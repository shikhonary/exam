"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { useCreateMonthlyFeeModal } from "@workspace/ui/hooks/use-create-monthly-fee-modal";
import { useCreateMonthlyFee } from "@workspace/api-client";
import { MonthlyFeeForm } from "../form/monthly-fee-form";
import { MonthlyFeeFormValues } from "@workspace/schema";

export const CreateMonthlyFeeModal = () => {
  const { isOpen, onClose } = useCreateMonthlyFeeModal();
  const { mutateAsync, isPending } = useCreateMonthlyFee();

  const onSubmit = async (data: MonthlyFeeFormValues) => {
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
          <DialogTitle className="text-xl font-bold">নতুন মাসিক ফি</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            নির্দিষ্ট ক্লাস এবং শিক্ষাবর্ষের জন্য একটি নতুন মাসিক ফি নির্ধারণ করুন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <MonthlyFeeForm 
            onSubmit={onSubmit} 
            isPending={isPending} 
            onCancel={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
