"use client";

import { useMonthlyFees, useDeleteMonthlyFee } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { CreateMonthlyFeeModal } from "../modals/create-monthly-fee-modal";
import { EditMonthlyFeeModal } from "../modals/edit-monthly-fee-modal";
import { useEditMonthlyFeeModal } from "@workspace/ui/hooks/use-edit-monthly-fee-modal";
import { RouterOutput } from "@workspace/api";

type MonthlyFee = RouterOutput["monthlyFee"]["list"]["data"]["items"][number];

export const MonthlyFeesView = () => {
  const { openDeleteModal } = useDeleteModal();
  const { onOpen: openEditModal } = useEditMonthlyFeeModal();

  const { data: feesData, isLoading } = useMonthlyFees();
  const deleteMutation = useDeleteMonthlyFee();

  const fees = feesData?.items || [];
  const total = feesData?.total || fees.length;

  const handleEdit = (fee: MonthlyFee) => {
    openEditModal(fee.id, {
      academicYearId: fee.academicYearId,
      academicClassId: fee.academicClassId,
      amount: fee.amount,
    });
  };

  const handleDelete = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "monthlyFee",
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

      <CreateMonthlyFeeModal />
      <EditMonthlyFeeModal />
    </>
  );
};
