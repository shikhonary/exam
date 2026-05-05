"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useWardFilters } from "../filters/client";

// ============================================================================
// WARD MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a ward
 */
export function useCreateWard() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.ward.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create ward");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.ward.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.ward.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a ward
 */
export function useUpdateWard() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.ward.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update ward");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.ward.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.ward.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a ward
 */
export function useDeleteWard() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.ward.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete ward");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.ward.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.ward.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for toggling ward active status
 */
export function useToggleWardActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.ward.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle ward status");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.ward.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.ward.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting wards
 */
export function useBulkDeleteWards() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.ward.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete wards");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.ward.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.ward.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// WARD QUERIES
// ============================================================================

/**
 * Hook for listing wards with filters
 */
export function useWards() {
  const trpc = useTRPC();
  const [filters] = useWardFilters();
  return useQuery(trpc.ward.list.queryOptions(filters));
}

/**
 * Hook for getting a ward by ID
 */
export function useWardById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.ward.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting ward statistics
 */
export function useWardStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.ward.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting wards for selection
 */
export function useWardsForSelection() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.ward.forSelection.queryOptions(),
    select: (data) => data.data,
  });
}
