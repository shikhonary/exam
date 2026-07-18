import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import { type PrismaClient, type Student, type Prisma } from "@workspace/db";
import {
  studentFormSchema,
  updateStudentSchema,
  type StudentFormValues,
  type UpdateStudentValues,
} from "@workspace/schema";

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class StudentService {
  constructor(private db: PrismaClient) {}

  // ── LIST ──────────────────────────────────────────────────────────────────
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<Student> | undefined> {
    try {
      const where: Prisma.StudentWhereInput = {};

      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { studentId: { contains: input.search, mode: "insensitive" } },
          { mobile: { contains: input.search, mode: "insensitive" } },
        ];
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 20,
      });

      const [items, total] = await Promise.all([
        this.db.student.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { createdAt: "desc" },
          ...pagination,
        }),
        this.db.student.count({ where }),
      ]);

      return createPaginatedResponse(
        items as Student[],
        total,
        input.page ?? 1,
        input.limit ?? 20,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── GET BY ID ─────────────────────────────────────────────────────────────
  async getById(id: string): Promise<Student | null | undefined> {
    try {
      return await this.db.student.findUnique({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(input: StudentFormValues): Promise<Student | undefined> {
    try {
      const data = studentFormSchema.parse(input);
      return await this.db.student.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    input: UpdateStudentValues,
  ): Promise<Student | undefined> {
    try {
      const data = updateStudentSchema.parse(input);
      return await this.db.student.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<Student | undefined> {
    try {
      return await this.db.student.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ── STATS ─────────────────────────────────────────────────────────────────
  async getStats() {
    try {
      const total = await this.db.student.count();
      return { total };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
