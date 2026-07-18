"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type { Student } from "@workspace/db";
import type { PaginatedResponse } from "@workspace/api";

import { useTRPC } from "../client";
import { useStudentFilters } from "../filters/client";

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.student.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.student.getStats.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.student.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.student.getStats.queryKey() }),
          queryClient.invalidateQueries({
            queryKey: trpc.student.getById.queryKey({ id: data.data?.id as string }),
          }),
        ]);
      }
    },
  });
}

export function useDeleteStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.student.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.student.getStats.queryKey() }),
        ]);
      }
    },
  });
}

export function useBulkDeleteStudents() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete students");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.student.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.student.getStats.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useStudents() {
  const trpc = useTRPC();
  const [filters] = useStudentFilters();

  return useQuery({
    ...trpc.student.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<Student>,
  });
}

export function useStudentById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.student.getById.queryOptions({ id }),
    select: (res) => res.data as Student,
  });
}

export function useStudentStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.student.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
