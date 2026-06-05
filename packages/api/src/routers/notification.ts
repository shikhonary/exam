import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { NotificationService } from "../services/notification.service";
import {
  listNotificationInput,
  updateNotificationInputSchema,
} from "../shared/input/notification";
import { notificationFormSchema } from "@workspace/schema";

export const notificationRouter = createTRPCRouter({
  list: adminProcedure.input(listNotificationInput).query(async ({ ctx, input }) => {
    const service = new NotificationService(ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const service = new NotificationService(ctx.db);
    const data = await service.getById(input.id);
    return {
      success: true,
      data,
    };
  }),

  create: baseMutationProcedure
    .input(notificationFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new NotificationService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Notification created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(updateNotificationInputSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new NotificationService(ctx.db);
      const data = await service.update(input);
      return {
        success: true,
        message: "Notification updated successfully",
        data,
      };
    }),

  markAsRead: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new NotificationService(ctx.db);
      const data = await service.markAsRead(input.id);
      return {
        success: true,
        message: "Notification marked as read",
        data,
      };
    }),

  markAllAsRead: baseMutationProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new NotificationService(ctx.db);
      const data = await service.markAllAsRead(input.userId);
      return {
        success: true,
        message: "All notifications marked as read",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new NotificationService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Notification deleted successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord);
