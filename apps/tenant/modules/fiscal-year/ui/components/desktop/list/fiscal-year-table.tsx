"use client";

import { Edit, Calendar, MoreHorizontal, Trash2, Star, CheckCircle2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { enToBnNumber } from "@workspace/utils";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

interface FiscalYear {
  id: string;
  name: string;
  nameBn: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  isActive: boolean;
}

interface FiscalYearTableProps {
  fiscalYears: FiscalYear[];
  isLoading: boolean;
  onEdit: (fy: FiscalYear) => void;
  onDelete: (id: string, name: string) => void;
  onSetCurrent: (id: string) => void;
}

export const FiscalYearTable = ({
  fiscalYears,
  isLoading,
  onEdit,
  onDelete,
  onSetCurrent,
}: FiscalYearTableProps) => {
  if (isLoading) {
    return (
      <div className="relative flex-grow border-t border-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">অর্থবছর</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">সময়কাল</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 text-center">অবস্থা</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded bg-surface-container" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 bg-surface-container" />
                        <Skeleton className="h-3 w-20 bg-surface-container opacity-60" />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40 bg-surface-container" />
                      <Skeleton className="h-3 w-24 bg-surface-container opacity-60" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-6 w-20 mx-auto bg-surface-container rounded-lg" />
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex justify-end">
                      <Skeleton className="w-10 h-10 rounded-xl bg-surface-container" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (fiscalYears.length === 0) {
    return (
      <div className="py-24 text-center border-t border-outline/5">
        <div className="flex flex-col items-center gap-4 opacity-40 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 rounded-[32px] bg-surface-container flex items-center justify-center text-slate-400">
            <Calendar className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">কোনো অর্থবছর পাওয়া যায়নি</h3>
            <p className="text-[10px] font-bold text-on-surface-variant/40 italic">নতুন একটি অর্থবছর তৈরি করে শুরু করুন</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-grow border-t border-surface-container animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">অর্থবছর</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">সময়কাল</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 text-center">অবস্থা</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/5">
            {fiscalYears.map((fy, index) => (
              <tr
                key={fy.id}
                className={cn(
                  "hover:bg-surface-container-low/30 transition-colors group",
                  fy.isCurrent && "bg-primary/[0.02]"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded bg-surface-container flex items-center justify-center transition-all shadow-sm border border-outline/5",
                      fy.isCurrent ? "text-primary bg-white ring-1 ring-primary/20" : "text-on-surface-variant/40"
                    )}>
                      {fy.isCurrent ? <Star size={20} className="fill-primary" /> : <Calendar size={20} strokeWidth={2.5} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">
                        {fy.nameBn}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-60">
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          FY {fy.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary/60" />
                      <span className="text-sm font-bold tracking-tight text-on-surface">
                        {enToBnNumber(format(new Date(fy.startDate), "dd MMM yyyy", { locale: bn }))} —
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span className="text-xs font-bold text-on-surface-variant/60 italic">
                        {enToBnNumber(format(new Date(fy.endDate), "dd MMM yyyy", { locale: bn }))}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    {fy.isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> বর্তমান
                      </span>
                    )}
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                      fy.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      {fy.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-on-surface-variant/40 hover:text-primary transition-all cursor-pointer rounded-xl hover:bg-primary/5 outline-none focus:outline-none focus:ring-0"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-outline/10 shadow-ambient p-1.5">
                        <DropdownMenuItem
                          onClick={() => onEdit(fy)}
                          className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-3 px-4 rounded-xl"
                        >
                          <Edit className="w-4 h-4 mr-3 opacity-60" /> এডিট করুন
                        </DropdownMenuItem>

                        {!fy.isCurrent && (
                          <DropdownMenuItem
                            onClick={() => onSetCurrent(fy.id)}
                            className="cursor-pointer font-bold text-primary hover:bg-primary/5 transition-colors py-3 px-4 rounded-xl"
                          >
                            <Star className="w-4 h-4 mr-3 fill-primary/20" /> বর্তমান হিসেবে সেট করুন
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="bg-outline/5 my-1" />

                        <DropdownMenuItem
                          onClick={() => onDelete(fy.id, fy.nameBn)}
                          className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-bold py-3 px-4 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4 mr-3 opacity-60" /> ডিলিট করুন
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

