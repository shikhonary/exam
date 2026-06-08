"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { useCreateCounterModal } from "@workspace/ui/hooks/use-create-counter-modal";
import { useCreateCounter } from "@workspace/api-client";
import { CounterForm } from "../form/counter-form";
import { CounterFormValues } from "@workspace/schema";

export const CreateCounterModal = () => {
  const { isOpen, onClose } = useCreateCounterModal();
  const { mutateAsync, isPending } = useCreateCounter();

  const onSubmit = async (data: CounterFormValues) => {
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
          <DialogTitle className="text-xl font-bold">নতুন কাউন্টার</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            নির্দিষ্ট ক্লাস এবং শিক্ষাবর্ষের জন্য একটি নতুন কাউন্টার নির্ধারণ করুন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <CounterForm 
            onSubmit={onSubmit} 
            isPending={isPending} 
            onCancel={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
