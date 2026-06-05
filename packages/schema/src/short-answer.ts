import { z } from "zod";
import { uuidSchema } from "./shared/fields";

export const shortAnswerFormSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().optional().or(z.literal("")).nullable(),
  reference: z.array(z.string()).optional(),
  
  chapterId: uuidSchema.or(z.string().min(1, "Chapter is required")),
  subjectId: uuidSchema.or(z.string().min(1, "Subject is required")),
  topicId: uuidSchema.optional().or(z.literal("")),
  subTopicId: uuidSchema.optional().or(z.literal("")),
  questionTypeId: uuidSchema.optional().or(z.literal("")),
});

export type ShortAnswerFormValues = z.infer<typeof shortAnswerFormSchema>;

export const defaultShortAnswerValues: ShortAnswerFormValues = {
  question: "",
  answer: null,
  reference: [],
  chapterId: "",
  subjectId: "",
  topicId: "",
  subTopicId: "",
  questionTypeId: "",
};

export const updateShortAnswerSchema = shortAnswerFormSchema.partial();

export const shortAnswerSchema = shortAnswerFormSchema.extend({
  id: uuidSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ShortAnswer = z.infer<typeof shortAnswerSchema>;
