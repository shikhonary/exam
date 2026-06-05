import { z } from "zod";
import { uuidSchema } from "./shared/fields";

export const settingFormSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  type: z.enum(["string", "boolean", "number", "json"]).default("string"),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export type SettingFormValues = z.infer<typeof settingFormSchema>;

export const settingSchema = settingFormSchema.extend({
  id: uuidSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Setting = z.infer<typeof settingSchema>;
