"use client";

import { useMCQStats } from "@workspace/api-client";
import { FileText, LucideIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
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
        </div>
        <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-soft">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export const McqListStat = () => {
  const { data, isLoading } = useMCQStats();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(1)].map((_, i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total MCQs"
        value={data?.total ?? 0}
        icon={FileText}
      />
    </div>
  );
};
