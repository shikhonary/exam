import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import { type PrismaClient, type Mcq, type Prisma } from "@workspace/db";
import {
  mcqFormSchema,
  updateMcqSchema,
  type McqFormValues,
  type UpdateMcqValues,
} from "@workspace/schema";

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class McqService {
  constructor(private db: PrismaClient) {}

  // ── LIST ──────────────────────────────────────────────────────────────────
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    type?: string;
    isMath?: boolean;
    subject?: string;
  }): Promise<PaginatedResponse<Mcq> | undefined> {
    try {
      const where: Prisma.McqWhereInput = {};

      if (input.search) {
        where.OR = [
          { question: { contains: input.search, mode: "insensitive" } },
          { subject: { contains: input.search, mode: "insensitive" } },
        ];
      }
      if (input.type !== undefined) where.type = input.type;
      if (input.isMath !== undefined) where.isMath = input.isMath;
      if (input.subject !== undefined) where.subject = input.subject;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 20,
      });

      const [items, total] = await Promise.all([
        this.db.mcq.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { createdAt: "desc" },
          ...pagination,
        }),
        this.db.mcq.count({ where }),
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

  // ── GET BY ID ─────────────────────────────────────────────────────────────
  async getById(id: string): Promise<Mcq | null | undefined> {
    try {
      return (await this.db.mcq.findUnique({
        where: { id },
      })) as Mcq | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(input: McqFormValues): Promise<Mcq | undefined> {
    try {
      const data = mcqFormSchema.parse(input);
      return await this.db.mcq.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    input: UpdateMcqValues,
  ): Promise<Mcq | undefined> {
    try {
      const data = updateMcqSchema.parse(input);
      return await this.db.mcq.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<Mcq | undefined> {
    try {
      return await this.db.mcq.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── BULK DELETE ───────────────────────────────────────────────────────────
  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await this.db.mcq.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── STATS ─────────────────────────────────────────────────────────────────
  async getStats() {
    try {
      const [total, math] = await Promise.all([
        this.db.mcq.count(),
        this.db.mcq.count({ where: { isMath: true } }),
      ]);
      return { total, math, standard: total - math };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── IMPORT ────────────────────────────────────────────────────────────────
  async import(input: McqFormValues[]): Promise<{ count: number } | undefined> {
    try {
      const data = input.map(item => mcqFormSchema.parse(item));
      const result = await this.db.mcq.createMany({ data });
      return { count: result.count };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
