"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import {
  useMcqs,
  useMcqStats,
  useDeleteMcq,
} from "@workspace/api-client";

import { McqCards } from "../components/mcq-cards";
import { McqStatCards } from "../components/mcq-stat-cards";
import { Filter } from "../components/filter";
import { Pagination } from "../components/pagination";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function McqsContent() {
  const { openDeleteModal } = useDeleteModal();
  const { data: mcqsData, isLoading: isQueryLoading } = useMcqs();
  const { data: stats, isLoading: isStatsLoading } = useMcqStats();

  const { mutateAsync: deleteMcq, isPending: isDeleting } = useDeleteMcq();

  const isLoading = isQueryLoading || isDeleting;

  const handleDelete = (id: string, question: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "mcq",
      entityName: question,
      onConfirm: (entityId) => {
        deleteMcq({ id: entityId });
      },
    });
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10"
    >
      {/* Header */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
        />
        <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <HelpCircle size={22} />
            </div>
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              MCQs
            </h1>
          </div>
          <div className="mt-1 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
          <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
            Manage multiple choice questions across the platform. View and update question details.
          </p>
        </div>

        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="
              group relative overflow-hidden
              inline-flex items-center gap-2
              text-slate-700 font-bold text-sm
              px-6 py-3 rounded-[16px]
              hover:scale-[1.03]
              active:scale-[0.97]
              transition-all duration-200 ease-out
              h-12 border-slate-200 bg-white
            "
          >
            <Link href="/mcqs/import">
              <span className="relative">Import JSON</span>
            </Link>
          </Button>

          <Button
            asChild
            className="
              group relative overflow-hidden
              inline-flex items-center gap-2
              bg-gradient-to-br from-primary to-primary-container
              text-white font-black text-sm
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
            <Link href="/mcqs/new">
              <span className="relative flex items-center justify-center rounded-lg bg-white/20 p-0.5">
                <Plus size={16} strokeWidth={3} />
              </span>
              <span className="relative">New MCQ</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-2 mb-10 animate-in fade-in zoom-in-95 duration-500">
        <McqStatCards stats={stats} isLoading={isStatsLoading} />
      </div>

      {/* Cards Area */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate animate-in slide-in-from-bottom-8 duration-700 delay-200">
        <Filter isLoading={isLoading} />
        
        <McqCards
          mcqs={mcqsData?.items ?? []}
          isLoading={isLoading}
          onDelete={handleDelete}
        />

        <Pagination totalItem={mcqsData?.meta?.total ?? 0} />
      </div>
    </motion.main>
  );
}

export function McqsView() {
  return (
    <div className="min-h-screen bg-surface relative isolate">
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />
      <McqsContent />
    </div>
  );
}
