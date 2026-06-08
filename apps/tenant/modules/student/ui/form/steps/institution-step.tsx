"use client";

import React from "react";
import { useFormContext } from "@workspace/ui/components/form";
import { StudentFormValues } from "@workspace/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { groupOptions, shiftOptions } from "@workspace/utils/constants";

export function InstitutionStep() {
  const { control } = useFormContext<StudentFormValues>();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.04]">
        <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,160,0.1)] flex items-center justify-center text-primary">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">প্রাতিষ্ঠানিক তথ্য</h2>
          <p className="text-xs text-muted-foreground">শিক্ষার্থীর স্কুল/কলেজ এবং রোল নম্বর</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="institute"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">প্রতিষ্ঠানের নাম <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="স্কুল/কলেজের নাম" className="h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl px-4" />
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="shift"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">শিফট (ঐচ্ছিক)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                    <SelectValue placeholder="শিফট নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {shiftOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer">
                      {s.labelBn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="section"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">শাখা (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="উদা: A" className="h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl px-4" />
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="group"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">গ্রুপ (ঐচ্ছিক)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                    <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {groupOptions.map((g) => (
                    <SelectItem key={g.value} value={g.value} className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer">
                      {g.labelBn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="roll"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">রোল নম্বর <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="উদা: 01" className="h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl px-4" />
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
}
