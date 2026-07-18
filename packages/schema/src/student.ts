import { z } from "zod";

// ---------------------------------------------------------------------------
// Student schemas
// ---------------------------------------------------------------------------

const studentBase = z.object({
  name: z.string().min(1, "Name is required").max(100),
  studentId: z.string().max(50).optional().nullable(),
  mobile: z.string().length(11, "Mobile must be 11 digits"),
});

export const studentFormSchema = studentBase;

export type StudentFormValues = z.infer<typeof studentBase>;

export const updateStudentSchema = studentBase.partial();

export type UpdateStudentValues = z.infer<typeof updateStudentSchema>;

export const defaultStudentValues: StudentFormValues = {
  name: "",
  studentId: "",
  mobile: "",
};
