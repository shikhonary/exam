"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useAdmissionFeeFilters } from "../filters/client";

// ============================================================================
// ADMISSION FEE MUTATIONS
// ============================================================================

export function useCreateAdmissionFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionFee.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create admission fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionFee.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateAdmissionFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionFee.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update admission fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionFee.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteAdmissionFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionFee.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete admission fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionFee.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkDeleteAdmissionFees() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionFee.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete admission fees");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionFee.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// ADMISSION FEE QUERIES
// ============================================================================

export function useAdmissionFees() {
  const trpc = useTRPC();
  const [filters] = useAdmissionFeeFilters();
  return useQuery({
    ...trpc.admissionFee.list.queryOptions(filters),
    select: (res) => res.data,
  });
}

export function useAdmissionFeeById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.admissionFee.getById.queryOptions(id),
    select: (data) => data.data,
  });
}
