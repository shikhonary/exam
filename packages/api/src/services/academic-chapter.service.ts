import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import { type PrismaClient, type AcademicChapter, type Prisma } from "@workspace/db";
import {
  academicChapterFormSchema,
  updateAcademicChapterSchema,
  type AcademicChapterFormValues,
  type UpdateAcademicChapterValues,
} from "@workspace/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AcademicChapterWithCount = AcademicChapter & {
  subject?: { id: string; nameEn: string; nameBn: string };
  academicYear?: { id: string; label: string };
  _count?: { topics: number; mcqs: number; cqs: number };
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class AcademicChapterService {
  constructor(private db: PrismaClient) {}

  // ── LIST ──────────────────────────────────────────────────────────────────
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    subjectId?: string | null;
    academicYearId?: string | null;
  }): Promise<PaginatedResponse<AcademicChapterWithCount> | undefined> {
    try {
      const where: Prisma.AcademicChapterWhereInput = {};

      if (input.search) {
        where.OR = [
          { nameEn: { contains: input.search, mode: "insensitive" } },
          { nameBn: { contains: input.search, mode: "insensitive" } },
        ];
      }
      if (input.isActive !== undefined && input.isActive !== null) {
        where.isActive = input.isActive;
      }
      if (input.subjectId) {
        where.subjectId = input.subjectId;
      }
      if (input.academicYearId) {
        where.academicYearId = input.academicYearId;
      }

      const pagination = buildPagination({ page: input.page || 1, limit: input.limit || 10 });
      const orderBy = buildOrderBy(input);

      const [data, total] = await Promise.all([
        this.db.academicChapter.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            subject: { select: { id: true, nameEn: true, nameBn: true } },
            academicYear: { select: { id: true, label: true } },
            _count: { select: { topics: true, mcqs: true, cqs: true } },
          },
        }),
        this.db.academicChapter.count({ where }),
      ]);

      return createPaginatedResponse(
        data,
        total,
        input.page ?? 1,
        input.limit ?? 10
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── GET BY ID ─────────────────────────────────────────────────────────────
  async getById(id: string): Promise<AcademicChapterWithCount | undefined> {
    try {
      const data = await this.db.academicChapter.findUnique({
        where: { id },
        include: {
          subject: { select: { id: true, nameEn: true, nameBn: true } },
          academicYear: { select: { id: true, label: true } },
          _count: { select: { topics: true, mcqs: true, cqs: true } },
        },
      });

      if (!data) throw new Error("Academic chapter not found");
      return data;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── GET FOR SELECTION ─────────────────────────────────────────────────────
  async forSelection(subjectId?: string | null) {
    try {
      const where: Prisma.AcademicChapterWhereInput = { isActive: true };
      if (subjectId) {
        where.subjectId = subjectId;
      }

      return await this.db.academicChapter.findMany({
        where,
        select: {
          id: true,
          nameEn: true,
          nameBn: true,
        },
        orderBy: { position: "asc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(data: AcademicChapterFormValues): Promise<AcademicChapter | undefined> {
    try {
      const validatedData = academicChapterFormSchema.parse(data);
      return await this.db.academicChapter.create({
        data: validatedData,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: string, data: UpdateAcademicChapterValues): Promise<AcademicChapter | undefined> {
    try {
      const validatedData = updateAcademicChapterSchema.parse(data);
      return await this.db.academicChapter.update({
        where: { id },
        data: validatedData,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<AcademicChapter | undefined> {
    try {
      return await this.db.academicChapter.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── TOGGLE STATUS ─────────────────────────────────────────────────────────
  async toggleActive(id: string): Promise<AcademicChapter | undefined> {
    try {
      const chapter = await this.db.academicChapter.findUnique({
        where: { id },
        select: { isActive: true },
      });

      if (!chapter) throw new Error("Academic chapter not found");

      return await this.db.academicChapter.update({
        where: { id },
        data: { isActive: !chapter.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
  // ── STATS ─────────────────────────────────────────────────────────────────
  async getStats() {
    try {
      const [total, active] = await Promise.all([
        this.db.academicChapter.count(),
        this.db.academicChapter.count({ where: { isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
