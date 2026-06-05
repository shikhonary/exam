import { z } from "zod";
import { uuidSchema } from "./shared/fields";

export const cqAttachmentSchema = z.object({
  url: z.string().url("Valid URL is required"),
  type: z.string().default("image"),
  caption: z.string().optional().or(z.literal("")),
  position: z.number().int().default(0),
});

export const cqAnswerSchema = z.object({
  answerA: z.string().optional().or(z.literal("")),
  answerB: z.string().optional().or(z.literal("")),
  answerC: z.string().optional().or(z.literal("")),
  answerD: z.string().optional().or(z.literal("")),
  explanation: z.string().optional().or(z.literal("")),
});

export const cqFormSchema = z.object({
  questionA: z.string().min(1, "Question A is required"),
  questionB: z.string().min(1, "Question B is required"),
  questionC: z.string().min(1, "Question C is required"),
  questionD: z.string().optional().or(z.literal("")),
  context: z.string().optional().or(z.literal("")),
  reference: z.array(z.string()).optional(),
  
  chapterId: uuidSchema.or(z.string().min(1, "Chapter is required")),
  subjectId: uuidSchema.or(z.string().min(1, "Subject is required")),
  topicId: uuidSchema.optional().or(z.literal("")),
  subTopicId: uuidSchema.optional().or(z.literal("")),
  questionTypeId: uuidSchema.optional().or(z.literal("")),

  attachments: z.array(cqAttachmentSchema).optional(),
  answer: cqAnswerSchema.optional().nullable(),
});

export type CQFormValues = z.infer<typeof cqFormSchema>;

export const defaultCQValues: CQFormValues = {
  questionA: "",
  questionB: "",
  questionC: "",
  questionD: "",
  context: "",
  reference: [],
  chapterId: "",
  subjectId: "",
  topicId: "",
  subTopicId: "",
  questionTypeId: "",
  attachments: [],
  answer: null,
};

export const updateCQSchema = cqFormSchema.partial();

export const cqSchema = cqFormSchema.extend({
  id: uuidSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CQ = z.infer<typeof cqSchema>;
