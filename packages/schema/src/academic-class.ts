import { z } from "zod";

// ---------------------------------------------------------------------------
// AcademicClass schemas
// ---------------------------------------------------------------------------

const academicClassBase = z.object({
  nameBn: z.string().min(1, "Bangla name is required").max(100),
  nameEn: z.string().min(1, "English name is required").max(100),
  level:  z.string().min(1, "Level is required").max(50),
  position: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const academicClassFormSchema = academicClassBase;

export type AcademicClassFormValues = z.infer<typeof academicClassBase>;

export const updateAcademicClassSchema = academicClassBase.partial();

export type UpdateAcademicClassValues = z.infer<typeof updateAcademicClassSchema>;

export const defaultAcademicClassValues: AcademicClassFormValues = {
  nameBn:   "",
  nameEn:   "",
  level:    "",
  position: 0,
  isActive: true,
};
