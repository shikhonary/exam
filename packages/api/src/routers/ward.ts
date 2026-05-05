import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { WardService } from "../services/ward.service";
import { idSchema, listInput, updateWardSchema } from "../shared/input/ward";
import { wardFormSchema } from "@workspace/schema";

export const wardRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new WardService(ctx.tenantClient);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new WardService(ctx.tenantClient);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(wardFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new WardService(ctx.tenantClient);
      const data = await service.create(input);
      return {
        success: true,
        message: "Ward created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateWardSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new WardService(ctx.tenantClient);
      const data = await service.update(input);
      return {
        success: true,
        message: "Ward updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new WardService(ctx.tenantClient);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Ward deleted successfully",
        data,
      };
    }),

  bulkDelete: baseTenantMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new WardService(ctx.tenantClient);
      const data = await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Wards deleted successfully",
        data,
      };
    }),

  toggleActive: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new WardService(ctx.tenantClient);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Ward status toggled successfully",
        data,
      };
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new WardService(ctx.tenantClient);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  forSelection: tenantProcedure.query(async ({ ctx }) => {
    const service = new WardService(ctx.tenantClient);
    const data = await service.forSelection();
    return {
      success: true,
      data,
    };
  }),
} satisfies TRPCRouterRecord);
