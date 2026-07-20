import { PrismaClient, Prisma } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import { getSmsProvider } from "./sms.service";
import { buildPagination } from "../shared/query-builder";
import { createPaginatedResponse } from "../shared/pagination";

export class ExamSessionService {
  constructor(private db: PrismaClient) {}

  async registerStudent(input: {
    name: string;
    mobile: string;
    studentId?: string;
  }) {
    try {
      let student = await this.db.student.findFirst({
        where: { mobile: input.mobile },
      });

      if (!student) {
        student = await this.db.student.create({
          data: {
            name: input.name,
            mobile: input.mobile,
            studentId: input.studentId,
          },
        });
      }

      const code = "123456"; // Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Delete any previous OTPs for this number
      await this.db.otp.deleteMany({
        where: { phone: input.mobile },
      });

      await this.db.otp.create({
        data: {
          phone: input.mobile,
          code,
          expiresAt,
        },
      });

      const smsProvider = getSmsProvider();
      await smsProvider.send(input.mobile, `আপনার ভেরিফিকেশন কোড হল ${code}`);

      return { studentId: student.id, otpSent: true };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async verifyOtp(input: { mobile: string; code: string }) {
    try {
      const otp = await this.db.otp.findFirst({
        where: {
          phone: input.mobile,
          verified: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!otp) {
        throw new Error("No active OTP found. Please request a new one.");
      }

      if (otp.attempts >= 3) {
        throw new Error("Too many failed attempts. Please request a new OTP.");
      }

      if (otp.code !== input.code) {
        await this.db.otp.update({
          where: { id: otp.id },
          data: { attempts: { increment: 1 } },
        });
        throw new Error("Invalid verification code.");
      }

      await this.db.otp.update({
        where: { id: otp.id },
        data: { verified: true },
      });

      const student = await this.db.student.findFirst({
        where: { mobile: input.mobile },
      });

      if (!student) {
        throw new Error("Student not found.");
      }

      return { verified: true, studentId: student.id };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async resendOtp(input: { mobile: string }) {
    try {
      await this.db.otp.deleteMany({
        where: { phone: input.mobile },
      });

      const code = "123456"; // Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      await this.db.otp.create({
        data: {
          phone: input.mobile,
          code,
          expiresAt,
        },
      });

      const smsProvider = getSmsProvider();
      await smsProvider.send(input.mobile, `আপনার ভেরিফিকেশন কোড হল ${code}`);

      return { otpSent: true };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getPublishedExams(input: { page?: number; limit?: number }) {
    try {
      const where: Prisma.ExamWhereInput = {
        status: "Published",
        isPublic: true,
      };

      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 20,
      });

      const [items, total] = await Promise.all([
        this.db.exam.findMany({
          where,
          orderBy: { startDate: "asc" },
          ...pagination,
        }),
        this.db.exam.count({ where }),
      ]);

      return createPaginatedResponse(
        items,
        total,
        input.page ?? 1,
        input.limit ?? 20,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getUpcomingExam() {
    try {
      const exam = await this.db.exam.findFirst({
        where: {
          status: "Published",
          OR: [{ endDate: { gt: new Date() } }, { endDate: null }],
        },
        orderBy: { startDate: "asc" },
      });
      return exam;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getExamDetail(examId: string) {
    try {
      const exam = await this.db.exam.findUnique({
        where: { id: examId },
        include: {
          _count: {
            select: { mcqs: true },
          },
        },
      });
      return exam;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async startAttempt(examId: string, studentId: string) {
    try {
      const exam = await this.db.exam.findUnique({
        where: { id: examId },
      });

      if (!exam || exam.status !== "Published") {
        throw new Error("Exam not available.");
      }

      let attempt = await this.db.examAttempt.findFirst({
        where: { examId, studentId },
        include: { answers: true },
      });

      if (attempt) {
        if (attempt.status === "Submitted") {
          throw new Error("You have already attempted this exam.");
        }
        // It's In Progress, so just resume it.
      } else {
        attempt = await this.db.examAttempt.create({
          data: {
            examId,
            studentId,
          },
          include: { answers: true },
        });
      }

      if (!attempt) {
        throw new Error("Could not start exam attempt.");
      }

      const examMcqs = await this.db.examMcq.findMany({
        where: { examId },
        include: { mcq: true },
        orderBy: { order: "asc" },
      });

      const questions = examMcqs.map((em) => ({
        id: em.mcq.id,
        question: em.mcq.question,
        options: em.mcq.options,
        type: em.mcq.type,
        isMath: em.mcq.isMath,
        statements: em.mcq.statements,
      }));

      // Calculate remaining duration if it was already started
      const elapsedMs = new Date().getTime() - attempt.startTime.getTime();
      const durationMs = exam.duration * 60 * 1000;
      const remainingMinutes = Math.max(0, (durationMs - elapsedMs) / 60000);

      const previousAnswers = (attempt as any).answers || [];

      return {
        attemptId: attempt.id,
        questions,
        duration: remainingMinutes,
        previousAnswers,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async submitAnswer(attemptId: string, mcqId: string, selectedOption: string) {
    try {
      const mcq = await this.db.mcq.findUnique({
        where: { id: mcqId },
      });

      if (!mcq) {
        throw new Error("Question not found.");
      }

      const isCorrect = mcq.answer === selectedOption;

      const existingAnswer = await this.db.answerHistory.findFirst({
        where: { attemptId, mcqId },
      });

      let answerRecord;
      if (existingAnswer) {
        answerRecord = await this.db.answerHistory.update({
          where: { id: existingAnswer.id },
          data: { selectedOption, isCorrect },
        });
      } else {
        answerRecord = await this.db.answerHistory.create({
          data: {
            attemptId,
            mcqId,
            selectedOption,
            isCorrect,
          },
        });
      }

      return { saved: true, answerId: answerRecord.id, isCorrect };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async submitExam(attemptId: string) {
    try {
      const attempt = await this.db.examAttempt.findUnique({
        where: { id: attemptId },
        include: { exam: true },
      });

      if (!attempt) {
        throw new Error("Attempt not found.");
      }

      const answers = await this.db.answerHistory.findMany({
        where: { attemptId },
      });

      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const wrongAnswers = answers.filter(
        (a) => !a.isCorrect && a.selectedOption !== null,
      ).length;

      const totalQuestionsCount = await this.db.examMcq.count({
        where: { examId: attempt.examId },
      });

      const marksPerQuestion =
        totalQuestionsCount > 0
          ? attempt.exam.totalMarks / totalQuestionsCount
          : 0;

      const score = correctAnswers * marksPerQuestion;

      const updatedAttempt = await this.db.examAttempt.update({
        where: { id: attemptId },
        data: {
          score,
          correctAnswers,
          wrongAnswers,
          status: "Submitted",
          endTime: new Date(),
        },
      });

      return updatedAttempt;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getAttemptResult(attemptId: string) {
    try {
      const result = await this.db.examAttempt.findUnique({
        where: { id: attemptId },
        include: {
          exam: true,
          student: true,
          answers: {
            include: { mcq: true },
          },
        },
      });
      return result;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getLeaderboard(page?: number, limit?: number) {
    try {
      const pageNum = page ?? 1;
      const limitNum = limit ?? 50;

      // 1. Fetch ALL submitted attempts
      const allAttempts = await this.db.examAttempt.findMany({
        where: { status: "Submitted" },
        include: {
          student: {
            select: { name: true, studentId: true },
          },
        },
      });

      // 2. Group by student and find the max score per exam
      // Structure: studentId -> { studentInfo, exams: { examId -> attempt } }
      const studentMap = new Map<
        string,
        {
          student: { name: string; studentId: string | null };
          exams: Map<string, (typeof allAttempts)[0]>;
        }
      >();

      for (const attempt of allAttempts) {
        const sId = attempt.studentId;
        if (!studentMap.has(sId)) {
          studentMap.set(sId, { student: attempt.student, exams: new Map() });
        }

        const studentData = studentMap.get(sId)!;
        const existingExamAttempt = studentData.exams.get(attempt.examId);

        if (!existingExamAttempt) {
          studentData.exams.set(attempt.examId, attempt);
        } else {
          // If higher score, replace. If tie, keep fastest.
          if (attempt.score > existingExamAttempt.score) {
            studentData.exams.set(attempt.examId, attempt);
          } else if (attempt.score === existingExamAttempt.score) {
            const currentDuration =
              new Date(existingExamAttempt.endTime!).getTime() -
              new Date(existingExamAttempt.startTime).getTime();
            const newDuration =
              new Date(attempt.endTime!).getTime() -
              new Date(attempt.startTime).getTime();
            if (newDuration < currentDuration) {
              studentData.exams.set(attempt.examId, attempt);
            }
          }
        }
      }

      // 3. Aggregate data for each student
      const aggregatedList = Array.from(studentMap.entries()).map(
        ([sId, data]) => {
          let totalScore = 0;
          let totalTimeMs = 0;
          const examsTaken = data.exams.size;

          for (const attempt of data.exams.values()) {
            totalScore += attempt.score;
            totalTimeMs +=
              new Date(attempt.endTime!).getTime() -
              new Date(attempt.startTime).getTime();
          }

          return {
            id: sId, // using student id as the unique key
            student: data.student,
            score: totalScore,
            examsTaken: examsTaken,
            totalTimeMs: totalTimeMs,
            // create mock startTime and endTime to reuse existing formatTime logic
            startTime: new Date(0),
            endTime: new Date(totalTimeMs),
          };
        },
      );

      // 4. Sort globally: Score DESC, Time ASC
      aggregatedList.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Descending
        }
        return a.totalTimeMs - b.totalTimeMs; // Ascending
      });

      // 5. Paginate
      const total = aggregatedList.length;
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedItems = aggregatedList.slice(startIndex, endIndex);

      return createPaginatedResponse(
        paginatedItems as any,
        total,
        pageNum,
        limitNum,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
