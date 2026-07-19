"use client";

import { useMutation, useQueryClient, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "../client";

// ============================================================================
// MUTATIONS
// ============================================================================

export function useRegisterStudent() {
  const trpc = useTRPC();
  return useMutation({
    ...trpc.examSession.registerStudent.mutationOptions(),
    onError: (error) => toast.error(error.message || "Failed to register"),
  });
}

export function useVerifyOtp() {
  const trpc = useTRPC();
  return useMutation({
    ...trpc.examSession.verifyOtp.mutationOptions(),
    onError: (error) => toast.error(error.message || "Invalid OTP"),
  });
}

export function useResendOtp() {
  const trpc = useTRPC();
  return useMutation({
    ...trpc.examSession.resendOtp.mutationOptions(),
    onError: (error) => toast.error(error.message || "Failed to resend OTP"),
  });
}

export function useStartAttempt() {
  const trpc = useTRPC();
  return useMutation({
    ...trpc.examSession.startAttempt.mutationOptions(),
    onError: (error) => toast.error(error.message || "Failed to start exam"),
  });
}

export function useSubmitAnswer() {
  const trpc = useTRPC();
  return useMutation({
    ...trpc.examSession.submitAnswer.mutationOptions(),
    onError: (error) => toast.error(error.message || "Failed to save answer"),
  });
}

export function useSubmitExam() {
  const trpc = useTRPC();
  return useMutation({
    ...trpc.examSession.submitExam.mutationOptions(),
    onError: (error) => toast.error(error.message || "Failed to submit exam"),
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useUpcomingExam() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.examSession.getUpcomingExam.queryOptions(),
    select: (data) => data?.data,
  });
}

export function usePublishedExams(page = 1, limit = 10) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.examSession.getPublishedExams.queryOptions({ page, limit }),
    select: (data) => data?.data,
  });
}

export function useExamLeaderboard(page = 1, limit = 10) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.examSession.getLeaderboard.queryOptions({ page, limit }),
    select: (data) => data?.data,
  });
}

export function useAttemptResult(attemptId: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.examSession.getAttemptResult.queryOptions({ attemptId }),
    select: (data) => data?.data,
    enabled: !!attemptId,
  });
}
