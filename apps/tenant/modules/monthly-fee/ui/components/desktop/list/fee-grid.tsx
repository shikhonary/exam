"use client";

import React from "react";
import { RouterOutput } from "@workspace/api";
import { LayoutGrid, Edit2, Trash2, MoreVertical, Calendar, GraduationCap } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { format } from "date-fns";
import { Button } from "@workspace/ui/components/button";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

type MonthlyFee = RouterOutput["monthlyFee"]["list"]["data"]["items"][number];

interface FeeGridProps {
  fees: MonthlyFee[];
  isLoading: boolean;
  onEdit: (fee: MonthlyFee) => void;
  onDelete: (id: string, name: string) => void;
}

export function FeeGrid({ fees, isLoading, onEdit, onDelete }: FeeGridProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#111827] border border-white/[0.05] rounded-xl p-5 overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-8 w-24 rounded-lg bg-white/[0.05]" />
              <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.05]" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4 bg-white/[0.05]" />
              <Skeleton className="h-5 w-1/2 bg-white/[0.05]" />
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.05]">
              <Skeleton className="h-4 w-1/2 bg-white/[0.05]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (fees.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-white/[0.04] rounded-full flex items-center justify-center text-[#4a607d]">
          <LayoutGrid size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground">
            কোনো মাসিক ফি নেই
          </h3>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm">
            নতুন মাসিক ফি যোগ করতে 'নতুন যোগ করুন' বাটনে ক্লিক করুন।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4">
      {fees.map((fee, index) => (
        <motion.div
          key={fee.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative bg-[#131B2C] hover:bg-[#1A243A] border border-white/[0.05] hover:border-white/[0.1] rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110" />

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">পরিমাণ</p>
              <h3 className="text-2xl font-black text-primary tracking-tight">৳{fee.amount}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-white/[0.08] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-[#111b2e] border border-white/[0.08] rounded-xl p-1 shadow-xl">
                <DropdownMenuItem
                  onClick={() => onEdit(fee)}
                  className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary m-1"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> এডিট
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(fee.id, `${fee.className} - ${fee.academicYear}`)}
                  className="rounded-lg cursor-pointer font-medium text-[#ff4757] focus:text-[#ff4757] focus:bg-[rgba(255,71,87,0.08)] m-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> ডিলিট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2.5 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.02]">
              <div className="w-6 h-6 rounded-md bg-[rgba(0,229,160,0.1)] flex items-center justify-center text-primary shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-foreground truncate">
                {fee.academicYear}
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.02]">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-foreground truncate">
                {fee.className}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-muted-foreground relative z-10">
            <span>তৈরি করা হয়েছে:</span>
            <span className="font-medium text-foreground/80">{format(new Date(fee.createdAt), "dd MMM, yyyy")}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
