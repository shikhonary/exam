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
  User,
  Fingerprint,
  Baby,
  CalendarDays,
  Type,
  Users,
  Heart,
  Languages,
  BookOpen,
  Building,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { CitizenApplicationFormValues } from "@workspace/schema";
import { FormCalendar } from "@workspace/ui/shared/form-calendar";
import {
  GENDER,
  MARITAL_STATUS,
  RELIGION,
  RESIDENT_STATUS,
} from "@workspace/utils";

interface IdentityStepProps {
  form: UseFormReturn<CitizenApplicationFormValues>;
}

export const IdentityStep = ({ form }: IdentityStepProps) => {
  return (
    <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            Personal Identity
          </h2>
          <p className="text-sm text-on-surface-variant font-medium italic">
            Primary identification and demographic details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Bangla Fields Column */}
        <div className="space-y-6">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Languages className="w-3 h-3" /> Bangla Documentation
            </p>
          </div>

          <FormField
            control={form.control}
            name="fullNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Type className="w-3.5 h-3.5" /> পূর্ণ নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="উদা: মোঃ আব্দুর রহমান"
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
            name="fatherNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Users className="w-3.5 h-3.5" /> পিতার নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="পিতার নাম লিখুন"
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
            name="motherNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Users className="w-3.5 h-3.5" /> মাতার নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="মাতার নাম লিখুন"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* English Fields Column */}
        <div className="space-y-6">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Type className="w-3 h-3" /> English Documentation
            </p>
          </div>

          <FormField
            control={form.control}
            name="fullNameEn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Type className="w-3.5 h-3.5" /> Full Name (English)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Md. Abdur Rahman"
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
            name="fatherNameEn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Users className="w-3.5 h-3.5" /> Father&apos;s Name (English)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter father's name"
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
            name="motherNameEn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Users className="w-3.5 h-3.5" /> Mother&apos;s Name (English)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter mother's name"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ID and Demographic Info */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-100 mt-4">
          <FormField
            control={form.control}
            name="nid"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Fingerprint className="w-3.5 h-3.5" /> NID Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="10 or 17 digits"
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
            name="birthRegistrationNo"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Baby className="w-3.5 h-3.5" /> Birth Reg. No
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="17 digits"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormCalendar
            name="dateOfBirth"
            label="Date of Birth"
            icon={CalendarDays}
            className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full"
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-8">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Users className="w-3.5 h-3.5" /> Gender
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {Object.values(GENDER).map((v) => (
                      <SelectItem key={v} value={v} className="font-bold">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <BookOpen className="w-3.5 h-3.5" /> Religion
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {Object.values(RELIGION).map((v) => (
                      <SelectItem key={v} value={v} className="font-bold">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Heart className="w-3.5 h-3.5" /> Marital Status
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {Object.values(MARITAL_STATUS).map((v) => (
                      <SelectItem key={v} value={v} className="font-bold">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="residentStatus"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Building className="w-3.5 h-3.5" /> Resident Status
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {Object.values(RESIDENT_STATUS).map((v) => (
                      <SelectItem key={v} value={v} className="font-bold">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Briefcase className="w-3.5 h-3.5" /> Occupation
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Service, Farmer"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full"
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
            name="educationalQualification"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <GraduationCap className="w-3.5 h-3.5" /> Educational Qualification
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., SSC, HSC, Honours"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </section>
  );
};
