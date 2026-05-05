"use client";

import { useVillages, useVillageStats } from "@workspace/api-client";
import { Stats } from "./stats";
import { Filters } from "./filters";
import { VillageTable } from "./village-table";
import { Pagination } from "./pagination";
import { Header } from "./header";
import { useState } from "react";
import { TenantTypes } from "@workspace/db";
import { Building2 } from "lucide-react";

interface ListProps {
  villages: (TenantTypes.Village & {
    ward?: { name: string; displayName: string };
  })[];
  isLoading: boolean;
  total: number;
  onToggleActive: (id: string) => void;
  onEdit: (village: TenantTypes.Village & { ward?: { name: string; displayName: string } }) => void;
  onDelete: (id: string, name: string) => void;
  onAdd: () => void;
}

export function List({
  villages,
  isLoading,
  total,
  onToggleActive,
  onEdit,
  onDelete,
  onAdd,
}: ListProps) {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Background Ambience */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <Header
        title="Village Management"
        subtitle="Organize and monitor villages within your Union Parishad jurisdiction."
        count={total}
        onAdd={onAdd}
        addLabel="Add Village"
        icon={<Building2 className="w-5 h-5" />}
      />

      <div className="px-8 pb-8 space-y-6 flex-grow">
        <Stats />

        <div className="bg-surface-container-lowest rounded-[32px] border border-outline/10 shadow-ambient-double overflow-hidden flex flex-col min-h-[500px]">
          <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className="flex-grow">
            <VillageTable
              villages={villages}
              isLoading={isLoading}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>

          <div className="mt-auto border-t border-outline/5">
            <Pagination total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
