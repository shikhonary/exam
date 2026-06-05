"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ============================================================================
// MCQ MUTATIONS
// ============================================================================

export function useCreateMCQ() {
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
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateMCQ() {
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
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteMCQ() {
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
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkDeleteMCQs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to bulk delete MCQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkCreateMCQs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.bulkCreate.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to import MCQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// MCQ QUERIES
// ============================================================================

export function useMCQs(filters: any) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mcq.list.queryOptions(filters),
    select: (data: any) => data.data,
  });
}

export function useMCQById(id?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mcq.getById.queryOptions({ id: id as string }),
    enabled: !!id,
    select: (data: any) => data.data,
  });
}

export function useMCQStats(chapterId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mcq.getStats.queryOptions({ chapterId }),
    select: (data: any) => data.data,
  });
}

export function useMCQsForAssignment(filters: {
  subjectId: string;
  questionTypeId: string;
  chapterId?: string;
  reference?: string;
  type?: string;
  session?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mcq.getForAssignment.queryOptions(filters),
    select: (data: any) => data.data,
  });
}
