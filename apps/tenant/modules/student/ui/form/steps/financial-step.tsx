"use client";

import React, { useEffect, useState } from "react";
import { useTRPC } from "@workspace/api-client";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "@workspace/ui/components/form";
import { StudentFormValues } from "@workspace/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Banknote, CreditCard, Activity, Lock, LockOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";

export function FinancialStep() {
  const { control, watch, setValue } = useFormContext<StudentFormValues>();
  const [isFeeLocked, setIsFeeLocked] = useState(true);

  const academicYearId = watch("academicYearId");
  const academicClassId = watch("academicClassId");

  const trpc = useTRPC();

  const { data: admissionFees } = useQuery({
    ...trpc.admissionFee.list.queryOptions({ academicYearId, academicClassId, limit: 1 }),
    enabled: !!academicYearId && !!academicClassId,
  });

  const { data: monthlyFees } = useQuery({
    ...trpc.monthlyFee.list.queryOptions({ academicYearId, academicClassId, limit: 1 }),
    enabled: !!academicYearId && !!academicClassId,
  });

  const hasFeeFromServer = !!(admissionFees?.data?.items?.[0] || monthlyFees?.data?.items?.[0]);

  useEffect(() => {
    if (admissionFees?.data?.items?.[0]) {
      setValue("admissionFee", admissionFees.data.items[0].amount);
    }
  }, [admissionFees, setValue]);

  useEffect(() => {
    if (monthlyFees?.data?.items?.[0]) {
      setValue("monthlyFee", monthlyFees.data.items[0].amount);
    }
  }, [monthlyFees, setValue]);

  // When server data arrives, lock the fields again
  useEffect(() => {
    if (hasFeeFromServer) setIsFeeLocked(true);
  }, [hasFeeFromServer]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,160,0.1)] flex items-center justify-center text-primary">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">ফি ও অন্যান্য</h2>
            <p className="text-xs text-muted-foreground">শিক্ষার্থীর ফি, এবং প্রোফাইল স্ট্যাটাস</p>
          </div>
        </div>

        {hasFeeFromServer && (
          <button
            type="button"
            onClick={() => setIsFeeLocked((prev) => !prev)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border",
              isFeeLocked
                ? "bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground"
                : "bg-[rgba(0,229,160,0.08)] border-primary/30 text-primary hover:bg-[rgba(0,229,160,0.12)]"
            )}
          >
            {isFeeLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                সম্পাদনা করুন
              </>
            ) : (
              <>
                <LockOpen className="w-3.5 h-3.5" />
                লক করুন
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="admissionFee"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">ভর্তি ফি (৳) <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="0"
                    readOnly={isFeeLocked && hasFeeFromServer}
                    className={cn(
                      "pl-9 h-12 border-transparent text-foreground placeholder:text-muted-foreground rounded-xl transition-all",
                      isFeeLocked && hasFeeFromServer
                        ? "bg-white/[0.01] text-muted-foreground cursor-not-allowed focus-visible:ring-0"
                        : "bg-white/[0.02] focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04]"
                    )}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="monthlyFee"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">মাসিক ফি (৳) <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="0"
                    readOnly={isFeeLocked && hasFeeFromServer}
                    className={cn(
                      "pl-9 h-12 border-transparent text-foreground placeholder:text-muted-foreground rounded-xl transition-all",
                      isFeeLocked && hasFeeFromServer
                        ? "bg-white/[0.01] text-muted-foreground cursor-not-allowed focus-visible:ring-0"
                        : "bg-white/[0.02] focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04]"
                    )}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-5 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:bg-white/[0.04] transition-colors md:col-span-2 mt-4">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    field.value
                      ? "bg-[rgba(0,229,160,0.1)] text-primary"
                      : "bg-white/[0.06] text-muted-foreground",
                  )}
                >
                  <Activity className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <FormLabel className="text-base font-bold text-foreground cursor-pointer">
                    {field.value ? "অ্যাক্টিভ শিক্ষার্থী" : "ইনঅ্যাক্টিভ শিক্ষার্থী"}
                  </FormLabel>
                  <FormDescription className="text-xs text-muted-foreground max-w-sm">
                    এটি চালু থাকলে শিক্ষার্থীর প্রোফাইলটি সরাসরি অ্যাক্টিভ হবে।
                  </FormDescription>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
}

