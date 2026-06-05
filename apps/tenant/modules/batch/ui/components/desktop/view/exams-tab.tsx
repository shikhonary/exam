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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            পরীক্ষার তালিকা
          </h2>
          {isLoading ? (
            <Skeleton className="h-8 w-24 rounded-full bg-white/[0.04]" />
          ) : (
            <span className="text-sm text-muted-foreground font-medium bg-[#131B2C] px-4 py-1.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02]">
              মোট {filteredExams.length} টি
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 bg-[#131B2C] p-1.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02]">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              filter === "all"
                ? "bg-white/[0.08] text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
            )}
          >
            সব
          </button>
          <button
            onClick={() => setFilter("active")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              filter === "active"
                ? "bg-[rgba(0,229,160,0.1)] text-primary shadow-sm"
                : "text-muted-foreground hover:text-primary hover:bg-white/[0.04]"
            )}
          >
            অ্যাক্টিভ
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              filter === "inactive"
                ? "bg-rose-500/10 text-rose-400 shadow-sm"
                : "text-muted-foreground hover:text-rose-400 hover:bg-white/[0.04]"
            )}
          >
            ইনঅ্যাক্টিভ
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="group relative bg-[#131B2C] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-6 border border-white/[0.02] flex flex-col gap-6"
            >
              <div className="absolute top-4 right-4">
                <Skeleton className="w-16 h-5 rounded-full bg-white/[0.04]" />
              </div>
              <div className="flex flex-col items-center mb-0 mt-2">
                <Skeleton className="w-16 h-16 rounded-full bg-white/[0.04] mb-4" />
                <Skeleton className="h-4 w-32 bg-white/[0.04]" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg bg-white/[0.04]" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-2 w-10 bg-white/[0.04]" />
                    <Skeleton className="h-3 w-20 bg-white/[0.04]" />
                  </div>
                </div>
              </div>
              <Skeleton className="w-full h-10 mt-6 rounded-xl bg-white/[0.04]" />
            </div>
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-[#131B2C] rounded-2xl p-12 border border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-center">
          <p className="text-muted-foreground font-medium">কোনো পরীক্ষা পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="group relative bg-[#131B2C] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-6 border border-white/[0.02] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    exam.isActive
                      ? "bg-[rgba(0,229,160,0.1)] text-primary"
                      : "bg-rose-500/10 text-rose-400"
                  )}
                >
                  {exam.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
                </span>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mb-4 shadow-inner group-hover:scale-105 transition-transform">
                  <FileText size={32} className="text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-foreground text-center line-clamp-2 min-h-[48px]">
                  {exam.name}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-muted-foreground">
                    <Calendar size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">তারিখ</span>
                    <span className="text-foreground font-medium">
                      {new Date(exam.date).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.04]">
                <Link
                  href={`/exams/${exam.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-primary font-bold text-sm py-2.5 rounded-xl transition-colors"
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
