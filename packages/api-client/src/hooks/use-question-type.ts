"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type { QuestionTypeWithCount } from "@workspace/api";
import type { PaginatedResponse } from "@workspace/api";

import { useTRPC } from "../client";
import { useQuestionTypeFilters } from "../filters/client";

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateQuestionType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create question type");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.questionType.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useUpdateQuestionType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update question type");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.questionType.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.forSelection.queryKey() }),
          queryClient.invalidateQueries({
            queryKey: trpc.questionType.getById.queryKey({ id: data.data?.id as string }),
          }),
        ]);
      }
    },
  });
}

export function useDeleteQuestionType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete question type");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.questionType.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useToggleQuestionTypeActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle question type status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.questionType.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

export function useBulkDeleteQuestionTypes() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete question types");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.questionType.list.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.getStats.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.questionType.forSelection.queryKey() }),
        ]);
      }
    },
  });
}

// ============================================================================
// QUERIES
// ============================================================================

export function useQuestionTypes() {
  const trpc = useTRPC();
  const [filters] = useQuestionTypeFilters();

  return useQuery({
    ...trpc.questionType.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<QuestionTypeWithCount>,
  });
}

export function useQuestionTypeById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.questionType.getById.queryOptions({ id }),
    select: (res) => res.data as QuestionTypeWithCount,
  });
}

export function useQuestionTypesForSelection() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionType.forSelection.queryOptions(),
    select: (data) =>
      data.data as {
        id: string;
        nameBn: string;
        nameEn: string;
        label: string;
      }[],
  });
}

export function useQuestionTypeStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionType.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

// ============================================================================
// SubjectQuestionType hooks
// ============================================================================

import type { SubjectQuestionTypeItem, SubjectQuestionTypeWithSubject } from "@workspace/api";

export function useSubjectQuestionTypes(subjectId: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionType.subjectQuestionType.listBySubject.queryOptions({ subjectId }),
    select: (res) => res.data as SubjectQuestionTypeItem[],
    enabled: !!subjectId,
  });
}

/** Inverted view — subjects linked to a question type (used in the QT edit form) */
export function useSubjectsByQuestionType(questionTypeId: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionType.subjectQuestionType.listByQuestionType.queryOptions({ questionTypeId }),
    select: (res) => res.data as SubjectQuestionTypeWithSubject[],
    enabled: !!questionTypeId,
  });
}

/** Assign this question type to a subject — called from the QT edit form */
export function useAssignQuestionTypeToSubject(questionTypeId: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.subjectQuestionType.assignToSubject.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to assign to subject");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionType.subjectQuestionType.listByQuestionType.queryKey({
            questionTypeId,
          }),
        });
      }
    },
  });
}

export function useAssignQuestionTypesToSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.subjectQuestionType.assign.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to assign question types");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionType.subjectQuestionType.listBySubject.queryKey({
            subjectId: variables.subjectId,
          }),
        });
      }
    },
  });
}

export function useRemoveSubjectQuestionType(subjectId: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.subjectQuestionType.remove.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to remove question type");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionType.subjectQuestionType.listBySubject.queryKey({ subjectId }),
        });
      }
    },
  });
}

export function useUpdateSubjectQuestionTypeLabel(subjectId: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.subjectQuestionType.updateLabel.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update label");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionType.subjectQuestionType.listBySubject.queryKey({ subjectId }),
        });
      }
    },
  });
}

/** Used from the QuestionType edit form — invalidates the listByQuestionType cache */
export function useRemoveSubjectQuestionTypeByQT(questionTypeId: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.subjectQuestionType.remove.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to remove assignment");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionType.subjectQuestionType.listByQuestionType.queryKey({
            questionTypeId,
          }),
        });
      }
    },
  });
}

/** Used from the QuestionType edit form — invalidates the listByQuestionType cache */
export function useUpdateSubjectQTLabelByQT(questionTypeId: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.subjectQuestionType.updateLabel.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update label");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionType.subjectQuestionType.listByQuestionType.queryKey({
            questionTypeId,
          }),
        });
      }
    },
  });
}


