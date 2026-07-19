import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { McqService } from "../services/mcq.service";
import { baseListInputSchema } from "../shared/filters";
import {
  mcqFormSchema,
  updateMcqSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const mcqRouter = createTRPCRouter({
  // ── Queries ───────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(baseListInputSchema.extend({
      limit: z.coerce.number().int().min(1).max(1000).default(10),
      type: z.string().optional(),
      isMath: z.boolean().optional(),
      subject: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new McqService(ctx.db);
    const data = await service.getStats();
    return { success: true, data };
  }),

  // ── Mutations ─────────────────────────────────────────────────────────────

  create: adminMutationProcedure
    .input(mcqFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "MCQ created successfully",
        data,
      };
    }),

  update: adminMutationProcedure
    .input(z.object({ id: z.string(), data: updateMcqSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "MCQ updated successfully",
        data,
      };
    }),

  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "MCQ deleted successfully",
        data,
      };
    }),

  bulkDelete: adminMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "MCQs deleted successfully",
      };
    }),

  import: adminMutationProcedure
    .input(z.array(mcqFormSchema))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.import(input);
      return {
        success: true,
        message: `${data?.count ?? 0} MCQs imported successfully`,
        data,
      };
    }),
} satisfies TRPCRouterRecord);
