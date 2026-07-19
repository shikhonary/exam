import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import { type PrismaClient, type Exam, type Prisma } from "@workspace/db";
import {
  examFormSchema,
  updateExamSchema,
  type ExamFormValues,
  type UpdateExamValues,
} from "@workspace/schema";

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class ExamService {
  constructor(private db: PrismaClient) {}

  // ── LIST ──────────────────────────────────────────────────────────────────
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    subject?: string | null;
    status?: string | null;
    isPublic?: boolean | null;
  }): Promise<PaginatedResponse<Exam> | undefined> {
    try {
      const where: Prisma.ExamWhereInput = {};

      if (input.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
        ];
      }
      
      if (input.subject != null) {
        where.subject = input.subject;
      }
      
      if (input.status != null) {
        where.status = input.status;
      }
      
      if (input.isPublic != null) {
        where.isPublic = input.isPublic;
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 20,
      });

      const [items, total] = await Promise.all([
        this.db.exam.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { createdAt: "desc" },
          ...pagination,
        }),
        this.db.exam.count({ where }),
      ]);

      return createPaginatedResponse(
        items as Exam[],
        total,
        input.page ?? 1,
        input.limit ?? 20,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── GET BY ID ─────────────────────────────────────────────────────────────
  async getById(id: string): Promise<Exam | null | undefined> {
    try {
      return await this.db.exam.findUnique({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(input: ExamFormValues): Promise<Exam | undefined> {
    try {
      const data = examFormSchema.parse(input);
      return await this.db.exam.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    input: UpdateExamValues,
  ): Promise<Exam | undefined> {
    try {
      const data = updateExamSchema.parse(input);
      return await this.db.exam.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<Exam | undefined> {
    try {
      return await this.db.exam.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── STATS ─────────────────────────────────────────────────────────────────
  async getStats() {
    try {
      const total = await this.db.exam.count();
      return { total };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── MCQS ──────────────────────────────────────────────────────────────────
  async getAttachedMcqs(examId: string) {
    try {
      const examMcqs = await this.db.examMcq.findMany({
        where: { examId },
        include: { mcq: true },
        orderBy: { order: "asc" },
      });
      return examMcqs;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async syncMcqs(examId: string, mcqIds: string[]) {
    try {
      // Use a transaction to ensure atomicity
      await this.db.$transaction(
        async (tx) => {
          // Delete existing relations
          await tx.examMcq.deleteMany({
            where: { examId },
          });

          // Insert new relations with order
          if (mcqIds.length > 0) {
            await tx.examMcq.createMany({
              data: mcqIds.map((mcqId, index) => ({
                examId,
                mcqId,
                order: index,
              })),
            });
          }
        },
        {
          maxWait: 5000, // default is 2000
          timeout: 20000, // default is 5000
        }
      );
      return { success: true };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
