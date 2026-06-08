import { z } from "zod";

/**
 * Student Schema
 */

export const studentFormSchema = z.object({
  studentId: z.string().min(1, "স্টুডেন্ট আইডি দিতে হবে"),
  name: z.string().min(1, "শিক্ষার্থীর নাম দিতে হবে"),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  academicClassId: z.string().min(1, "ক্লাস নির্বাচন করুন"),
  batchId: z.string().min(1, "ব্যাচ নির্বাচন করুন"),
  institute: z.string().min(1, "প্রতিষ্ঠানের নাম দিতে হবে"),
  roll: z.string().min(1, "রোল নম্বর দিতে হবে"),
  group: z.string().optional().or(z.literal("")),
  shift: z.string().optional().or(z.literal("")),
  section: z.string().optional().or(z.literal("")),
  fatherName: z.string().min(1, "পিতার নাম দিতে হবে"),
  motherName: z.string().min(1, "মাতার নাম দিতে হবে"),
  dateOfBirth: z.date().optional().or(z.string().optional()),
  gender: z.string().min(1, "লিঙ্গ নির্বাচন করুন"),
  bloodGroup: z.string().optional().or(z.literal("")),
  nationality: z.string().min(1, "জাতীয়তা দিতে হবে"),
  religion: z.string().min(1, "ধর্ম নির্বাচন করুন"),
  imageUrl: z.string().optional().or(z.literal("")),
  primaryPhone: z.string().length(11, "ফোন নম্বর অবশ্যই ১১ সংখ্যার হতে হবে"),
  secondaryPhone: z.string().length(11, "ফোন নম্বর অবশ্যই ১১ সংখ্যার হতে হবে").optional().or(z.literal("")),
  presentAddress: z.string().min(1, "বর্তমান ঠিকানা দিতে হবে"),
  permanentAddress: z.string().min(1, "স্থায়ী ঠিকানা দিতে হবে"),
  isActive: z.boolean().default(true),
  admissionFee: z.coerce.number().min(0, "ভর্তি ফি ০ বা তার বেশি হতে হবে"),
  monthlyFee: z.coerce.number().min(0, "মাসিক ফি ০ বা তার বেশি হতে হবে"),
  academicYearId: z.string().min(1, "শিক্ষাবর্ষ নির্বাচন করুন"),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
