"use client";

import { Search, X, RotateCcw, BookOpen, Activity } from "lucide-react";
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

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils";
import {
  useQuestionPaperFilters,
  useAcademicClassesForSelection,
} from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";

interface FilterProps {
  isLoading: boolean;
}

export const QuestionPaperFilters = ({ isLoading }: FilterProps) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useQuestionPaperFilters();
  const debounceValue = useDebounce(search, 500);

  const { data: classesData } = useAcademicClassesForSelection();

  useEffect(() => {
    setFilters({
      search: debounceValue || null,
      page: 1,
    });
  }, [debounceValue, setFilters]);

  const handleClassChange = (value: string | null) => {
    setFilters({
      ...filters,
      classId: value,
      page: 1,
    });
  };

  const handleStatusChange = (value: string | null) => {
    setFilters({
      ...filters,
      status: value,
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.classId !== null ||
    filters.status !== null ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      classId: null,
      status: null,
    });
  };

  const selectedClassLabel = classesData?.find((c) => c.id === filters.classId)?.nameEn || "Class";
  const selectedStatusLabel = filters.status === "DRAFT" ? "Draft" : filters.status === "PUBLISHED" ? "Published" : "Status";

  return (
    <div className="bg-white overflow-hidden border-b border-outline/5">
      <div className="bg-white p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Filter elements container */}
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Bar */}
          <div className="relative flex-grow min-w-[200px] max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
            <Input
              className="w-full bg-surface-container-low py-2.5 pl-10 pr-4 rounded-[12px] border-none focus:ring-2 focus:ring-primary/60 text-sm text-on-surface placeholder:text-on-surface-variant/40 h-10 transition-all font-bold"
              placeholder="Search question papers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Academic Class Filter */}
          <div className="w-full sm:w-40 lg:w-48">
            <Select
              value={filters.classId || "all"}
              onValueChange={(val) => handleClassChange(val === "all" ? null : val)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <BookOpen size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Classes" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="all" className="font-bold">
                  All Classes
                </SelectItem>
                {classesData?.map((cls) => (
                  <SelectItem
                    key={cls.id}
                    value={cls.id}
                    className="font-bold"
                  >
                    {cls.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40 lg:w-48">
            <Select
              value={filters.status || "all"}
              onValueChange={(val) => handleStatusChange(val === "all" ? null : val)}
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
                <SelectItem value="DRAFT" className="font-bold">Draft</SelectItem>
                <SelectItem value="PUBLISHED" className="font-bold">Published</SelectItem>
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
              {filters.classId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Class:</span>
                  <span className="font-bold text-[11px]">{selectedClassLabel}</span>
                  <button onClick={() => setFilters({ ...filters, classId: null })} className="hover:text-rose-500 transition-colors ml-1">
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}
              {filters.status && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Status:</span>
                  <span className="font-bold text-[11px]">{selectedStatusLabel}</span>
                  <button onClick={() => setFilters({ ...filters, status: null })} className="hover:text-rose-500 transition-colors ml-1">
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
