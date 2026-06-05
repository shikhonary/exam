"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ============================================================================
// CQ MUTATIONS
// ============================================================================

export function useCreateCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create CQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.cq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update CQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.cq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete CQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.cq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkDeleteCQs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to bulk delete CQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.cq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkCreateCQs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.bulkCreate.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to import CQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.cq.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.cq.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// CQ QUERIES
// ============================================================================

export function useCQs(filters: any) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.cq.list.queryOptions(filters),
    select: (data: any) => data.data,
  });
}

export function useCQById(id?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.cq.getById.queryOptions({ id: id as string }),
    enabled: !!id,
    select: (data: any) => data.data,
  });
}

export function useCQStats(chapterId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.cq.getStats.queryOptions({ chapterId }),
    select: (data: any) => data.data,
  });
}

export function useCQsForAssignment(filters: {
  subjectId: string;
  questionTypeId: string;
  chapterId?: string;
  reference?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.cq.getForAssignment.queryOptions(filters),
    select: (data: any) => data.data,
  });
}
