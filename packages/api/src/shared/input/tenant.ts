import z from "zod";
import { baseListInputSchema } from "../filters";
import { tenantFormSchema, updateTenantSchema } from "@workspace/schema";

export const listTenantInput = baseListInputSchema.extend({
  isActive: z.boolean().optional().nullable(),
  type: z.string().optional().nullable(),
  planId: z.string().optional().nullable(),
});

export type listTenantInputType = z.infer<typeof listTenantInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateTenantInputSchema = updateTenantSchema.extend({
  id: idSchema,
});

export type updateTenantInputType = z.infer<typeof updateTenantInputSchema>;
