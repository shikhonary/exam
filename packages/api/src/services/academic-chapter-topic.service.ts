import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import { type PrismaClient, type AcademicChapterTopic, type Prisma } from "@workspace/db";
import {
  academicChapterTopicFormSchema,
  updateAcademicChapterTopicSchema,
  type AcademicChapterTopicFormValues,
  type UpdateAcademicChapterTopicValues,
} from "@workspace/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AcademicChapterTopicWithCount = AcademicChapterTopic & {
  chapter?: { id: string; nameEn: string; nameBn: string; subject?: { id: string; nameEn: string; nameBn: string; }; academicYear?: { id: string; label: string; }; };
  _count?: { subtopics: number; mcqs: number; cqs: number };
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class AcademicChapterTopicService {
  constructor(private db: PrismaClient) {}

  // ── LIST ──────────────────────────────────────────────────────────────────
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    chapterId?: string | null;
  }): Promise<PaginatedResponse<AcademicChapterTopicWithCount> | undefined> {
    try {
      const where: Prisma.AcademicChapterTopicWhereInput = {};

      if (input.search) {
        where.OR = [
          { nameEn: { contains: input.search, mode: "insensitive" } },
          { nameBn: { contains: input.search, mode: "insensitive" } },
        ];
      }
      if (input.isActive !== undefined && input.isActive !== null) {
        where.isActive = input.isActive;
      }
      if (input.chapterId) {
        where.chapterId = input.chapterId;
      }

      const pagination = buildPagination({ page: input.page || 1, limit: input.limit || 10 });
      const orderBy = buildOrderBy(input);

      const [data, total] = await Promise.all([
        this.db.academicChapterTopic.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            chapter: { 
              select: { 
                id: true, 
                nameEn: true, 
                nameBn: true,
                subject: { select: { id: true, nameEn: true, nameBn: true } },
                academicYear: { select: { id: true, label: true } }
              } 
            },
            _count: { select: { subtopics: true, mcqs: true, cqs: true } },
          },
        }),
        this.db.academicChapterTopic.count({ where }),
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
  async getById(id: string): Promise<AcademicChapterTopicWithCount | undefined> {
    try {
      const data = await this.db.academicChapterTopic.findUnique({
        where: { id },
        include: {
          chapter: { 
            select: { 
              id: true, 
              nameEn: true, 
              nameBn: true,
              subject: { select: { id: true, nameEn: true, nameBn: true } },
              academicYear: { select: { id: true, label: true } }
            } 
          },
          _count: { select: { subtopics: true, mcqs: true, cqs: true } },
        },
      });
      if (!data) throw new Error("Academic chapter topic not found");
      return data;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(data: AcademicChapterTopicFormValues): Promise<AcademicChapterTopic | undefined> {
    try {
      const validated = academicChapterTopicFormSchema.parse(data);

      return await this.db.academicChapterTopic.create({
        data: validated,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    data: UpdateAcademicChapterTopicValues
  ): Promise<AcademicChapterTopic | undefined> {
    try {
      const validated = updateAcademicChapterTopicSchema.parse(data);

      return await this.db.academicChapterTopic.update({
        where: { id },
        data: validated,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<AcademicChapterTopic | undefined> {
    try {
      return await this.db.academicChapterTopic.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── TOGGLE STATUS ─────────────────────────────────────────────────────────
  async toggleActive(id: string): Promise<AcademicChapterTopic | undefined> {
    try {
      const current = await this.db.academicChapterTopic.findUnique({
        where: { id },
        select: { isActive: true },
      });

      if (!current) throw new Error("Academic chapter topic not found");

      return await this.db.academicChapterTopic.update({
        where: { id },
        data: { isActive: !current.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── FOR SELECTION ─────────────────────────────────────────────────────────
  async forSelection(chapterId?: string | null): Promise<Pick<AcademicChapterTopic, "id" | "nameEn" | "nameBn">[] | undefined> {
    try {
      const where: Prisma.AcademicChapterTopicWhereInput = { isActive: true };
      if (chapterId) where.chapterId = chapterId;

      return await this.db.academicChapterTopic.findMany({
        where,
        select: { id: true, nameEn: true, nameBn: true },
        orderBy: { position: "asc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── STATS ─────────────────────────────────────────────────────────────────
  async getStats() {
    try {
      const [total, active, inactive] = await Promise.all([
        this.db.academicChapterTopic.count(),
        this.db.academicChapterTopic.count({ where: { isActive: true } }),
        this.db.academicChapterTopic.count({ where: { isActive: false } }),
      ]);
      return { total, active, inactive };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
