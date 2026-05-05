import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { toast } from "@workspace/ui/components/sonner";
import { useQueryState, parseAsString } from "nuqs";

// ============================================================================
// CITIZEN APPLICATION MUTATIONS
// ============================================================================

export function useCreateCitizenApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.citizenApplication.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateCitizenApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.citizenApplication.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteCitizenApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.citizenApplication.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useApproveCitizenApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.citizenApplication.approve.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to approve application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizen.list.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useRejectCitizenApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.citizenApplication.reject.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to reject application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizenApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// CITIZEN APPLICATION QUERIES
// ============================================================================

/**
 * Hook for listing citizen applications with filters
 */
export function useCitizenApplications(
  filters: Parameters<
    ReturnType<typeof useTRPC>["citizenApplication"]["list"]["queryOptions"]
  >[0]
) {
  const trpc = useTRPC();
  return useQuery(trpc.citizenApplication.list.queryOptions(filters as any));
}

export function useCitizenApplicationById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.citizenApplication.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useCitizenApplicationStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.citizenApplication.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
