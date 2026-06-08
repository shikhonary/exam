"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { useEditMonthlyFeeModal } from "@workspace/ui/hooks/use-edit-monthly-fee-modal";
import { useUpdateMonthlyFee } from "@workspace/api-client";
import { MonthlyFeeForm } from "../form/monthly-fee-form";
import { MonthlyFeeFormValues } from "@workspace/schema";

export const EditMonthlyFeeModal = () => {
  const { isOpen, onClose, monthlyFeeId, initialData } = useEditMonthlyFeeModal();
  const { mutateAsync, isPending } = useUpdateMonthlyFee();

  const onSubmit = async (data: MonthlyFeeFormValues) => {
    if (!monthlyFeeId) return;
    
    try {
      await mutateAsync({
        id: monthlyFeeId,
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
          <DialogTitle className="text-xl font-bold">মাসিক ফি সম্পাদন করুন</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            বিদ্যমান মাসিক ফির পরিমাণ বা অন্যান্য তথ্য পরিবর্তন করুন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <MonthlyFeeForm 
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
