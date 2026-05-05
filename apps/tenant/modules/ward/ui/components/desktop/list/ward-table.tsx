"use client";

import {
  Edit,
  MapPin,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TenantTypes } from "@workspace/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface WardTableProps {
  wards: TenantTypes.Ward[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onEdit: (ward: TenantTypes.Ward) => void;
  onDelete: (id: string, name: string) => void;
}

export const WardTable = ({
  wards,
  isLoading,
  onEdit,
  onDelete,
}: WardTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest overflow-hidden border-t border-outline/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                  Ward Name
                </th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                  Display Name
                </th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                  Status
                </th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl bg-surface-container-low" />
                      <Skeleton className="h-5 w-32 bg-surface-container-low" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-5 w-40 bg-surface-container-low" />
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-6 w-16 bg-surface-container-low rounded-full" />
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex justify-end">
                      <Skeleton className="w-10 h-10 rounded-xl bg-surface-container-low" />
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

  if (wards.length === 0) {
    return (
      <div className="bg-surface-container-lowest py-20 flex flex-col items-center justify-center text-center space-y-4 border-t border-outline/5">
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-on-surface-variant/30">
          <MapPin size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-on-surface tracking-tight">
            No wards found
          </h3>
          <p className="text-on-surface-variant/70 max-w-xs mx-auto text-sm leading-relaxed font-medium italic">
            There are no wards matching your criteria. Try adjusting your
            filters or add a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest overflow-hidden animate-in fade-in zoom-in-95 duration-500 border-t border-outline/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                Ward Name
              </th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                Display Name
              </th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                Status
              </th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/5">
            {wards.map((ward, index) => (
              <tr
                key={ward.id}
                className="hover:bg-surface-container-low/30 transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center transition-colors group-hover:bg-surface-container-lowest text-primary shadow-sm",
                      )}
                    >
                      <MapPin size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-base font-black text-on-surface tracking-tight">
                      {ward.name}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="text-sm font-bold text-on-surface-variant">
                    {ward.displayName}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                      ward.isActive
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-100",
                    )}
                  >
                    {ward.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-on-surface-variant/40 hover:text-primary transition-all cursor-pointer rounded-xl hover:bg-primary/5 outline-none focus:outline-none focus:ring-0"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl border-outline/10 shadow-ambient">
                        <DropdownMenuItem 
                          onClick={() => onEdit(ward)}
                          className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-2.5 px-3 rounded-lg"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit Ward
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-outline/5" />
                        <DropdownMenuItem
                          className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-bold py-2.5 px-3 rounded-lg"
                          onClick={() => onDelete(ward.id, ward.name)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Ward
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
