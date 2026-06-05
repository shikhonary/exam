import { z } from "zod";
import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import {
  type AcademicYear,
  type AcademicSession,
  type PrismaClient,
  type Prisma,
} from "@workspace/db";
import {
  academicYearFormSchema,
  updateAcademicYearSchema,
} from "@workspace/schema";

export interface AcademicSessionWithClasses extends AcademicSession {
  classes: {
    academicClass: { id: string; nameBn: string; nameEn: string; level: string };
  }[];
}

export interface AcademicYearWithRelations extends AcademicYear {
  sessions: AcademicSessionWithClasses[];
  _count?: { tenants: number; questionPapers: number };
}

const sessionInclude = {
  classes: {
    include: {
      academicClass: {
        select: { id: true, nameBn: true, nameEn: true, level: true },
      },
    },
  },
} satisfies Prisma.AcademicSessionInclude;

const yearInclude = {
  sessions: { include: sessionInclude },
  _count: { select: { tenants: true, questionPapers: true } },
} satisfies Prisma.AcademicYearInclude;

export class AcademicYearService {
  constructor(private db: PrismaClient) {}

  // ---------------------------------------------------------------------------
  // LIST
  // ---------------------------------------------------------------------------
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    isCurrent?: boolean;
  }): Promise<PaginatedResponse<AcademicYearWithRelations> | undefined> {
    try {
      const where: Prisma.AcademicYearWhereInput = {};

      if (input.search) {
        where.OR = [
          { label: { contains: input.search, mode: "insensitive" } },
          { slug: { contains: input.search, mode: "insensitive" } },
        ];
      }
      if (input.isActive !== undefined) where.isActive = input.isActive;
      if (input.isCurrent !== undefined) where.isCurrent = input.isCurrent;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 10,
      });

      const [items, total] = await Promise.all([
        this.db.academicYear.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { startDate: "desc" },
          ...pagination,
          include: yearInclude,
        }),
        this.db.academicYear.count({ where }),
      ]);

      return createPaginatedResponse(
        items as AcademicYearWithRelations[],
        total,
        input.page ?? 1,
        input.limit ?? 10,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------------------------------
  async getById(id: string): Promise<AcademicYearWithRelations | null | undefined> {
    try {
      return (await this.db.academicYear.findUnique({
        where: { id },
        include: yearInclude,
      })) as AcademicYearWithRelations | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // GET CURRENT
  // ---------------------------------------------------------------------------
  async getCurrent(): Promise<AcademicYearWithRelations | null | undefined> {
    try {
      return (await this.db.academicYear.findFirst({
        where: { isCurrent: true, isActive: true },
        include: yearInclude,
      })) as AcademicYearWithRelations | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------
  async create(
    input: z.infer<typeof academicYearFormSchema>,
  ): Promise<AcademicYearWithRelations | undefined> {
    try {
      const data = academicYearFormSchema.parse(input);
      const { sessions, ...yearData } = data;

      // If this is marked as current, unset all other current years first
      if (yearData.isCurrent) {
        await this.db.academicYear.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
      }

      const year = await this.db.academicYear.create({
        data: {
          ...yearData,
          sessions: {
            create: sessions.map(({ classIds, ...session }) => ({
              ...session,
              classes: {
                create: classIds.map((classId) => ({ classId })),
              },
            })),
          },
        },
        include: yearInclude,
      });

      return year as AcademicYearWithRelations;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // UPDATE (year fields only — sessions managed separately)
  // ---------------------------------------------------------------------------
  async update(
    id: string,
    input: z.infer<typeof updateAcademicYearSchema>,
  ): Promise<AcademicYearWithRelations | undefined> {
    try {
      const data = updateAcademicYearSchema.parse(input);

      if (data.isCurrent) {
        await this.db.academicYear.updateMany({
          where: { isCurrent: true, id: { not: id } },
          data: { isCurrent: false },
        });
      }

      return (await this.db.academicYear.update({
        where: { id },
        data,
        include: yearInclude,
      })) as AcademicYearWithRelations;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------
  async delete(id: string): Promise<AcademicYear | undefined> {
    try {
      const year = await this.db.academicYear.findUnique({
        where: { id },
        select: { isCurrent: true, _count: { select: { tenants: true } } },
      });

      if (year?.isCurrent) {
        throw new Error("Cannot delete the current academic year. Set another year as current first.");
      }
      if ((year?._count?.tenants ?? 0) > 0) {
        throw new Error(`Cannot delete. ${year!._count!.tenants} tenant(s) reference this year.`);
      }

      return await this.db.academicYear.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // SET CURRENT
  // ---------------------------------------------------------------------------
  async setCurrent(id: string): Promise<AcademicYear | undefined> {
    try {
      await this.db.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
      return await this.db.academicYear.update({
        where: { id },
        data: { isCurrent: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // TOGGLE ACTIVE
  // ---------------------------------------------------------------------------
  async toggleActive(id: string): Promise<AcademicYear | undefined> {
    try {
      const year = await this.db.academicYear.findUniqueOrThrow({ where: { id }, select: { isActive: true, isCurrent: true } });
      if (year.isCurrent && year.isActive) {
        throw new Error("Cannot deactivate the current academic year.");
      }
      return await this.db.academicYear.update({
        where: { id },
        data: { isActive: !year.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // FOR SELECTION (dropdown use)
  // ---------------------------------------------------------------------------
  async forSelection() {
    try {
      return await this.db.academicYear.findMany({
        where: { isActive: true },
        select: { id: true, label: true, slug: true, isCurrent: true, startDate: true, endDate: true },
        orderBy: { startDate: "desc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // STATS
  // ---------------------------------------------------------------------------
  async getStats() {
    try {
      const [total, active, current] = await Promise.all([
        this.db.academicYear.count(),
        this.db.academicYear.count({ where: { isActive: true } }),
        this.db.academicYear.findFirst({ where: { isCurrent: true }, select: { label: true } }),
      ]);
      return { total, active, currentLabel: current?.label ?? null };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
