import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { AcademicChapterService } from "../services/academic-chapter.service";
import { baseListInputSchema } from "../shared/filters";
import {
  academicChapterFormSchema,
  updateAcademicChapterSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const academicChapterRouter = createTRPCRouter({
  // ── Queries ───────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(
      baseListInputSchema.extend({
        academicYearId: z.string().nullish(),
        subjectId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  forSelection: publicProcedure
    .input(z.object({ subjectId: z.string().nullish() }).optional())
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.forSelection(input?.subjectId);
      return { success: true, data };
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicChapterService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  // ── Mutations ─────────────────────────────────────────────────────────────

  create: adminMutationProcedure
    .input(academicChapterFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Academic chapter created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicChapterSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Academic chapter updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Academic chapter deleted successfully",
        data,
      };
    }),

  toggleActive: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Academic chapter status toggled",
        data,
      };
    }),

  bulkDelete: adminMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      await Promise.all(input.ids.map((id) => service.delete(id)));
      return {
        success: true,
        message: "Academic chapters deleted successfully",
      };
    }),
} satisfies TRPCRouterRecord);
