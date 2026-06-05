"use client";

import { CheckCircle2, Globe2, Star, LucideIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  className,
  iconClassName,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 p-5 lg:p-6 transition-all duration-300",
        "hover:shadow-glow hover:border-primary/20 group relative overflow-hidden",
        className,
      )}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {title}
          </p>
          <div className="text-3xl lg:text-4xl font-black text-foreground tracking-tight flex items-baseline gap-2">
            {value}
          </div>
        </div>
        <div className={cn("p-3 bg-primary/10 rounded-xl text-primary shadow-soft", iconClassName)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

interface StatsProps {
  stats?: {
    total: number;
    active: number;
    currentLabel: string | null;
  } | null;
  isLoading?: boolean;
}

export function AcademicYearStatCards({ stats, isLoading }: StatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
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
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard
        title="Total Years"
        value={stats?.total ?? 0}
        icon={Globe2}
      />
      <StatsCard
        title="Active"
        value={stats?.active ?? 0}
        icon={CheckCircle2}
        className="[&_.text-primary]:text-green-500 [&_.bg-primary\/10]:bg-green-500/10 [&_.border-primary\/20]:border-green-500/20"
        iconClassName="text-green-500 bg-green-500/10"
      />
      <StatsCard
        title="Current Default"
        value={stats?.currentLabel || (
          <span className="text-xl text-primary/50 italic font-medium">None Set</span>
        )}
        icon={Star}
        className="bg-primary/5 border-primary/20 hover:border-primary/40"
      />
    </div>
  );
}
