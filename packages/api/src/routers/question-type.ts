import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { QuestionTypeService, SubjectQuestionTypeService } from "../services/question-type.service";
import { baseListInputSchema } from "../shared/filters";
import {
  questionTypeFormSchema,
  updateQuestionTypeSchema,
  assignQuestionTypesToSubjectSchema,
  updateSubjectQuestionTypeSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const questionTypeRouter = createTRPCRouter({
  list: publicProcedure
    .input(baseListInputSchema)
    .query(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  forSelection: publicProcedure.query(async ({ ctx }) => {
    const service = new QuestionTypeService(ctx.db);
    const data = await service.forSelection();
    return { success: true, data };
  }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new QuestionTypeService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  create: adminMutationProcedure
    .input(questionTypeFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Question type created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateQuestionTypeSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Question type updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Question type deleted successfully",
        data,
      };
    }),

  toggleActive: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Question type status toggled",
        data,
      };
    }),

  bulkDelete: adminMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Question types deleted successfully",
      };
    }),

  // --------------------------------------------------------------------------
  // SubjectQuestionType sub-router
  // --------------------------------------------------------------------------
  subjectQuestionType: {
    listBySubject: publicProcedure
      .input(z.object({ subjectId: z.string() }))
      .query(async ({ ctx, input }) => {
        const service = new SubjectQuestionTypeService(ctx.db);
        const data = await service.listBySubject(input.subjectId);
        return { success: true, data };
      }),

    /** Inverted view — all subjects linked to a given question type */
    listByQuestionType: publicProcedure
      .input(z.object({ questionTypeId: z.string() }))
      .query(async ({ ctx, input }) => {
        const service = new SubjectQuestionTypeService(ctx.db);
        const data = await service.listByQuestionType(input.questionTypeId);
        return { success: true, data };
      }),

    assign: adminMutationProcedure
      .input(assignQuestionTypesToSubjectSchema)
      .mutation(async ({ ctx, input }) => {
        const service = new SubjectQuestionTypeService(ctx.db);
        await service.assignToSubject(input);
        return { success: true, message: "Question types assigned successfully" };
      }),

    /** Assign this question type to a subject — called from the question type form */
    assignToSubject: adminMutationProcedure
      .input(
        z.object({
          questionTypeId: z.string(),
          subjectId: z.string(),
          label: z.string().min(1).max(50),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const service = new SubjectQuestionTypeService(ctx.db);
        await service.assignToSubject({
          subjectId: input.subjectId,
          items: [{ questionTypeId: input.questionTypeId, label: input.label }],
        });
        return { success: true, message: "Assigned to subject successfully" };
      }),

    remove: adminMutationProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const service = new SubjectQuestionTypeService(ctx.db);
        await service.removeFromSubject(input.id);
        return { success: true, message: "Question type removed from subject" };
      }),

    updateLabel: adminMutationProcedure
      .input(z.object({ id: z.string(), data: updateSubjectQuestionTypeSchema }))
      .mutation(async ({ ctx, input }) => {
        const service = new SubjectQuestionTypeService(ctx.db);
        await service.updateLabel(input.id, input.data);
        return { success: true, message: "Label updated successfully" };
      }),
  },
} satisfies TRPCRouterRecord);

