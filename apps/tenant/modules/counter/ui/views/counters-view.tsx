"use client";

import { useCounters, useDeleteCounter } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { CreateCounterModal } from "../modals/create-counter-modal";
import { EditCounterModal } from "../modals/edit-counter-modal";
import { useEditCounterModal } from "@workspace/ui/hooks/use-edit-counter-modal";
import { RouterOutput } from "@workspace/api";

type Counter = RouterOutput["counter"]["list"]["data"]["items"][number];

export const CountersView = () => {
  const { openDeleteModal } = useDeleteModal();
  const { onOpen: openEditModal } = useEditCounterModal();

  const { data: feesData, isLoading } = useCounters();
  const deleteMutation = useDeleteCounter();

  const fees = feesData?.items || [];
  const total = feesData?.total || fees.length;

  const handleEdit = (fee: Counter) => {
    openEditModal(fee.id, {
      academicYearId: fee.academicYearId,
      type: fee.type,
      value: fee.value,
    });
  };

  const handleDelete = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "counter",
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
          fees={fees}
          isLoading={isLoading}
          total={total}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileList
          isLoading={isLoading}
          fees={fees}
          total={total}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CreateCounterModal />
      <EditCounterModal />
    </>
  );
};
