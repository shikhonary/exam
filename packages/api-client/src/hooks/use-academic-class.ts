"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type { AcademicClassWithCount } from "@workspace/api";
import type { PaginatedResponse } from "@workspace/api";

import { useTRPC } from "../client";
import { useAcademicClassFilters } from "../filters/client";

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateAcademicClass() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic class");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateAcademicClass() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic class");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.forSelection.queryKey() }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicClass.getById.queryKey({ id: data.data?.id as string }),
          }),
        ]);
      }
    },
  });
}

export function useDeleteAcademicClass() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic class");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useToggleAcademicClassActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle academic class status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useReorderAcademicClasses() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.reorder.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to reorder academic classes");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useBulkDeleteAcademicClasses() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic classes");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicClass.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useAcademicClasses() {
  const trpc = useTRPC();
  const [filters] = useAcademicClassFilters();

  return useQuery({
    ...trpc.academicClass.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<AcademicClassWithCount>,
  });
}

export function useAcademicClassById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicClass.getById.queryOptions({ id }),
    select: (res) => res.data as AcademicClassWithCount,
  });
}

export function useAcademicClassesForSelection() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicClass.forSelection.queryOptions(),
    select: (data) =>
      data.data as {
        id: string;
        nameBn: string;
        nameEn: string;
        level: string;
        position: number;
      }[],
  });
}

export function useAcademicClassStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicClass.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
