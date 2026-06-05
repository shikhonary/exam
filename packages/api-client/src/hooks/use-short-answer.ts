"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ============================================================================
// SHORT ANSWER MUTATIONS
// ============================================================================

export function useCreateShortAnswer() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.shortAnswer.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create short answer");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.shortAnswer.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateShortAnswer() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.shortAnswer.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update short answer");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.shortAnswer.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteShortAnswer() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.shortAnswer.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete short answer");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.shortAnswer.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkDeleteShortAnswers() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.shortAnswer.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to bulk delete short answers");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.shortAnswer.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkCreateShortAnswers() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.shortAnswer.bulkCreate.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to import short answers");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.shortAnswer.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.shortAnswer.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// SHORT ANSWER QUERIES
// ============================================================================

export function useShortAnswers(filters: any) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.shortAnswer.list.queryOptions(filters),
    select: (data: any) => data.data,
  });
}

export function useShortAnswerById(id?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.shortAnswer.getById.queryOptions({ id: id as string }),
    enabled: !!id,
    select: (data: any) => data.data,
  });
}

export function useShortAnswerStats(chapterId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.shortAnswer.getStats.queryOptions({ chapterId }),
    select: (data: any) => data.data,
  });
}

export function useShortAnswersForAssignment(filters: {
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
    ...trpc.shortAnswer.getForAssignment.queryOptions(filters),
    select: (data: any) => data.data,
  });
}
