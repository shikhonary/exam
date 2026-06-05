"use client";

import Link from "next/link";
import { HelpCircle, Edit, MoreHorizontal, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { cn } from "@workspace/ui/lib/utils";
import type { QuestionTypeWithCount } from "@workspace/api";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

const columns: Column<QuestionTypeWithCount>[] = [
  {
    key: "nameEn",
    header: "Question Type",
    render: (qt) => (
      <div className="flex flex-col gap-1">
        <p className="font-bold text-foreground tracking-tight text-sm leading-none">
          {qt.nameEn}
        </p>
        {qt.nameBn && (
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="text-[10px] font-medium leading-none">
              {qt.nameBn}
            </span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: "usage",
    header: "Usage",
    hideOnMobile: true,
    render: (qt) => (
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 bg-muted/30 w-fit px-2.5 py-1 rounded-lg border border-border/50">
          <span className="text-[10px] font-medium opacity-70">Subjects:</span>
          <p className="text-[11px] font-bold text-foreground leading-none">
            {qt._count?.subjects ?? 0}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-muted/30 w-fit px-2.5 py-1 rounded-lg border border-border/50">
          <span className="text-[10px] font-medium opacity-70">Questions:</span>
          <p className="text-[11px] font-bold text-foreground leading-none">
            {qt._count?.questions ?? 0}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "isActive",
    header: "Status",
    render: (qt) => <StatusBadge active={qt.isActive} />,
  },
];

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

interface QuestionTypeTableProps {
  questionTypes: QuestionTypeWithCount[];
  isLoading: boolean;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string) => void;
}

export function QuestionTypeTable({
  questionTypes,
  isLoading,
  onDelete,
  onToggleActive,
}: QuestionTypeTableProps) {
  if (isLoading && questionTypes.length === 0) {
    return (
      <div className="relative flex-grow border-t border-surface-container animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5",
                      column.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {column.header}
                  </th>
                ))}
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {columns.map((column) => {
                    if (column.key === "nameEn") {
                      return (
                        <td key={String(column.key)} className="px-4 py-4 align-middle">
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-32 bg-surface-container" />
                            <Skeleton className="h-3 w-20 bg-surface-container opacity-60" />
                          </div>
                        </td>
                      );
                    }
                    if (column.key === "usage") {
                      return (
                        <td key={String(column.key)} className="px-4 py-4 align-middle hidden md:table-cell">
                          <Skeleton className="h-6 w-32 bg-surface-container rounded-lg" />
                        </td>
                      );
                    }
                    if (column.key === "isActive") {
                      return (
                        <td key={String(column.key)} className="px-4 py-4 align-middle">
                          <Skeleton className="h-6 w-20 bg-surface-container rounded-lg" />
                        </td>
                      );
                    }
                    return null;
                  })}
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

  if (questionTypes.length === 0) {
    return (
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 p-16 text-center shadow-soft m-4">
        <div className="size-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/50">
          <HelpCircle className="size-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No Question Types Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          We couldn&apos;t find any question types matching your current filters. Try
          broadening your search parameters or create a new type.
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
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5",
                    column.hideOnMobile && "hidden md:table-cell",
                  )}
                >
                  {column.header}
                </th>
              ))}
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/5">
            {questionTypes.map((item, index) => (
              <tr
                key={item.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="hover:bg-surface-container-low/30 transition-colors group"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-4 align-middle",
                      column.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {column.render ? column.render(item) : ""}
                  </td>
                ))}
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
                        <Link href={`/question-types/${item.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span>Edit Details</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                      
                      <DropdownMenuItem
                        className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                        onClick={() => onToggleActive(item.id)}
                      >
                        {item.isActive ? (
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
                      <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-destructive/10"
                        onClick={() => onDelete(item.id, item.nameEn)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Type</span>
                      </DropdownMenuItem>
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
