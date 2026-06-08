"use client";

import {
  useCreateFiscalYear,
  useUpdateFiscalYear,
  useFiscalYears,
  useDeleteFiscalYear,
  useSetCurrentFiscalYear,
} from "@workspace/api-client";
import { FiscalYearTable } from "../components/desktop/list/fiscal-year-table";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import {
  useCreateFiscalYearModal,
  useEditFiscalYearModal,
} from "@workspace/ui/hooks/use-fiscal-year-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { FiscalYearForm } from "../components/desktop/modal/fiscal-year-form";
import { Plus, Save, Calendar } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Stats } from "../components/desktop/list/stats";
import { FiscalYearFilters } from "../components/desktop/list/fiscal-year-filters";
import { FiscalYearPagination } from "../components/desktop/list/fiscal-year-pagination";

export const FiscalYearsView = () => {
  const { openDeleteModal } = useDeleteModal();
  const createModal = useCreateFiscalYearModal();
  const editModal = useEditFiscalYearModal();

  const { data, isLoading } = useFiscalYears();

  const createMutation = useCreateFiscalYear();
  const updateMutation = useUpdateFiscalYear();
  const deleteMutation = useDeleteFiscalYear();
  const setCurrentMutation = useSetCurrentFiscalYear();

  const fyItems = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const handleSetCurrent = async (id: string) => {
    await setCurrentMutation.mutateAsync({ id });
  };

  const handleDelete = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "fiscalYear",
      entityName: name,
      onConfirm: (id) => {
        deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <div className="hidden md:block min-h-screen bg-surface relative isolate">
      {/* Background blobs for depth */}
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
          />

          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              অর্থবছর ব্যবস্থাপনা
            </h1>

            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />

            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              ইউনিয়ন পরিষদের প্রশাসনিক কার্যক্রম, ট্যাক্স এসেসমেন্ট ও আর্থিক প্রতিবেদনের জন্য অর্থবছর পরিচালনা করুন।
            </p>
          </div>

          <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Button
              onClick={createModal.onOpen}
              className="
                group relative overflow-hidden
                inline-flex items-center gap-2
                bg-gradient-to-br from-primary to-primary-container
                text-white font-black text-sm
                px-6 py-3 rounded-2xl
                border-0
                shadow-lg shadow-primary/25
                hover:shadow-xl hover:shadow-primary/30
                hover:scale-[1.03]
                active:scale-[0.97]
                transition-all duration-200 ease-out
                h-auto
              "
            >
              <span className="relative flex items-center justify-center rounded-lg bg-white/20 p-0.5">
                <Plus size={16} strokeWidth={3} />
              </span>
              <span className="relative">নতুন অর্থবছর</span>
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Stats />
        </div>

        {/* Table Container */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate">
          <FiscalYearFilters />

          <FiscalYearTable
            fiscalYears={fyItems as any}
            isLoading={isLoading}
            onEdit={editModal.onOpen}
            onDelete={handleDelete}
            onSetCurrent={handleSetCurrent}
          />

          <FiscalYearPagination total={total} />
        </div>
      </main>


      {/* Create Modal */}
      <Dialog open={createModal.isOpen} onOpenChange={createModal.onClose}>
        <DialogContent className="max-w-lg bg-white border-none p-8 rounded-[40px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-11 h-11 rounded-[20px] bg-primary/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" strokeWidth={3} />
              </div>
              নতুন অর্থবছর তৈরি করুন
            </DialogTitle>
          </DialogHeader>
          <FiscalYearForm
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

      {/* Edit Modal */}
      <Dialog open={editModal.isOpen} onOpenChange={editModal.onClose}>
        <DialogContent className="max-w-lg bg-white border-none p-8 rounded-[40px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-11 h-11 rounded-[20px] bg-primary/10 flex items-center justify-center">
                <Save className="w-5 h-5 text-primary" strokeWidth={3} />
              </div>
              অর্থবছর তথ্য আপডেট করুন
            </DialogTitle>
          </DialogHeader>
          <FiscalYearForm
            mode="edit"
            initialData={editModal.fiscalYear || undefined}
            isLoading={updateMutation.isPending}
            onSubmit={async (values) => {
              if (editModal.fiscalYear) {
                await updateMutation.mutateAsync({
                  id: editModal.fiscalYear.id,
                  ...values,
                });
                editModal.onClose();
              }
            }}
            onCancel={editModal.onClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
