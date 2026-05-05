import { z } from "zod";
import { nameSchema } from "./shared/fields";


export const villageFormSchema = z.object({
  name: nameSchema,
  displayName: z.string().min(1, "Display name must be at least 1 character").max(100),
  wardId: z.string().uuid("Invalid ward selected"),
  isActive: z.boolean(),
});

export type VillageFormValues = z.infer<typeof villageFormSchema>;
