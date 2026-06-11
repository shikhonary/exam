"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import { cn } from "@workspace/ui/lib/utils";
import {
  useStudentFilters,
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useBatchByYearClassId,
} from "@workspace/api-client";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export const Filters = () => {
  const [filters, setFilters] = useStudentFilters();

  const { data: classes } = useAcademicClassesForSelection();
  const { data: years } = useAcademicYearsForSelection();
  const { data: batches } = useBatchByYearClassId(
    filters.academicYearId ?? undefined,
    filters.academicClassId ?? undefined,
  );

  const classOptions =
    classes?.map((item) => ({
      label: item.nameBn,
      value: item.id,
    })) ?? [];

  const yearOptions =
    years?.map((item) => ({
      label: item.label,
      value: item.id,
    })) ?? [];

  const batchOptions =
    batches?.map((item) => ({
      label: item.name,
      value: item.id,
    })) ?? [];

  const isActiveVal =
    filters.isActive === true
      ? "true"
      : filters.isActive === false
        ? "false"
        : "all";

  const handleFilterStatusChange = (value: string) => {
    setFilters({
      isActive: value === "true" ? true : value === "false" ? false : null,
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

  const handleAcademicClassChange = (id: string) => {
    setFilters({
      academicClassId: id === "all" ? null : id,
      batchId: null,
      page: 1,
    });
  };

  const handleBatchChange = (id: string) => {
    setFilters({
      batchId: id === "all" ? null : id,
      page: 1,
    });
  };

  const handleAcademicYearChange = (id: string) => {
    setFilters({
      academicYearId: id === "all" ? null : id,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      isActive: null,
      academicClassId: null,
      academicYearId: null,
      batchId: null,
    });
  };

  const hasActiveFilters =
    (filters.isActive !== null && filters.isActive !== undefined) ||
    !!filters.sortBy ||
    !!filters.search ||
    !!filters.academicClassId ||
    !!filters.academicYearId ||
    !!filters.batchId ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label={hasActiveFilters ? "Filters (active)" : "Filters"}
          className={cn(
            "relative px-3 bg-white/[0.04] text-muted-foreground rounded-xl flex items-center justify-center active:scale-95 transition-transform h-10 w-10 hover:bg-white/[0.08] shadow-sm border-none",
            hasActiveFilters && "text-primary bg-[rgba(0,229,160,0.10)]",
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {hasActiveFilters && (
            <span
              aria-hidden="true"
              className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"
            />
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-card rounded-t-[32px] border-white/[0.08] shadow-2xl pb-6">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-white/[0.1] mt-3 mb-2" />

        <DrawerHeader className="px-6 text-left">
          <DrawerTitle className="text-xl font-bold tracking-tight text-foreground">
            শিক্ষার্থী ফিল্টার করুন
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            শিক্ষার্থী তালিকা পরিশোধন করুন
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 space-y-4 mt-2">
          {/* Status Filter */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              অবস্থা
            </h3>
            <div
              className="grid grid-cols-1 gap-2"
              role="radiogroup"
              aria-label="Filter by status"
            >
              {[
                { label: "সব", value: "all" },
                { label: "অ্যাক্টিভ", value: "true" },
                { label: "ইনঅ্যাক্টিভ", value: "false" },
              ].map((item) => {
                const isSelected = isActiveVal === item.value;
                return (
                  <button
                    key={item.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleFilterStatusChange(item.value)}
                    className={cn(
                      "flex items-center justify-between px-5 py-2 rounded-2xl transition-all duration-300 border",
                      isSelected
                        ? "bg-[rgba(0,229,160,0.10)] border-[rgba(0,229,160,0.20)] text-primary font-bold shadow-inner scale-[0.98]"
                        : "bg-transparent border-white/[0.08] text-muted-foreground font-medium hover:border-white/[0.15] hover:bg-white/[0.02]",
                    )}
                  >
                    <span className="text-sm">{item.label}</span>
                    {isSelected && (
                      <Check className="w-5 h-5 animate-in zoom-in-50 duration-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                বছর
              </h3>
              <Select
                value={filters.academicYearId ?? "all"}
                onValueChange={handleAcademicYearChange}
              >
                <SelectTrigger className="w-full bg-white/[0.05] border-white/[0.08] rounded-xl text-xs font-semibold text-foreground h-10 px-4 focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] transition-all">
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
            </div>
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                ক্লাস
              </h3>
              <Select
                value={filters.academicClassId ?? "all"}
                onValueChange={handleAcademicClassChange}
              >
                <SelectTrigger className="w-full bg-white/[0.05] border-white/[0.08] rounded-xl text-xs font-semibold text-foreground h-10 px-4 focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] transition-all">
                  <SelectValue placeholder="সব ক্লাস" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-xl text-foreground">
                  <SelectItem value="all" className="text-xs font-medium focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
                    সব ক্লাস
                  </SelectItem>
                  {classOptions.map((item) => (
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
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              ব্যাচ
            </h3>
            <Select
              value={filters.batchId ?? "all"}
              onValueChange={handleBatchChange}
              disabled={!filters.academicClassId}
            >
              <SelectTrigger className="w-full bg-white/[0.05] border-white/[0.08] rounded-xl text-xs font-semibold text-foreground h-10 px-4 focus:ring-1 focus:ring-[rgba(0,229,160,0.30)] transition-all disabled:opacity-50">
                <SelectValue placeholder="সব ব্যাচ" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-xl text-foreground">
                <SelectItem value="all" className="text-xs font-medium focus:bg-[rgba(0,229,160,0.08)] focus:text-primary">
                  সব ব্যাচ
                </SelectItem>
                {batchOptions.map((item) => (
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
          </div>

          {/* Sort Filter */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              সাজান
            </h3>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Sort students"
            >
              {[
                { label: "নতুন", value: "createdAt-desc" },
                { label: "পুরোনো", value: "createdAt-asc" },
                { label: "নাম (এ-জেড)", value: "name-asc" },
                { label: "নাম (জেড-এ)", value: "name-desc" },
              ].map((item) => {
                const currentSort = filters.sortBy && filters.sortOrder ? `${filters.sortBy}-${filters.sortOrder}` : "createdAt-desc";
                const isSelected = currentSort === item.value;
                return (
                  <button
                    key={item.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSortChange(item.value)}
                    className={cn(
                      "flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 border",
                      isSelected
                        ? "bg-[rgba(0,229,160,0.10)] border-[rgba(0,229,160,0.20)] text-primary font-bold shadow-inner scale-[0.98]"
                        : "bg-transparent border-white/[0.08] text-muted-foreground font-medium hover:border-white/[0.15] hover:bg-white/[0.02]",
                    )}
                  >
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter className="px-6 flex flex-row gap-3 mt-2">
          <Button
            onClick={handleResetFilters}
            variant="ghost"
            disabled={!hasActiveFilters}
            className="flex-1 h-10 rounded-2xl font-bold bg-white/[0.06] text-muted-foreground hover:bg-white/[0.1] disabled:opacity-50 transition-all border-none"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            রিসেট
          </Button>
          <DrawerClose asChild>
            <Button className="flex-[2] h-10 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 border-none">
              ফিল্টার প্রয়োগ করুন
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
