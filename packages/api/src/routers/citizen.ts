import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { citizenSchema, citizenListInputSchema } from "@workspace/schema";
import { CitizenService } from "../services/citizen.service";

const idSchema = z.string().uuid();

export const citizenRouter = createTRPCRouter({
  list: tenantProcedure.input(citizenListInputSchema).query(async ({ ctx, input }) => {
    const service = new CitizenService(ctx.tenantClient);
    return await service.list(input);
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new CitizenService(ctx.tenantClient);
    return await service.getById(input);
  }),

  getByNid: tenantProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const service = new CitizenService(ctx.tenantClient);
    return await service.getByNid(input);
  }),

  create: baseTenantMutationProcedure
    .input(citizenSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new CitizenService(ctx.tenantClient);
      return await service.create(input);
    }),

  update: baseTenantMutationProcedure
    .input(
      citizenSchema.partial().extend({
        id: idSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const service = new CitizenService(ctx.tenantClient);
      return await service.update(id, data);
    }),
} satisfies TRPCRouterRecord);
