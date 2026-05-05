import z from "zod";
import { baseListInputSchema } from "../filters";
import { villageFormSchema } from "@workspace/schema";

export const listInput = baseListInputSchema.extend({
  wardId: z.string().uuid().nullable().optional(),
});

export type listInputType = z.infer<typeof listInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateVillageSchema = villageFormSchema.extend({
  id: idSchema,
});

export type updateVillageInputType = z.infer<typeof updateVillageSchema>;
