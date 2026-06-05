"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

export function useNotifications(filters: any = {}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.notification.list.queryOptions(filters),
    select: (data) => data.data as any,
  });
}

export function useNotificationById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.notification.getById.queryOptions({ id }),
    select: (data) => data.data,
  });
}

export function useCreateNotification() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.notification.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create notification");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.notification.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateNotification() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.notification.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update notification");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.notification.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useMarkNotificationAsRead() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.notification.markAsRead.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to mark as read");
    },
    onSuccess: async (data) => {
      if (data.success) {
        // toast.success(data.message); // Too noisy for read actions
        await queryClient.invalidateQueries({
          queryKey: trpc.notification.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.notification.markAllAsRead.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to mark all as read");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.notification.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteNotification() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.notification.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete notification");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.notification.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}
