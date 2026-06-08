"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { useCounterFilters } from "@workspace/api-client";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
}

export function Pagination({ total }: PaginationProps) {
  const [filters, setFilters] = useCounterFilters();

  const currentPage = filters.page;
  const pageSize = filters.limit;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page });
  };

  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  if (total === 0) return null;

  return (
    <div className="px-8 py-5 flex items-center justify-between border-t border-white/[0.05] bg-card">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            দেখাচ্ছে <span className="text-primary">{startRange}</span> -{" "}
            <span className="text-primary">{endRange}</span>, সর্বমোট{" "}
            <span className="text-foreground">{total}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="h-9 px-3 text-muted-foreground hover:text-primary hover:bg-[rgba(0,229,160,0.08)] rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold text-xs gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          পূর্ববর্তী
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "w-9 h-9 rounded-lg font-bold text-xs transition-all",
                  currentPage === pageNum
                    ? "bg-[#131B2C] text-white border border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:bg-[#1A243A]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]",
                )}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="h-9 px-3 text-muted-foreground hover:text-primary hover:bg-[rgba(0,229,160,0.08)] rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold text-xs gap-1"
        >
          পরবর্তী
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
