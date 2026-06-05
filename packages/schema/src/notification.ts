import { z } from "zod";
import { uuidSchema } from "./shared/fields";

export const notificationFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  actionUrl: z.string().optional().nullable(),
  actionLabel: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  tenantId: z.string().optional().nullable(),
});

export type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export const notificationSchema = notificationFormSchema.extend({
  id: uuidSchema,
  read: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Notification = z.infer<typeof notificationSchema>;
