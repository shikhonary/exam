import { z } from "zod";

// ---------------------------------------------------------------------------
// QuestionType schemas
// ---------------------------------------------------------------------------

const questionTypeBase = z.object({
  nameEn: z.string().min(1, "English name is required").max(100),
  nameBn: z.string().min(1, "Bangla name is required").max(100),
  isActive: z.boolean().default(true),
});

export const questionTypeFormSchema = questionTypeBase;

export type QuestionTypeFormValues = z.infer<typeof questionTypeBase>;

export const updateQuestionTypeSchema = questionTypeBase.partial();

export type UpdateQuestionTypeValues = z.infer<typeof updateQuestionTypeSchema>;

export const defaultQuestionTypeValues: QuestionTypeFormValues = {
  nameEn:   "",
  nameBn:   "",
  isActive: true,
};

// ---------------------------------------------------------------------------
// SubjectQuestionType schemas
// Associates a QuestionType with an AcademicSubject, with an optional label
// override per subject context (e.g. "MCQ" might be shown as "Objective" for
// a given subject).
// ---------------------------------------------------------------------------

/** Single assignment row — one questionType linked to one subject */
export const subjectQuestionTypeFormSchema = z.object({
  subjectId:      z.string().uuid("Invalid subject ID"),
  questionTypeId: z.string().uuid("Invalid question type ID"),
  label:          z.string().min(1, "Label is required").max(50),
});

export type SubjectQuestionTypeFormValues = z.infer<typeof subjectQuestionTypeFormSchema>;

/** Bulk assign: provide a subjectId + array of { questionTypeId, label } */
export const assignQuestionTypesToSubjectSchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID"),
  items: z
    .array(
      z.object({
        questionTypeId: z.string().uuid("Invalid question type ID"),
        label:          z.string().min(1, "Label is required").max(50),
      }),
    )
    .min(1, "At least one question type is required"),
});

export type AssignQuestionTypesToSubjectValues = z.infer<typeof assignQuestionTypesToSubjectSchema>;

/** Update only the label of an existing SubjectQuestionType row */
export const updateSubjectQuestionTypeSchema = z.object({
  label: z.string().min(1, "Label is required").max(50),
});

export type UpdateSubjectQuestionTypeValues = z.infer<typeof updateSubjectQuestionTypeSchema>;

