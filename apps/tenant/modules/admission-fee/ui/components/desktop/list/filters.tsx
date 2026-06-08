"use client";

import React from "react";
import { RotateCcw, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  useAcademicYearsForSelection,
  useAdmissionFeeFilters,
} from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";
import { LayoutGrid, List as ListIcon } from "lucide-react";

interface FiltersProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function Filters({ viewMode, onViewModeChange }: FiltersProps) {
  const [filters, setFilters] = useAdmissionFeeFilters();

  const { data: years } = useAcademicYearsForSelection();

  const year_options =
    years?.map((item) => ({
      label: item.label,
      value: item.id,
    })) ?? [];

  const handleAcademicYearChange = (id: string) => {
    setFilters({
      academicYearId: id === "all" ? null : id,
      page: 1,
    });
  };

  const hasActiveFilters =
    !!filters.academicYearId ||
    !!filters.sortBy ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setFilters({
      limit: null,
      page: null,
      academicYearId: null,
      sortBy: null,
      sortOrder: null,
    });
  };

  return (
    <div className="bg-card overflow-hidden border-b border-white/[0.06]">
      <div className="p-4 flex flex-wrap items-center gap-4">
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
              <SelectItem value="amount-asc" className="focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">পরিমাণ (কম-বেশি)</SelectItem>
              <SelectItem value="amount-desc" className="focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">পরিমাণ (বেশি-কম)</SelectItem>
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
                        "amount-asc": "পরিমাণ (কম-বেশি)",
                        "amount-desc": "পরিমাণ (বেশি-কম)",
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
