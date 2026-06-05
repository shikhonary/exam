"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type { AcademicChapterTopicWithCount } from "@workspace/api";
import type { PaginatedResponse } from "@workspace/api";

import { useTRPC } from "../client";
import { useAcademicChapterTopicFilters } from "../filters/client";

// ============================================================================
// Types
// ============================================================================

export type { AcademicChapterTopicWithCount };

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateAcademicChapterTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapterTopic.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic chapter topic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateAcademicChapterTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapterTopic.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic chapter topic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.getById.queryKey({ id: data.data?.id as string }) }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useDeleteAcademicChapterTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapterTopic.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic chapter topic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useToggleAcademicChapterTopicActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapterTopic.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle academic chapter topic status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.getById.queryKey({ id: data.data?.id as string }) }),
          queryClient.invalidateQueries({ queryKey: trpc.academicChapterTopic.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useAcademicChapterTopics() {
  const trpc = useTRPC();
  const [filters] = useAcademicChapterTopicFilters();

  return useQuery({
    ...trpc.academicChapterTopic.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<AcademicChapterTopicWithCount>,
  });
}

export function useAcademicChapterTopicById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicChapterTopic.getById.queryOptions({ id }),
    select: (res) => res.data as AcademicChapterTopicWithCount,
  });
}

export function useAcademicChapterTopicsForSelection(chapterId?: string | null) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapterTopic.forSelection.queryOptions({ chapterId }),
    select: (data) => data.data,
  });
}

export function useAcademicChapterTopicStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapterTopic.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
