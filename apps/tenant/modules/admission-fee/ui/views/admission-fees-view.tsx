"use client";

import { useAdmissionFees, useDeleteAdmissionFee } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { CreateAdmissionFeeModal } from "../modals/create-admission-fee-modal";
import { EditAdmissionFeeModal } from "../modals/edit-admission-fee-modal";
import { useEditAdmissionFeeModal } from "@workspace/ui/hooks/use-edit-admission-fee-modal";
import { RouterOutput } from "@workspace/api";

type AdmissionFee = RouterOutput["admissionFee"]["list"]["data"]["items"][number];

export const AdmissionFeesView = () => {
  const { openDeleteModal } = useDeleteModal();
  const { onOpen: openEditModal } = useEditAdmissionFeeModal();

  const { data: feesData, isLoading } = useAdmissionFees();
  const deleteMutation = useDeleteAdmissionFee();

  const fees = feesData?.items || [];
  const total = feesData?.total || fees.length;

  const handleEdit = (fee: AdmissionFee) => {
    openEditModal(fee.id, {
      academicYearId: fee.academicYearId,
      academicClassId: fee.academicClassId,
      amount: fee.amount,
    });
  };

  const handleDelete = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "admission-fee",
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

      <CreateAdmissionFeeModal />
      <EditAdmissionFeeModal />
    </>
  );
};
