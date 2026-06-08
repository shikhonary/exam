"use client";

import { admissionFeeFormSchema, AdmissionFeeFormValues } from "@workspace/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useAcademicYearsForSelection, useAcademicClassesForSelection } from "@workspace/api-client";
import { Loader2 } from "lucide-react";

interface AdmissionFeeFormProps {
  initialData?: Partial<AdmissionFeeFormValues>;
  onSubmit: (data: AdmissionFeeFormValues) => void;
  isPending: boolean;
  onCancel: () => void;
}

export const AdmissionFeeForm = ({
  initialData,
  onSubmit,
  isPending,
  onCancel,
}: AdmissionFeeFormProps) => {
  const { data: academicYears, isLoading: isYearsLoading } = useAcademicYearsForSelection();
  const { data: academicClasses, isLoading: isClassesLoading } = useAcademicClassesForSelection();

  const form = useForm<AdmissionFeeFormValues>({
    resolver: zodResolver(admissionFeeFormSchema),
    defaultValues: {
      academicYearId: initialData?.academicYearId || "",
      academicClassId: initialData?.academicClassId || "",
      amount: initialData?.amount || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border-b border-white/[0.04] pb-4 flex justify-start">
          <p className="text-xs font-medium text-muted-foreground">
            <span className="text-rose-500">*</span> চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="academicYearId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-foreground tracking-widest uppercase">
                  শিক্ষাবর্ষ <span className="text-rose-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending || isYearsLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="শিক্ষাবর্ষ নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicYears?.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academicClassId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-foreground tracking-widest uppercase">
                  ক্লাস <span className="text-rose-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending || isClassesLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="ক্লাস নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicClasses?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-foreground tracking-widest uppercase">
                ফি এর পরিমাণ (৳) <span className="text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  disabled={isPending}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.04]">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.04] px-5 py-2 h-auto rounded-lg text-sm transition-all"
            disabled={isPending}
          >
            বাতিল
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="group bg-[#131B2C] hover:bg-[#1A243A] text-primary border border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] px-8 py-3 h-auto rounded-xl hover:-translate-y-1 transition-all duration-300 font-bold text-sm tracking-wide"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : null}
            সংরক্ষণ করুন
          </Button>
        </div>
      </form>
    </Form>
  );
};
