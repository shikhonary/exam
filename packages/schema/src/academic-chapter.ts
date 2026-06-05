import { z } from "zod";

export const academicChapterSchema = z.object({
  id: z.string(),
  nameBn: z.string().min(1, "Bengali name is required"),
  nameEn: z.string().min(1, "English name is required"),
  position: z.number().int().default(0),
  isActive: z.boolean().default(true),
  subjectId: z.string().min(1, "Subject is required"),
  academicYearId: z.string().min(1, "Academic Year is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AcademicChapter = z.infer<typeof academicChapterSchema>;

export const academicChapterFormSchema = z.object({
  nameBn: z.string().min(1, "Bengali name is required"),
  nameEn: z.string().min(1, "English name is required"),
  position: z.number().int().default(0),
  isActive: z.boolean().default(true),
  subjectId: z.string().min(1, "Subject is required"),
  academicYearId: z.string().min(1, "Academic Year is required"),
});

export type AcademicChapterFormValues = z.infer<
  typeof academicChapterFormSchema
>;

export const updateAcademicChapterSchema = academicChapterFormSchema.partial();

export type UpdateAcademicChapterValues = z.infer<
  typeof updateAcademicChapterSchema
>;

export const defaultAcademicChapterValues: AcademicChapterFormValues = {
  nameBn: "",
  nameEn: "",
  position: 0,
  isActive: true,
  subjectId: "",
  academicYearId: "",
};
