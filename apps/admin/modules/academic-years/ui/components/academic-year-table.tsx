"use client";

import { format } from "date-fns";
import { Check, Edit, MoreHorizontal, ShieldAlert, Trash, ToggleLeft, ToggleRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { AcademicYearWithRelations } from "@workspace/api";
import { cn } from "@workspace/ui/lib/utils";

interface AcademicYearTableProps {
  years: AcademicYearWithRelations[];
  isLoading: boolean;
  onDelete: (id: string, label: string) => void;
  onSetCurrent: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function AcademicYearTable({
  years,
  isLoading,
  onDelete,
  onSetCurrent,
  onToggleActive,
}: AcademicYearTableProps) {
  if (isLoading && years.length === 0) {
    return (
      <div className="relative flex-grow border-t border-surface-container animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">Year</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 hidden md:table-cell">Duration</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 hidden lg:table-cell">Sessions</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 hidden xl:table-cell">Usage</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">Status</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">Current</th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32 bg-surface-container" />
                      <Skeleton className="h-3 w-20 bg-surface-container opacity-60" />
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle hidden md:table-cell">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24 bg-surface-container" />
                      <Skeleton className="h-3 w-28 bg-surface-container opacity-60" />
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle hidden lg:table-cell">
                    <Skeleton className="h-6 w-8 bg-surface-container rounded-md" />
                  </td>
                  <td className="px-4 py-4 align-middle hidden xl:table-cell">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-20 bg-surface-container opacity-60" />
                      <Skeleton className="h-3 w-20 bg-surface-container opacity-60" />
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <Skeleton className="h-6 w-20 bg-surface-container rounded-lg" />
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <Skeleton className="h-6 w-20 bg-surface-container rounded-lg" />
                  </td>
                  <td className="px-4 py-4 text-right align-middle">
                    <div className="flex justify-end">
                      <Skeleton className="w-10 h-10 rounded-xl bg-surface-container" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (years.length === 0) {
    return (
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 p-16 text-center shadow-soft m-4">
        <div className="size-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/50">
          <ShieldAlert className="size-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No Academic Years Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          We couldn't find any academic years matching your current filters. Try
          broadening your search parameters or create a new year.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-grow border-t border-surface-container animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">Year</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 hidden md:table-cell">Duration</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 hidden lg:table-cell">Sessions</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 hidden xl:table-cell">Usage</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">Status</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">Current</th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/5">
            {years.map((year, index) => (
              <tr
                key={year.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className={cn(
                  "hover:bg-surface-container-low/30 transition-colors group",
                  year.isCurrent && "bg-primary/5"
                )}
              >
                <td className="px-4 py-4 align-middle">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/academic-years/${year.id}`}
                      className="font-bold text-foreground tracking-tight text-sm leading-none hover:text-primary transition-colors"
                    >
                      {year.label}
                    </Link>
                    <div className="flex items-center gap-1.5 opacity-60">
                      <span className="text-[10px] font-medium leading-none">
                        {year.slug}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 align-middle hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-foreground leading-none">
                      {format(new Date(year.startDate), "MMM d, yyyy")}
                    </span>
                    <span className="text-[10px] font-medium leading-none opacity-60">
                      to {format(new Date(year.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 align-middle hidden lg:table-cell">
                  <Badge variant="outline" className="font-mono bg-surface text-on-surface-variant h-6">
                    {year.sessions?.length || 0}
                  </Badge>
                </td>

                <td className="px-4 py-4 align-middle hidden xl:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-muted/30 w-fit px-2 py-0.5 rounded border border-border/50">
                      <span className="text-[10px] font-bold text-foreground leading-none">
                        {year._count?.tenants || 0} Tenants
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/30 w-fit px-2 py-0.5 rounded border border-border/50">
                      <span className="text-[10px] font-bold text-foreground leading-none">
                        {year._count?.questionPapers || 0} Exams
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 align-middle">
                  <StatusBadge active={year.isActive} />
                </td>

                <td className="px-4 py-4 align-middle">
                  {year.isCurrent ? (
                    <Badge className="bg-primary text-white border-0 shadow-sm text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                      <Check className="w-3 h-3 mr-1" strokeWidth={3} />
                      Current
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] font-black uppercase tracking-widest px-3 border-outline/20 text-on-surface-variant hover:text-primary hover:border-primary/30 rounded-lg bg-surface"
                      onClick={() => onSetCurrent(year.id)}
                      disabled={isLoading || !year.isActive}
                    >
                      Set Current
                    </Button>
                  )}
                </td>

                <td className="px-4 py-4 text-right align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                        disabled={isLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl z-50 rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                        asChild
                      >
                        <Link href={`/academic-years/${year.id}`}>
                          <Edit className="h-4 w-4" />
                          <span>Edit Details</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                      
                      <DropdownMenuItem
                        className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                        onClick={() => onToggleActive(year.id)}
                        disabled={year.isCurrent}
                      >
                        {year.isActive ? (
                          <>
                            <ToggleLeft className="h-4 w-4 text-amber-500" />
                            <span>Mark Inactive</span>
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4 text-green-500" />
                            <span>Mark Active</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      {!year.isCurrent && (
                        <>
                          <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-destructive/10"
                            onClick={() => onDelete(year.id, year.label)}
                            disabled={isLoading || (year._count?.tenants ?? 0) > 0}
                          >
                            <Trash className="h-4 w-4" />
                            <span>Delete Year</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={cn(
        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all",
        active
          ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
          : "bg-muted text-muted-foreground border-transparent",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.4)]",
          active ? "bg-green-500 animate-pulse" : "bg-muted-foreground",
        )}
      />
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}
