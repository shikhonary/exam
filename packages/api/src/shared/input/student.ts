import z from "zod";
import { baseListInputSchema } from "../filters";
import { studentFormSchema } from "@workspace/schema";

export const listInput = baseListInputSchema.extend({
  academicYearId: z.string().uuid().nullable().optional(),
  batchId: z.string().uuid().nullable().optional(),
});

export type listInputType = z.infer<typeof listInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateStudentSchema = studentFormSchema.extend({
  id: idSchema,
});

export type updateStudentInputType = z.infer<typeof updateStudentSchema>;
