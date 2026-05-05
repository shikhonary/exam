"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useCitizenApplicationFilters } from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";

export function CitizenApplicationFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useCitizenApplicationFilters();

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null });
  }, [debouncedSearch, setFilters]);

  const handleStatusChange = (status: string | null) => {
    setFilters({
      ...filters,
      status: status,
      page: 1, // Reset to first page on filter change
    });
  };

  const hasActiveFilters =
    !!filters.status ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      status: null,
      wardNo: null,
    });
  };

  return (
    <div className="bg-white rounded-[24px] border border-outline/5 shadow-sm overflow-hidden mb-6">
      <div className="p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant opacity-50" />
          <Input
            className="w-full bg-slate-50 py-2.5 pl-11 pr-4 rounded-xl border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-sm text-on-surface placeholder:text-on-surface-variant/40 h-12 transition-all"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-outline/5">
          {[
            { label: "All", value: null },
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ].map((s) => (
            <Button
              key={s.label}
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(s.value)}
              className={cn(
                "h-10 px-5 rounded-lg text-xs font-bold transition-all duration-200",
                filters.status === s.value
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/50",
              )}
            >
              {s.label}
            </Button>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="h-12 px-5 rounded-xl border-outline/10 bg-white gap-2 text-on-surface-variant font-bold ml-auto"
        >
          <Filter className="w-4 h-4" /> More Filters
        </Button>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-0 border-t border-slate-50 mt-2 pt-4">
              {filters.search && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-primary/10"
                >
                  <span className="font-black text-[10px] uppercase opacity-50 mr-1">
                    Search:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.search}
                  </span>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilters({ ...filters, search: null });
                    }}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.status && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-primary/10"
                >
                  <span className="font-black text-[10px] uppercase opacity-50 mr-1">
                    Status:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.status}
                  </span>
                  <button
                    onClick={() => handleStatusChange(null)}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="ml-auto text-[10px] font-black text-on-surface-variant/80 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
