"use client";

import {
  ArrowUpDown,
  Search,
  X,
  Activity,
  RotateCcw,
  Calendar,
  Bookmark,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  activeBooleanStatusOptions,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@workspace/utils";
import {
  useAcademicChapterFilters,
  useAcademicYearsForSelection,
  useAcademicSubjectsForSelection,
} from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";

interface FilterProps {
  isLoading: boolean;
}

export const AcademicChapterFilters = ({ isLoading }: FilterProps) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useAcademicChapterFilters();
  const debounceValue = useDebounce(search, 500);

  const { data: yearsData } = useAcademicYearsForSelection();
  const { data: subjectsData } = useAcademicSubjectsForSelection();

  useEffect(() => {
    setFilters({
      search: debounceValue || null,
      page: 1,
    });
  }, [debounceValue, setFilters]);

  const handleFilterStatusChange = (value: string | null) => {
    let isActive: boolean | null = null;
    if (value === "true") isActive = true;
    else if (value === "false") isActive = false;

    setFilters({
      ...filters,
      isActive,
      page: 1,
    });
  };
  
  const handleYearChange = (value: string | null) => {
    setFilters({
      ...filters,
      academicYearId: value,
      page: 1,
    });
  };

  const handleSubjectChange = (value: string | null) => {
    setFilters({
      ...filters,
      subjectId: value,
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [string, "asc" | "desc"];
    setFilters({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  const currentSort =
    filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}-${filters.sortOrder}`
      : "";

  const DEFAULT_SORT_BY = "position";
  const DEFAULT_SORT_ORDER = "asc";

  const hasActiveFilters =
    filters.isActive !== null ||
    filters.academicYearId !== null ||
    filters.subjectId !== null ||
    !!filters.search ||
    (filters.sortBy !== null && filters.sortBy !== DEFAULT_SORT_BY) ||
    (filters.sortOrder !== null && filters.sortOrder !== DEFAULT_SORT_ORDER) ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      sortOrder: null,
      isActive: null,
      academicYearId: null,
      subjectId: null,
    });
  };

  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case "position-asc":
        return "Position (Low-High)";
      case "nameEn-asc":
        return "Name (A-Z)";
      case "nameEn-desc":
        return "Name (Z-A)";
      default:
        return "Position (Low-High)";
    }
  };

  const selectedYearLabel = yearsData?.find(y => y.id === filters.academicYearId)?.label || "Year";
  const selectedSubjectLabel = subjectsData?.find(c => c.id === filters.subjectId)?.nameEn || "Subject";

  return (
    <div className="bg-white overflow-hidden border-b border-outline/5">
      <div className="bg-white p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative flex-grow min-w-[200px] max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
            <Input
              className="w-full bg-surface-container-low py-2.5 pl-10 pr-4 rounded-[12px] border-none focus:ring-2 focus:ring-primary/60 text-sm text-on-surface placeholder:text-on-surface-variant/40 h-10 transition-all font-bold"
              placeholder="Search chapters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="w-full sm:w-40 lg:w-48">
            <Select
              value={filters.academicYearId || "all"}
              onValueChange={(val) => handleYearChange(val === "all" ? null : val)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <Calendar size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Years" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="all" className="font-bold">
                  All Years
                </SelectItem>
                {yearsData?.map((year) => (
                  <SelectItem
                    key={year.id}
                    value={year.id}
                    className="font-bold"
                  >
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-40 lg:w-48">
            <Select
              value={filters.subjectId || "all"}
              onValueChange={(val) => handleSubjectChange(val === "all" ? null : val)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <Bookmark size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Subjects" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="all" className="font-bold">
                  All Subjects
                </SelectItem>
                {subjectsData?.map((sub) => (
                  <SelectItem
                    key={sub.id}
                    value={sub.id}
                    className="font-bold"
                  >
                    {sub.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-36">
            <Select
              value={filters.isActive === null ? "all" : String(filters.isActive)}
              onValueChange={(val) =>
                handleFilterStatusChange(val === "all" ? null : val)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <Activity size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="all" className="font-bold">
                  All Status
                </SelectItem>
                {activeBooleanStatusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    className="font-bold"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={currentSort || "position-asc"}
              onValueChange={(v) => handleSortChange(v)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <ArrowUpDown size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="Sort" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="position-asc" className="font-bold">Position (Low-High)</SelectItem>
                <SelectItem value="nameEn-asc" className="font-bold">Name (A-Z)</SelectItem>
                <SelectItem value="nameEn-desc" className="font-bold">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Search:</span>
                  <span className="font-bold text-[11px]">{filters.search}</span>
                  <button onClick={() => { setSearch(""); setFilters({ ...filters, search: null }); }} className="hover:text-rose-500 transition-colors ml-1">
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}
              {filters.academicYearId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Year:</span>
                  <span className="font-bold text-[11px]">{selectedYearLabel}</span>
                  <button onClick={() => setFilters({ ...filters, academicYearId: null })} className="hover:text-rose-500 transition-colors ml-1">
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}
              {filters.subjectId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Subject:</span>
                  <span className="font-bold text-[11px]">{selectedSubjectLabel}</span>
                  <button onClick={() => setFilters({ ...filters, subjectId: null })} className="hover:text-rose-500 transition-colors ml-1">
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}
              {filters.isActive !== null && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Status:</span>
                  <span className="font-bold text-[11px]">{activeBooleanStatusOptions.find(o => String(o.value) === String(filters.isActive))?.label || (filters.isActive ? "Active" : "Inactive")}</span>
                  <button onClick={() => setFilters({ ...filters, isActive: null })} className="hover:text-rose-500 transition-colors ml-1">
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}
              {currentSort && currentSort !== "position-asc" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Sort:</span>
                  <span className="font-bold text-[11px]">{getSortLabel(currentSort)}</span>
                  <button onClick={() => setFilters({ ...filters, sortBy: null, sortOrder: null })} className="hover:text-rose-500 transition-colors ml-1">
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                disabled={isLoading}
                className="ml-auto text-[10px] font-bold text-on-surface-variant hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg text-destructive"
              >
                <RotateCcw className="w-3 h-3 text-destructive" />
                Reset All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
