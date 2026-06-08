"use client";

import { useFeeStats } from "@workspace/api-client";
import {
  FolderIcon,
  CheckCircle,
  PauseCircle,
  GraduationCap,
} from "lucide-react";

import { Skeleton } from "@workspace/ui/components/skeleton";

export function Stats() {
  const { data: stats, isLoading } = useFeeStats();

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-6 rounded-2xl flex items-center gap-5">
            <Skeleton className="w-12 h-12 rounded-full bg-white/[0.06]" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 bg-white/[0.06]" />
              <Skeleton className="h-6 w-10 bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<FolderIcon className="w-6 h-6" />}
        label="মোট ব্যাচ"
        value={stats?.total.toString() ?? "0"}
      />
      <StatCard
        icon={<CheckCircle className="w-6 h-6" />}
        label="অ্যাক্টিভ ব্যাচ"
        value={stats?.active.toString() ?? "0"}
        accent
      />
      <StatCard
        icon={<PauseCircle className="w-6 h-6" />}
        label="ইনঅ্যাক্টিভ ব্যাচ"
        value={stats?.inactive.toString() ?? "0"}
      />
      <StatCard
        icon={<GraduationCap className="w-6 h-6" />}
        label="মোট শিক্ষার্থী"
        value={stats?.totalStudents.toLocaleString() ?? "0"}
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="group bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-6 rounded-2xl flex items-center gap-5 transition-all hover:-translate-y-1 duration-300">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 ${
          accent
            ? "bg-[rgba(0,229,160,0.1)] text-primary group-hover:shadow-[0_0_15px_rgba(0,229,160,0.2)]"
            : "bg-white/[0.04] text-muted-foreground group-hover:bg-white/[0.08] group-hover:text-foreground"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold tracking-wider text-muted-foreground/80 mb-1">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-foreground">{value}</p>
      </div>
    </div>
  );
}
