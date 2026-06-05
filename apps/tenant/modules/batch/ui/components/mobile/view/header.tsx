"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useRouter } from "next/navigation";
import { TenantTypes } from "@workspace/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useDeleteBatch, useToggleBatchActive } from "@workspace/api-client";

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
        router.push("/batches");
      },
    });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="flex items-center px-4 h-16 w-full max-w-md mx-auto justify-between">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 text-primary p-2 hover:bg-white/[0.04] transition-colors rounded-full active:scale-90"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-32 bg-white/[0.06] mb-1.5" />
                <Skeleton className="h-3 w-16 bg-white/[0.06]" />
              </>
            ) : (
              <>
                <h1 className="font-bold tracking-tight text-foreground leading-none text-base">
                  {batch?.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  ব্যাচের বিস্তারিত
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="flex items-center gap-1.5 bg-[#131B2C] hover:bg-[#1A243A] text-primary border border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.5)] font-bold text-[11px] h-9 px-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <Link href={`/batches/edit/${batch?.id}`}>
              <Edit strokeWidth={3} className="w-3.5 h-3.5 transition-transform duration-300 group-active:scale-110" />
              <span>এডিট করুন</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLoading}>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary hover:bg-white/[0.04] rounded-full h-10 w-10 focus:ring-0 outline-none transition-colors"
                disabled={isLoading}
              >
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-ambient border-white/[0.06] bg-card">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer font-medium p-3 hover:bg-white/[0.04] focus:bg-white/[0.04] rounded-lg"
                onClick={() => batch?.id && toggleActive(batch.id)}
                disabled={isLoading}
              >
                {batch?.isActive ? (
                  <>
                    <ToggleLeft size={16} className="text-amber-500" /> ডিঅ্যাক্টিভ করুন
                  </>
                ) : (
                  <>
                    <ToggleRight size={16} className="text-primary" /> অ্যাক্টিভ করুন
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer font-medium p-3 text-rose-500 focus:bg-rose-500/10 focus:text-rose-400 rounded-lg"
                onClick={() => batch?.id && batch?.name && handleDeleteBatch(batch.id, batch.name)}
                disabled={isLoading}
              >
                <Trash2 size={16} /> ডিলিট করুন
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
