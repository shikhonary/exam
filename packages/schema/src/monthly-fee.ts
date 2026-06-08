import { z } from "zod";

/**
 * Monthly Fee Schema
 */
export const monthlyFeeFormSchema = z.object({
  academicYearId: z.string().uuid("অনুগ্রহ করে একটি বছর নির্বাচন করুন"),
  academicClassId: z.string().uuid("অনুগ্রহ করে একটি ক্লাস নির্বাচন করুন"),
  amount: z.coerce
    .number({
      required_error: "ফি এর পরিমাণ দিতে হবে",
      invalid_type_error: "ফি অবশ্যই সংখ্যা হতে হবে",
    })
    .min(0, "ফি এর পরিমাণ ০ বা তার বেশি হতে হবে"),
});

export type MonthlyFeeFormValues = z.infer<typeof monthlyFeeFormSchema>;
