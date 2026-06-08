"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { useCreateAdmissionFeeModal } from "@workspace/ui/hooks/use-create-admission-fee-modal";
import { useCreateAdmissionFee } from "@workspace/api-client";
import { AdmissionFeeForm } from "../form/admission-fee-form";
import { AdmissionFeeFormValues } from "@workspace/schema";

export const CreateAdmissionFeeModal = () => {
  const { isOpen, onClose } = useCreateAdmissionFeeModal();
  const { mutateAsync, isPending } = useCreateAdmissionFee();

  const onSubmit = async (data: AdmissionFeeFormValues) => {
    try {
      await mutateAsync(data);
      onClose();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">নতুন ভর্তি ফি</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            নির্দিষ্ট ক্লাস এবং শিক্ষাবর্ষের জন্য একটি নতুন ভর্তি ফি নির্ধারণ করুন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <AdmissionFeeForm 
            onSubmit={onSubmit} 
            isPending={isPending} 
            onCancel={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
