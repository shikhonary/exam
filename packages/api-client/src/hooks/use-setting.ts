"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

export function useSettings(filters: any = {}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.setting.list.queryOptions(filters),
    select: (data) => data.data as any,
  });
}

export function useSettingByKey(key: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.setting.getByKey.queryOptions({ key }),
    select: (data) => data.data,
  });
}

export function useUpsertSetting() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.setting.upsert.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to save setting");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.setting.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkUpdateSettings() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.setting.bulkUpdate.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update settings");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.setting.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteSetting() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.setting.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete setting");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.setting.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}
