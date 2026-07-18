"use client";

import Link from "next/link";
import { Edit, MoreHorizontal, Trash2, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { Mcq } from "@workspace/db";
import { Badge } from "@workspace/ui/components/badge";

interface McqCardsProps {
  mcqs: Mcq[];
  isLoading: boolean;
  onDelete: (id: string, question: string) => void;
}

export function McqCards({ mcqs, isLoading, onDelete }: McqCardsProps) {
  if (isLoading && mcqs.length === 0) {
    return (
      <div className="p-6 border-t border-surface-container animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-slate-100 rounded-3xl p-6 bg-white/60 backdrop-blur shadow-sm">
              <Skeleton className="h-4 w-3/4 mb-6 bg-slate-100/80" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-xl bg-slate-100/60" />
                <Skeleton className="h-10 w-full rounded-xl bg-slate-100/60" />
                <Skeleton className="h-10 w-full rounded-xl bg-slate-100/60" />
                <Skeleton className="h-10 w-full rounded-xl bg-slate-100/60" />
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-2">
                <Skeleton className="h-6 w-16 rounded-lg bg-slate-100/80" />
                <Skeleton className="h-6 w-16 rounded-lg bg-slate-100/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mcqs.length === 0) {
    return (
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 p-16 text-center shadow-soft m-4">
        <div className="size-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/50">
          <HelpCircle className="size-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No MCQs Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          We couldn&apos;t find any MCQs matching your current filters. Try
          broadening your search parameters or create a new MCQ.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-surface-container animate-in fade-in duration-500 bg-surface-container-lowest/50">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mcqs.map((item, index) => {
          // Parse options if stored as JSON array string or valid array
          const parsedOptions = Array.isArray(item.options)
            ? item.options
            : typeof item.options === "string"
            ? JSON.parse(item.options)
            : [];

          return (
            <div
              key={item.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="group bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 p-6 flex flex-col relative animate-in slide-in-from-bottom-4"
            >
              <div className="absolute top-5 right-5 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all bg-white shadow-sm border border-slate-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 animate-in fade-in zoom-in-95"
                  >
                    <DropdownMenuItem asChild className="rounded-xl font-bold text-sm cursor-pointer p-2.5">
                      <Link href={`/mcqs/${item.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                    <DropdownMenuItem
                      className="rounded-xl font-bold text-sm cursor-pointer p-2.5 text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                      onClick={() => onDelete(item.id, item.question)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete MCQ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-5 pr-10">
                <h3 className="font-bold text-slate-800 text-[15px] leading-relaxed line-clamp-3">
                  {item.question}
                </h3>
              </div>

              <div className="mt-auto space-y-2.5">
                {parsedOptions.slice(0, 4).map((opt: string, oIdx: number) => {
                  const isCorrect = Array.isArray(item.answer)
                    ? item.answer.includes(opt)
                    : item.answer === opt || (item.type === "multiple-statement" && String(item.answer).includes(String(oIdx + 1)));

                  return (
                    <div
                      key={oIdx}
                      className={`text-[12px] px-3.5 py-2.5 rounded-2xl flex items-center gap-3 border ${
                        isCorrect
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-sm"
                          : "bg-slate-50 border-slate-100/80 text-slate-600 font-medium"
                      }`}
                    >
                      <div
                        className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${
                          isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="line-clamp-2 leading-tight">{opt}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider font-bold">
                    {item.type}
                  </Badge>
                  {item.subject && (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider font-bold">
                      {item.subject}
                    </Badge>
                  )}
                </div>
                <span className="text-slate-400 tabular-nums tracking-tight">
                  {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
