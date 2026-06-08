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
import {
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useBatchByYearClassId,
  useNextStudentId,
} from "@workspace/api-client";
import { BookOpen, Hash, GraduationCap, Layers } from "lucide-react";
import { motion } from "framer-motion";

export function AcademicStep() {
  const { control, watch, setValue } = useFormContext<StudentFormValues>();
  
  const { data: classes } = useAcademicClassesForSelection();
  const { data: years } = useAcademicYearsForSelection();

  const academicYearId = watch("academicYearId");
  const academicClassId = watch("academicClassId");

  const { data: batches } = useBatchByYearClassId(academicYearId, academicClassId);
  const { data: nextStudentId } = useNextStudentId(academicYearId, academicClassId);

  React.useEffect(() => {
    if (nextStudentId) {
      setValue("studentId", nextStudentId, { shouldValidate: true, shouldDirty: true });
    }
  }, [nextStudentId, setValue]);

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
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">একাডেমিক তথ্য</h2>
          <p className="text-xs text-muted-foreground">শিক্ষার্থীর ক্লাস, ব্যাচ ও অন্যান্য একাডেমিক তথ্য</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="academicYearId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">শিক্ষাবর্ষ <span className="text-rose-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                    <SelectValue placeholder="শিক্ষাবর্ষ নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {years?.map((year) => (
                    <SelectItem key={year.id} value={year.id} className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer">
                      {year.label}
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
          name="academicClassId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">ক্লাস <span className="text-rose-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4 relative pl-9">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <SelectValue placeholder="ক্লাস নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {classes?.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer">
                      {c.nameBn}
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
          name="batchId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">ব্যাচ <span className="text-rose-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined} disabled={!academicYearId || !academicClassId}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4 relative pl-9 disabled:opacity-50">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <SelectValue placeholder="ব্যাচ নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                  {batches?.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer">
                      {b.name}
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
          name="studentId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">স্টুডেন্ট আইডি <span className="text-rose-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input {...field} value={field.value || ""} readOnly placeholder="উদা: STU-2023-001" className="pl-9 h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl opacity-70 cursor-not-allowed" />
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
