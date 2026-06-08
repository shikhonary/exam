"use client";

import { useRouter } from "next/navigation";
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
  Bookmark,
  Hash,
  Loader2,
  Plus,
  Save,
  X,
  Calendar,
  FileText
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  academicChapterFormSchema,
  updateAcademicChapterSchema,
  type AcademicChapterFormValues,
  type UpdateAcademicChapterValues,
  defaultAcademicChapterValues,
} from "@workspace/schema";
import {
  useCreateAcademicChapter,
  useUpdateAcademicChapter,
  useAcademicChapterById,
  useAcademicYearsForSelection,
  useAcademicSubjectsForSelection,
} from "@workspace/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AcademicChapterFormProps {
  id?: string;
}

// ---------------------------------------------------------------------------
// Main Form (Create Mode)
// ---------------------------------------------------------------------------

export function CreateAcademicChapterForm() {
  const router = useRouter();
  const { mutateAsync: create, isPending } = useCreateAcademicChapter();

  const form = useForm<AcademicChapterFormValues>({
    resolver: zodResolver(academicChapterFormSchema) as any,
    defaultValues: defaultAcademicChapterValues,
  });

  const onSubmit = async (data: AcademicChapterFormValues) => {
    const result = await create(data);
    if (result?.success) {
      router.push("/academic-chapters");
    }
  };

  return (
    <FormContent
      form={form}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={() => router.push("/academic-chapters")}
      mode="create"
    />
  );
}

// ---------------------------------------------------------------------------
// Edit Form
// ---------------------------------------------------------------------------

interface EditAcademicChapterFormProps {
  id: string;
}

export function EditAcademicChapterForm({ id }: EditAcademicChapterFormProps) {
  const router = useRouter();
  const { data: chapter, isLoading: isQueryLoading } = useAcademicChapterById(id);
  const { mutateAsync: update, isPending: isUpdatePending } = useUpdateAcademicChapter();

  const form = useForm<UpdateAcademicChapterValues>({
    resolver: zodResolver(updateAcademicChapterSchema) as any,
    defaultValues: {
      nameEn: chapter?.nameEn ?? "",
      nameBn: chapter?.nameBn ?? "",
      position: chapter?.position ?? 0,
      isActive: chapter?.isActive ?? true,
      academicYearId: chapter?.academicYearId ?? "",
      subjectId: chapter?.subjectId ?? "",
    },
  });

  const onSubmit = async (data: UpdateAcademicChapterValues) => {
    const result = await update({ id, data });
    if (result?.success) {
      router.push("/academic-chapters");
    }
  };

  if (isQueryLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-2xl border border-outline/5 shadow-ambient">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm font-bold text-on-surface-variant">
          Loading chapter data...
        </p>
      </div>
    );
  }

  return (
    <FormContent
      form={form as any}
      isPending={isUpdatePending}
      onSubmit={onSubmit as any}
      onCancel={() => router.push("/academic-chapters")}
      mode="edit"
    />
  );
}

// ---------------------------------------------------------------------------
// Shared Form Content
// ---------------------------------------------------------------------------

interface FormContentProps {
  form: any;
  isPending: boolean;
  onSubmit: (data: AcademicChapterFormValues) => void;
  onCancel: () => void;
  mode: "create" | "edit";
}

function FormContent({
  form,
  isPending,
  onSubmit,
  onCancel,
  mode,
}: FormContentProps) {
  const { data: academicYears, isLoading: isYearsLoading } = useAcademicYearsForSelection();
  const { data: subjects, isLoading: isSubjectsLoading } = useAcademicSubjectsForSelection();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="academicYearId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Academic Year
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isYearsLoading}
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      {academicYears?.map((year) => (
                        <SelectItem
                          key={year.id}
                          value={year.id}
                          className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary"
                        >
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-primary" />
                  Subject
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubjectsLoading}
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      {subjects?.map((sub) => (
                        <SelectItem
                          key={sub.id}
                          value={sub.id}
                          className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary"
                        >
                          {sub.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  English Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Thermodynamics"
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
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Bengali Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. তাপগতিবিদ্যা"
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 font-bengali"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  Order Position
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          {/* Empty column for alignment if needed, or we can leave it full width */}
        </div>

        <div className="space-y-3">
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
                      Active Status
                    </FormLabel>
                    <p className="text-[10px] text-slate-400 font-bold leading-none">
                      Keep this chapter active to be displayed
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

        <div className="flex items-center gap-3 pt-6 border-t border-outline/5">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-2 h-12 px-6 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50 border-none transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-md shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 border-none"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="w-4 h-4" strokeWidth={3} />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "create" ? "Create Chapter" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
