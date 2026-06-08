"use client";

import React from "react";
import {
  useCounterFilters,
  useAcademicYearsForSelection,
} from "@workspace/api-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export const Filters = () => {
  const [filters, setFilters] = useCounterFilters();
  const { data: years } = useAcademicYearsForSelection();

  const yearOptions =
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

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [string, "asc" | "desc"];
    setFilters({
      sortBy,
      sortOrder,
      page: 1,
    });
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Select
        value={filters.academicYearId ?? "all"}
        onValueChange={handleAcademicYearChange}
      >
        <SelectTrigger className="flex-1 bg-white/[0.05] border-white/[0.08] rounded-xl text-xs font-semibold text-foreground h-10 px-4 focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] transition-all">
          <SelectValue placeholder="সব বছর" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-xl text-foreground">
          <SelectItem value="all" className="text-xs font-medium focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
            সব বছর
          </SelectItem>
          {yearOptions.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="text-xs font-medium focus:bg-[rgba(0,229,160,0.08)] focus:text-primary"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy && filters.sortOrder ? `${filters.sortBy}-${filters.sortOrder}` : "createdAt-desc"}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="flex-1 bg-white/[0.05] border-white/[0.08] rounded-xl text-xs font-semibold text-foreground h-10 px-4 focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] transition-all">
          <SelectValue placeholder="সাজান" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-xl text-foreground">
          <SelectItem value="createdAt-desc" className="text-xs font-medium focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
            নতুন
          </SelectItem>
          <SelectItem value="createdAt-asc" className="text-xs font-medium focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
            পুরোনো
          </SelectItem>
          <SelectItem value="value-asc" className="text-xs font-medium focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
            পরিমাণ (কম-বেশি)
          </SelectItem>
          <SelectItem value="value-desc" className="text-xs font-medium focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
            পরিমাণ (বেশি-কম)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
