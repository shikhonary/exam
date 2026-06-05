"use client";

import { useBatches } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteBatch, useToggleBatchActive } from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

export const BatchesView = () => {
  const { openDeleteModal } = useDeleteModal();

  const { data: batches, isLoading: isQueryLoading } = useBatches();

  const deleteMutation = useDeleteBatch();
  const toggleActiveMutation = useToggleBatchActive();

  const isLoading = isQueryLoading;

  const batchItems = batches?.items || [];
  const total = batches?.total || batchItems.length;

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
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <List
          batches={batches?.items ?? []}
          isLoading={isLoading}
          total={total}
          onToggleActive={toggleActive}
          onDelete={handleDeleteBatch}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileList
          isLoading={isLoading}
          batches={batches?.items ?? []}
          total={total}
          onToggleActive={toggleActive}
          onDelete={handleDeleteBatch}
        />
      </div>
    </>
  );
};
