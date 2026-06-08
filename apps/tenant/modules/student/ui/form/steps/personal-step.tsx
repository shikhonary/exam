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
import { User, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { 
  nationalityOptions,
  genderOptions,
  religionOptions,
  bloodGroupOptions
} from "@workspace/utils/constants";

export function PersonalStep() {
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
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">ব্যক্তিগত তথ্য</h2>
          <p className="text-xs text-muted-foreground">শিক্ষার্থীর সাধারণ এবং পারিবারিক তথ্য</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">শিক্ষার্থীর পূর্ণ নাম <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input {...field} placeholder="শিক্ষার্থীর নাম লিখুন" className="pl-9 h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl" />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fatherName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">পিতার নাম <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="পিতার নাম লিখুন" className="h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl px-4" />
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="motherName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">মাতার নাম <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="মাতার নাম লিখুন" className="h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl px-4" />
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">লিঙ্গ <span className="text-rose-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                    <SelectValue placeholder="নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {genderOptions.map((g) => (
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
          name="religion"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">ধর্ম <span className="text-rose-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                    <SelectValue placeholder="নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {religionOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer">
                      {r.labelBn}
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
          name="bloodGroup"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">রক্তের গ্রুপ (ঐচ্ছিক)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                    <SelectValue placeholder="নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {bloodGroupOptions.map((bg) => (
                    <SelectItem key={bg.value} value={bg.value} className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer">
                      {bg.labelBn}
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
          name="nationality"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">জাতীয়তা <span className="text-rose-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                    <SelectValue placeholder="জাতীয়তা নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {nationalityOptions.map((n) => (
                    <SelectItem key={n.value} value={n.value} className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer">
                      {n.labelBn}
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
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">ছবির URL (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input {...field} placeholder="https://example.com/image.jpg" className="pl-9 h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl" />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
}
