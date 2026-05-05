import { villageFormSchema } from "@workspace/schema";
import {
  idSchema,
  listInput,
  updateVillageSchema,
} from "../shared/input/village";
import { VillageService } from "../services/village.service";
import { createTRPCRouter, tenantProcedure } from "../trpc";

export const villageRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new VillageService(ctx.tenantClient);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new VillageService(ctx.tenantClient);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: tenantProcedure
    .input(villageFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new VillageService(ctx.tenantClient);
      const data = await service.create(input);
      return {
        success: true,
        message: "Village created successfully",
        data,
      };
    }),

  update: tenantProcedure
    .input(updateVillageSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new VillageService(ctx.tenantClient);
      const data = await service.update(input);
      return {
        success: true,
        message: "Village updated successfully",
        data,
      };
    }),

  delete: tenantProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    const service = new VillageService(ctx.tenantClient);
    await service.delete(input);
    return {
      success: true,
      message: "Village deleted successfully",
    };
  }),

  toggleActive: tenantProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new VillageService(ctx.tenantClient);
      const data = await service.toggleActive(input);
      return {
        success: true,
        message: `Village ${data?.isActive ? "activated" : "deactivated"} successfully`,
        data,
      };
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new VillageService(ctx.tenantClient);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  forSelection: tenantProcedure.query(async ({ ctx }) => {
    const service = new VillageService(ctx.tenantClient);
    const data = await service.forSelection();
    return {
      success: true,
      data,
    };
  }),
});
