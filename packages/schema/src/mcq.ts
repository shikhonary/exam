import { z } from "zod";
import { uuidSchema } from "./shared/fields";

export const questionContextSchema = z.object({
  text: z.string().optional().or(z.literal("")),
  url: z.string().url("Valid URL is required").optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
});

export const mcqFormSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  options: z.array(z.string()).min(2, "At least two options are required"),
  statements: z.array(z.string()).optional().default([]),
  type: z.string().min(1, "Type is required"),
  isMath: z.boolean().default(false),
  reference: z.array(z.string()).optional().default([]),
  explanation: z.string().optional().or(z.literal("")),
  session: z.coerce.number().int().min(1, "Session is required"),
  source: z.string().optional().or(z.literal("")),
  questionUrl: z.string().url("Valid URL is required").optional().or(z.literal("")),
  
  contextId: uuidSchema.optional().or(z.literal("")),
  questionContext: questionContextSchema.optional().nullable(),
  
  chapterId: uuidSchema.or(z.string().min(1, "Chapter is required")),
  subjectId: uuidSchema.or(z.string().min(1, "Subject is required")),
  topicId: uuidSchema.optional().or(z.literal("")),
  subTopicId: uuidSchema.optional().or(z.literal("")),
  questionTypeId: uuidSchema.optional().or(z.literal("")),
  
  isActive: z.boolean().default(true),
});

export type MCQFormValues = z.infer<typeof mcqFormSchema>;

export const defaultMCQValues: MCQFormValues = {
  question: "",
  answer: "",
  options: ["", "", "", ""],
  statements: [],
  type: "",
  isMath: false,
  reference: [],
  explanation: "",
  session: new Date().getFullYear(),
  source: "",
  questionUrl: "",
  contextId: "",
  questionContext: null,
  chapterId: "",
  subjectId: "",
  topicId: "",
  subTopicId: "",
  questionTypeId: "",
  isActive: true,
};

export const updateMCQSchema = mcqFormSchema.partial();

export const mcqSchema = mcqFormSchema.extend({
  id: uuidSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MCQ = z.infer<typeof mcqSchema>;
