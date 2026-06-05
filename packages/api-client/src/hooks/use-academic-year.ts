"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type {
  AcademicYearWithRelations,
  PaginatedResponse,
} from "@workspace/api";

import { useTRPC } from "../client";
import { useAcademicYearFilters } from "../filters/client";

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateAcademicYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicYear.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic year");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.getCurrent.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateAcademicYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicYear.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic year");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.getCurrent.queryKey() }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.getById.queryKey({ id: data.data?.id as string }),
          }),
        ]);
      }
    },
  });
}

export function useDeleteAcademicYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicYear.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic year");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useSetCurrentAcademicYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicYear.setCurrent.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to set current academic year");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.getCurrent.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useToggleAcademicYearActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicYear.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle academic year status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.academicYear.getStats.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useAcademicYears() {
  const trpc = useTRPC();
  const [filters] = useAcademicYearFilters();

  return useQuery({
    ...trpc.academicYear.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<AcademicYearWithRelations>,
  });
}

export function useAcademicYearById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicYear.getById.queryOptions({ id }),
    select: (res) => res.data as AcademicYearWithRelations,
  });
}

export function useCurrentAcademicYear() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicYear.getCurrent.queryOptions(),
    select: (data) => data.data as AcademicYearWithRelations | null,
  });
}

export function useAcademicYearsForSelection() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicYear.forSelection.queryOptions(),
    select: (data) =>
      data.data as {
        id: string;
        label: string;
        slug: string;
        isCurrent: boolean;
        startDate: Date;
        endDate: Date;
      }[],
  });
}

export function useAcademicYearStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicYear.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
