import { z } from "zod";
import { baseListInputSchema } from "../filters";
import { notificationFormSchema } from "@workspace/schema";

export const listNotificationInput = baseListInputSchema.extend({
  read: z.boolean().optional().nullable(),
  type: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  tenantId: z.string().optional().nullable(),
});

export type ListNotificationInputType = z.infer<typeof listNotificationInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export const updateNotificationInputSchema = notificationFormSchema.extend({
  id: idSchema,
});

export type UpdateNotificationInputType = z.infer<typeof updateNotificationInputSchema>;
