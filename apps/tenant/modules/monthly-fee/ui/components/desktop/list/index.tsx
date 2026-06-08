"use client";

import { useState } from "react";
import { Header } from "./header";
import { Filters } from "./filters";
import { FeeTable } from "./fee-table";
import { FeeGrid } from "./fee-grid";
import { Pagination } from "./pagination";
import { RouterOutput } from "@workspace/api";

type MonthlyFee = RouterOutput["monthlyFee"]["list"]["data"]["items"][number];

interface ListProps {
  fees: MonthlyFee[];
  isLoading: boolean;
  total: number;
  onEdit: (fee: MonthlyFee) => void;
  onDelete: (id: string, name: string) => void;
}

export type ViewMode = "table" | "grid";

export const List = ({ fees, isLoading, total, onEdit, onDelete }: ListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="min-h-screen bg-background relative isolate">
      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <Header
          title="মাসিক ফি"
          description="শিক্ষার্থীদের জন্য মাসিক ফি নির্ধারণ ও পরিচালনা করুন।"
        />

        <div className="mt-12 space-y-6">
          <div className="bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden p-2">
            <Filters viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          <div className="bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden">
            {viewMode === "table" ? (
              <FeeTable
                fees={fees}
                isLoading={isLoading}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ) : (
              <FeeGrid
                fees={fees}
                isLoading={isLoading}
                onEdit={onEdit}
                onDelete={onDelete}
              />
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
