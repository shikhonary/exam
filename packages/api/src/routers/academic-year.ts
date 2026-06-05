import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { AcademicYearService } from "../services/academic-year.service";
import { baseListInputSchema } from "../shared/filters";
import {
  academicYearFormSchema,
  updateAcademicYearSchema,
} from "@workspace/schema";
import { zNullishBoolean } from "../shared/filters";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const academicYearRouter = createTRPCRouter({
  // ── Queries ──────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(
      baseListInputSchema.extend({
        isCurrent: zNullishBoolean,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  getCurrent: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicYearService(ctx.db);
    const data = await service.getCurrent();
    return { success: true, data };
  }),

  forSelection: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicYearService(ctx.db);
    const data = await service.forSelection();
    return { success: true, data };
  }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicYearService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  // ── Mutations ─────────────────────────────────────────────────────────────

  create: adminMutationProcedure
    .input(academicYearFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Academic year created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicYearSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Academic year updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Academic year deleted successfully",
        data,
      };
    }),

  setCurrent: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.db);
      const data = await service.setCurrent(input.id);
      return {
        success: true,
        message: "Current academic year updated successfully",
        data,
      };
    }),

  toggleActive: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.db);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Academic year status toggled",
        data,
      };
    }),
} satisfies TRPCRouterRecord);
