"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useMonthlyFeeFilters } from "@workspace/api-client";

interface PaginationProps {
  total: number;
}

export const Pagination = ({ total }: PaginationProps) => {
  const [filters, setFilters] = useMonthlyFeeFilters();

  const currentPage = filters.page;
  const pageSize = filters.limit;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page });
  };

  if (total === 0) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-8 pb-10">
      <Button
        variant="ghost"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] transition-colors p-0"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="flex gap-2">
        <Button className="w-10 h-10 rounded-lg bg-[#131B2C] text-white font-bold text-sm shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.05] p-0 hover:bg-[#1A243A] hover:text-white">
          {currentPage}
        </Button>
      </div>
      <Button
        variant="ghost"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] transition-colors p-0"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </nav>
  );
};
