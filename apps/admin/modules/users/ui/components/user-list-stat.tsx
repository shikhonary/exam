"use client";

import { Users, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

import { StatsCard } from "./stat-card";
import { useUserStats } from "@workspace/api-client";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const UserListStat = () => {
  const { data: statsData, isLoading } = useUserStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 p-5 lg:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-20 bg-surface-container" />
                <Skeleton className="h-10 w-16 bg-surface-container" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl bg-surface-container" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Users"
        value={statsData?.total ?? 0}
        icon={Users}
      />
      <StatsCard
        title="Active"
        value={statsData?.active ?? 0}
        icon={CheckCircle2}
        className="[&_.text-primary]:text-green-500 [&_.bg-primary\/10]:bg-green-500/10 [&_.border-primary\/20]:border-green-500/20"
      />
      <StatsCard
        title="Inactive"
        value={statsData?.inactive ?? 0}
        icon={XCircle}
        className="[&_.text-primary]:text-orange-500 [&_.bg-primary\/10]:bg-orange-500/10 [&_.border-primary\/20]:border-orange-500/20"
      />
      <StatsCard
        title="Admins"
        value={statsData?.byRole?.ADMIN ?? 0}
        icon={ShieldAlert}
        className="[&_.text-primary]:text-blue-500 [&_.bg-primary\/10]:bg-blue-500/10 [&_.border-primary\/20]:border-blue-500/20"
      />
    </div>
  );
};
