"use client";

import { Button } from "@workspace/ui/components/button";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useShortAnswerFilters } from "@workspace/api-client";
import { cn } from "@workspace/ui/lib/utils";

export const Filter = ({ setSelectedIds, isLoading }: any) => {
  return (
    <div className="flex justify-between items-center bg-card p-4 rounded-lg border">
      <div className="flex items-center gap-4">
        <h3 className="font-semibold text-lg">Short Answer Filter</h3>
        <p className="text-sm text-muted-foreground">Filter integration goes here...</p>
      </div>
      <div className="flex gap-2">
        <Link href="/short-answers/import">
          <Button variant="outline">Import JSON</Button>
        </Link>
        <Link href="/short-answers/new">
          <Button>Create Short Answer</Button>
        </Link>
      </div>
    </div>
  );
};

export const BulkActions = ({ selectedCount, setSelectedIds, onBulkDelete, isLoading }: any) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-primary/10 p-4 rounded-lg border border-primary/20 animate-in slide-in-from-top-2">
      <span className="font-medium text-primary">{selectedCount} Items selected</span>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setSelectedIds([])} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onBulkDelete} disabled={isLoading}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>
      </div>
    </div>
  );
};

export const Pagination = ({ totalItem }: any) => {
  const [filters, setFilters] = useShortAnswerFilters();

  const currentPage = filters.page || 1;
  const pageSize = filters.limit || 10;
  const totalPages = Math.ceil(totalItem / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page });
  };

  const startRange = totalItem > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, totalItem);

  if (totalItem === 0) return null;

  return (
    <div className="px-8 py-5 flex items-center justify-between border-t border-border/50 bg-card rounded-b-3xl mt-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-background border border-border/50 rounded-lg">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Showing <span className="text-primary font-black">{startRange}</span> -{" "}
            <span className="text-primary font-black">{endRange}</span> of{" "}
            <span className="text-foreground font-black">{totalItem}</span> Records
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="h-9 px-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold text-xs gap-1.5"
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
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
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
          className="h-9 px-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold text-xs gap-1.5"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
