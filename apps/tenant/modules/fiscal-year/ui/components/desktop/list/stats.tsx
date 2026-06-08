"use client";

import { useFiscalYearStats } from "@workspace/api-client";
import {
  Calendar,
  CheckCircle,
  PauseCircle,
} from "lucide-react";
import { enToBnNumber } from "@workspace/utils";

export function Stats() {
  const { data: stats } = useFiscalYearStats();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={<Calendar className="w-6 h-6" />}
        label="মোট অর্থবছর"
        value={enToBnNumber(stats?.total) || "০"}
        iconBgClass="bg-primary/10"
        iconTextClass="text-primary"
      />
      <StatCard
        icon={<CheckCircle className="w-6 h-6" />}
        label="সক্রিয় অর্থবছর"
        value={enToBnNumber(stats?.active) || "০"}
        iconBgClass="bg-emerald-500/10"
        iconTextClass="text-emerald-600"
      />
      <StatCard
        icon={<PauseCircle className="w-6 h-6" />}
        label="নিষ্ক্রিয় অর্থবছর"
        value={enToBnNumber(stats?.inactive) || "০"}
        iconBgClass="bg-slate-200/50"
        iconTextClass="text-slate-600"
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  iconBgClass,
  iconTextClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBgClass: string;
  iconTextClass: string;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-2xl shadow-ambient flex items-center gap-5 transition-all hover:shadow-ambient-double">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass} ${iconTextClass} shadow-sm`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
          {label}
        </p>
        <p className="text-2xl font-black text-on-surface tracking-tight leading-none mt-1">{value}</p>
      </div>
    </div>
  );
}
