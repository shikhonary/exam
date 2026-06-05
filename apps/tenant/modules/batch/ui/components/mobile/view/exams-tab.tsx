"use client";

import { Calendar, FileText, ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";

const DUMMY_EXAMS = [
  {
    id: "1",
    name: "অর্ধ-বার্ষিক পরীক্ষা ২০২৪",
    date: new Date("2024-06-15").toISOString(),
    isActive: true,
  },
  {
    id: "2",
    name: "সাপ্তাহিক মূল্যায়ন - গণিত",
    date: new Date("2024-07-02").toISOString(),
    isActive: true,
  },
  {
    id: "3",
    name: "মডেল টেস্ট ১",
    date: new Date("2024-05-10").toISOString(),
    isActive: false,
  },
  {
    id: "4",
    name: "টিউটোরিয়াল - বিজ্ঞান",
    date: new Date("2024-07-20").toISOString(),
    isActive: true,
  },
];

import { Skeleton } from "@workspace/ui/components/skeleton";

export const ExamsTab = ({ isLoading }: { isLoading?: boolean }) => {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredExams = DUMMY_EXAMS.filter((exam) => {
    if (filter === "active") return exam.isActive;
    if (filter === "inactive") return !exam.isActive;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 mb-2 px-1">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            পরীক্ষার তালিকা
          </h2>
          {isLoading ? (
            <Skeleton className="h-7 w-20 rounded-full bg-white/[0.04]" />
          ) : (
            <span className="text-[10px] text-muted-foreground font-bold bg-[#131B2C] px-3 py-1 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-white/[0.02] uppercase tracking-wider">
              মোট {filteredExams.length} টি
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 bg-[#131B2C] p-1.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap",
              filter === "all"
                ? "bg-white/[0.08] text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground active:bg-white/[0.04]"
            )}
          >
            সব
          </button>
          <button
            onClick={() => setFilter("active")}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap",
              filter === "active"
                ? "bg-[rgba(0,229,160,0.1)] text-primary shadow-sm"
                : "text-muted-foreground hover:text-primary active:bg-white/[0.04]"
            )}
          >
            অ্যাক্টিভ
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap",
              filter === "inactive"
                ? "bg-rose-500/10 text-rose-400 shadow-sm"
                : "text-muted-foreground hover:text-rose-400 active:bg-white/[0.04]"
            )}
          >
            ইনঅ্যাক্টিভ
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 px-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#131B2C] rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02]"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="w-14 h-14 shrink-0 rounded-full bg-white/[0.04]" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <Skeleton className="h-4 w-32 bg-white/[0.04]" />
                    <Skeleton className="w-12 h-4 rounded-full bg-white/[0.04]" />
                  </div>
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded-full bg-white/[0.04]" />
                      <Skeleton className="h-3 w-20 bg-white/[0.04]" />
                    </div>
                  </div>
                </div>
              </div>
              <Skeleton className="w-full h-10 mt-4 rounded-xl bg-white/[0.04]" />
            </div>
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-[#131B2C] rounded-2xl p-8 border border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-center mx-1">
          <p className="text-muted-foreground text-sm font-medium">কোনো পরীক্ষা পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="space-y-4 px-1">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-[#131B2C] rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02] active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shadow-inner">
                  <FileText size={24} className="text-amber-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-foreground line-clamp-2 pr-2 leading-tight">
                      {exam.name}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                        exam.isActive
                          ? "bg-[rgba(0,229,160,0.1)] text-primary"
                          : "bg-rose-500/10 text-rose-400"
                      )}
                    >
                      {exam.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground text-xs">
                        {new Date(exam.date).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.04]">
                <Link
                  href={`/exams/${exam.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-white/[0.04] active:bg-white/[0.08] text-primary font-bold text-sm py-2.5 rounded-xl transition-colors"
                >
                  বিস্তারিত দেখুন
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
