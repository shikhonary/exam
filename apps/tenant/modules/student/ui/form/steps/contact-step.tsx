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
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function ContactStep() {
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
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">যোগাযোগ ও ঠিকানা</h2>
          <p className="text-xs text-muted-foreground">শিক্ষার্থীর সাথে যোগাযোগের মাধ্যম এবং ঠিকানার বিবরণ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="primaryPhone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">প্রাথমিক ফোন নম্বর <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input {...field} placeholder="01XXX-XXXXXX" className="pl-9 h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl" />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="secondaryPhone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">বিকল্প ফোন নম্বর (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                  <Input {...field} placeholder="01XXX-XXXXXX" className="pl-9 h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl" />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">ইমেইল ঠিকানা (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input {...field} type="email" placeholder="student@example.com" className="pl-9 h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl" />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="presentAddress"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">বর্তমান ঠিকানা <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                  <textarea
                    {...field}
                    placeholder="বর্তমান ঠিকানা বিস্তারিত লিখুন"
                    className="w-full min-h-[100px] pl-9 py-3 rounded-xl bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground text-sm focus:outline-none resize-none transition-colors"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="permanentAddress"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">স্থায়ী ঠিকানা <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-4 h-4 text-muted-foreground opacity-50" />
                  <textarea
                    {...field}
                    placeholder="স্থায়ী ঠিকানা বিস্তারিত লিখুন"
                    className="w-full min-h-[100px] pl-9 py-3 rounded-xl bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground text-sm focus:outline-none resize-none transition-colors"
                  />
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
