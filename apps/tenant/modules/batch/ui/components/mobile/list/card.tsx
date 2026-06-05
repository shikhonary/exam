"use client";

import React, { useState } from "react";
import { TenantTypes } from "@workspace/db";
import {
  Edit2,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

interface BatchWithRelations extends TenantTypes.Batch {
  _count: { students: number };
}

interface BatchCardProps {
  batch: BatchWithRelations;
  index: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const BatchCard = ({
  batch,
  index,
  onToggleActive,
  onDelete,
}: BatchCardProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleToggleActive = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await onToggleActive(batch.id);
    } finally {
      setIsPending(false);
    }
  };

  const capacity = batch.capacity || 1;
  const studentCount = batch._count?.students || 0;
  const progress = Math.min((studentCount / capacity) * 100, 100);
  
  const getProgressColor = () => {
    if (progress >= 100) return "bg-[#ff4757]"; // Full (Red)
    if (progress >= 80) return "bg-[#ff9f43]"; // Near full (Orange)
    return "bg-primary"; // Available (Green)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-card rounded-xl border border-white/[0.06] overflow-hidden active:scale-[0.99] transition-all duration-200"
    >
      <div className="flex">
        {/* Left accent bar — 3px, colored by status */}
        <div
          className={cn(
            "w-[3px] flex-shrink-0",
            !batch.isActive ? "bg-white/[0.10]" : getProgressColor()
          )}
        />

        <div className="flex-1 p-4">
          {/* Top: name + status badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate leading-tight">
                {batch.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {batch.className} · {batch.academicYear as unknown as string}
              </p>
            </div>
            <span
              className={cn(
                "flex-shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                batch.isActive
                  ? "bg-[rgba(0,229,160,0.10)] text-primary border-[rgba(0,229,160,0.20)]"
                  : "bg-white/[0.06] text-muted-foreground border-transparent"
              )}
            >
              {batch.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between">
              <span className="text-[11px] text-muted-foreground">ভর্তি</span>
              <span className="text-[11px] text-foreground font-medium">
                {studentCount}/{capacity}
              </span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full transition-colors",
                  getProgressColor()
                )}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <Avatar
                  key={i}
                  className="w-7 h-7 border-2 border-background ring-1 ring-white/[0.06]"
                >
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${batch.id}${i}`}
                  />
                  <AvatarFallback className="text-[9px] font-bold bg-white/[0.06] text-muted-foreground">
                    ST
                  </AvatarFallback>
                </Avatar>
              ))}
              {studentCount > 3 && (
                <div className="w-7 h-7 rounded-full bg-white/[0.06] border-2 border-background flex items-center justify-center text-[9px] font-black text-muted-foreground ring-1 ring-white/[0.06]">
                  +{studentCount - 3}
                </div>
              )}
            </div>
          </div>

          {/* Action row */}
          <div className="flex gap-2">
            <Link
              href={`/batches/${batch.id}`}
              className={cn(
                "flex-1 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-foreground flex items-center justify-center gap-1.5 active:bg-white/[0.08] transition-colors",
                isPending && "opacity-50 pointer-events-none"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              বিস্তারিত
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center active:bg-white/[0.08] transition-colors text-muted-foreground hover:text-foreground outline-none focus:outline-none focus:ring-0 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <MoreVertical className="w-4 h-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-[#111b2e] border border-white/[0.08] rounded-xl p-1">
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
                  <Link href={`/batches/edit/${batch.id}`}>
                    <Edit2 className="w-4 h-4 mr-2" /> এডিট
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary"
                  onClick={handleToggleActive}
                  disabled={isPending}
                >
                  {batch.isActive ? (
                    <><ToggleLeft className="w-4 h-4 mr-2" /> ইনঅ্যাক্টিভ করুন</>
                  ) : (
                    <><ToggleRight className="w-4 h-4 mr-2" /> অ্যাক্টিভ করুন</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer font-medium text-[#ff4757] focus:text-[#ff4757] focus:bg-[rgba(255,71,87,0.08)]"
                  onClick={() => onDelete(batch.id, batch.name)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> ডিলিট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
