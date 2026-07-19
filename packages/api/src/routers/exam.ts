import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { ExamService } from "../services/exam.service";
import { baseListInputSchema } from "../shared/filters";
import {
  examFormSchema,
  updateExamSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const examRouter = createTRPCRouter({
  // ── Queries ───────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(
      baseListInputSchema.extend({
        subject: z.string().nullish(),
        status: z.string().nullish(),
        isPublic: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const service = new ExamService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new ExamService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new ExamService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  // ── Mutations ─────────────────────────────────────────────────────────────

  create: adminMutationProcedure
    .input(examFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExamService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Exam created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateExamSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new ExamService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Exam updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new ExamService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Exam deleted successfully",
        data,
      };
    }),

  bulkDelete: adminMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new ExamService(ctx.db);
      // Delete one by one so guard runs for each
      await Promise.all(input.ids.map((id) => service.delete(id)));
      return {
        success: true,
        message: "Exams deleted successfully",
      };
    }),

  getAttachedMcqs: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new ExamService(ctx.db);
      const data = await service.getAttachedMcqs(input.examId);
      return { success: true, data };
    }),

  syncMcqs: adminMutationProcedure
    .input(z.object({ examId: z.string(), mcqIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new ExamService(ctx.db);
      const data = await service.syncMcqs(input.examId, input.mcqIds);
      return {
        success: true,
        message: "MCQs attached successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord);
