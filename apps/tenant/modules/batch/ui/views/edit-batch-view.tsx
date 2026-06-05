"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useBatchById } from "@workspace/api-client";
import { BatchEditForm } from "../form/batch-edit-form";

interface EditBatchViewProps {
  batchId: string;
}

export const EditBatchView = ({ batchId }: EditBatchViewProps) => {
  const { data: batch } = useBatchById(batchId);

  if (!batch) return null;

  return (
    <>
      <main className="min-h-screen w-full">
        <div className="py-6 max-w-3xl mx-auto px-4 md:px-8">
          {/* Breadcrumb and Title Section */}
          <div>
            <Link
              href="/batches"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-white/[0.04] border border-white/[0.08] transition-all group mb-2 w-fit px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">
                পিছনে ফিরে যান
              </span>
            </Link>
            <div className="flex flex-col gap-1 border-none shadow-none">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                ব্যাচ সম্পাদনা
              </h2>
              <p className="text-muted-foreground text-sm">
                ব্যাচের তথ্য, আসন সংখ্যা এবং অবস্থা পরিবর্তন করুন।
              </p>
            </div>
          </div>
        </div>
        <BatchEditForm batch={batch} />
      </main>
    </>
  );
};
