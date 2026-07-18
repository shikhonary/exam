import { z } from "zod";

// ---------------------------------------------------------------------------
// Exam schemas
// ---------------------------------------------------------------------------

const examBase = z.object({
  title: z.string().min(1, "Title is required").max(255),
  subject: z.string().min(1, "Subject is required").max(100),
  duration: z.number().int().min(1, "Duration must be at least 1 minute"),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  isPublic: z.boolean().default(true),
  status: z.enum(["Draft", "Published", "Completed"]).default("Draft"),
});

export const examFormSchema = examBase;

export type ExamFormValues = z.infer<typeof examBase>;

export const updateExamSchema = examBase.partial();

export type UpdateExamValues = z.infer<typeof updateExamSchema>;

export const defaultExamValues: ExamFormValues = {
  title: "",
  subject: "",
  duration: 60,
  isPublic: true,
  status: "Draft",
};
