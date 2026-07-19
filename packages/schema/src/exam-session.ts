import { z } from "zod";

// ---------------------------------------------------------------------------
// Exam Session schemas (student-facing exam app)
// ---------------------------------------------------------------------------

export const studentRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  mobile: z.string().regex(/^01[3-9]\d{8}$/, "Valid BD mobile number required"),
  studentId: z.string().optional(),
});

export type StudentRegistrationValues = z.infer<typeof studentRegistrationSchema>;

export const verifyOtpSchema = z.object({
  mobile: z.string(),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  mobile: z.string(),
});

export type ResendOtpValues = z.infer<typeof resendOtpSchema>;

export const startAttemptSchema = z.object({
  examId: z.string().uuid(),
  studentId: z.string().uuid(),
});

export type StartAttemptValues = z.infer<typeof startAttemptSchema>;

export const submitAnswerSchema = z.object({
  attemptId: z.string().uuid(),
  mcqId: z.string().uuid(),
  selectedOption: z.string(),
});

export type SubmitAnswerValues = z.infer<typeof submitAnswerSchema>;

export const submitExamSchema = z.object({
  attemptId: z.string().uuid(),
});

export type SubmitExamValues = z.infer<typeof submitExamSchema>;

export const leaderboardInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

export type LeaderboardInputValues = z.infer<typeof leaderboardInputSchema>;
