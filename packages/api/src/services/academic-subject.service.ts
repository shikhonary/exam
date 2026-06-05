import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import { type PrismaClient, type AcademicSubject, type Prisma } from "@workspace/db";
import {
  academicSubjectFormSchema,
  updateAcademicSubjectSchema,
  type AcademicSubjectFormValues,
  type UpdateAcademicSubjectValues,
} from "@workspace/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AcademicSubjectWithCount = AcademicSubject & {
  academicYear?: { id: string; label: string };
  classSubjects?: { academicClass: { id: string; nameEn: string; nameBn: string } }[];
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class AcademicSubjectService {
  constructor(private db: PrismaClient) {}

  // ── LIST ──────────────────────────────────────────────────────────────────
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    academicYearId?: string | null;
    academicClassId?: string | null;
  }): Promise<PaginatedResponse<AcademicSubjectWithCount> | undefined> {
    try {
      const where: Prisma.AcademicSubjectWhereInput = {};

      if (input.search) {
        where.OR = [
          { nameEn: { contains: input.search, mode: "insensitive" } },
          { nameBn: { contains: input.search, mode: "insensitive" } },
          { code: { contains: input.search, mode: "insensitive" } },
        ];
      }
      if (input.isActive !== undefined) where.isActive = input.isActive;
      if (input.academicYearId) where.academicYearId = input.academicYearId;
      if (input.academicClassId) {
        where.classSubjects = {
          some: { classId: input.academicClassId },
        };
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 20,
      });

      const [items, total] = await Promise.all([
        this.db.academicSubject.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { nameEn: "asc" },
          ...pagination,
          include: {
            academicYear: { select: { id: true, label: true } },
            classSubjects: { select: { academicClass: { select: { id: true, nameEn: true, nameBn: true } } } },
          },
        }),
        this.db.academicSubject.count({ where }),
      ]);

      return createPaginatedResponse(
        items as AcademicSubjectWithCount[],
        total,
        input.page ?? 1,
        input.limit ?? 20,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── GET BY ID ─────────────────────────────────────────────────────────────
  async getById(id: string): Promise<AcademicSubjectWithCount | null | undefined> {
    try {
      return (await this.db.academicSubject.findUnique({
        where: { id },
        include: {
          academicYear: { select: { id: true, label: true } },
          classSubjects: { select: { academicClass: { select: { id: true, nameEn: true, nameBn: true } } } },
        },
      })) as AcademicSubjectWithCount | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(input: AcademicSubjectFormValues): Promise<AcademicSubject | undefined> {
    try {
      const { academicClassIds, ...restData } = academicSubjectFormSchema.parse(input);
      return await this.db.academicSubject.create({ 
        data: {
          ...restData,
          classSubjects: {
            create: academicClassIds.map((cid) => ({ classId: cid })),
          },
        } 
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    input: UpdateAcademicSubjectValues,
  ): Promise<AcademicSubject | undefined> {
    try {
      const { academicClassIds, ...restData } = updateAcademicSubjectSchema.parse(input);
      
      const updateData: Prisma.AcademicSubjectUpdateInput = { ...restData };
      if (academicClassIds) {
        updateData.classSubjects = {
          deleteMany: {},
          create: academicClassIds.map((cid) => ({ classId: cid })),
        };
      }

      return await this.db.academicSubject.update({ where: { id }, data: updateData });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<AcademicSubject | undefined> {
    try {
      return await this.db.academicSubject.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── TOGGLE ACTIVE ─────────────────────────────────────────────────────────
  async toggleActive(id: string): Promise<AcademicSubject | undefined> {
    try {
      const subject = await this.db.academicSubject.findUniqueOrThrow({
        where: { id },
        select: { isActive: true },
      });
      return await this.db.academicSubject.update({
        where: { id },
        data: { isActive: !subject.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }



  // ── FOR SELECTION ─────────────────────────────────────────────────────────
  async forSelection(classId?: string | null, academicYearId?: string | null) {
    try {
      return await this.db.academicSubject.findMany({
        where: {
          isActive: true,
          ...(classId ? { classSubjects: { some: { classId } } } : {}),
          ...(academicYearId ? { academicYearId } : {}),
        },
        select: { id: true, nameBn: true, nameEn: true, code: true },
        orderBy: { nameEn: "asc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── STATS ─────────────────────────────────────────────────────────────────
  async getStats() {
    try {
      const [total, active] = await Promise.all([
        this.db.academicSubject.count(),
        this.db.academicSubject.count({ where: { isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
