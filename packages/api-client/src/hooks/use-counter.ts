"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useCounterFilters } from "../filters/client";

// ============================================================================
// COUNTER MUTATIONS
// ============================================================================

export function useCreateCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.counter.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.counter.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.counter.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.counter.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.counter.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.counter.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkDeleteCounters() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.counter.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete counters");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.counter.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// COUNTER QUERIES
// ============================================================================

export function useCounters() {
  const trpc = useTRPC();
  const [filters] = useCounterFilters();
  return useQuery({
    ...trpc.counter.list.queryOptions(filters),
    select: (res) => res.data,
  });
}

export function useCounterById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.counter.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useNextStudentId(academicYearId?: string, academicClassId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.counter.getNextStudentId.queryOptions(
      {
        academicYearId: academicYearId!,
        academicClassId: academicClassId!,
      },
      {
        enabled: !!academicYearId && !!academicClassId,
      }
    ),
    select: (data) => data.data,
  });
}
