"use client";

import { ChevronRight, FileText, Beaker, Calculator } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const RecentExams = ({ isLoading }: { isLoading?: boolean }) => {
  // Static placeholders as per design
  const exams = [
    {
      id: 1,
      title: "Physics Weekly Test",
      submissions: "22/25",
      avg: "78%",
      icon: Beaker,
      color: "text-primary",
      bg: "bg-[rgba(0,229,160,0.1)]",
    },
    {
      id: 2,
      title: "Mathematics Monthly Assessment",
      submissions: "18/25",
      avg: "82%",
      icon: Calculator,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          সাম্প্রতিক পরীক্ষা
        </h2>
        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
          সবগুলো দেখুন
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-[#131B2C] p-4 rounded-2xl flex items-center gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02]"
            >
              <Skeleton className="w-12 h-12 rounded-xl bg-white/[0.04] flex-shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-4 w-3/4 bg-white/[0.04]" />
                <div className="flex items-center gap-3">
                   <Skeleton className="h-3 w-20 bg-white/[0.04]" />
                   <Skeleton className="h-3 w-16 bg-white/[0.04]" />
                </div>
              </div>
              <Skeleton className="w-5 h-5 rounded-md bg-white/[0.04] flex-shrink-0" />
            </div>
          ))
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-[#131B2C] p-4 rounded-2xl flex items-center gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02] hover:bg-white/[0.02] transition-colors active:scale-[0.98] cursor-pointer"
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                exam.bg,
                exam.color
              )}>
                <exam.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm truncate uppercase tracking-tight">
                  {exam.title}
                </h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-muted-foreground font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/[0.2]" />
                    {exam.submissions} জমা দিয়েছেন
                  </span>
                  <span className="text-[11px] text-primary font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {exam.avg} গড়
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground/50" />
            </div>
          ))
        )}
      </div>
    </section>
  );
};
