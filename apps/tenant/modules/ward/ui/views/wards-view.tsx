"use client";

import { useCreateWard, useUpdateWard, useWards } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { useDeleteWard, useToggleWardActive } from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useCreateWardModal, useEditWardModal } from "@workspace/ui/hooks/use-ward-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { WardForm } from "../components/desktop/modal/ward-form";
import { Plus, Save } from "lucide-react";

export const WardsView = () => {
  const { openDeleteModal } = useDeleteModal();
  const createModal = useCreateWardModal();
  const editModal = useEditWardModal();

  const { data: wards, isLoading } = useWards();

  const createMutation = useCreateWard();
  const updateMutation = useUpdateWard();
  const deleteMutation = useDeleteWard();
  const toggleActiveMutation = useToggleWardActive();

  const wardItems = wards?.data?.items || [];
  const total = wards?.data?.total || 0;

  const toggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync({ id });
  };

  const handleDeleteWard = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "ward",
      entityName: name,
      onConfirm: (id) => {
        deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <>
      <List
        wards={wardItems}
        isLoading={isLoading}
        total={total}
        onToggleActive={toggleActive}
        onEdit={editModal.onOpen}
        onDelete={handleDeleteWard}
        onAdd={createModal.onOpen}
      />

      {/* Create Ward Modal */}
      <Dialog open={createModal.isOpen} onOpenChange={createModal.onClose}>
        <DialogContent className="max-w-md bg-white border-none p-6 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" strokeWidth={3} />
              </div>
              Create New Ward
            </DialogTitle>
          </DialogHeader>
          <WardForm
            mode="create"
            isLoading={createMutation.isPending}
            onSubmit={async (values) => {
              await createMutation.mutateAsync(values);
              createModal.onClose();
            }}
            onCancel={createModal.onClose}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Ward Modal */}
      <Dialog open={editModal.isOpen} onOpenChange={editModal.onClose}>
        <DialogContent className="max-w-md bg-white border-none p-6 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Save className="w-4 h-4 text-primary" />
              </div>
              Edit Ward Details
            </DialogTitle>
          </DialogHeader>
          <WardForm
            mode="edit"
            initialData={editModal.ward || undefined}
            isLoading={updateMutation.isPending}
            onSubmit={async (values) => {
              if (editModal.ward) {
                await updateMutation.mutateAsync({ id: editModal.ward.id, ...values });
                editModal.onClose();
              }
            }}
            onCancel={editModal.onClose}
          />
        </DialogContent>
      </Dialog>

      {/* Floating Background Decorative Elements */}
      <div className="fixed top-[20%] -left-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] -right-16 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
    </>
  );
};
