"use client";

import {
  BookOpen,
  Calendar,
  Edit,
  Eye,
  Layers,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TenantTypes } from "@workspace/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";

interface BatchWithRelations extends TenantTypes.Batch {
  _count: {
    students: number;
  };
}

interface BatchTableProps {
  batches: BatchWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const BatchTable = ({
  batches,
  isLoading,
  onDelete,
}: BatchTableProps) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-[#4a607d] border-b border-white/[0.05]">
                  ব্যাচের নাম
                </th>
                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-[#4a607d] border-b border-white/[0.05]">
                  ক্লাস ও বছর
                </th>
                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-[#4a607d] border-b border-white/[0.05]">
                  আসন সংখ্যা
                </th>
                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-[#4a607d] border-b border-white/[0.05]">
                  অবস্থা
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
                      <Skeleton className="h-5 w-32 bg-white/[0.06]" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-white/[0.06]" />
                      <Skeleton className="h-4 w-28 bg-white/[0.06]" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-5 w-20 bg-white/[0.06]" />
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-6 w-16 bg-white/[0.06] rounded-full" />
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

  if (batches.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center text-[#4a607d]">
          <Layers size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground">
            কোনো রেকর্ড নেই
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
                ব্যাচের নাম
              </th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 border-b border-white/[0.02]">
                ক্লাস ও বছর
              </th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 border-b border-white/[0.02]">
                আসন সংখ্যা
              </th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 border-b border-white/[0.02]">
                অবস্থা
              </th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 text-right border-b border-white/[0.02]">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {batches.map((batch, index) => (
              <tr
                key={batch.id}
                className="hover:bg-white/[0.02] transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center text-primary">
                      <Layers size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {batch.name}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {batch.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {batch.academicYear}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {batch._count.students} / {batch.capacity}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      batch.isActive
                        ? "bg-[rgba(0,229,160,0.10)] text-primary border-[rgba(0,229,160,0.20)]"
                        : "bg-white/[0.06] text-muted-foreground border-transparent",
                    )}
                  >
                    {batch.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
                  </span>
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
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
                          <Link href={`/batches/${batch.id}`}>
                            <Eye className="w-4 h-4 mr-2" /> বিস্তারিত
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
                          <Link href={`/batches/edit/${batch.id}`}>
                            <Edit className="w-4 h-4 mr-2" /> এডিট
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem
                          className="rounded-lg cursor-pointer font-medium text-[#ff4757] focus:text-[#ff4757] focus:bg-[rgba(255,71,87,0.08)]"
                          onClick={() => onDelete(batch.id, batch.name)}
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
