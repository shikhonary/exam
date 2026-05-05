import { z } from "zod";
import { nameSchema } from "./shared/fields";

/**
 * Ward Schema
 */

export const wardFormSchema = z.object({
  name: nameSchema,
  displayName: z.string().min(1, "Display name must be at least 2 characters").max(100),
  isActive: z.boolean(),
});

export type WardFormValues = z.infer<typeof wardFormSchema>;
