"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useStudentFilters } from "../filters/client";

// ============================================================================
// STUDENT MUTATIONS
// ============================================================================

export function useCreateStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create student");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
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
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
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
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useToggleStudentActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle student status");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
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
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// STUDENT QUERIES
// ============================================================================

export function useStudents() {
  const trpc = useTRPC();
  const [filters] = useStudentFilters();
  return useQuery({
    ...trpc.student.list.queryOptions(filters),
    select: (res) => res.data,
  });
}

export function useStudentById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.student.getById.queryOptions(id),
    select: (data) => data.data,
  });
}
