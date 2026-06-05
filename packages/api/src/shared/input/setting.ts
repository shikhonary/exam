import { z } from "zod";
import { baseListInputSchema } from "../filters";
import { settingFormSchema } from "@workspace/schema";

export const listSettingInput = baseListInputSchema.extend({
  category: z.string().optional().nullable(),
});

export type ListSettingInputType = z.infer<typeof listSettingInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export const updateSettingInputSchema = settingFormSchema.extend({
  id: idSchema,
});

export type UpdateSettingInputType = z.infer<typeof updateSettingInputSchema>;

export const bulkUpdateSettingsInputSchema = z.object({
  settings: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })),
});
