"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, Activity, Star } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useFiscalYearFilters } from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export function FiscalYearFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useFiscalYearFilters();

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null, page: 1 });
  }, [debouncedSearch, setFilters]);

  const hasActiveFilters =
    filters.isActive !== null ||
    filters.isCurrent !== null ||
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
      isCurrent: null,
    });
  };

  return (
    <div className="bg-white overflow-hidden border-b border-outline/5">
      <div className="bg-white p-4 flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <Input
            className="w-full bg-surface-container-low py-2.5 pl-10 pr-4 rounded-[12px] border-none focus:ring-2 focus:ring-primary/60 text-sm text-on-surface placeholder:text-on-surface-variant/40 h-10 transition-all font-bold"
            placeholder="নাম বা বাংলা নাম দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Current Status Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.isCurrent === null ? "all" : filters.isCurrent.toString()}
            onValueChange={(val) => {
              setFilters({
                ...filters,
                isCurrent: val === "all" ? null : val === "true",
                page: 1
              });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left overflow-hidden">
                <Star size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব বছর" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব বছর</SelectItem>
              <SelectItem value="true" className="font-bold text-primary">বর্তমান বছর</SelectItem>
              <SelectItem value="false" className="font-bold text-on-surface-variant">অন্যান্য বছর</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Status Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.isActive === null ? "all" : filters.isActive.toString()}
            onValueChange={(val) => {
              setFilters({
                ...filters,
                isActive: val === "all" ? null : val === "true",
                page: 1
              });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left overflow-hidden">
                <Activity size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব অবস্থা" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব অবস্থা</SelectItem>
              <SelectItem value="true" className="font-bold text-emerald-600">সক্রিয়</SelectItem>
              <SelectItem value="false" className="font-bold text-slate-400">নিষ্ক্রিয়</SelectItem>
            </SelectContent>
          </Select>
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
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    সার্চ:
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

              {filters.isCurrent !== null && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    ধরন:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.isCurrent ? "বর্তমান বছর" : "অন্যান্য বছর"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, isCurrent: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.isActive !== null && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    অবস্থা:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
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
                className="ml-auto text-[10px] font-bold text-on-surface-variant hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg text-destructive"
              >
                <RotateCcw className="w-3 h-3 text-destructive" />
                সব রিসেট করুন
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
