import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  mutationMiddleware,
} from "../trpc";
import { SubscriptionService } from "../services/subscription.service";
import {
  subscriptionFormSchema,
  updateSubscriptionSchema,
  changeSubscriptionPlanSchema,
  cancelSubscriptionSchema,
} from "@workspace/schema";
import { baseListInputSchema } from "../shared/filters";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const subscriptionRouter = createTRPCRouter({
  // ============================================================================
  // ADMIN PROCEDURES
  // ============================================================================

  // List all subscriptions (Admin)
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        tenantId: z.string().uuid().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  // Get by ID (Admin)
  getById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  // Get by Tenant ID (Admin)
  getByTenantId: adminProcedure
    .input(z.object({ tenantId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.getByTenantId(input.tenantId);
      return {
        success: true,
        data,
      };
    }),

  // Get Stats (Admin)
  stats: adminProcedure.query(async ({ ctx }) => {
    const service = new SubscriptionService(ctx.db);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  // Create subscription (Admin manual creation)
  createOne: adminMutationProcedure
    .input(subscriptionFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Subscription created successfully",
        data,
      };
    }),

  // Update subscription overrides (Admin)
  updateOne: adminMutationProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updateSubscriptionSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Subscription updated successfully",
        data,
      };
    }),

  // Change subscription plan (Admin)
  changePlan: adminMutationProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: changeSubscriptionPlanSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.changePlan(input.id, input.data);
      return {
        success: true,
        message: "Subscription plan changed successfully",
        data,
      };
    }),

  // Cancel subscription (Admin)
  cancel: adminMutationProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: cancelSubscriptionSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.cancel(input.id, input.data);
      return {
        success: true,
        message: "Subscription canceled successfully",
        data,
      };
    }),
});
