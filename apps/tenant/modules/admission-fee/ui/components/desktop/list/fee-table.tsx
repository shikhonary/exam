"use client";

import { RouterOutput } from "@workspace/api";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { MoreHorizontal, Edit, Trash2, Calendar, BookOpen, Layers } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";

type AdmissionFee = RouterOutput["admissionFee"]["list"]["data"]["items"][number];

interface FeeTableProps {
  fees: AdmissionFee[];
  isLoading: boolean;
  onEdit: (fee: AdmissionFee) => void;
  onDelete: (id: string, name: string) => void;
}

export const FeeTable = ({ fees, isLoading, onEdit, onDelete }: FeeTableProps) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-[#4a607d] border-b border-white/[0.05]">
                  পরিমাণ
                </th>
                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-[#4a607d] border-b border-white/[0.05]">
                  ক্লাস ও বছর
                </th>
                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-[#4a607d] border-b border-white/[0.05]">
                  তৈরির তারিখ
                </th>
                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-[#4a607d] text-right border-b border-white/[0.05]">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg bg-white/[0.06]" />
                      <Skeleton className="h-5 w-24 bg-white/[0.06]" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-white/[0.06]" />
                      <Skeleton className="h-4 w-28 bg-white/[0.06]" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-4 w-24 bg-white/[0.06]" />
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex justify-end">
                      <Skeleton className="w-9 h-9 rounded-lg bg-white/[0.06]" />
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

  if (fees.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center text-[#4a607d]">
          <Layers size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground">
            কোনো ভর্তি ফি নেই
          </h3>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm">
            ফিল্টার পরিবর্তন করুন অথবা নতুন যোগ করুন।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.01]">
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 border-b border-white/[0.02]">
                পরিমাণ
              </th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 border-b border-white/[0.02]">
                ক্লাস ও বছর
              </th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 border-b border-white/[0.02]">
                তৈরির তারিখ
              </th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 text-right border-b border-white/[0.02]">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {fees.map((fee, index) => (
              <tr
                key={fee.id}
                className="hover:bg-white/[0.02] transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center text-primary">
                      <span className="text-xl font-bold">৳</span>
                    </div>
                    <span className="text-lg font-black text-primary tracking-tight">
                      {fee.amount}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {fee.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {fee.academicYear}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground opacity-70" />
                    <span className="text-sm font-medium text-foreground/80">
                      {format(new Date(fee.createdAt), "dd MMM, yyyy")}
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
                          className="text-muted-foreground hover:text-primary hover:bg-[rgba(0,229,160,0.08)] rounded-lg transition-all outline-none focus:outline-none focus:ring-0"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-[#111b2e] border border-white/[0.08] rounded-xl p-1">
                        <DropdownMenuItem
                          onClick={() => onEdit(fee)}
                          className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary m-1"
                        >
                          <Edit className="w-4 h-4 mr-2" /> এডিট
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem
                          className="rounded-lg cursor-pointer font-medium text-[#ff4757] focus:text-[#ff4757] focus:bg-[rgba(255,71,87,0.08)] m-1"
                          onClick={() => onDelete(fee.id, `${fee.className} - ${fee.academicYear}`)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> ডিলিট
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
