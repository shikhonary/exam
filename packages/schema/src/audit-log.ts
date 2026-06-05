import { z } from "zod";
import { uuidSchema } from "./shared/fields";

export const auditLogSchema = z.object({
  id: uuidSchema,
  action: z.string(),
  entity: z.string(),
  entityId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  metadata: z.any().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  tenantId: z.string().optional().nullable(),
  createdAt: z.date(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;
