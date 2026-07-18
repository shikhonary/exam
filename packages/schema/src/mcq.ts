import { z } from "zod";

// ---------------------------------------------------------------------------
// Mcq schemas
// ---------------------------------------------------------------------------

const mcqBase = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  type: z.string().min(1, "Type is required"),
  options: z.array(z.string()).min(2, "At least two options are required"),
  statements: z.array(z.string()).default([]),
  isMath: z.boolean().default(false),
  reference: z.array(z.string()).default([]),
  subject: z.string().min(1, "Subject is required"),
});

export const mcqFormSchema = mcqBase;

export type McqFormValues = z.infer<typeof mcqBase>;

export const updateMcqSchema = mcqBase.partial();

export type UpdateMcqValues = z.infer<typeof updateMcqSchema>;

export const mcqImportSchema = z.object({
  mcqs: z.array(mcqFormSchema).min(1, "At least one MCQ is required"),
});

export type McqImportValues = z.infer<typeof mcqImportSchema>;

export const defaultMcqValues: McqFormValues = {
  question: "",
  answer: "",
  type: "",
  options: ["", "", "", ""],
  statements: [],
  isMath: false,
  reference: [],
  subject: "",
};
