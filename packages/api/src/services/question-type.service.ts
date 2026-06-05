import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import { type PrismaClient, type QuestionType, type Prisma } from "@workspace/db";
import {
  questionTypeFormSchema,
  updateQuestionTypeSchema,
  assignQuestionTypesToSubjectSchema,
  updateSubjectQuestionTypeSchema,
  type QuestionTypeFormValues,
  type UpdateQuestionTypeValues,
  type AssignQuestionTypesToSubjectValues,
  type UpdateSubjectQuestionTypeValues,
} from "@workspace/schema";

export type QuestionTypeWithCount = QuestionType & {
  _count?: { subjects: number; questions: number };
};

export class QuestionTypeService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
  }): Promise<PaginatedResponse<QuestionTypeWithCount> | undefined> {
    try {
      const where: Prisma.QuestionTypeWhereInput = {};

      if (input?.search) {
        where.OR = [
          { nameEn: { contains: input.search, mode: "insensitive" } },
          { nameBn: { contains: input.search, mode: "insensitive" } },
        ];
      }
      if (input.isActive !== undefined) where.isActive = input.isActive;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 20,
      });

      const [rawItems, total] = await Promise.all([
        this.db.questionType.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { createdAt: "desc" },
          ...pagination,
          include: {
            _count: { select: { subjects: true, mcqs: true, cqs: true } },
          },
        }),
        this.db.questionType.count({ where }),
      ]);

      const items = rawItems.map(item => ({
        ...item,
        _count: {
          subjects: item._count?.subjects ?? 0,
          questions: (item._count?.mcqs ?? 0) + (item._count?.cqs ?? 0),
        }
      }));

      return createPaginatedResponse(
        items as QuestionTypeWithCount[],
        total,
        input.page ?? 1,
        input.limit ?? 20,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<QuestionTypeWithCount | null | undefined> {
    try {
      const item = await this.db.questionType.findUnique({
        where: { id },
        include: {
          _count: { select: { subjects: true, mcqs: true, cqs: true } },
        },
      });
      if (!item) return null;
      return {
        ...item,
        _count: {
          subjects: item._count?.subjects ?? 0,
          questions: (item._count?.mcqs ?? 0) + (item._count?.cqs ?? 0),
        }
      } as QuestionTypeWithCount;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: QuestionTypeFormValues): Promise<QuestionType | undefined> {
    try {
      const data = questionTypeFormSchema.parse(input);
      return await this.db.questionType.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: string,
    input: UpdateQuestionTypeValues,
  ): Promise<QuestionType | undefined> {
    try {
      const data = updateQuestionTypeSchema.parse(input);
      return await this.db.questionType.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<QuestionType | undefined> {
    try {
      const qt = await this.db.questionType.findUnique({
        where: { id },
        select: {
          _count: { select: { subjects: true, mcqs: true, cqs: true } },
        },
      });
      const questionCount = (qt?._count?.mcqs ?? 0) + (qt?._count?.cqs ?? 0);
      if ((qt?._count?.subjects ?? 0) > 0 || questionCount > 0) {
        throw new Error(
          "Cannot delete: this question type is linked to subjects or questions.",
        );
      }
      return await this.db.questionType.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async toggleActive(id: string): Promise<QuestionType | undefined> {
    try {
      const qt = await this.db.questionType.findUniqueOrThrow({
        where: { id },
        select: { isActive: true },
      });
      return await this.db.questionType.update({
        where: { id },
        data: { isActive: !qt.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.delete(id)));
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async forSelection() {
    try {
      return await this.db.questionType.findMany({
        where: { isActive: true },
        select: { id: true, nameBn: true, nameEn: true },
        orderBy: { nameEn: "asc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats() {
    try {
      const [total, active] = await Promise.all([
        this.db.questionType.count(),
        this.db.questionType.count({ where: { isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

// ============================================================================
// SubjectQuestionType types & service
// ============================================================================

export type SubjectQuestionTypeItem = {
  id: string;
  subjectId: string;
  questionTypeId: string;
  label: string;
  createdAt: Date;
  questionType: { id: string; nameEn: string; nameBn: string };
};

/** Inverted view — queried from the QuestionType side, includes the subject */
export type SubjectQuestionTypeWithSubject = {
  id: string;
  subjectId: string;
  questionTypeId: string;
  label: string;
  createdAt: Date;
  subject: { id: string; nameEn: string; nameBn: string; code: string | null };
};

export class SubjectQuestionTypeService {
  constructor(private db: PrismaClient) {}

  /** Fetch all SubjectQuestionType rows for a given subject */
  async listBySubject(subjectId: string): Promise<SubjectQuestionTypeItem[]> {
    try {
      return (await this.db.subjectQuestionType.findMany({
        where: { subjectId },
        include: {
          questionType: { select: { id: true, nameEn: true, nameBn: true } },
        },
        orderBy: { createdAt: "asc" },
      })) as SubjectQuestionTypeItem[];
    } catch (error) {
      handlePrismaError(error);
      return [];
    }
  }

  /** Fetch all SubjectQuestionType rows for a given question type (inverted view) */
  async listByQuestionType(questionTypeId: string): Promise<SubjectQuestionTypeWithSubject[]> {
    try {
      return (await this.db.subjectQuestionType.findMany({
        where: { questionTypeId },
        include: {
          subject: { select: { id: true, nameEn: true, nameBn: true, code: true } },
        },
        orderBy: { createdAt: "asc" },
      })) as SubjectQuestionTypeWithSubject[];
    } catch (error) {
      handlePrismaError(error);
      return [];
    }
  }

  /** Bulk-assign question types to a subject (upsert — safe to call multiple times) */
  async assignToSubject(input: AssignQuestionTypesToSubjectValues): Promise<void> {
    try {
      const { subjectId, items } = assignQuestionTypesToSubjectSchema.parse(input);
      await Promise.all(
        items.map((item) =>
          this.db.subjectQuestionType.upsert({
            where: {
              subjectId_questionTypeId: {
                subjectId,
                questionTypeId: item.questionTypeId,
              },
            },
            create: { subjectId, questionTypeId: item.questionTypeId, label: item.label },
            update: { label: item.label },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /** Remove a single SubjectQuestionType row by its own id */
  async removeFromSubject(id: string): Promise<void> {
    try {
      await this.db.subjectQuestionType.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /** Update the per-subject label override */
  async updateLabel(id: string, input: UpdateSubjectQuestionTypeValues): Promise<void> {
    try {
      const { label } = updateSubjectQuestionTypeSchema.parse(input);
      await this.db.subjectQuestionType.update({ where: { id }, data: { label } });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

