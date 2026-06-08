"use client";

import React from "react";
import {
  fiscalYearFormSchema,
  type FiscalYearFormValues,
} from "@workspace/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import {
  Activity,
  Calendar as CalendarIcon,
  CalendarDays,
  Loader2,
  Plus,
  Save,
  Star,
  X,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { enToBnNumber } from "@workspace/utils";


interface FiscalYearFormProps {
  initialData?: Partial<FiscalYearFormValues>;
  onSubmit: (values: FiscalYearFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export const FiscalYearForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: FiscalYearFormProps) => {
  const form = useForm<FiscalYearFormValues>({
    resolver: zodResolver(fiscalYearFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      nameBn: initialData?.nameBn || "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      isCurrent: initialData?.isCurrent ?? false,
      isActive: initialData?.isActive ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                  অর্থবছর (EN)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 2023-2024"
                    {...field}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      // Sync to Bengali field
                      form.setValue("nameBn", enToBnNumber(val), {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameBn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-primary" />
                  অর্থবছর (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="যেমন: ২০২৩-২০২৪"
                    {...field}
                    onChange={(e) => {
                      const converted = enToBnNumber(e.target.value);
                      field.onChange(converted);
                    }}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>


        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  শুরুর তারিখ
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-left justify-start transition-all hover:bg-slate-100",
                          !field.value && "text-slate-400 font-normal"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {field.value ? (
                          enToBnNumber(format(field.value, "dd MMMM, yyyy", { locale: bn }))
                        ) : (
                          <span>তারিখ নির্বাচন করুন</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-outline/10 shadow-ambient" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  শেষের তারিখ
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-left justify-start transition-all hover:bg-slate-100",
                          !field.value && "text-slate-400 font-normal"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {field.value ? (
                          enToBnNumber(format(field.value, "dd MMMM, yyyy", { locale: bn }))
                        ) : (
                          <span>তারিখ নির্বাচন করুন</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-outline/10 shadow-ambient" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>


        <div className="space-y-3">
          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl group/toggle transition-all hover:bg-primary/10">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                      field.value
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-400"
                    )}
                  >
                    <Star
                      className={cn("w-5 h-5", field.value && "scale-110 fill-current")}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-black text-slate-700 leading-none cursor-pointer">
                      বর্তমান অর্থবছর
                    </FormLabel>
                    <p className="text-[10px] text-slate-400 font-bold leading-none">
                      সিস্টেমের ডিফল্ট অর্থবছর হিসেবে সেট করুন
                    </p>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-primary"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group/toggle transition-all hover:bg-slate-100/50">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                      field.value
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200 text-slate-400"
                    )}
                  >
                    <Activity
                      className={cn("w-5 h-5", field.value && "scale-110")}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-black text-slate-700 leading-none cursor-pointer">
                      সক্রিয় অবস্থা
                    </FormLabel>
                    <p className="text-[10px] text-slate-400 font-bold leading-none">
                      লেনদেন বা এসেসমেন্টের জন্য সচল রাখুন
                    </p>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-2 h-12 px-6 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50 border-none transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            বাতিল
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-md shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 border-none"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="w-4 h-4" strokeWidth={3} />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "create" ? "তৈরি করুন" : "সংরক্ষণ করুন"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
