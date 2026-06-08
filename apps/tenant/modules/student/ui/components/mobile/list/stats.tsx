"use client";

import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";

interface StatsProps {
  total: number;
}

export const Stats = ({ total }: StatsProps) => {

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-3 px-6 mb-6 pb-2">
      <StatPill label="মোট শিক্ষার্থী" value={total} index={0} />
      <StatPill label="অ্যাক্টিভ" value={"-"} accent index={1} />
      <StatPill label="ইনঅ্যাক্টিভ" value={"-"} index={2} />
    </div>
  );
};

function StatPill({
  label,
  value,
  accent = false,
  index = 0,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  index?: number;
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
          : "bg-white/[0.04] text-foreground border-white/[0.06]"
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-extrabold">{value}</span>
    </motion.div>
  );
}
