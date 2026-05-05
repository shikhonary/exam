import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { toast } from "@workspace/ui/components/sonner";
import { useVillageFilters } from "../filters/client";

// ============================================================================
// VILLAGE MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a new village
 */
export function useCreateVillage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.village.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create village");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.village.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.village.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a village
 */
export function useUpdateVillage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.village.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update village");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.village.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.village.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a village
 */
export function useDeleteVillage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.village.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete village");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.village.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.village.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for toggling village active status
 */
export function useToggleVillageActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.village.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle village status");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.village.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.village.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// VILLAGE QUERIES
// ============================================================================

/**
 * Hook for listing villages with filters
 */
export function useVillages() {
  const trpc = useTRPC();
  const [filters] = useVillageFilters();
  return useQuery(trpc.village.list.queryOptions(filters));
}

/**
 * Hook for getting a village by ID
 */
export function useVillageById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.village.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting village statistics
 */
export function useVillageStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.village.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting villages for selection
 */
export function useVillagesForSelection() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.village.forSelection.queryOptions(),
    select: (data) => data.data,
  });
}
