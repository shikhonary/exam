import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { AcademicClassService } from "../services/academic-class.service";
import { baseListInputSchema } from "../shared/filters";
import {
  academicClassFormSchema,
  updateAcademicClassSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const academicClassRouter = createTRPCRouter({
  // ── Queries ───────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(baseListInputSchema)
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  forSelection: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicClassService(ctx.db);
    const data = await service.forSelection();
    return { success: true, data };
  }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicClassService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  // ── Mutations ─────────────────────────────────────────────────────────────

  create: adminMutationProcedure
    .input(academicClassFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Academic class created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicClassSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Academic class updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Academic class deleted successfully",
        data,
      };
    }),

  toggleActive: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Academic class status toggled",
        data,
      };
    }),

  reorder: adminMutationProcedure
    .input(
      z.object({
        items: z.array(z.object({ id: z.string(), position: z.number().int().min(0) })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      await service.reorder(input.items);
      return {
        success: true,
        message: "Class order updated successfully",
      };
    }),

  bulkDelete: adminMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      // Delete one by one so guard runs for each
      await Promise.all(input.ids.map((id) => service.delete(id)));
      return {
        success: true,
        message: "Academic classes deleted successfully",
      };
    }),
} satisfies TRPCRouterRecord);
