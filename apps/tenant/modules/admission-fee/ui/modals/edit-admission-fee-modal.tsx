"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { useEditAdmissionFeeModal } from "@workspace/ui/hooks/use-edit-admission-fee-modal";
import { useUpdateAdmissionFee } from "@workspace/api-client";
import { AdmissionFeeForm } from "../form/admission-fee-form";
import { AdmissionFeeFormValues } from "@workspace/schema";

export const EditAdmissionFeeModal = () => {
  const { isOpen, onClose, admissionFeeId, initialData } = useEditAdmissionFeeModal();
  const { mutateAsync, isPending } = useUpdateAdmissionFee();

  const onSubmit = async (data: AdmissionFeeFormValues) => {
    if (!admissionFeeId) return;
    
    try {
      await mutateAsync({
        id: admissionFeeId,
        ...data,
      });
      onClose();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">ভর্তি ফি সম্পাদন করুন</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            বিদ্যমান ভর্তি ফির পরিমাণ বা অন্যান্য তথ্য পরিবর্তন করুন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <AdmissionFeeForm 
            initialData={initialData}
            onSubmit={onSubmit} 
            isPending={isPending} 
            onCancel={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
