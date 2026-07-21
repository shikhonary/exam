import { z } from "zod";
import { type TRPCRouterRecord, TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc/index";
import { ExamSessionService } from "../services/exam-session.service";
import { baseListInputSchema } from "../shared/filters";
import {
  studentRegistrationSchema,
  verifyOtpSchema,
  resendOtpSchema,
  startAttemptSchema,
  submitAnswerSchema,
  submitExamSchema,
  leaderboardInputSchema,
} from "@workspace/schema";
import { AiService } from "../services/ai.service";

export const examSessionRouter = createTRPCRouter({
  registerStudent: publicProcedure
    .input(studentRegistrationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.registerStudent(input);
      return { success: true, data };
    }),

  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.verifyOtp(input);
      return { success: true, data };
    }),

  resendOtp: publicProcedure
    .input(resendOtpSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.resendOtp(input);
      return { success: true, data };
    }),

  getPublishedExams: publicProcedure
    .input(baseListInputSchema)
    .query(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.getPublishedExams(input);
      return { success: true, data };
    }),

  getUpcomingExam: publicProcedure.query(async ({ ctx }) => {
    const service = new ExamSessionService(ctx.db);
    const data = await service.getUpcomingExam();
    return { success: true, data };
  }),

  getExamDetail: publicProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.getExamDetail(input.examId);
      return { success: true, data };
    }),

  startAttempt: publicProcedure
    .input(startAttemptSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.startAttempt(input.examId, input.studentId);
      return { success: true, data };
    }),

  submitAnswer: publicProcedure
    .input(submitAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.submitAnswer(input.attemptId, input.mcqId, input.selectedOption);
      return { success: true, data };
    }),

  submitExam: publicProcedure
    .input(submitExamSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.submitExam(input.attemptId);
      return { success: true, data };
    }),

  getAttemptResult: publicProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.getAttemptResult(input.attemptId);
      return { success: true, data };
    }),

  getAiFeedback: publicProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new ExamSessionService(ctx.db);
      const aiService = new AiService();
      
      const attemptResult = await service.getAttemptResult(input.attemptId);
      
      if (!attemptResult) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Attempt not found" });
      }

      if (attemptResult.aiFeedback) {
        return { success: true, data: attemptResult.aiFeedback };
      }
      
      const aiFeedback = await aiService.generateExamFeedback({
        studentName: attemptResult.student.name,
        examTitle: attemptResult.exam.title,
        score: attemptResult.score,
        totalMarks: attemptResult.exam.totalMarks,
        correctCount: attemptResult.correctAnswers,
        wrongCount: attemptResult.wrongAnswers,
        totalQuestions: attemptResult.answers.length,
      });

      // Save to database
      await ctx.db.examAttempt.update({
        where: { id: input.attemptId },
        data: { aiFeedback },
      });

      return { success: true, data: aiFeedback };
    }),

  getLeaderboard: publicProcedure
    .input(leaderboardInputSchema)
    .query(async ({ input, ctx }) => {
      const service = new ExamSessionService(ctx.db);
      const data = await service.getLeaderboard(input.page, input.limit);
      return { success: true, data };
    }),
} satisfies TRPCRouterRecord);
