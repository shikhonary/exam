"use client";

import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";

import { Skeleton } from "@workspace/ui/components/skeleton";

interface StatsProps {
  stats: {
    totalStudents: number;
    inactiveStudents: number;
    totalExams: number;
  };
  capacity: number;
  isLoading?: boolean;
}

export const Stats = ({ stats, capacity, isLoading }: StatsProps) => {
  const studentCount = stats.totalStudents;
  const capacityPercentage =
    capacity > 0 ? Math.round((studentCount / capacity) * 100) : 0;

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-3 px-6 pb-2">
      <>
        <StatPill label="শিক্ষার্থী" value={studentCount} index={0} isLoading={isLoading} />
        <StatPill label="পরীক্ষা" value={stats.totalExams} index={1} isLoading={isLoading} />
        <StatPill label="গড় স্কোর" value="18%" accent index={2} isLoading={isLoading} />
        <StatPill label="ধারণক্ষমতা" value={`${capacityPercentage}%`} index={3} isLoading={isLoading} />
      </>
    </div>
  );
};

function StatPill({
  label,
  value,
  accent = false,
  index = 0,
  isLoading,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  index?: number;
  isLoading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex-shrink-0 px-4 py-2 rounded-full border flex items-center gap-2 whitespace-nowrap",
        accent
          ? "bg-[rgba(0,229,160,0.08)] text-primary border-[rgba(0,229,160,0.20)]"
          : "bg-[#131B2C] text-foreground border-white/[0.02] shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {isLoading ? (
        <Skeleton className="h-4 w-6 bg-white/[0.04] rounded-sm" />
      ) : (
        <span className="text-sm font-bold">{value}</span>
      )}
    </motion.div>
  );
}
