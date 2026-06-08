"use client";

import {
  ArrowUpDown,
  Download,
  Plus,
  Search,
  Upload,
  X,
  Activity,
  RotateCcw,
  CreditCard,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
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
  ACTIVE_STATUS,
  activeBooleanStatusOptions,
  ACTIVE_BOOLEAN_STATUS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  tenantTypeOptions,
  TENANT_TYPE,
} from "@workspace/utils";
import { useTenantFilters, useSubscriptionPlansForSelection } from "@workspace/api-client";

import { useDebounce } from "@workspace/ui/hooks/use-debounce";

interface FilterProps {
  isLoading: boolean;
}

export const Filter = ({ isLoading }: FilterProps) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useTenantFilters();
  const { data: subscriptionPlansData } = useSubscriptionPlansForSelection();
  const debounceValue = useDebounce(search, 500);

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

  const handleFilterTypeChange = (value: TENANT_TYPE | null) => {
    setFilters({
      ...filters,
      type: value,
      page: 1,
    });
  };

  const handleFilterPlanChange = (value: string | null) => {
    setFilters({
      ...filters,
      planId: value,
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

  const DEFAULT_SORT_BY = "createdAt";
  const DEFAULT_SORT_ORDER = "desc";

  const hasActiveFilters =
    filters.isActive !== null ||
    filters.type !== null ||
    filters.planId !== null ||
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
      type: null,
      planId: null,
    });
  };

  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case "name-asc":
        return "Name (A-Z)";
      case "name-desc":
        return "Name (Z-A)";
      case "createdAt-asc":
        return "Oldest First";
      case "createdAt-desc":
      default:
        return "Newest First";
    }
  };

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
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={filters.type || "all"}
              onValueChange={(val) =>
                handleFilterTypeChange(val === "all" ? null : (val as TENANT_TYPE))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <Users size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="all" className="font-bold">
                  All Types
                </SelectItem>
                {tenantTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="font-bold"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40">
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

          {/* Plan Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={filters.planId || "all"}
              onValueChange={(val) =>
                handleFilterPlanChange(val === "all" ? null : val)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <CreditCard size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Plans" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="all" className="font-bold">
                  All Plans
                </SelectItem>
                {subscriptionPlansData?.map((plan) => (
                  <SelectItem
                    key={plan.id}
                    value={plan.id}
                    className="font-bold"
                  >
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={currentSort || "createdAt-desc"}
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
                <SelectItem value="name-asc" className="font-bold">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc" className="font-bold">Name (Z-A)</SelectItem>
                <SelectItem value="createdAt-desc" className="font-bold">Newest First</SelectItem>
                <SelectItem value="createdAt-asc" className="font-bold">Oldest First</SelectItem>
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
              {filters.type !== null && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Type:</span>
                  <span className="font-bold text-[11px]">{tenantTypeOptions.find(o => o.value === filters.type)?.label || filters.type}</span>
                  <button onClick={() => setFilters({ ...filters, type: null })} className="hover:text-rose-500 transition-colors ml-1">
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}
              {filters.planId !== null && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">Plan:</span>
                  <span className="font-bold text-[11px]">{subscriptionPlansData?.find(p => p.id === filters.planId)?.name || filters.planId}</span>
                  <button onClick={() => setFilters({ ...filters, planId: null })} className="hover:text-rose-500 transition-colors ml-1">
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
              {currentSort && currentSort !== "createdAt-desc" && (
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
