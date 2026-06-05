"use client";

import {
  useForm,
  zodResolver,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Activity,
  Group,
  School,
  Calendar as CalendarIcon,
  PlusCircle,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { batchFormSchema, BatchFormValues } from "@workspace/schema";
import {
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useUpdateBatch,
} from "@workspace/api-client";
import { useEffect } from "react";
import { TenantTypes } from "@workspace/db";

interface EditBatchFormProps {
  batch: TenantTypes.Batch;
}

export const EditBatchForm = ({ batch }: EditBatchFormProps) => {
  const router = useRouter();

  const { mutateAsync: updateBatch, isPending } = useUpdateBatch();
  const { data: academicClasses } = useAcademicClassesForSelection();
  const { data: academicYears } = useAcademicYearsForSelection();

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      name: batch.name,
      academicClassId: batch.academicClassId,
      academicYearId: batch.academicYearId,
      capacity: batch.capacity,
      isActive: batch.isActive,
    },
  });

  const watchAll = form.watch();

  // Sync academicYear string when academicYearId changes
  useEffect(() => {
    if (watchAll.academicYearId && academicYears) {
      const selectedYear = academicYears.find(
        (y) => y.id === watchAll.academicYearId,
      );
      if (selectedYear) {
        form.setValue("academicYear", selectedYear.label, { shouldValidate: true });
      }
    }
  }, [watchAll.academicYearId, academicYears, form]);

  async function onSubmit(values: BatchFormValues) {
    try {
      await updateBatch({ id: batch.id, ...values });
      router.push("/batches");
    } catch (error: any) {
      if (error?.message?.includes("ইতিমধ্যে বিদ্যমান")) {
        form.setError("name", {
          type: "server",
          message: error.message,
        });
      }
      // Error is handled in the hook's onError
      console.error(error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4 md:px-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Form Validation Errors:", errors);
          })}
          className="bg-[#131B2C] rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02] animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
        >
          <div className="border-b border-white/[0.04] pb-4 mb-6 flex justify-start">
            <p className="text-xs font-medium text-muted-foreground">
              <span className="text-rose-500">*</span> চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে
            </p>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">
                    ব্যাচের নাম <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="উদাঃ ব্যাচ ক-১"
                      className="h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground placeholder:text-muted-foreground rounded-xl px-4"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">
                    আসন সংখ্যা <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 bg-white/[0.02] border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white/[0.04] text-foreground rounded-xl px-4 font-bold text-lg w-full"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <FormField
                control={form.control}
                name="academicClassId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">
                      ক্লাস <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                          <SelectValue placeholder="ক্লাস নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                        {academicClasses?.map((cls) => (
                          <SelectItem
                            key={cls.id}
                            value={cls.id}
                            className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer"
                          >
                            {cls.nameBn || cls.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicYearId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold text-white tracking-widest uppercase">
                      বছর <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 w-full bg-white/[0.02] border-transparent focus:ring-1 focus:ring-primary focus:bg-white/[0.04] text-foreground rounded-xl px-4">
                          <SelectValue placeholder="বছর নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-white/[0.08] bg-[#111b2e] shadow-lg text-foreground">
                        {academicYears?.map((year) => (
                          <SelectItem
                            key={year.id}
                            value={year.id}
                            className="h-10 focus:bg-[rgba(0,229,160,0.08)] focus:text-primary transition-colors cursor-pointer"
                          >
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-bold" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6 pt-2">


            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-5 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
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
                        {field.value ? "অ্যাক্টিভ ব্যাচ" : "ইনঅ্যাক্টিভ ব্যাচ"}
                      </FormLabel>
                      <FormDescription className="text-xs text-muted-foreground max-w-sm">
                        এটি চালু থাকলে ব্যাচটি সরাসরি ব্যবহারযোগ্য হবে।
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.04]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
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
              ) : (
                <Save className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
              )}
              সেভ করুন
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
