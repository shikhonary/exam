import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import { type PrismaClient, type AcademicClass, type Prisma } from "@workspace/db";
import {
  academicClassFormSchema,
  updateAcademicClassSchema,
  type AcademicClassFormValues,
  type UpdateAcademicClassValues,
} from "@workspace/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AcademicClassWithCount = AcademicClass & {
  _count?: { classSubjects: number; academicSessions: number };
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class AcademicClassService {
  constructor(private db: PrismaClient) {}

  // ── LIST ──────────────────────────────────────────────────────────────────
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
  }): Promise<PaginatedResponse<AcademicClassWithCount> | undefined> {
    try {
      const where: Prisma.AcademicClassWhereInput = {};

      if (input.search) {
        where.OR = [
          { nameEn: { contains: input.search, mode: "insensitive" } },
          { nameBn: { contains: input.search, mode: "insensitive" } },
          { level: { contains: input.search, mode: "insensitive" } },
        ];
      }
      if (input.isActive !== undefined) where.isActive = input.isActive;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 20,
      });

      const [items, total] = await Promise.all([
        this.db.academicClass.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            _count: { select: { classSubjects: true, academicSessions: true } },
          },
        }),
        this.db.academicClass.count({ where }),
      ]);

      return createPaginatedResponse(
        items as AcademicClassWithCount[],
        total,
        input.page ?? 1,
        input.limit ?? 20,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── GET BY ID ─────────────────────────────────────────────────────────────
  async getById(id: string): Promise<AcademicClassWithCount | null | undefined> {
    try {
      return (await this.db.academicClass.findUnique({
        where: { id },
        include: {
          _count: { select: { classSubjects: true, academicSessions: true } },
        },
      })) as AcademicClassWithCount | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(input: AcademicClassFormValues): Promise<AcademicClass | undefined> {
    try {
      const data = academicClassFormSchema.parse(input);
      return await this.db.academicClass.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    input: UpdateAcademicClassValues,
  ): Promise<AcademicClass | undefined> {
    try {
      const data = updateAcademicClassSchema.parse(input);
      return await this.db.academicClass.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<AcademicClass | undefined> {
    try {
      const cls = await this.db.academicClass.findUnique({
        where: { id },
        select: {
          _count: { select: { classSubjects: true, academicSessions: true } },
        },
      });
      if ((cls?._count?.classSubjects ?? 0) > 0) {
        throw new Error(
          "Cannot delete: this class is linked to one or more subjects.",
        );
      }
      return await this.db.academicClass.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── TOGGLE ACTIVE ─────────────────────────────────────────────────────────
  async toggleActive(id: string): Promise<AcademicClass | undefined> {
    try {
      const cls = await this.db.academicClass.findUniqueOrThrow({
        where: { id },
        select: { isActive: true },
      });
      return await this.db.academicClass.update({
        where: { id },
        data: { isActive: !cls.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── REORDER (update position) ─────────────────────────────────────────────
  async reorder(
    items: { id: string; position: number }[],
  ): Promise<void> {
    try {
      await this.db.$transaction(
        items.map(({ id, position }) =>
          this.db.academicClass.update({
            where: { id },
            data: { position },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── FOR SELECTION ─────────────────────────────────────────────────────────
  async forSelection() {
    try {
      return await this.db.academicClass.findMany({
        where: { isActive: true },
        select: { id: true, nameBn: true, nameEn: true, level: true, position: true },
        orderBy: { position: "asc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── STATS ─────────────────────────────────────────────────────────────────
  async getStats() {
    try {
      const [total, active] = await Promise.all([
        this.db.academicClass.count(),
        this.db.academicClass.count({ where: { isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
