"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, LayoutGrid, List as ListIcon } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useStudentFilters,
} from "@workspace/api-client";
import { useDebounceCallback } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";

interface FiltersProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function Filters({ viewMode, onViewModeChange }: FiltersProps) {
  const [filters, setFilters] = useStudentFilters();
  const [search, setSearch] = useState(filters.search ?? "");

  const debouncedSetFilters = useDebounceCallback((value: string) => {
    setFilters({ search: value || null, page: 1 });
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSetFilters(value);
  };

  const { data: years } = useAcademicYearsForSelection();
  const { data: classes } = useAcademicClassesForSelection();

  const year_options =
    years?.map((item) => ({
      label: item.label,
      value: item.id,
    })) ?? [];

  const class_options =
    classes?.map((item) => ({
      label: item.nameBn || item.nameEn,
      value: item.id,
    })) ?? [];

  // Sync external search changes (e.g. from mobile view or clear button)
  useEffect(() => {
    setSearch(filters.search ?? "");
  }, [filters.search]);

  const handleAcademicYearChange = (id: string) => {
    setFilters({
      academicYearId: id === "all" ? null : id,
      page: 1,
    });
  };

  const handleAcademicClassChange = (id: string) => {
    setFilters({
      academicClassId: id === "all" ? null : id,
      page: 1,
    });
  };

  const handleStatusChange = (status: "all" | "active" | "inactive") => {
    setFilters({
      isActive:
        status === "active" ? true : status === "inactive" ? false : null,
      page: 1,
    });
  };

  const hasActiveFilters =
    (filters.isActive !== null && filters.isActive !== undefined) ||
    !!filters.sortBy ||
    !!filters.search ||
    !!filters.academicYearId ||
    !!filters.academicClassId ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      academicYearId: null,
      academicClassId: null,
      isActive: null,
    });
  };

  return (
    <div className="bg-card overflow-hidden border-b border-white/[0.06]">
      <div className="p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            className="w-full bg-white/[0.05] py-2.5 pl-10 pr-10 rounded-xl border-white/[0.08] focus:border-[rgba(0,229,160,0.30)] focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] text-sm text-foreground placeholder:text-muted-foreground h-10 transition-all [&::-webkit-search-cancel-button]:hidden"
            placeholder="শিক্ষার্থী খুঁজুন..."
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setFilters({ search: null, page: 1 });
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/[0.1] text-muted-foreground flex items-center justify-center hover:bg-white/[0.15] transition-colors text-[10px] font-bold leading-none"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center border border-white/[0.06] rounded-lg p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("all")}
            className={cn(
              "h-8 px-4 rounded-md text-xs font-bold transition-all duration-200",
              filters.isActive === null
                ? "bg-white/[0.08] text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent",
            )}
          >
            সব
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("active")}
            className={cn(
              "h-8 px-4 rounded-md text-xs font-bold transition-all duration-200",
              filters.isActive === true
                ? "bg-white/[0.08] text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent",
            )}
          >
            অ্যাক্টিভ
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("inactive")}
            className={cn(
              "h-8 px-4 rounded-md text-xs font-bold transition-all duration-200",
              filters.isActive === false
                ? "bg-white/[0.08] text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent",
            )}
          >
            ইনঅ্যাক্টিভ
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={filters.academicYearId ?? "all"}
            onValueChange={handleAcademicYearChange}
          >
            <SelectTrigger className="bg-white/[0.05] border-white/[0.08] rounded-xl text-sm font-semibold text-foreground w-[150px] h-10 px-4 focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] transition-all">
              <SelectValue placeholder="সব বছর" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] text-foreground">
              <SelectItem value="all">সব বছর</SelectItem>
              {year_options.map((item) => (
                <SelectItem key={item.value} value={item.value} className="focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.academicClassId ?? "all"}
            onValueChange={handleAcademicClassChange}
          >
            <SelectTrigger className="bg-white/[0.05] border-white/[0.08] rounded-xl text-sm font-semibold text-foreground w-[150px] h-10 px-4 focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] transition-all">
              <SelectValue placeholder="সব ক্লাস" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] text-foreground">
              <SelectItem value="all">সব ক্লাস</SelectItem>
              {class_options.map((item) => (
                <SelectItem key={item.value} value={item.value} className="focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy && filters.sortOrder ? `${filters.sortBy}-${filters.sortOrder}` : "createdAt-desc"}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split("-") as [string, "asc" | "desc"];
              setFilters({ sortBy, sortOrder, page: 1 });
            }}
          >
            <SelectTrigger className="bg-white/[0.05] border-white/[0.08] rounded-xl text-sm font-semibold text-foreground w-[150px] h-10 px-4 focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] transition-all">
              <SelectValue placeholder="সাজান" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] text-foreground">
              <SelectItem value="createdAt-desc" className="focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">নতুন</SelectItem>
              <SelectItem value="createdAt-asc" className="focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">পুরোনো</SelectItem>
              <SelectItem value="name-asc" className="focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">নাম (এ-জেড)</SelectItem>
              <SelectItem value="name-desc" className="focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">নাম (জেড-এ)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center border border-white/[0.06] rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange("table")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "table"
                ? "bg-white/[0.08] text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ListIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "grid"
                ? "bg-white/[0.08] text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
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
                  className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.20)] text-xs text-primary shadow-sm rounded-lg hover:bg-[rgba(0,229,160,0.12)]"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    খুঁজুন:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.search}
                  </span>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilters({ search: null, page: 1 });
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
                  className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.20)] text-xs text-primary shadow-sm rounded-lg hover:bg-[rgba(0,229,160,0.12)]"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    অবস্থা:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
                  </span>
                  <button
                    onClick={() => setFilters({ isActive: null, page: 1 })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.academicYearId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.20)] text-xs text-primary shadow-sm rounded-lg hover:bg-[rgba(0,229,160,0.12)]"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    বছর:
                  </span>
                  <span className="font-bold text-[11px]">
                    {
                      year_options.find(
                        (item) => item.value === filters.academicYearId,
                      )?.label
                    }
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ academicYearId: null, page: 1 })
                    }
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.academicClassId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.20)] text-xs text-primary shadow-sm rounded-lg hover:bg-[rgba(0,229,160,0.12)]"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    ক্লাস:
                  </span>
                  <span className="font-bold text-[11px]">
                    {
                      class_options.find(
                        (item) => item.value === filters.academicClassId,
                      )?.label
                    }
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ academicClassId: null, page: 1 })
                    }
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {(filters.sortBy || filters.sortOrder) && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.20)] text-xs text-primary shadow-sm rounded-lg hover:bg-[rgba(0,229,160,0.12)]"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    সাজান:
                  </span>
                  <span className="font-bold text-[11px]">
                    {(() => {
                      const sortLabels = {
                        "createdAt-desc": "নতুন",
                        "createdAt-asc": "পুরোনো",
                        "name-asc": "নাম (এ-জেড)",
                        "name-desc": "নাম (জেড-এ)",
                      } as const;
                      const key = `${filters.sortBy || "createdAt"}-${filters.sortOrder || "desc"}`;
                      return sortLabels[key as keyof typeof sortLabels] ?? "নতুন";
                    })()}
                  </span>
                  <button
                    onClick={() => setFilters({ sortBy: null, sortOrder: null, page: 1 })}
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
                className="ml-auto text-[10px] font-bold text-muted-foreground hover:text-[#ff4757] hover:bg-[rgba(255,71,87,0.08)] transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg"
              >
                <RotateCcw className="w-3 h-3" />
                সব রিসেট করুন
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
