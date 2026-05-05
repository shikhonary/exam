import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { citizenApplicationSchema } from "@workspace/schema";
import { CitizenApplicationService } from "../services/citizen-application.service";
import { idSchema, listInput } from "../shared/input/citizen-application";

export const citizenApplicationRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new CitizenApplicationService(ctx.tenantClient);
    return await service.list(input);
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new CitizenApplicationService(ctx.tenantClient);
    return await service.getById(input);
  }),

  create: baseTenantMutationProcedure
    .input(citizenApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new CitizenApplicationService(ctx.tenantClient);
      return await service.create(input);
    }),

  update: baseTenantMutationProcedure
    .input(
      citizenApplicationSchema.partial().extend({
        id: idSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const service = new CitizenApplicationService(ctx.tenantClient);
      return await service.update(id, data);
    }),

  delete: baseTenantMutationProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new CitizenApplicationService(ctx.tenantClient);
      return await service.delete(input);
    }),

  approve: baseTenantMutationProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const service = new CitizenApplicationService(ctx.tenantClient);
      return await service.approve(input);
    }),

  reject: baseTenantMutationProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const service = new CitizenApplicationService(ctx.tenantClient);
      return await service.reject(input);
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new CitizenApplicationService(ctx.tenantClient);
    return await service.getStats();
  }),
} satisfies TRPCRouterRecord);
