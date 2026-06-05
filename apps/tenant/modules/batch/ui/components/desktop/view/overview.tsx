"use client";

import {
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";

interface BatchWithRelations extends TenantTypes.Batch {
  _count: {
    students: number;
  };
}

import { Skeleton } from "@workspace/ui/components/skeleton";

interface OverviewProps {
  batch?: BatchWithRelations;
  isLoading?: boolean;
}

export const Overview = ({ batch, isLoading }: OverviewProps) => {
  const studentCount = batch?._count?.students || 0;
  const capacity = batch?.capacity || 0;
  const utilization =
    capacity > 0 ? Math.round((studentCount / capacity) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Batch Information Card */}
      <div className="bg-[#131B2C] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-8 border border-white/[0.02]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            ব্যাচের তথ্য
          </h2>
          {isLoading ? (
            <Skeleton className="h-6 w-24 rounded-full bg-white/[0.04]" />
          ) : (
            <span
              className={cn(
                "ring-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.05em]",
                batch?.isActive
                  ? "bg-[rgba(0,229,160,0.1)] text-primary ring-[rgba(0,229,160,0.2)]"
                  : "bg-white/[0.04] text-muted-foreground ring-white/[0.06]",
              )}
            >
              {batch?.isActive ? "অ্যাক্টিভ ইউনিট" : "ইনঅ্যাক্টিভ ইউনিট"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
          <InfoItem label="ব্যাচের নাম" value={batch?.name} isLoading={isLoading} />
          <InfoItem label="শ্রেণী" value={batch?.className || "নির্ধারিত নয়"} isLoading={isLoading} />
          <InfoItem
            label="শিক্ষাবর্ষ"
            value={batch?.academicYear || "নির্ধারিত নয়"}
            isLoading={isLoading}
          />
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              বর্তমান অবস্থা
            </label>
            <div className="flex items-center gap-2.5">
              {isLoading ? <Skeleton className="h-5 w-20 bg-white/[0.04]" /> : (
                <>
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,229,160,0.5)]",
                      batch?.isActive ? "bg-primary" : "bg-white/[0.2]",
                    )}
                  ></span>
                  <span className="text-sm font-bold text-foreground">
                    {batch?.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </>
              )}
            </div>
          </div>
          <InfoItem
            label="বর্তমান ভর্তি"
            value={`${studentCount} জন শিক্ষার্থী`}
            isLoading={isLoading}
          />
          <InfoItem
            label="প্রাতিষ্ঠানিক সীমা"
            value={`${capacity} জন শিক্ষার্থী`}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-5">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-foreground">
                ধারণক্ষমতার ব্যবহার
              </span>
              <span className="text-[11px] text-muted-foreground font-medium italic">
                {utilization >= 90
                  ? "প্রায় পূর্ণ"
                  : utilization >= 70
                    ? "ধারণক্ষমতার কাছাকাছি"
                    : "পর্যাপ্ত জায়গা"}
              </span>
            </div>
            <span className="text-sm font-black text-primary bg-[rgba(0,229,160,0.1)] px-2.5 py-1 rounded-lg">
              {studentCount} / {capacity}
            </span>
          </div>
          <div className="w-full bg-white/[0.04] h-2.5 rounded-full overflow-hidden p-[2px]">
            <div
              className="bg-gradient-to-r from-[#00b37a] to-[#00e5a0] h-full rounded-full transition-all duration-700"
              style={{ width: `${utilization}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
            <InfoIcon className="w-3.5 h-3.5 text-primary" />
            বর্তমান শিক্ষাবর্ষের জন্য এই ব্যাচে {Math.max(capacity - studentCount, 0)} টি শূন্যপদ বাকি আছে।
          </p>
        </div>
      </div>

      {/* Top Performers Card */}
      <div className="bg-[#131B2C] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-8 border border-white/[0.02] space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            শীর্ষ পারফর্মার
          </h2>
          <button className="text-primary text-xs font-bold hover:text-[#00b37a] transition-colors hover:underline underline-offset-4">
            অ্যানালিটিক্স দেখুন
          </button>
        </div>
        <div className="space-y-2">
          {/* Static placeholders for now as per design */}
          <PerformerItem
            name="রহিম আহমেদ"
            id="#1024-01"
            major="বিজ্ঞান"
            score="৯৪.৮%"
            rank="০১"
            initial="RA"
            color="emerald"
            premium
          />
          <PerformerItem
            name="ফাতেমা বেগম"
            id="#1024-05"
            major="মানবিক"
            score="৮৯.২%"
            rank="০২"
            initial="FB"
            color="blue"
            premium={false}
          />
          <PerformerItem
            name="নুসরাত জাহান"
            id="#1024-08"
            major="বাণিজ্য"
            score="৮৭.৫%"
            rank="০৩"
            initial="NJ"
            color="purple"
            premium={false}
          />
        </div>
      </div>
    </div>
  );
};

function InfoItem({
  label,
  value,
  isLoading,
}: {
  label: string;
  value?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </label>
      {isLoading ? (
        <Skeleton className="h-5 w-32 bg-white/[0.04]" />
      ) : (
        <span className="text-sm font-bold text-foreground tracking-tight">
          {value}
        </span>
      )}
    </div>
  );
}

interface PerformerItemProps {
  name: string;
  id: string;
  major: string;
  score: string;
  rank: string;
  initial: string;
  color: string;
  premium: boolean;
}

const PerformerItem = ({
  name,
  id,
  major,
  score,
  rank,
  initial,
  color,
  premium,
}: PerformerItemProps) => {
  const colorMap: Record<string, string> = {
    emerald: "bg-[rgba(0,229,160,0.1)] text-primary ring-[rgba(0,229,160,0.2)]",
    blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition-all group border border-transparent hover:border-white/[0.06] cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ring-1 shadow-sm transition-transform group-hover:scale-105",
              colorMap[color],
            )}
          >
            {initial}
          </div>
          {premium && (
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#131B2C] rounded-lg shadow-sm flex items-center justify-center ring-1 ring-white/[0.06]">
              <span className="text-[12px]">⭐</span>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h4>
          <p className="text-[11px] text-muted-foreground font-medium tracking-wide">
            ID: {id} • {major}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="block text-[15px] font-black text-foreground">
            {score}
          </span>
          <span
            className={cn(
              "block text-[9px] font-bold uppercase tracking-tighter",
              color === "emerald" ? "text-primary" : `text-${color}-400`,
            )}
          >
            র‍্যাঙ্ক {rank}
          </span>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
};
