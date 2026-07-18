"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type { Mcq } from "@workspace/db";
import type { PaginatedResponse } from "@workspace/api";

import { useTRPC } from "../client";
import { useMCQFilters } from "../filters/client";

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateMcq() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.mcq.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.mcq.getStats.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateMcq() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.mcq.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.mcq.getStats.queryKey() }),
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.getById.queryKey({ id: data.data?.id as string }),
          }),
        ]);
      }
    },
  });
}

export function useDeleteMcq() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.mcq.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.mcq.getStats.queryKey() }),
        ]);
      }
    },
  });
}

export function useBulkDeleteMcqs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete MCQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.mcq.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.mcq.getStats.queryKey() }),
        ]);
      }
    },
  });
}

export function useImportMcqs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.import.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to import MCQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.mcq.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.mcq.getStats.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useMcqs() {
  const trpc = useTRPC();
  const [filters] = useMCQFilters();

  return useQuery({
    ...trpc.mcq.list.queryOptions({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      sortBy: filters.sortBy ?? undefined,
      sortOrder: filters.sortOrder ?? undefined,
      type: filters.type ?? undefined,
      isMath: filters.isMath ?? undefined,
      subject: filters.subjectId ?? undefined,
    }),
    select: (data) => data.data as PaginatedResponse<Mcq>,
  });
}

export function useMcqById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.mcq.getById.queryOptions({ id }),
    select: (res) => res.data as Mcq,
  });
}

export function useMcqStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mcq.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
