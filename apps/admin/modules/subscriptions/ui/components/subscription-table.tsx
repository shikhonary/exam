"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  Eye,
  CreditCard,
  Building2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { cn } from "@workspace/ui/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

const getStatusBadge = (status: string) => {
  const normalizedStatus = status?.toUpperCase() || "";
  const isActive = normalizedStatus === "ACTIVE";
  const isCanceled = normalizedStatus === "CANCELED";
  const isPastDue = normalizedStatus === "PAST_DUE";

  return (
    <Badge
      variant={isActive ? "default" : isCanceled ? "destructive" : "secondary"}
      className={cn(
        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all",
        isActive && "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
        isCanceled && "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
        isPastDue && "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
        !isActive && !isCanceled && !isPastDue && "bg-muted text-muted-foreground border-transparent"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full mr-1.5",
          isActive && "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse",
          isCanceled && "bg-red-500",
          isPastDue && "bg-amber-500",
          !isActive && !isCanceled && !isPastDue && "bg-muted-foreground"
        )}
      />
      {normalizedStatus}
    </Badge>
  );
};

const columns: Column<any>[] = [
  {
    key: "tenant",
    header: "Tenant",
    render: (item) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground bg-muted/30 w-fit px-2 py-0.5 rounded border border-border/50">
          <Building2 className="w-3 h-3 text-primary" />
          {item.tenant?.name || "Unknown"}
        </div>
        <p className="font-medium text-muted-foreground tracking-tight text-[10px] font-mono pl-1">
          {item.tenant?.slug}
        </p>
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan Details",
    render: (item) => (
      <div className="flex flex-col gap-1">
        <p className="font-bold text-foreground tracking-tight text-sm leading-none">
          {item.plan?.displayName || "Unknown Plan"}
        </p>
        <div className="flex items-center gap-1.5 opacity-60">
          <span className="text-[10px] font-medium leading-none uppercase tracking-wider">
            {item.billingCycle}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (item) => getStatusBadge(item.status),
  },
  {
    key: "billing",
    header: "Billing",
    hideOnMobile: true,
    render: (item) => (
      <div className="flex flex-col gap-1">
        <p className="font-bold text-foreground tracking-tight text-[11px] leading-none">
          ৳ {item.billingCycle === "yearly" ? item.pricePerYear : item.pricePerMonth}
        </p>
        {item.cancelAtPeriodEnd ? (
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-500">
            Cancels soon
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            Renews
          </div>
        )}
      </div>
    ),
  },
  {
    key: "period",
    header: "Period End",
    hideOnMobile: true,
    render: (item) => (
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted/30 w-fit px-2 py-0.5 rounded border border-border/50">
        <Calendar className="w-3 h-3" />
        {format(new Date(item.currentPeriodEnd), "MMM d, yyyy")}
      </div>
    ),
  },
];

interface SubscriptionTableProps {
  subscriptions: any[];
  isLoading: boolean;
  onCancel: (sub: any) => void;
}

export function SubscriptionTable({
  subscriptions,
  isLoading,
  onCancel,
}: SubscriptionTableProps) {
  if (isLoading && subscriptions.length === 0) {
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
                    return (
                      <td 
                        key={String(column.key)} 
                        className={cn(
                          "px-4 py-4 align-middle",
                          column.hideOnMobile && "hidden md:table-cell"
                        )}
                      >
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-24 bg-surface-container rounded-md" />
                          <Skeleton className="h-3 w-16 bg-surface-container opacity-60 rounded-md" />
                        </div>
                      </td>
                    );
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

  if (subscriptions.length === 0) {
    return (
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 p-16 text-center shadow-soft m-4">
        <div className="size-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/50">
          <CreditCard className="size-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No Subscriptions Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          We couldn&apos;t find any subscriptions matching your current filters. Try
          broadening your search parameters.
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
            {subscriptions.map((item, index) => (
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
                        <Link href={`/subscriptions/${item.id}`}>
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                        asChild
                      >
                        <Link href={`/subscriptions/${item.id}/change-plan`}>
                          <RefreshCw className="h-4 w-4" />
                          <span>Change Plan</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                        asChild
                      >
                        <Link href={`/subscriptions/${item.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span>Edit Limits</span>
                        </Link>
                      </DropdownMenuItem>

                      {item.status !== "CANCELED" && !item.cancelAtPeriodEnd && (
                        <>
                          <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-destructive/10"
                            onClick={() => onCancel(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Cancel Plan</span>
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
