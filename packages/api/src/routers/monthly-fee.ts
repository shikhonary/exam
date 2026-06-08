import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { MonthlyFeeService } from "../services/monthly-fee.service";
import { idSchema, listInput, updateMonthlyFeeSchema } from "../shared/input/monthly-fee";
import { monthlyFeeFormSchema } from "@workspace/schema";

export const monthlyFeeRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new MonthlyFeeService(ctx.tenantClient, ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new MonthlyFeeService(ctx.tenantClient, ctx.db);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(monthlyFeeFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new MonthlyFeeService(ctx.tenantClient, ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Monthly Fee created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateMonthlyFeeSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new MonthlyFeeService(ctx.tenantClient, ctx.db);
      const data = await service.update(input);
      return {
        success: true,
        message: "Monthly Fee updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new MonthlyFeeService(ctx.tenantClient, ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Monthly Fee deleted successfully",
        data,
      };
    }),

  bulkDelete: baseTenantMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new MonthlyFeeService(ctx.tenantClient, ctx.db);
      const data = await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Monthly Fees deleted successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord);
