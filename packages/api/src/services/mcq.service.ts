import { z } from "zod";
import { Prisma, type PrismaClient } from "@workspace/db";
import {
  type MCQ,
  mcqFormSchema,
  updateMCQSchema,
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

export class McqService {
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
    type?: string;
    session?: number;
    isMath?: boolean;
  }): Promise<
    PaginatedResponse<MCQ & { subject: any; chapter: any; questionType: any; topic: any }> | undefined
  > {
    try {
      const where = buildWhere(input, ["question", "answer", "explanation"]);

      if (input.search) {
        where.OR = [...(where.OR || []), { reference: { has: input.search } }];
      }

      if (input.subjectId) where.subjectId = input.subjectId;
      if (input.chapterId) where.chapterId = input.chapterId;
      if (input.questionTypeId) where.questionTypeId = input.questionTypeId;
      if (input.type) where.type = input.type;
      if (input.session) where.session = input.session;
      if (input.isMath !== undefined && input.isMath !== null) where.isMath = input.isMath;
      if (input.reference) where.reference = { has: input.reference };

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const stableOrderBy = Array.isArray(orderBy)
        ? [...orderBy, { id: "asc" as const }]
        : [orderBy, { id: "asc" as const }];

      const [items, total] = await Promise.all([
        this.db.mcq.findMany({
          where,
          orderBy: stableOrderBy,
          ...pagination,
          include: { subject: true, chapter: true, questionType: true, topic: true, questionContext: true },
        }),
        this.db.mcq.count({ where }),
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
    type?: string;
    session?: number;
  }): Promise<
    PaginatedResponse<MCQ & { subject: any; chapter: any; questionType: any; topic: any }> | undefined
  > {
    try {
      const where: Prisma.McqWhereInput = {
        subjectId: input.subjectId,
      };

      // Only filter by questionTypeId if it's strictly needed, but often MCQs don't have it set.
      // We can allow MCQs with matching questionTypeId OR null questionTypeId.
      where.AND = [
        {
          OR: [
            { questionTypeId: input.questionTypeId },
            { questionTypeId: null }
          ]
        }
      ];

      if (input.chapterId) where.chapterId = input.chapterId;
      if (input.type) where.type = input.type;
      if (input.session) where.session = input.session;
      
      if (input.reference) {
        const matches = await this.db.$queryRaw<{ id: string }[]>`
          SELECT id FROM "Mcq" 
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
          { reference: { has: input.search } },
        ];
      }

      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.mcq.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...pagination,
          include: { subject: true, chapter: true, questionType: true, topic: true, questionContext: true },
        }),
        this.db.mcq.count({ where }),
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
      return await this.db.mcq.findUnique({
        where: { id: validatedId },
        include: { subject: true, chapter: true, topic: true, subtopic: true, questionContext: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: MCQ): Promise<MCQ | undefined> {
    try {
      const data = mcqFormSchema.parse(input);
      const { questionContext, subjectId, chapterId, topicId, subTopicId, questionTypeId, contextId, ...rest } = data;

      const item = await this.db.mcq.create({
        data: {
          ...rest,
          subject: subjectId ? { connect: { id: subjectId } } : undefined,
          chapter: chapterId ? { connect: { id: chapterId } } : undefined,
          ...(topicId ? { topic: { connect: { id: topicId } } } : {}),
          ...(subTopicId ? { subtopic: { connect: { id: subTopicId } } } : {}),
          ...(questionTypeId ? { questionType: { connect: { id: questionTypeId } } } : {}),
          ...(questionContext && !contextId ? {
            questionContext: { create: questionContext }
          } : contextId ? {
            questionContext: { connect: { id: contextId } }
          } : {}),
        } as any,
        include: { questionContext: true }
      });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, input: MCQ): Promise<MCQ | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateMCQSchema.parse(input);

      const { questionContext, subjectId, chapterId, topicId, subTopicId, questionTypeId, contextId, ...rest } = data;

      const item = await this.db.mcq.update({
        where: { id: validatedId },
        data: {
          ...rest,
          ...(subjectId ? { subject: { connect: { id: subjectId } } } : {}),
          ...(chapterId ? { chapter: { connect: { id: chapterId } } } : {}),
          ...(topicId ? { topic: { connect: { id: topicId } } } : { topic: { disconnect: true } }),
          ...(subTopicId ? { subtopic: { connect: { id: subTopicId } } } : { subtopic: { disconnect: true } }),
          ...(questionTypeId ? { questionType: { connect: { id: questionTypeId } } } : { questionType: { disconnect: true } }),
          ...(questionContext && !contextId ? {
            questionContext: { create: questionContext }
          } : contextId ? {
            questionContext: { connect: { id: contextId } }
          } : {
            questionContext: { disconnect: true }
          }),
        } as any,
        include: { questionContext: true }
      });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<MCQ | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.mcq.delete({ where: { id: validatedId } });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkCreate(items: unknown[]): Promise<{ count: number } | undefined> {
    try {
      // Pre-process items to handle null explanations and string contexts
      const cleanedItems = items.map((item: any) => {
        if (!item || typeof item !== 'object') return item;
        
        const rawCtx = item.questionContext || item.context;
        const formattedCtx = typeof rawCtx === 'string' ? { text: rawCtx } : rawCtx;
        
        return {
          ...item,
          explanation: item.explanation == null ? "" : String(item.explanation),
          questionContext: formattedCtx,
        };
      });

      const validated = z.array(mcqFormSchema).parse(cleanedItems);
      
      const result = await this.db.$transaction(async (tx) => {
        for (const item of validated) {
          const { questionContext, subjectId, chapterId, topicId, subTopicId, questionTypeId, contextId, ...rest } = item;
          
          await tx.mcq.create({
            data: {
              ...rest,
              subject: subjectId ? { connect: { id: subjectId } } : undefined,
              chapter: chapterId ? { connect: { id: chapterId } } : undefined,
              ...(topicId ? { topic: { connect: { id: topicId } } } : {}),
              ...(subTopicId ? { subtopic: { connect: { id: subTopicId } } } : {}),
              ...(questionTypeId ? { questionType: { connect: { id: questionTypeId } } } : {}),
              ...(questionContext && !contextId ? {
                questionContext: { create: questionContext }
              } : contextId ? {
                questionContext: { connect: { id: contextId } }
              } : {}),
            } as any,
          });
        }
        return { count: validated.length };
      }, {
        timeout: 30000,
      });
      
      return result;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<any | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.mcq.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(chapterId?: string): Promise<any | undefined> {
    try {
      const where = chapterId ? { chapterId } : {};
      const total = await this.db.mcq.count({ where });
      return { total };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
