"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useMonthlyFeeFilters } from "../filters/client";

// ============================================================================
// MONTHLY FEE MUTATIONS
// ============================================================================

export function useCreateMonthlyFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.monthlyFee.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create monthly fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.monthlyFee.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateMonthlyFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.monthlyFee.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update monthly fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.monthlyFee.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteMonthlyFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.monthlyFee.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete monthly fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.monthlyFee.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkDeleteMonthlyFees() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.monthlyFee.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete monthly fees");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.monthlyFee.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// MONTHLY FEE QUERIES
// ============================================================================

export function useMonthlyFees() {
  const trpc = useTRPC();
  const [filters] = useMonthlyFeeFilters();
  return useQuery({
    ...trpc.monthlyFee.list.queryOptions(filters),
    select: (res) => res.data,
  });
}

export function useMonthlyFeeById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.monthlyFee.getById.queryOptions(id),
    select: (data) => data.data,
  });
}
