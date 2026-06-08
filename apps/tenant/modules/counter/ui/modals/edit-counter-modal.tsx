"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { useEditCounterModal } from "@workspace/ui/hooks/use-edit-counter-modal";
import { useUpdateCounter } from "@workspace/api-client";
import { CounterForm } from "../form/counter-form";
import { CounterFormValues } from "@workspace/schema";

export const EditCounterModal = () => {
  const { isOpen, onClose, counterId, initialData } = useEditCounterModal();
  const { mutateAsync, isPending } = useUpdateCounter();

  const onSubmit = async (data: CounterFormValues) => {
    if (!counterId) return;
    
    try {
      await mutateAsync({
        id: counterId,
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
          <DialogTitle className="text-xl font-bold">কাউন্টার সম্পাদন করুন</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            বিদ্যমান কাউন্টারর পরিমাণ বা অন্যান্য তথ্য পরিবর্তন করুন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <CounterForm 
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
