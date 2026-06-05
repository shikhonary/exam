"use client";

import { useState } from "react";
import { Header } from "./header";
import { Stats } from "./stats";
import { Filters } from "./filters";
import { BatchTable } from "./batch-table";
import { BatchGrid } from "./batch-grid";
import { Pagination } from "./pagination";
import { TenantTypes } from "@workspace/db";

export type ViewMode = "table" | "grid";

interface BatchWithRelations extends TenantTypes.Batch {
  _count: {
    students: number;
  };
}

interface BatchTableProps {
  batches: BatchWithRelations[];
  isLoading: boolean;
  total: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const List = ({
  batches,
  isLoading,
  total,
  onToggleActive,
  onDelete,
}: BatchTableProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="min-h-screen bg-background relative isolate">
      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <Header
          title="একাডেমিক ব্যাচ"
          description="একাডেমিক গ্রুপ, শিক্ষার্থীর ভর্তি এবং সেমিস্টার জুড়ে ব্যাচের পারফরম্যান্স পরিচালনা করুন।"
        />

        <div className="mt-8">
          <Stats />
        </div>

        <div className="mt-12 space-y-6">
          <div className="bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden p-2">
            <Filters viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          <div className="bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden">
            {viewMode === "table" ? (
              <BatchTable
                batches={batches}
                isLoading={isLoading}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ) : (
              <div className="p-8">
                <BatchGrid
                  batches={batches}
                  isLoading={isLoading}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
          
          <div className="bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden p-2">
            <Pagination total={total} />
          </div>
        </div>

      </main>
    </div>
  );
};
