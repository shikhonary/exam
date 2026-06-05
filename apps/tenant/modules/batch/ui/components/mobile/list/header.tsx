"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Layers } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { useDebounceCallback } from "@workspace/ui/hooks/use-debounce";
import { useBatchFilters } from "@workspace/api-client/filters";
import { Filters } from "./filters";

export const Header = () => {
  const [filters, setFilters] = useBatchFilters();
  const [search, setSearch] = useState(filters.search ?? "");
  
  const debouncedSetFilters = useDebounceCallback((value: string) => {
    setFilters({ search: value || null, page: 1 });
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSetFilters(value);
  };

  // Sync external search changes (e.g. from desktop view or clear button)
  useEffect(() => {
    setSearch(filters.search ?? "");
  }, [filters.search]);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/[0.06]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[rgba(0,229,160,0.15)] flex items-center justify-center text-primary border border-[rgba(0,229,160,0.20)]">
              <Layers className="w-5 h-5" />
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
          </div>

          <div className="min-w-0">
            <h1 className="text-[15px] font-bold tracking-tight text-foreground leading-none truncate">
              একাডেমিক ব্যাচ
            </h1>
            <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[200px]">
              একাডেমিক গ্রুপ, শিক্ষার্থীর ভর্তি এবং সেমিস্টার জুড়ে ব্যাচের পারফরম্যান্স পরিচালনা করুন।
            </p>
          </div>
        </div>

        {/* Add button */}
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <Button
            asChild
            className="
              flex items-center gap-1.5
              bg-[#131B2C] hover:bg-[#1A243A] text-primary border border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.5)]
              font-bold text-[11px] h-9 px-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 group
            "
          >
            <Link href="/batches/new">
              <Plus strokeWidth={3} className="w-3.5 h-3.5 transition-transform duration-300 group-active:rotate-90 group-active:scale-110" />
              <span>নতুন যোগ করুন</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Search + Filter row */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
          <Input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="রেকর্ড খুঁজুন..."
            className="
              w-full h-10 pl-9 pr-8
              bg-white/[0.04] border border-white/[0.08]
              rounded-xl text-sm text-foreground
              placeholder:text-muted-foreground
              focus-visible:ring-1 focus-visible:ring-[rgba(0,229,160,0.30)]
              focus-visible:border-[rgba(0,229,160,0.30)]
              transition-colors
              [&::-webkit-search-cancel-button]:hidden
            "
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

        <div className="flex-shrink-0">
          <Filters />
        </div>
      </div>

      {search && (
        <div className="px-4 pb-3 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[11px] text-muted-foreground">ফলাফল:</span>
          <span className="inline-flex items-center gap-1 bg-[rgba(0,229,160,0.08)] text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[rgba(0,229,160,0.20)] max-w-[160px] truncate">
            {search}
          </span>
        </div>
      )}
    </header>
  );
};
