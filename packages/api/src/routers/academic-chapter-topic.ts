import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { AcademicChapterTopicService } from "../services/academic-chapter-topic.service";
import { baseListInputSchema } from "../shared/filters";
import {
  academicChapterTopicFormSchema,
  updateAcademicChapterTopicSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const academicChapterTopicRouter = createTRPCRouter({
  // ── Queries ───────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(
      baseListInputSchema.extend({
        chapterId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterTopicService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterTopicService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  forSelection: publicProcedure
    .input(z.object({ chapterId: z.string().nullish() }).optional())
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterTopicService(ctx.db);
      const data = await service.forSelection(input?.chapterId);
      return { success: true, data };
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicChapterTopicService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  // ── Mutations ─────────────────────────────────────────────────────────────

  create: adminMutationProcedure
    .input(academicChapterTopicFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterTopicService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Academic chapter topic created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicChapterTopicSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterTopicService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Academic chapter topic updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterTopicService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Academic chapter topic deleted successfully",
        data,
      };
    }),

  toggleActive: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterTopicService(ctx.db);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Academic chapter topic status updated successfully",
        data,
      };
    }),
});
