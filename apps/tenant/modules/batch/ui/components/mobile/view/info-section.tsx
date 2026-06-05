"use client";

import { Info, Users } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";

import { Skeleton } from "@workspace/ui/components/skeleton";

interface InfoSectionProps {
  batch?: TenantTypes.Batch;
  studentCount: number;
  isLoading?: boolean;
}

export const InfoSection = ({ batch, studentCount, isLoading }: InfoSectionProps) => {
  const capacity = batch?.capacity || 0;
  const utilization = capacity > 0 ? Math.round((studentCount / capacity) * 100) : 0;

  return (
    <section className="bg-[#131B2C] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden border border-white/[0.02]">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-white">
        <Info size={80} />
      </div>
      
      <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_8px_rgba(0,229,160,0.5)]"></span>
        ব্যাচের তথ্য
      </h2>

      <div className="space-y-5 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              ব্যাচের নাম
            </p>
            {isLoading ? <Skeleton className="h-5 w-24 mt-1 bg-white/[0.04]" /> : <p className="text-sm font-bold text-foreground mt-1">{batch?.name}</p>}
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              শ্রেণী
            </p>
            {isLoading ? <Skeleton className="h-5 w-20 mt-1 bg-white/[0.04]" /> : (
              <p className="text-sm font-bold text-foreground mt-1">
                {batch?.className || "নির্ধারিত নয়"}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              শিক্ষাবর্ষ
            </p>
            {isLoading ? <Skeleton className="h-5 w-16 mt-1 bg-white/[0.04]" /> : (
              <p className="text-sm font-bold text-foreground mt-1">
                {batch?.academicYear || "নির্ধারিত নয়"}
              </p>
            )}
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              অবস্থা
            </p>
            <div className="mt-1">
              {isLoading ? <Skeleton className="h-5 w-16 rounded-full bg-white/[0.04]" /> : (
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ring-1",
                batch?.isActive 
                  ? "bg-[rgba(0,229,160,0.1)] text-primary ring-[rgba(0,229,160,0.2)]" 
                  : "bg-white/[0.04] text-muted-foreground ring-white/[0.06]"
              )}>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1.5",
                  batch?.isActive ? "bg-primary shadow-[0_0_8px_rgba(0,229,160,0.5)]" : "bg-white/[0.2]"
                )}></span>
                {batch?.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
              </span>
              )}</div>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-white/[0.06]">
          <div className="flex justify-between items-end mb-2.5">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                ভর্তি
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 bg-white/[0.04] mt-1" />
              ) : (
                <p className="text-lg font-black text-foreground">
                  {studentCount} <span className="text-muted-foreground font-bold ml-1 text-sm tracking-tight">/ {capacity} শিক্ষার্থী</span>
                </p>
              )}
            </div>
            {!isLoading && (
              <span className={cn(
                "text-xs font-black px-2 py-1 rounded-lg",
                utilization >= 90 ? "text-rose-400 bg-rose-500/10" : "text-primary bg-[rgba(0,229,160,0.1)]"
              )}>
                {utilization}% ব্যবহার
              </span>
            )}
          </div>
          <div className="w-full bg-white/[0.04] h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                utilization >= 90 ? "bg-rose-500" : "bg-primary"
              )}
              style={{ width: `${Math.min(isLoading ? 0 : utilization, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
