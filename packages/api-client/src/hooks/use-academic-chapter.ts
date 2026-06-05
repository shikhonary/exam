"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type { AcademicChapterWithCount } from "@workspace/api";
import type { PaginatedResponse } from "@workspace/api";

import { useTRPC } from "../client";
import { useAcademicChapterFilters } from "../filters/client";

// ============================================================================
// Types
// ============================================================================

export type { AcademicChapterWithCount };

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic chapter");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic chapter");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.getById.queryKey({ id: data.data?.id as string }) }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useDeleteAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic chapter");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useToggleAcademicChapterActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle academic chapter status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.getById.queryKey({ id: data.data?.id as string }) }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useBulkDeleteAcademicChapters() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic chapters");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapter.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useAcademicChapters() {
  const trpc = useTRPC();
  const [filters] = useAcademicChapterFilters();

  return useQuery({
    ...trpc.academicChapter.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<AcademicChapterWithCount>,
  });
}

export function useAcademicChapterById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicChapter.getById.queryOptions({ id }),
    select: (res) => res.data as AcademicChapterWithCount,
  });
}

export function useAcademicChaptersForSelection(subjectId?: string | null) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapter.forSelection.queryOptions({ subjectId }),
    select: (data) => data.data,
  });
}

export function useAcademicChapterStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapter.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
