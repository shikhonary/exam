"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type { AcademicSubjectWithCount } from "@workspace/api";
import type { PaginatedResponse } from "@workspace/api";

import { useTRPC } from "../client";
import { useAcademicSubjectFilters } from "../filters/client";

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic subject");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic subject");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.forSelection.queryKey() }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.getById.queryKey({ id: data.data?.id as string }),
          }),
        ]);
      }
    },
  });
}

export function useDeleteAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic subject");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useToggleAcademicSubjectActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle academic subject status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.forSelection.queryKey() }),
        ]);
      }
    },
  });
}



export function useBulkDeleteAcademicSubjects() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic subjects");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicSubject.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useAcademicSubjects() {
  const trpc = useTRPC();
  const [filters] = useAcademicSubjectFilters();

  return useQuery({
    ...trpc.academicSubject.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<AcademicSubjectWithCount>,
  });
}

export function useAcademicSubjectById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubject.getById.queryOptions({ id }),
    select: (res) => res.data as AcademicSubjectWithCount,
  });
}

export function useAcademicSubjectsForSelection(classId?: string, academicYearId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicSubject.forSelection.queryOptions({ classId, academicYearId }),
    select: (data) =>
      data.data as {
        id: string;
        nameBn: string;
        nameEn: string;
        code: string | null;
      }[],
  });
}

export function useAcademicSubjectStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicSubject.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
