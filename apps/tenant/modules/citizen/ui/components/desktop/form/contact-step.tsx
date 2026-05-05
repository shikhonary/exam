"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import {
  Phone,
  Mail,
  Clipboard,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { CitizenApplicationFormValues } from "@workspace/schema";

interface ContactStepProps {
  form: UseFormReturn<CitizenApplicationFormValues>;
}

export const ContactStep = ({ form }: ContactStepProps) => {
  return (
    <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
          <Phone className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            Contact & Communication
          </h2>
          <p className="text-sm text-on-surface-variant font-medium italic">
            Mobile, email and optional remarks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                <Phone className="w-3.5 h-3.5" /> Mobile Number <span className="text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 01712345678"
                  className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g., citizen@example.com"
                  className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commentsBn"
          render={({ field }) => (
            <FormItem className="md:col-span-2 space-y-2 pt-2">
              <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                <Clipboard className="w-3.5 h-3.5" /> অতিরিক্ত মন্তব্য (বাংলা)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="যেকোনো প্রয়োজনীয় তথ্য লিখুন"
                  className="h-14 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};
