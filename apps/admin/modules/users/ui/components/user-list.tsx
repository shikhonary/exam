"use client";

import React from "react";
import {
  Edit,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UsersRound,
  ShieldAlert,
  User,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { cn } from "@workspace/ui/lib/utils";

import { useUsers } from "@workspace/api-client";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  _count: {
    tenants: number;
    memberships: number;
  };
}

const columns: Column<UserListItem>[] = [
  {
    key: "name",
    header: "User Details",
    render: (user) => (
      <div className="flex flex-col gap-1">
        <p className="font-bold text-foreground tracking-tight text-sm leading-none">
          {user.name}
        </p>
        <div className="flex items-center gap-1.5 opacity-60">
          <span className="text-[11px] leading-none">
            {user.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    hideOnMobile: true,
    render: (user) => (
      <RoleBadge role={user.role} />
    ),
  },
  {
    key: "memberships",
    header: "Memberships",
    hideOnMobile: true,
    render: (user) => (
      <div className="flex items-center gap-2 bg-muted/30 w-fit px-2.5 py-1 rounded-lg border border-border/50">
        <UsersRound className="w-3.5 h-3.5 text-primary" />
        <p className="text-[11px] font-bold text-foreground leading-none">
          {user._count.memberships}
        </p>
      </div>
    ),
  },
  {
    key: "isActive",
    header: "Status",
    render: (user) => (
      <StatusBadge active={user.isActive} />
    ),
  },
];

interface UserListProps {
  onToggleStatus: (id: string) => Promise<void>;
  isLoading: boolean;
  handleDelete: (id: string, name: string) => void;
  onChangeRole: (id: string, currentRole: string, name: string) => void;
}

function RoleBadge({ role }: { role: string }) {
  const isSpecial = role === "ADMIN";
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold text-[10px] uppercase tracking-wider rounded-md h-6",
        isSpecial 
          ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
          : "bg-primary/5 text-primary border-primary/20"
      )}
    >
      {isSpecial ? (
        <ShieldAlert className="w-3 h-3 mr-1.5" />
      ) : (
        <User className="w-3 h-3 mr-1.5" />
      )}
      {role}
    </Badge>
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

export function UserList({
  onToggleStatus,
  isLoading,
  handleDelete,
  onChangeRole,
}: UserListProps) {
  const { data: usersData, isLoading: isQueryLoading } = useUsers();

  if (isQueryLoading) {
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
                    if (column.key === 'name') {
                      return (
                        <td key={String(column.key)} className="px-4 py-4 align-middle">
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-32 bg-surface-container" />
                            <Skeleton className="h-3 w-40 bg-surface-container opacity-60" />
                          </div>
                        </td>
                      )
                    }
                    if (column.key === 'role') {
                      return (
                        <td key={String(column.key)} className="px-4 py-4 align-middle hidden md:table-cell">
                          <Skeleton className="h-6 w-20 bg-surface-container rounded-md" />
                        </td>
                      )
                    }
                    if (column.key === 'memberships') {
                      return (
                        <td key={String(column.key)} className="px-4 py-4 align-middle hidden md:table-cell">
                           <Skeleton className="h-6 w-12 bg-surface-container rounded-lg" />
                        </td>
                      )
                    }
                    if (column.key === 'isActive') {
                      return (
                        <td key={String(column.key)} className={cn("px-4 py-4 align-middle", column.hideOnMobile && "hidden md:table-cell")}>
                          <Skeleton className="h-6 w-20 bg-surface-container rounded-lg" />
                        </td>
                      )
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

  if (!usersData?.items?.length) {
    return (
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 p-16 text-center shadow-soft">
        <div className="size-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/50">
          <UsersRound className="size-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No Users Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          We couldn&apos;t find any users matching your current filters. Try
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
          {usersData?.items.map((item: any, index: number) => (
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
                    className="w-48 bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl z-50 rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                      onClick={() => onChangeRole(item.id, item.role, item.name)}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      <span>Change Role</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                      onClick={() =>
                        onToggleStatus(item.id)
                      }
                    >
                      {item.isActive ? (
                        <>
                          <ToggleLeft className="h-4 w-4 text-amber-500" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4 text-green-500" />
                          <span>Activate</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-destructive/10"
                      onClick={() => handleDelete(item.id, item.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
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
