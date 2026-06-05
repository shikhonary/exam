import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { UserService } from "../services/user.service";
import {
  listUserInput,
  idSchema,
  updateUserInputSchema,
} from "../shared/input/user";
import { userFormSchema } from "@workspace/schema";

/**
 * Platform-wide User Management Router (Admin Only)
 */
export const userRouter = createTRPCRouter({
  list: adminProcedure.input(listUserInput).query(async ({ ctx, input }) => {
    const service = new UserService(ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: adminProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new UserService(ctx.db);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseMutationProcedure
    .input(userFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new UserService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "User created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(updateUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new UserService(ctx.db);
      const data = await service.update(input);
      return {
        success: true,
        message: "User updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new UserService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "User deleted successfully",
        data,
      };
    }),

  toggleStatus: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new UserService(ctx.db);
      const data = await service.toggleStatus(input.id);
      return {
        success: true,
        message: "User status updated successfully",
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new UserService(ctx.db);
      const data = await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Users activated successfully",
        data,
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new UserService(ctx.db);
      const data = await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Users deactivated successfully",
        data,
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new UserService(ctx.db);
      const data = await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Users deleted successfully",
        data,
      };
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const service = new UserService(ctx.db);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),
} satisfies TRPCRouterRecord);
