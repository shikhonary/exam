"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ============================================================================
// USER MUTATIONS
// ============================================================================

export function useCreateUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.user.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.user.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });

  return mutation;
}

export function useUpdateUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.user.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.user.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.user.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.user.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useToggleUserStatus() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.user.toggleStatus.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle user status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.user.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkActivateUsers() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.user.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate users");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.user.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkDeactivateUsers() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.user.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate users");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.user.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkDeleteUsers() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.user.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete users");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.user.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// USER QUERIES
// ============================================================================

export function useUsers(filters: any = {}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.user.list.queryOptions(filters),
    select: (data) => data.data as any,
  });
}

export function useUserById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.user.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useUserStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.user.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
