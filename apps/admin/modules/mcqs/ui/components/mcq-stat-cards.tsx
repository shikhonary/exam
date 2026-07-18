"use client";

import { HelpCircle, Calculator, LucideIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 p-5 lg:p-6 transition-all duration-300",
        "hover:shadow-glow hover:border-primary/20",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {title}
          </p>
          <p className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            {value}
          </p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs mt-3 px-2 py-0.5 rounded-full w-fit",
                trend.isPositive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20",
              )}
            >
              <span className="font-semibold">
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground/70">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-soft">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

interface StatsProps {
  stats?: {
    total: number;
    math: number;
    standard: number;
  } | null;
  isLoading?: boolean;
}

export function McqStatCards({ stats, isLoading }: StatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatsCard
        title="Total MCQs"
        value={stats?.total ?? 0}
        icon={HelpCircle}
      />
      <StatsCard
        title="Math MCQs"
        value={stats?.math ?? 0}
        icon={Calculator}
      />
    </div>
  );
}
