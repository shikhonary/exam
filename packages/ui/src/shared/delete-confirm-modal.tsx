"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "../components/sonner";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { DeleteEntityType, useDeleteModal } from "../hooks/use-delete";

const entityLabels: Record<
  DeleteEntityType,
  { singular: string; icon: string }
> = {
  user: { singular: "ব্যবহারকারী", icon: "👤" },
  subject: { singular: "বিষয়", icon: "📚" },
  chapter: { singular: "অধ্যায়", icon: "📖" },
  class: { singular: "ক্লাস", icon: "🏷️" },
  topic: { singular: "টপিক", icon: "🎓" },
  subtopic: { singular: "সাবটপিক", icon: "🎓" },
  mcq: { singular: "MCQ", icon: "❓" },
  tenant: { singular: "প্রতিষ্ঠান", icon: "🏢" },
  subscriptionPlan: { singular: "সাবস্ক্রিপশন প্ল্যান", icon: "📦" },
  subscription: { singular: "সাবস্ক্রিপশন", icon: "📦" },
  academicClass: { singular: "একাডেমিক ক্লাস", icon: "🏷️" },
  academicYear: { singular: "একাডেমিক বছর", icon: "📅" },
  batch: { singular: "ব্যাচ", icon: "🎓" },
  counter: { singular: "কাউন্টার", icon: "🔢" },
  admissionFee: { singular: "ভর্তি ফি", icon: "💰" },
  monthlyFee: { singular: "মাসিক ফি", icon: "💰" },
  student: { singular: "শিক্ষার্থী", icon: "📚" },
  ward: { singular: "ওয়ার্ড", icon: "🏫" },
  village: { singular: "গ্রাম", icon: "🏡" },
  assessment: { singular: "মূল্যায়ন", icon: "📄" },
  citizenApplication: { singular: "আবেদন", icon: "📄" },
  fiscalYear: { singular: "অর্থবছর", icon: "📅" },
  category: { singular: "ক্যাটাগরি", icon: "📁" },
  "trade-license-application": { singular: "আবেদন", icon: "📄" },
};

export function DeleteConfirmModal() {
  const {
    isOpen,
    entityId,
    entityType,
    entityName,
    onConfirmCallback,
    closeDeleteModal,
  } = useDeleteModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const entityInfo = (entityType && entityLabels[entityType])
    ? entityLabels[entityType]
    : { singular: "আইটেম", icon: "📦" };

  const handleDelete = async () => {
    if (!entityId) return;

    setIsDeleting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (onConfirmCallback) {
        onConfirmCallback(entityId);
      }

      setTimeout(() => {
        closeDeleteModal();
      }, 300);
    } catch {
      toast.error("Failed to delete", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      closeDeleteModal();
    }
  };

  return (
    <AlertDialog open={isOpen && !!entityId} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md bg-[#131B2C] border border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-2xl">
        <AlertDialogHeader className="space-y-4">
          {/* Icon Header */}
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
          </div>

          <AlertDialogTitle className="text-center text-xl font-bold tracking-tight text-foreground">
            {entityInfo.singular} মুছে ফেলবেন?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center space-y-2 flex flex-col items-center">
            {entityName ? (
              <>
                <span className="text-muted-foreground font-medium">আপনি এটি মুছে ফেলতে যাচ্ছেন:</span>
                <span className="flex items-center justify-center gap-2 py-2 px-4 bg-white/[0.04] border border-white/[0.02] rounded-xl shadow-sm mt-2">
                  <span className="text-lg">{entityInfo.icon}</span>
                  <span className="font-bold text-foreground truncate max-w-[200px]">
                    {entityName}
                  </span>
                </span>
              </>
            ) : (
              <span className="text-muted-foreground font-medium">
                আপনি এই {entityInfo.singular} মুছে ফেলতে যাচ্ছেন।
              </span>
            )}
            <span className="text-rose-400 text-[11px] font-bold pt-2 uppercase tracking-wider block">
              এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-3 mt-6 sm:justify-center">
          <Button
            variant="outline"
            onClick={() => closeDeleteModal()}
            disabled={isDeleting}
            className="flex-1 bg-white/[0.04] border-white/[0.06] text-foreground hover:bg-white/[0.08] hover:text-foreground font-bold rounded-xl"
          >
            <X className="w-4 h-4 mr-2" />
            বাতিল করুন
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ backgroundColor: "#e11d48", color: "white", border: "none" }}
            className={cn(
              "flex-1 gap-2 font-bold rounded-xl shadow-[0_4px_15px_rgba(225,29,72,0.3)] hover:opacity-90 transition-opacity",
              isDeleting && "opacity-80",
            )}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                মুছে ফেলা হচ্ছে...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                মুছে ফেলুন
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
