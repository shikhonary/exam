"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  MoreVertical,
  Edit,
  Trash2,
  Power,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { TenantTypes } from "@workspace/db";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface VillageTableProps {
  villages: (TenantTypes.Village & {
    ward?: { name: string; displayName: string };
  })[];
  isLoading: boolean;
  onToggleActive: (id: string) => void;
  onEdit: (village: TenantTypes.Village & { ward?: { name: string; displayName: string } }) => void;
  onDelete: (id: string, name: string) => void;
}

export function VillageTable({
  villages,
  isLoading,
  onToggleActive,
  onEdit,
  onDelete,
}: VillageTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest border-t border-outline/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-outline/5 h-14">
              <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-widest pl-6">
                Village Details
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">
                Ward Information
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">
                Created Date
              </TableHead>
              <TableHead className="w-[100px] text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="h-16 border-outline/5">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl bg-surface-container-low" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-surface-container-low" />
                      <Skeleton className="h-3 w-20 bg-surface-container-low" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-surface-container-low" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-lg bg-surface-container-low" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28 bg-surface-container-low" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Skeleton className="h-8 w-8 rounded-lg ml-auto bg-surface-container-low" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (villages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-surface-container-lowest border-t border-outline/5">
        <div className="w-20 h-20 rounded-[32px] bg-primary/5 flex items-center justify-center mb-6 border border-primary/5">
          <Building2 className="w-10 h-10 text-primary/20" />
        </div>
        <h3 className="text-xl font-black text-on-surface tracking-tight">
          No Villages Found
        </h3>
        <p className="text-on-surface-variant font-medium text-sm mt-2 max-w-[300px] text-center leading-relaxed italic">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border-t border-outline/5 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-outline/5 h-14">
            <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-widest pl-6">
              Village Details
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">
              Ward Information
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">
              Status
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">
              Created Date
            </TableHead>
            <TableHead className="w-[100px] text-right pr-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {villages.map((village) => (
            <TableRow
              key={village.id}
              className="group hover:bg-surface-container-low/50 border-outline/5 transition-all duration-300 h-16"
            >
              <TableCell className="pl-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/5 group-hover:scale-110 transition-all duration-500 shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-on-surface tracking-tight text-sm truncate">
                      {village.name}
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest truncate">
                      {village.displayName}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-black text-on-surface-variant tracking-tight">
                    {village.ward?.name || "N/A"}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border transition-all duration-500",
                    village.isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm"
                      : "bg-slate-50 text-slate-400 border-slate-100",
                  )}
                >
                  {village.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2 text-on-surface-variant/60">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold tracking-tight italic">
                    {format(new Date(village.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-right pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 p-1 rounded-2xl border-outline/5 shadow-2xl bg-white"
                  >
                    <DropdownMenuItem
                      onClick={() => onEdit(village)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggleActive(village.id)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                    >
                      <Power className="w-4 h-4" />
                      {village.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(village.id, village.name)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Village
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
