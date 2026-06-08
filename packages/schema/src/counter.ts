import { z } from "zod";

/**
 * Counter Schema
 */
export const counterFormSchema = z.object({
  academicYearId: z.string().uuid("অনুগ্রহ করে একটি বছর নির্বাচন করুন"),
  type: z.string({
    required_error: "ধরন নির্বাচন করুন",
  }),
  value: z.coerce
    .number({
      required_error: "মান দিতে হবে",
      invalid_type_error: "মান অবশ্যই সংখ্যা হতে হবে",
    })
    .int("মান অবশ্যই পূর্ণসংখ্যা হতে হবে")
    .min(0, "মান ০ বা তার বেশি হতে হবে"),
});

export type CounterFormValues = z.infer<typeof counterFormSchema>;
