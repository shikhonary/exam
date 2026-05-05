"use client";

import { UseFormReturn } from "@workspace/ui/components/form";
import { Search, CheckCircle2 } from "lucide-react";
import { CitizenApplicationFormValues } from "@workspace/schema";
import { format } from "date-fns";

interface ReviewStepProps {
  form: UseFormReturn<CitizenApplicationFormValues>;
}

export const ReviewStep = ({ form }: ReviewStepProps) => {
  const values = form.getValues();

  return (
    <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            Review Application
          </h2>
          <p className="text-sm text-on-surface-variant font-medium italic">
            Please verify all details before final submission
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Personal Information</h3>
            <div className="space-y-4 bg-surface-container-low/50 rounded-3xl p-6 border border-outline/5">
              <ReviewItem label="Name (BN)" value={values.fullNameBn} />
              <ReviewItem label="Name (EN)" value={values.fullNameEn} />
              <ReviewItem label="Father's Name" value={values.fatherNameBn} />
              <ReviewItem label="Mother's Name" value={values.motherNameBn} />
              <ReviewItem label="NID" value={values.nid} />
              <ReviewItem label="Date of Birth" value={values.dateOfBirth ? format(new Date(values.dateOfBirth), "PPP") : "N/A"} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Contact & Address</h3>
            <div className="space-y-4 bg-surface-container-low/50 rounded-3xl p-6 border border-outline/5">
              <ReviewItem label="Mobile" value={values.mobile} />
              <ReviewItem label="Village" value={values.presentVillageBn} />
              <ReviewItem label="Ward No" value={values.presentWardNo?.toString()} />
              <ReviewItem label="Post Office" value={values.presentPostOffice} />
              <ReviewItem label="Upazila" value={values.presentUpazila} />
              <ReviewItem label="District" value={values.presentDistrict} />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 p-6 bg-primary/5 rounded-[24px] border border-primary/10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface tracking-tight">Final Confirmation</p>
            <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
              By submitting this application, you certify that all information provided is accurate to the best of your knowledge. This data will be used for official records upon approval.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider opacity-60">{label}</span>
    <span className="text-sm font-bold text-on-surface">{value || "—"}</span>
  </div>
);
