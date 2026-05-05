"use client";

import { useVillageStats } from "@workspace/api-client";
import {
  Building2,
  CheckCircle,
  PauseCircle,
} from "lucide-react";

export function Stats() {
  const { data: stats } = useVillageStats();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={<Building2 className="w-6 h-6" />}
        label="Total Villages"
        value={stats?.total.toString() ?? "0"}
        iconBgClass="bg-primary/10"
        iconTextClass="text-primary"
      />
      <StatCard
        icon={<CheckCircle className="w-6 h-6" />}
        label="Active Villages"
        value={stats?.active.toString() ?? "0"}
        iconBgClass="bg-emerald-500/10"
        iconTextClass="text-emerald-600"
      />
      <StatCard
        icon={<PauseCircle className="w-6 h-6" />}
        label="Inactive Villages"
        value={stats?.inactive.toString() ?? "0"}
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
