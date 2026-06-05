"use client";

import { PlusCircle, Users, ArrowRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";

interface BatchWithRelations extends TenantTypes.Batch {
  _count: {
    students: number;
  };
}

import { Skeleton } from "@workspace/ui/components/skeleton";

interface SidebarProps {
  batch?: BatchWithRelations;
  isLoading?: boolean;
}

export const Sidebar = ({ batch, isLoading }: SidebarProps) => {
  return (
    <div className="space-y-8">
      {/* Recent Assessments Card */}
      <div className="bg-[#131B2C] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-8 border border-white/[0.02] flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            সাম্প্রতিক পরীক্ষা
          </h2>
          <button className="p-2 text-primary hover:bg-white/[0.04] rounded-xl transition-all ring-1 ring-transparent hover:ring-white/[0.06]">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="group relative flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <Skeleton className="w-1.5 rounded-full h-auto bg-white/[0.04]" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-16 bg-white/[0.04]" />
                    <Skeleton className="h-3 w-12 bg-white/[0.04]" />
                  </div>
                  <Skeleton className="h-5 w-3/4 bg-white/[0.04]" />
                  <div className="flex items-center gap-6 mt-2 pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-12 bg-white/[0.04]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-12 bg-white/[0.04]" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <AssessmentItem
                subject="Physics"
                title="Weekly Test - Physics Chapter 1"
                time="2 DAYS AGO"
                attended="25/30"
                average="72%"
                color="emerald"
              />
              <AssessmentItem
                subject="Mathematics"
                title="Monthly Assessment - Pure Maths"
                time="5 DAYS AGO"
                attended="24/30"
                average="65%"
                color="blue"
              />
            </>
          )}
        </div>

        <button className="w-full py-4 rounded-xl border-2 border-dashed border-white/[0.1] text-muted-foreground text-xs font-bold hover:bg-white/[0.02] hover:border-white/[0.2] hover:text-foreground transition-all flex items-center justify-center gap-2 group">
          পরীক্ষার ইতিহাস দেখুন
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const AssessmentItem = ({
  subject,
  title,
  time,
  attended,
  average,
  color,
}: any) => {
  const colorMap: any = {
    emerald: "text-primary bg-[rgba(0,229,160,0.05)] hover:border-[rgba(0,229,160,0.2)]",
    blue: "text-blue-400 bg-blue-500/5 hover:border-blue-500/20",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-[#1A2333] hover:bg-[#1E293B] border border-white/[0.02] transition-all cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
        colorMap[color],
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={cn(
            "text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-[0.08em]",
            color === "emerald"
              ? "bg-[rgba(0,229,160,0.1)] text-primary"
              : "bg-blue-500/10 text-blue-400",
          )}
        >
          {subject}
        </span>
        <span className="text-[10px] font-bold text-muted-foreground/70">{time}</span>
      </div>
      <h3 className="text-[15px] font-bold text-foreground mb-6 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="text-[12px] font-bold text-foreground">
            {attended}{" "}
            <span className="font-medium text-muted-foreground/70 ml-1">উপস্থিত</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-tighter">
            গড়
          </span>
          <span className="text-[14px] font-black text-foreground">
            {average}
          </span>
        </div>
      </div>
    </div>
  );
};
