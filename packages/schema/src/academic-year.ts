import { z } from "zod";

// ---------------------------------------------------------------------------
// AcademicSession schemas
// ---------------------------------------------------------------------------

// Raw object — keeps .partial() / .omit() available
const academicSessionBase = z.object({
  name: z.string().min(1, "Session name is required").max(100),
  startDate: z.coerce.date({ required_error: "Start date is required" }),
  endDate: z.coerce.date({ required_error: "End date is required" }),
  classIds: z.array(z.string()).min(1, "Select at least one class"),
  isActive: z.boolean().default(true),
});

// With cross-field validation (used for actual parse/validation)
export const academicSessionFormSchema = academicSessionBase.refine(
  (d) => d.endDate > d.startDate,
  { message: "End date must be after start date", path: ["endDate"] },
);

export type AcademicSessionFormValues = z.infer<typeof academicSessionBase>;

// .partial() on the raw ZodObject — works correctly
export const updateAcademicSessionSchema = academicSessionBase.partial().refine(
  (d) => {
    if (d.startDate && d.endDate) return d.endDate > d.startDate;
    return true;
  },
  { message: "End date must be after start date", path: ["endDate"] },
);

export type UpdateAcademicSessionValues = z.infer<typeof updateAcademicSessionSchema>;

// ---------------------------------------------------------------------------
// AcademicYear schemas
// ---------------------------------------------------------------------------

// Raw object — keeps .omit() / .partial() available
const academicYearBase = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(20, "Label too long")
    .regex(/^\d{4}(-\d{2,4})?$/, "Label must be like '2025' or '2025-26'"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(20)
    .regex(/^[\w-]+$/, "Slug must be URL-safe"),
  startDate: z.coerce.date({ required_error: "Start date is required" }),
  endDate: z.coerce.date({ required_error: "End date is required" }),
  isCurrent: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sessions: z.array(academicSessionBase).default([]),
});

// With cross-field validation
export const academicYearFormSchema = academicYearBase.refine(
  (d) => d.endDate > d.startDate,
  { message: "End date must be after start date", path: ["endDate"] },
);

export type AcademicYearFormValues = z.infer<typeof academicYearBase>;

// .omit() + .partial() on the raw ZodObject — works correctly
export const updateAcademicYearSchema = academicYearBase
  .omit({ sessions: true })
  .partial()
  .refine(
    (d) => {
      if (d.startDate && d.endDate) return d.endDate > d.startDate;
      return true;
    },
    { message: "End date must be after start date", path: ["endDate"] },
  );

export type UpdateAcademicYearValues = z.infer<typeof updateAcademicYearSchema>;

export const defaultAcademicYearValues: Partial<AcademicYearFormValues> = {
  label: "",
  slug: "",
  isCurrent: false,
  isActive: true,
  sessions: [],
};
