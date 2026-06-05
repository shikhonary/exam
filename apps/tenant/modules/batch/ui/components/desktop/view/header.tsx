"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { TenantTypes } from "@workspace/db";
import Link from "next/link";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useDeleteBatch, useToggleBatchActive } from "@workspace/api-client";

import { Skeleton } from "@workspace/ui/components/skeleton";

interface HeaderProps {
  batch?: TenantTypes.Batch;
  isLoading?: boolean;
}

export const Header = ({ batch, isLoading }: HeaderProps) => {
  const router = useRouter();

  const { openDeleteModal } = useDeleteModal();

  const deleteMutation = useDeleteBatch();
  const toggleActiveMutation = useToggleBatchActive();

  const toggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync({ id });
  };

  const handleDeleteBatch = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "batch",
      entityName: name,
      onConfirm: (id) => {
        deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <header className="z-50 glass-header flex justify-between items-center w-full px-8 h-16">
      <div className="flex items-center gap-5">
        <button
          onClick={() => router.back()}
          className="p-2.5 hover:bg-[rgba(0,229,160,0.08)] rounded-xl transition-all group border border-transparent hover:border-[rgba(0,229,160,0.20)]"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-active:scale-90 transition-all" />
        </button>
        <div className="flex flex-col">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-48 mb-2 bg-white/[0.06]" />
              <Skeleton className="h-4 w-32 bg-white/[0.06]" />
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                {batch?.name}
              </h1>
              <div className="flex items-center gap-3 text-[13px] text-muted-foreground font-medium mt-1">
                <span>ব্যাচের বিস্তারিত ওভারভিউ এবং ম্যানেজমেন্ট</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          asChild
          className="group bg-[#131B2C] hover:bg-[#1A243A] text-primary border border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] font-bold text-sm px-5 py-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          <Link href={`/batches/edit/${batch?.id}`}>
            <Edit size={16} strokeWidth={3} className="mr-1.5 transition-transform duration-300 group-hover:scale-110" />
            <span>এডিট করুন</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary transition-all cursor-pointer rounded-lg hover:bg-white/[0.04] outline-none focus:outline-none focus:ring-0"
              disabled={isLoading}
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-card border-white/[0.06]">
            <DropdownMenuItem
              className="cursor-pointer font-medium p-2 rounded-lg hover:bg-white/[0.04] focus:bg-white/[0.04]"
              onClick={() => batch?.id && toggleActive(batch.id)}
              disabled={isLoading}
            >
              {batch?.isActive ? (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2 text-amber-500 opacity-70" />
                  ডিঅ্যাক্টিভ করুন
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4 mr-2 text-primary opacity-70" />
                  অ্যাক্টিভ করুন
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              className="cursor-pointer font-medium p-2 rounded-lg text-rose-400 focus:text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10"
              onClick={() => batch?.id && batch?.name && handleDeleteBatch(batch.id, batch.name)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2 opacity-70" />
              মুছে ফেলুন
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
