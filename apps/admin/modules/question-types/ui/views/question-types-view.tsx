"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import {
  useQuestionTypes,
  useQuestionTypeStats,
  useDeleteQuestionType,
  useToggleQuestionTypeActive,
} from "@workspace/api-client";

import { QuestionTypeTable } from "../components/question-type-table";
import { QuestionTypeStatCards } from "../components/question-type-stat-cards";
import { Filter } from "../components/filter";
import { Pagination } from "../components/pagination";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function QuestionTypesContent() {
  const { openDeleteModal } = useDeleteModal();
  const { data: questionTypesData, isLoading: isQueryLoading } = useQuestionTypes();
  const { data: stats, isLoading: isStatsLoading } = useQuestionTypeStats();

  const { mutateAsync: deleteType, isPending: isDeleting } = useDeleteQuestionType();
  const { mutateAsync: toggleActive, isPending: isToggling } = useToggleQuestionTypeActive();

  const isLoading = isQueryLoading || isDeleting || isToggling;

  const handleDelete = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "questionType",
      entityName: name,
      onConfirm: (entityId) => {
        deleteType({ id: entityId });
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
              Question Types
            </h1>
          </div>
          <div className="mt-1 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
          <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
            Manage global question types across the platform. Set up question types (e.g. MCQ, CQ, Broad Question) to categorize questions.
          </p>
        </div>

        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
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
            <Link href="/question-types/new">
              <span className="relative flex items-center justify-center rounded-lg bg-white/20 p-0.5">
                <Plus size={16} strokeWidth={3} />
              </span>
              <span className="relative">New Question Type</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-2 mb-10 animate-in fade-in zoom-in-95 duration-500">
        <QuestionTypeStatCards stats={stats} isLoading={isStatsLoading} />
      </div>

      {/* Table Area */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate animate-in slide-in-from-bottom-8 duration-700 delay-200">
        <Filter isLoading={isLoading} />
        
        <QuestionTypeTable
          questionTypes={questionTypesData?.items ?? []}
          isLoading={isLoading}
          onDelete={handleDelete}
          onToggleActive={(id) => toggleActive({ id })}
        />

        <Pagination totalItem={questionTypesData?.meta?.total ?? 0} />
      </div>
    </motion.main>
  );
}

export function QuestionTypesView() {
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
      <QuestionTypesContent />
    </div>
  );
}
