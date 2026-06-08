"use client";

import { useState } from "react";
import { Header } from "./header";
import { Stats } from "./stats";
import { Filters } from "./filters";
import { StudentTable } from "./student-table";
import { StudentGrid } from "./student-grid";
import { Pagination } from "./pagination";
import { TenantTypes } from "@workspace/db";

export type ViewMode = "table" | "grid";

interface StudentWithRelations extends TenantTypes.Student {
  batch?: {
    id: string;
    name: string;
  } | null;
}

interface StudentTableProps {
  students: StudentWithRelations[];
  isLoading: boolean;
  total: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const List = ({
  students,
  isLoading,
  total,
  onToggleActive,
  onDelete,
}: StudentTableProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="min-h-screen bg-background relative isolate">
      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <Header
          title="শিক্ষার্থী"
          description="শিক্ষার্থীদের তথ্য, ভর্তি এবং অন্যান্য বিষয়াবলী পরিচালনা করুন।"
        />

        <div className="mt-8">
          <Stats total={total} />
        </div>

        <div className="mt-12 space-y-6">
          <div className="bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden p-2">
            <Filters viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          <div className="bg-[#131B2C] border border-white/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden">
            {viewMode === "table" ? (
              <StudentTable
                students={students}
                isLoading={isLoading}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ) : (
              <div className="p-8">
                <StudentGrid
                  students={students}
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
