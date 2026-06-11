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
  User,
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

interface StudentWithRelations extends TenantTypes.Student {
  batch?: {
    id: string;
    name: string;
  } | null;
}

interface StudentCardProps {
  student: StudentWithRelations;
  index: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const StudentCard = ({
  student,
  index,
  onToggleActive,
  onDelete,
}: StudentCardProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleToggleActive = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await onToggleActive(student.id);
    } finally {
      setIsPending(false);
    }
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
            !student.isActive ? "bg-white/[0.10]" : "bg-primary"
          )}
        />

        <div className="flex-1 p-4">
          {/* Top: name + status badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center text-primary flex-shrink-0 overflow-hidden">
                {student.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={student.imageUrl} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} strokeWidth={2.5} />
                )}
              </div>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-sm font-semibold text-foreground truncate leading-tight">
                  {student.name}
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5 truncate uppercase tracking-widest">
                  ID: {student.studentId}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "flex-shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                student.isActive
                  ? "bg-[rgba(0,229,160,0.10)] text-primary border-[rgba(0,229,160,0.20)]"
                  : "bg-white/[0.06] text-muted-foreground border-transparent"
              )}
            >
              {student.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
            </span>
          </div>

          <div className="space-y-1.5 mb-4 mt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>ক্লাস: <span className="font-semibold text-foreground">{student.className || "-"}</span></span>
              <span>ব্যাচ: <span className="font-semibold text-foreground">{student.batch?.name || "-"}</span></span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>রোল: <span className="font-semibold text-foreground">{student.roll}</span></span>
              <span>ফোন: <span className="font-semibold text-foreground">{student.primaryPhone}</span></span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1.5 border-t border-white/[0.05]">
              <span>মাসিক ফি:</span>
              <span className="font-semibold text-foreground">৳{student.monthlyFee}</span>
            </div>
          </div>

          {/* Action row */}
          <div className="flex gap-2">
            <Link
              href={`/students/${student.id}`}
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
                  <Link href={`/students/edit/${student.id}`}>
                    <Edit2 className="w-4 h-4 mr-2" /> এডিট
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary"
                  onClick={handleToggleActive}
                  disabled={isPending}
                >
                  {student.isActive ? (
                    <><ToggleLeft className="w-4 h-4 mr-2" /> ইনঅ্যাক্টিভ করুন</>
                  ) : (
                    <><ToggleRight className="w-4 h-4 mr-2" /> অ্যাক্টিভ করুন</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer font-medium text-[#ff4757] focus:text-[#ff4757] focus:bg-[rgba(255,71,87,0.08)]"
                  onClick={() => onDelete(student.id, student.name)}
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
