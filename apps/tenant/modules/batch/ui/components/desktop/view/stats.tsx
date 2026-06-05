"use client";

import { Users, UserX, FileText, PieChart } from "lucide-react";

import { Skeleton } from "@workspace/ui/components/skeleton";

interface StatsProps {
  stats: {
    totalStudents: number;
    inactiveStudents: number;
    totalExams: number;
  };
  capacity: number;
  isLoading?: boolean;
}

export const Stats = ({ stats, capacity, isLoading }: StatsProps) => {
  const studentCount = stats.totalStudents;
  const capacityPercentage =
    capacity > 0 ? Math.round((studentCount / capacity) * 100) : 0;

  // Dynamic colors for the progress bar
  const getStatusColor = (percent: number) => {
    if (percent >= 90) return "from-rose-500 to-red-400";
    if (percent >= 70) return "from-amber-500 to-orange-400";
    return "from-[#00b37a] to-[#00e5a0]";
  };

  const statConfig = [
    {
      label: "মোট শিক্ষার্থী",
      value: studentCount,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "ইনঅ্যাক্টিভ",
      value: stats.inactiveStudents,
      icon: UserX,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      label: "মোট পরীক্ষা",
      value: stats.totalExams,
      icon: FileText,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statConfig.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden bg-[#131B2C] px-6 py-4 rounded-2xl border border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                {item.label}
              </span>
              {isLoading ? (
                <Skeleton className="h-9 w-16 bg-white/[0.04]" />
              ) : (
                <span className="text-3xl font-black text-foreground">
                  {item.value.toLocaleString()}
                </span>
              )}
            </div>
            <div
              className={`p-3 rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}
            >
              <item.icon size={24} />
            </div>
          </div>
        </div>
      ))}

      {/* Capacity Card */}
      <div className="bg-[#131B2C] px-6 py-4 rounded-2xl border border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1">
        <div className="flex flex-col h-full justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                ধারণক্ষমতা
              </span>
              {isLoading ? (
                <Skeleton className="h-9 w-20 bg-white/[0.04]" />
              ) : (
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-foreground">
                    {capacityPercentage}%
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] text-muted-foreground">
              <PieChart size={24} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-white/[0.04] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getStatusColor(capacityPercentage)}`}
                style={{ width: `${isLoading ? 0 : Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
