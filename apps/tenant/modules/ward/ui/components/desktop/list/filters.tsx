"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, LayoutGrid, List as ListIcon } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  useWardFilters,
} from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";

interface FiltersProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function Filters({ viewMode, onViewModeChange }: FiltersProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useWardFilters();

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null });
  }, [debouncedSearch, setFilters]);

  const handleStatusChange = (status: "all" | "active" | "inactive") => {
    setFilters({
      ...filters,
      isActive:
        status === "active" ? true : status === "inactive" ? false : null,
    });
  };

  const hasActiveFilters =
    (filters.isActive !== null && filters.isActive !== undefined) ||
    !!filters.sortBy ||
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
      isActive: null,
    });
  };

  return (
    <div className="bg-surface-container-lowest overflow-hidden">
      <div className="p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
          <Input
            className="w-full bg-surface-container-low py-2.5 pl-10 pr-4 rounded-xl border-none focus-visible:ring-2 focus-visible:ring-primary/40 text-sm text-on-surface placeholder:text-on-surface-variant/40 h-10 transition-all"
            placeholder="Search wards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("all")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.isActive === null
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50",
            )}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("active")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.isActive === true
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50",
            )}
          >
            Active
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("inactive")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.isActive === false
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50",
            )}
          >
            Inactive
          </Button>
        </div>

        <div className="ml-auto flex items-center bg-surface-container-low p-1 rounded-xl border border-outline/5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              viewMode === "grid"
                ? "bg-surface-container-lowest shadow-sm text-primary"
                : "text-on-surface-variant/50 hover:text-on-surface-variant hover:bg-surface-container-lowest/50",
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("table")}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              viewMode === "table"
                ? "bg-surface-container-lowest shadow-sm text-primary"
                : "text-on-surface-variant/50 hover:text-on-surface-variant hover:bg-surface-container-lowest/50",
            )}
          >
            <ListIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-0">
              {filters.search && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest border border-outline/10 text-xs text-primary shadow-sm rounded-lg hover:bg-surface-container-lowest"
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

              {filters.isActive !== null && filters.isActive !== undefined && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest border border-outline/10 text-xs text-primary shadow-sm rounded-lg hover:bg-surface-container-lowest"
                >
                  <span className="font-black text-[10px] uppercase opacity-50 mr-1">
                    Status:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, isActive: null })}
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
