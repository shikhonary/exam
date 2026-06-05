import z from "zod";
import { baseListInputSchema } from "../filters";
import { updateUserSchema } from "@workspace/schema";

export const listUserInput = baseListInputSchema.extend({
  isActive: z.boolean().optional().nullable(),
  role: z.string().optional().nullable(),
});

export type listUserInputType = z.infer<typeof listUserInput>;

export const idSchema = z.string().min(1, { message: "Invalid ID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateUserInputSchema = updateUserSchema.extend({
  id: idSchema,
});

export type updateUserInputType = z.infer<typeof updateUserInputSchema>;
