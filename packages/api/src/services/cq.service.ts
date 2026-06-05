import { z } from "zod";
import { Prisma, type PrismaClient } from "@workspace/db";
import {
  type CQ,
  cqFormSchema,
  updateCQSchema,
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

export class CqService {
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
    PaginatedResponse<CQ & { subject: any; chapter: any; questionType: any; topic: any }> | undefined
  > {
    try {
      const where = buildWhere(input, ["questionA", "questionB", "questionC", "questionD", "context"]);

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
        this.db.cq.findMany({
          where,
          orderBy: stableOrderBy,
          ...pagination,
          include: { subject: true, chapter: true, questionType: true, topic: true },
        }),
        this.db.cq.count({ where }),
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
    PaginatedResponse<CQ & { subject: any; chapter: any; questionType: any; topic: any }> | undefined
  > {
    try {
      const where: Prisma.CqWhereInput = {
        subjectId: input.subjectId,
        questionTypeId: input.questionTypeId,
      };

      if (input.chapterId) where.chapterId = input.chapterId;
      
      if (input.reference) {
        const matches = await this.db.$queryRaw<{ id: string }[]>`
          SELECT id FROM "cq" 
          WHERE EXISTS (
            SELECT 1 FROM unnest(reference) AS ref 
            WHERE ref ILIKE ${input.reference + "%"}
          )
        `;
        where.id = { in: matches.map((m) => m.id) };
      }

      if (input.search) {
        where.OR = [
          { questionA: { contains: input.search, mode: "insensitive" } },
          { context: { contains: input.search, mode: "insensitive" } },
          { reference: { has: input.search } },
        ];
      }

      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.cq.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...pagination,
          include: { subject: true, chapter: true, questionType: true, topic: true },
        }),
        this.db.cq.count({ where }),
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
      return await this.db.cq.findUnique({
        where: { id: validatedId },
        include: { subject: true, chapter: true, topic: true, subtopic: true, attachments: true, answer: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: CQ): Promise<CQ | undefined> {
    try {
      const data = cqFormSchema.parse(input);

      const { attachments, answer, ...rest } = data;

      const sanitised: Record<string, unknown> = { ...rest };
      for (const fk of ["topicId", "subTopicId", "questionTypeId"] as const) {
        if (
          fk in sanitised &&
          (sanitised[fk] === "" || sanitised[fk] === undefined)
        ) {
          sanitised[fk] = null;
        }
      }

      const item = await this.db.cq.create({
        data: {
          ...(sanitised as any),
          attachments: attachments && attachments.length > 0 ? {
            create: attachments
          } : undefined,
          answer: answer ? {
            create: answer
          } : undefined,
        },
        include: { attachments: true, answer: true }
      });
      return item as unknown as CQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, input: CQ): Promise<CQ | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateCQSchema.parse(input);

      const { attachments, answer, ...rest } = data;

      const sanitised: Record<string, unknown> = { ...rest };
      for (const fk of ["topicId", "subTopicId", "questionTypeId"] as const) {
        if (
          fk in sanitised &&
          (sanitised[fk] === "" || sanitised[fk] === undefined)
        ) {
          sanitised[fk] = null;
        }
      }

      const item = await this.db.cq.update({
        where: { id: validatedId },
        data: {
          ...(sanitised as any),
          attachments: attachments ? {
            deleteMany: {},
            create: attachments,
          } : undefined,
          answer: answer !== undefined ? (answer === null ? { delete: true } : {
            upsert: {
              create: answer,
              update: answer,
            }
          }) : undefined,
        },
        include: { attachments: true, answer: true }
      });
      return item as unknown as CQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<CQ | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.cq.delete({ where: { id: validatedId } });
      return item as unknown as CQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkCreate(items: unknown[]): Promise<{ count: number } | undefined> {
    try {
      const validated = z.array(cqFormSchema).parse(items);
      
      const result = await this.db.$transaction(async (tx) => {
        for (const item of validated) {
          const { attachments, answer, ...rest } = item;
          
          await tx.cq.create({
            data: {
              ...rest,
              topicId: rest.topicId || null,
              subTopicId: rest.subTopicId || null,
              questionTypeId: rest.questionTypeId || null,
              attachments: attachments && attachments.length > 0 ? {
                create: attachments
              } : undefined,
              answer: answer ? {
                create: answer
              } : undefined,
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
      return await this.db.cq.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(chapterId?: string): Promise<any | undefined> {
    try {
      const where = chapterId ? { chapterId } : {};
      const total = await this.db.cq.count({ where });
      return { total };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
