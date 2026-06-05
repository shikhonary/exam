import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields";

/**
 * Batch Schema
 */

export const batchFormSchema = z.object({
  academicYearId: z.string().min(1, "অনুগ্রহ করে একটি বছর নির্বাচন করুন"),
  academicClassId: z.string().min(1, "অনুগ্রহ করে একটি ক্লাস নির্বাচন করুন"),
  name: z
    .string()
    .min(1, "ব্যাচের নাম অবশ্যই দিতে হবে")
    .max(100, "ব্যাচের নাম ১০০ অক্ষরের বেশি হতে পারবে না")
    .trim(),
  academicYear: z.string().min(4, "সঠিক বছর দিন").max(20),
  capacity: z.coerce
    .number({
      required_error: "আসন সংখ্যা দিতে হবে",
      invalid_type_error: "আসন সংখ্যা অবশ্যই নম্বর হতে হবে",
    })
    .int("আসন সংখ্যা পূর্ণসংখ্যা হতে হবে")
    .min(1, "আসন সংখ্যা কমপক্ষে ১ হতে হবে"),
  isActive: z.boolean(),
});

export type BatchFormValues = z.infer<typeof batchFormSchema>;
