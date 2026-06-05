import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { AcademicSubjectService } from "../services/academic-subject.service";
import { baseListInputSchema } from "../shared/filters";
import {
  academicSubjectFormSchema,
  updateAcademicSubjectSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const academicSubjectRouter = createTRPCRouter({
  // ── Queries ───────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(
      baseListInputSchema.extend({
        academicYearId: z.string().nullish(),
        academicClassId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  forSelection: publicProcedure
    .input(z.object({ 
      classId: z.string().nullish(),
      academicYearId: z.string().nullish(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.forSelection(input?.classId, input?.academicYearId);
      return { success: true, data };
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicSubjectService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  // ── Mutations ─────────────────────────────────────────────────────────────

  create: adminMutationProcedure
    .input(academicSubjectFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Academic subject created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicSubjectSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Academic subject updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Academic subject deleted successfully",
        data,
      };
    }),

  toggleActive: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Academic subject status toggled",
        data,
      };
    }),



  bulkDelete: adminMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      await Promise.all(input.ids.map((id) => service.delete(id)));
      return {
        success: true,
        message: "Academic subjects deleted successfully",
      };
    }),
} satisfies TRPCRouterRecord);
