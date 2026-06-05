import { z } from "zod";

export const academicChapterTopicSchema = z.object({
  id: z.string(),
  nameEn: z.string().min(1, "English name is required"),
  nameBn: z.string().min(1, "Bengali name is required"),
  position: z.number().int().default(0),
  isActive: z.boolean().default(true),
  chapterId: z.string().min(1, "Chapter is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AcademicChapterTopic = z.infer<typeof academicChapterTopicSchema>;

export const academicChapterTopicFormSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameBn: z.string().min(1, "Bengali name is required"),
  position: z.number().int().default(0),
  isActive: z.boolean().default(true),
  chapterId: z.string().min(1, "Chapter is required"),
});

export type AcademicChapterTopicFormValues = z.infer<
  typeof academicChapterTopicFormSchema
>;

export const updateAcademicChapterTopicSchema = academicChapterTopicFormSchema.partial();

export type UpdateAcademicChapterTopicValues = z.infer<
  typeof updateAcademicChapterTopicSchema
>;

export const defaultAcademicChapterTopicValues: AcademicChapterTopicFormValues = {
  nameEn: "",
  nameBn: "",
  position: 0,
  isActive: true,
  chapterId: "",
};
