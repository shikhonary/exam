"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

export function useSubscriptions(input: any = {}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.subscription.list.queryOptions(input),
    select: (data) => data.data,
  });
}

export function useSubscriptionById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.subscription.getById.queryOptions({ id }),
    enabled: !!id,
    select: (data) => data.data,
  });
}

export function useSubscriptionByTenantId(tenantId: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.subscription.getByTenantId.queryOptions({ tenantId }),
    enabled: !!tenantId,
    select: (data) => data.data,
  });
}

export function useCreateSubscription() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation({
    ...trpc.subscription.createOne.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create subscription");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.subscription.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateSubscription() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation({
    ...trpc.subscription.updateOne.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update subscription");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscription.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscription.getById.queryKey({ id: variables.id }),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useChangeSubscriptionPlan() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation({
    ...trpc.subscription.changePlan.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to change subscription plan");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscription.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscription.getById.queryKey({ id: variables.id }),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useCancelSubscription() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation({
    ...trpc.subscription.cancel.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to cancel subscription");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscription.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscription.getById.queryKey({ id: variables.id }),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useSubscriptionStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.subscription.stats.queryOptions(),
    select: (data) => data.data,
  });
}
