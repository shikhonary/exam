"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { useQuestionPaperFilters } from "@workspace/api-client";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItem: number;
}

export function Pagination({ totalItem }: PaginationProps) {
  const [filters, setFilters] = useQuestionPaperFilters();

  const currentPage = filters.page || 1;
  const pageSize = filters.limit || 10;
  const totalPages = Math.ceil(totalItem / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ page });
  };

  const startRange = totalItem > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, totalItem);

  if (totalItem === 0) return null;

  return (
    <div className="px-8 py-5 flex items-center justify-between border-t border-outline/5 bg-white">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-surface-container-low border border-outline/5 rounded-lg">
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
            Showing <span className="text-primary font-black">{startRange}</span> -{" "}
            <span className="text-primary font-black">{endRange}</span> of{" "}
            <span className="text-on-surface font-black">{totalItem}</span> Records
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="h-9 px-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold text-xs gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
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
                    ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low",
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
          className="h-9 px-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold text-xs gap-1.5"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
