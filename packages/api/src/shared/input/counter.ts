import z from "zod";
import { baseListInputSchema } from "../filters";
import { counterFormSchema } from "@workspace/schema";

export const listInput = baseListInputSchema.extend({
  academicYearId: z.string().uuid().nullable(),
  type: z.string().nullable(),
});

export type listInputType = z.infer<typeof listInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateCounterSchema = counterFormSchema.extend({
  id: idSchema,
});

export type updateCounterInputType = z.infer<typeof updateCounterSchema>;

export const getNextStudentIdSchema = z.object({
  academicYearId: z.string().uuid(),
});

export type getNextStudentIdInputType = z.infer<typeof getNextStudentIdSchema>;
