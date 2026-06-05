"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";

export function useAuditLogs(filters: any = {}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.auditLog.list.queryOptions(filters),
    select: (data) => data.data as any,
  });
}

export function useAuditLogById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.auditLog.getById.queryOptions({ id }),
    select: (data) => data.data,
  });
}
