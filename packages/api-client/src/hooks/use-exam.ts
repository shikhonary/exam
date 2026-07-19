"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type { Exam } from "@workspace/db";
import type { PaginatedResponse } from "@workspace/api";

import { useTRPC } from "../client";
import { useExamFilters } from "../filters/client";

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateExam() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.exam.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create exam");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.exam.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.exam.getStats.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateExam() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.exam.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update exam");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.exam.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.exam.getStats.queryKey() }),
          queryClient.invalidateQueries({
            queryKey: trpc.exam.getById.queryKey({ id: data.data?.id as string }),
          }),
        ]);
      }
    },
  });
}

export function useDeleteExam() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.exam.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete exam");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.exam.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.exam.getStats.queryKey() }),
        ]);
      }
    },
  });
}

export function useBulkDeleteExams() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.exam.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete exams");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.exam.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.exam.getStats.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useExams(filters: any = {}) {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.exam.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<Exam>,
  });
}

export function useExamById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.exam.getById.queryOptions({ id }),
    select: (res) => res.data as Exam,
  });
}

export function useExamStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.exam.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

export function useAttachedMcqs(examId: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.exam.getAttachedMcqs.queryOptions({ examId }),
    select: (data) => data.data,
    enabled: !!examId,
  });
}

export function useSyncExamMcqs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation({
    ...trpc.exam.syncMcqs.mutationOptions(),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries(
        trpc.exam.getAttachedMcqs.queryFilter({ examId: variables.examId })
      );
    },
    onError: (error) => toast.error(error.message || "Failed to sync MCQs"),
  });
}
