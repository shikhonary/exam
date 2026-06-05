import { z } from "zod";
import { Prisma, type PrismaClient } from "@workspace/db";
import {
  type ShortAnswer,
  shortAnswerFormSchema,
  updateShortAnswerSchema,
  uuidSchema,
} from "@workspace/schema";
import { handlePrismaError } from "../middleware/error-handler";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";

export class ShortAnswerService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    sort?: string;
    subjectId?: string;
    chapterId?: string;
    questionTypeId?: string;
    reference?: string;
  }): Promise<
    PaginatedResponse<ShortAnswer & { subject: any; chapter: any; questionType: any; topic: any }> | undefined
  > {
    try {
      const where = buildWhere(input, ["question", "answer"]);

      if (input.search) {
        where.OR = [...(where.OR || []), { reference: { has: input.search } }];
      }

      if (input.subjectId) where.subjectId = input.subjectId;
      if (input.chapterId) where.chapterId = input.chapterId;
      if (input.questionTypeId) where.questionTypeId = input.questionTypeId;
      if (input.reference) where.reference = { has: input.reference };

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const stableOrderBy = Array.isArray(orderBy)
        ? [...orderBy, { id: "asc" as const }]
        : [orderBy, { id: "asc" as const }];

      const [items, total] = await Promise.all([
        this.db.shortAnswer.findMany({
          where,
          orderBy: stableOrderBy,
          ...pagination,
          include: { subject: true, chapter: true, questionType: true, topic: true },
        }),
        this.db.shortAnswer.count({ where }),
      ]);

      return createPaginatedResponse(
        items as any,
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getForAssignment(input: {
    page: number;
    limit: number;
    search?: string;
    subjectId: string;
    questionTypeId: string;
    chapterId?: string;
    reference?: string;
  }): Promise<
    PaginatedResponse<ShortAnswer & { subject: any; chapter: any; questionType: any; topic: any }> | undefined
  > {
    try {
      const where: Prisma.ShortAnswerWhereInput = {
        subjectId: input.subjectId,
        questionTypeId: input.questionTypeId,
      };

      if (input.chapterId) where.chapterId = input.chapterId;
      
      if (input.reference) {
        const matches = await this.db.$queryRaw<{ id: string }[]>`
          SELECT id FROM "short_answer" 
          WHERE EXISTS (
            SELECT 1 FROM unnest(reference) AS ref 
            WHERE ref ILIKE ${input.reference + "%"}
          )
        `;
        where.id = { in: matches.map((m) => m.id) };
      }

      if (input.search) {
        where.OR = [
          { question: { contains: input.search, mode: "insensitive" } },
          { answer: { contains: input.search, mode: "insensitive" } },
          { reference: { has: input.search } },
        ];
      }

      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.shortAnswer.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...pagination,
          include: { subject: true, chapter: true, questionType: true, topic: true },
        }),
        this.db.shortAnswer.count({ where }),
      ]);

      return createPaginatedResponse(
        items as any,
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.shortAnswer.findUnique({
        where: { id: validatedId },
        include: { subject: true, chapter: true, topic: true, subtopic: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: ShortAnswer): Promise<ShortAnswer | undefined> {
    try {
      const data = shortAnswerFormSchema.parse(input);

      const sanitised: Record<string, unknown> = { ...data };
      for (const fk of ["topicId", "subTopicId", "questionTypeId"] as const) {
        if (
          fk in sanitised &&
          (sanitised[fk] === "" || sanitised[fk] === undefined)
        ) {
          sanitised[fk] = null;
        }
      }

      const item = await this.db.shortAnswer.create({
        data: sanitised as any,
      });
      return item as unknown as ShortAnswer;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, input: ShortAnswer): Promise<ShortAnswer | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateShortAnswerSchema.parse(input);

      const sanitised: Record<string, unknown> = { ...data };
      for (const fk of ["topicId", "subTopicId", "questionTypeId"] as const) {
        if (
          fk in sanitised &&
          (sanitised[fk] === "" || sanitised[fk] === undefined)
        ) {
          sanitised[fk] = null;
        }
      }

      const item = await this.db.shortAnswer.update({
        where: { id: validatedId },
        data: sanitised as any,
      });
      return item as unknown as ShortAnswer;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<ShortAnswer | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.shortAnswer.delete({ where: { id: validatedId } });
      return item as unknown as ShortAnswer;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkCreate(items: unknown[]): Promise<{ count: number } | undefined> {
    try {
      const validated = z.array(shortAnswerFormSchema).parse(items);
      
      const result = await this.db.$transaction(async (tx) => {
        for (const item of validated) {
          await tx.shortAnswer.create({
            data: {
              ...item,
              topicId: item.topicId || null,
              subTopicId: item.subTopicId || null,
              questionTypeId: item.questionTypeId || null,
            },
          });
        }
        return { count: validated.length };
      });
      
      return result;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<any | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.shortAnswer.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(chapterId?: string): Promise<any | undefined> {
    try {
      const where = chapterId ? { chapterId } : {};
      const total = await this.db.shortAnswer.count({ where });
      return { total };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
