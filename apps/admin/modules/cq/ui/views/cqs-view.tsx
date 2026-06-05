"use client";

import { useState } from "react";
import {
  useCQs,
  useDeleteCQ,
  useBulkDeleteCQs,
  useUpdateCQ,
} from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { toast } from "@workspace/ui/components/sonner";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

import { CqListStat } from "../components/stat-card";
import { BulkActions, Pagination } from "../components/utils";
import { CqCard, CqCardSkeleton, type CqCardItem } from "../components/cq-card";
import { CqFilters } from "../components/cq-filters";
import { useCqFilters } from "@workspace/api-client";

export const CqsView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { openDeleteModal } = useDeleteModal();
  const [filters] = useCqFilters();

  const { data: cqsData, isLoading: isCQsLoading } = useCQs(filters);
  const { mutate: deleteCQ, isPending: isDeleting } = useDeleteCQ();
  const { mutateAsync: bulkDeleteCQs, isPending: isBulkDeleting } =
    useBulkDeleteCQs();
  const { mutateAsync: updateCQ } = useUpdateCQ();

  const cqs: CqCardItem[] = cqsData?.items ?? [];
  const total = cqsData?.meta?.total ?? 0;

  const isLoading = isDeleting || isBulkDeleting;

  const handleDelete = (id: string, questionContext: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "cq",
      entityName: questionContext ? (questionContext.slice(0, 60) + (questionContext.length > 60 ? "..." : "")) : "this CQ",
      onConfirm: (id) => {
        deleteCQ({ id });
      },
    });
  };

  const handleBulkDelete = async () => {
    await bulkDeleteCQs({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch(console.error);
  };

  return (
    <div className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10 space-y-10 text-foreground animate-in fade-in duration-700">
      {/* Header */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
        />
        <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileText size={22} />
            </div>
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-foreground font-headline">
              Creative Questions
            </h1>
          </div>
          <div className="mt-1 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary/50" />
          <p className="text-sm leading-6 text-muted-foreground max-w-lg font-medium italic opacity-70">
            Manage creative questions and bulk import them using JSON.
          </p>
        </div>

        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="
              group relative overflow-hidden
              inline-flex items-center gap-2
              font-black text-sm
              px-6 py-3 rounded-[16px]
              border-2 border-border/50 bg-background
              shadow-sm hover:bg-muted/50
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200 ease-out
              h-12
            "
          >
            <Link href="/cqs/import">
              <span className="relative">Import JSON</span>
            </Link>
          </Button>
          <Button
            asChild
            className="
              group relative overflow-hidden
              inline-flex items-center gap-2
              bg-primary
              text-primary-foreground font-black text-sm
              px-6 py-3 rounded-[16px]
              border-0
              shadow-lg shadow-primary/25
              hover:shadow-xl hover:shadow-primary/30
              hover:scale-[1.03]
              active:scale-[0.97]
              transition-all duration-200 ease-out
              h-12
            "
          >
            <Link href="/cqs/new">
              <span className="relative flex items-center justify-center rounded-lg bg-primary-foreground/20 p-0.5 text-primary-foreground">
                <Plus size={16} strokeWidth={3} />
              </span>
              <span className="relative">Create New CQ</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CqListStat />

      <div className="flex flex-col gap-10">
        {/* Filter & Actions Section */}
        <div className="space-y-6">
          <CqFilters isLoading={isLoading} />

          <BulkActions
            selectedCount={selectedIds.length}
            setSelectedIds={setSelectedIds}
            onBulkDelete={handleBulkDelete}
            isLoading={isLoading}
          />
        </div>

        {/* Cards Grid */}
        {isCQsLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CqCardSkeleton key={i} />
            ))}
          </div>
        ) : cqs.length === 0 ? (
          <div className="bg-card/80 backdrop-blur-2xl rounded-[3rem] border border-dashed border-border/60 p-20 text-center shadow-medium transition-all duration-500 hover:border-primary/30">
            <div className="size-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/10 shadow-inner group transition-transform duration-500 hover:rotate-12">
              <span className="text-5xl group-hover:scale-110 transition-transform cursor-default">
                🤔
              </span>
            </div>
            <h3 className="text-3xl font-black bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              No CQs Found
            </h3>
            <p className="text-base text-muted-foreground/80 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
              We couldn&apos;t find any CQs matching your criteria. Try
              adjusting filters or create a new entry to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {cqs.map((cq) => (
              <CqCard
                key={cq.id}
                cq={cq}
                selected={selectedIds.includes(cq.id)}
                onSelect={(id) => {
                  if (selectedIds.includes(id)) {
                    setSelectedIds(selectedIds.filter((i) => i !== id));
                  } else {
                    setSelectedIds([...selectedIds, id]);
                  }
                }}
                onDelete={() => handleDelete(cq.id, cq.context || cq.questionA)}
                onUpdate={(updatedCq) => {
                  updateCQ({ id: cq.id, data: updatedCq }).then(() => {
                    toast.success("CQ updated");
                  }).catch(() => {
                    toast.error("Failed to update CQ");
                  });
                }}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pt-2">
          <Pagination totalItem={total} />
        </div>
      </div>
    </div>
  );
};
