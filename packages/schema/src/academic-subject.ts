import { z } from "zod";

// ---------------------------------------------------------------------------
// AcademicSubject schemas
// ---------------------------------------------------------------------------

const academicSubjectBase = z.object({
  nameBn: z.string().min(1, "Bangla name is required").max(100),
  nameEn: z.string().min(1, "English name is required").max(100),
  code: z.string().max(50).optional().nullable(),
  group: z.string().max(50).optional().nullable(),
  isActive: z.boolean().default(true),
  academicYearId: z.string().min(1, "Academic Year is required"),
  academicClassIds: z.array(z.string()).min(1, "Select at least one class"),
});

export const academicSubjectFormSchema = academicSubjectBase;

export type AcademicSubjectFormValues = z.infer<typeof academicSubjectBase>;

export const updateAcademicSubjectSchema = academicSubjectBase.partial();

export type UpdateAcademicSubjectValues = z.infer<typeof updateAcademicSubjectSchema>;

export const defaultAcademicSubjectValues: AcademicSubjectFormValues = {
  nameBn: "",
  nameEn: "",
  code: null,
  group: null,
  isActive: true,
  academicYearId: "",
  academicClassIds: [],
};
