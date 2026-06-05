"use client";

import { User, Phone, Hash, ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";

const DUMMY_STUDENTS = [
  {
    id: "1",
    name: "মেহেদী হাসান",
    roll: "101",
    email: "mehedi@example.com",
    phone: "01711000001",
    isActive: true,
  },
  {
    id: "2",
    name: "ফাতেমা আক্তার",
    roll: "102",
    email: "fatema@example.com",
    phone: "01811000002",
    isActive: true,
  },
  {
    id: "3",
    name: "রাকিবুল ইসলাম",
    roll: "103",
    email: "rakib@example.com",
    phone: "01911000003",
    isActive: false,
  },
  {
    id: "4",
    name: "সাদিয়া রহমান",
    roll: "104",
    email: "sadia@example.com",
    phone: "01611000004",
    isActive: true,
  },
  {
    id: "5",
    name: "তন্ময় সাহা",
    roll: "105",
    email: "tonmoy@example.com",
    phone: "01511000005",
    isActive: true,
  },
];

import { Skeleton } from "@workspace/ui/components/skeleton";

export const StudentsTab = ({ isLoading }: { isLoading?: boolean }) => {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredStudents = DUMMY_STUDENTS.filter((student) => {
    if (filter === "active") return student.isActive;
    if (filter === "inactive") return !student.isActive;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 mb-2 px-1">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            শিক্ষার্থীর তালিকা
          </h2>
          {isLoading ? (
            <Skeleton className="h-7 w-20 rounded-full bg-white/[0.04]" />
          ) : (
            <span className="text-xs text-muted-foreground font-medium bg-[#131B2C] px-3 py-1 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02]">
              মোট {filteredStudents.length} জন
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
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#131B2C] rounded-2xl p-5 border border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl bg-white/[0.04]" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-white/[0.04]" />
                    <Skeleton className="h-3 w-20 bg-white/[0.04]" />
                  </div>
                </div>
                <Skeleton className="w-16 h-5 rounded-full bg-white/[0.04]" />
              </div>
              <div className="space-y-2 p-3 bg-white/[0.02] rounded-xl">
                <Skeleton className="h-3 w-40 bg-white/[0.04]" />
                <Skeleton className="h-3 w-32 bg-white/[0.04]" />
              </div>
              <Skeleton className="w-full h-10 rounded-xl bg-white/[0.04]" />
            </div>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-[#131B2C] rounded-2xl p-10 border border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-center">
          <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">কোনো শিক্ষার্থী পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="space-y-4 px-1">
          {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-[#131B2C] rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                <User size={24} className="text-indigo-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-base font-bold text-foreground line-clamp-1 pr-2">
                    {student.name}
                  </h3>
                  <span
                    className={cn(
                      "shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                      student.isActive
                        ? "bg-[rgba(0,229,160,0.1)] text-primary"
                        : "bg-rose-500/10 text-rose-400"
                    )}
                  >
                    {student.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Hash size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-xs">{student.roll || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-xs">{student.phone || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/[0.04]">
              <Link
                href={`/students/${student.id}`}
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
