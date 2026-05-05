"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { GENDER } from "@workspace/utils";


/**
 * Mutation hook for creating a citizen record
 */
export function useCreateCitizen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.citizen.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create citizen record");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.citizen.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Hook for listing citizens with filters
 */
export function useCitizens(
  filters: Parameters<
    ReturnType<typeof useTRPC>["citizen"]["list"]["queryOptions"]
  >[0]
) {
  const trpc = useTRPC();
  return useQuery(trpc.citizen.list.queryOptions(filters as any));
}

/**
 * Hook for getting a citizen by ID
 */
export function useCitizenById(id: string) {
  const trpc = useTRPC();
  return useQuery(trpc.citizen.getById.queryOptions(id));
}

/**
 * Hook for getting a citizen by NID
 */
export function useCitizenByNid(nid: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.citizen.getByNid.queryOptions(nid),
    enabled: !!nid,
  });
}
