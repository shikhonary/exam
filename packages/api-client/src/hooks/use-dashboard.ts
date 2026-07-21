"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";

export function useDashboardOverview() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.dashboard.getOverview.queryOptions(),
    select: (data) => data.data,
  });
}
