import { z } from "zod";
import { baseListInputSchema } from "../filters";

export const listAuditLogInput = baseListInputSchema.extend({
  action: z.string().optional().nullable(),
  entity: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  tenantId: z.string().optional().nullable(),
});

export type ListAuditLogInputType = z.infer<typeof listAuditLogInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });
