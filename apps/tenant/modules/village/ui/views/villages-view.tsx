"use client";

import { useVillages, useCreateVillage, useUpdateVillage, useDeleteVillage, useToggleVillageActive } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useCreateVillageModal, useEditVillageModal } from "@workspace/ui/hooks/use-village-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { VillageForm } from "../components/desktop/modal/village-form";
import { Plus, Save } from "lucide-react";

export const VillagesView = () => {
  const { openDeleteModal } = useDeleteModal();
  const createModal = useCreateVillageModal();
  const editModal = useEditVillageModal();

  const { data: villages, isLoading } = useVillages();

  const createMutation = useCreateVillage();
  const updateMutation = useUpdateVillage();
  const deleteMutation = useDeleteVillage();
  const toggleActiveMutation = useToggleVillageActive();

  const villageItems = villages?.data?.items || [];
  const total = villages?.data?.total || 0;

  const toggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync(id);
  };

  const handleDeleteVillage = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "village",
      entityName: name,
      onConfirm: (id) => {
        deleteMutation.mutateAsync(id);
      },
    });
  };

  return (
    <>
      <List
        villages={villageItems as any}
        isLoading={isLoading}
        total={total}
        onToggleActive={toggleActive}
        onEdit={editModal.onOpen}
        onDelete={handleDeleteVillage}
        onAdd={createModal.onOpen}
      />

      {/* Create Village Modal */}
      <Dialog open={createModal.isOpen} onOpenChange={createModal.onClose}>
        <DialogContent className="max-w-md bg-white border-none p-6 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" strokeWidth={3} />
              </div>
              Create New Village
            </DialogTitle>
          </DialogHeader>
          <VillageForm
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

      {/* Edit Village Modal */}
      <Dialog open={editModal.isOpen} onOpenChange={editModal.onClose}>
        <DialogContent className="max-w-md bg-white border-none p-6 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Save className="w-4 h-4 text-primary" />
              </div>
              Edit Village Details
            </DialogTitle>
          </DialogHeader>
          <VillageForm
            mode="edit"
            initialData={editModal.village || undefined}
            isLoading={updateMutation.isPending}
            onSubmit={async (values) => {
              if (editModal.village) {
                await updateMutation.mutateAsync({ id: editModal.village.id, ...values });
                editModal.onClose();
              }
            }}
            onCancel={editModal.onClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
