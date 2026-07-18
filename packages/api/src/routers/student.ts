import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { StudentService } from "../services/student.service";
import { baseListInputSchema } from "../shared/filters";
import {
  studentFormSchema,
  updateStudentSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const studentRouter = createTRPCRouter({
  // ── Queries ───────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(baseListInputSchema)
    .query(async ({ ctx, input }) => {
      const service = new StudentService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new StudentService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new StudentService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  // ── Mutations ─────────────────────────────────────────────────────────────

  create: adminMutationProcedure
    .input(studentFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Student created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateStudentSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Student updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Student deleted successfully",
        data,
      };
    }),

  bulkDelete: adminMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.db);
      // Delete one by one so guard runs for each
      await Promise.all(input.ids.map((id) => service.delete(id)));
      return {
        success: true,
        message: "Students deleted successfully",
      };
    }),
} satisfies TRPCRouterRecord);
