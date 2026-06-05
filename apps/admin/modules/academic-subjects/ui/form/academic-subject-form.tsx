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
  BookOpen,
  FolderOpen
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { MultiSelect } from "@workspace/ui/components/multi-select";

import {
  academicSubjectFormSchema,
  updateAcademicSubjectSchema,
  type AcademicSubjectFormValues,
  type UpdateAcademicSubjectValues,
  defaultAcademicSubjectValues,
} from "@workspace/schema";
import { groupOptions } from "@workspace/utils";
import {
  useCreateAcademicSubject,
  useUpdateAcademicSubject,
  useAcademicSubjectById,
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
} from "@workspace/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AcademicSubjectFormProps {
  id?: string;
}

// ---------------------------------------------------------------------------
// Main Form (Create Mode)
// ---------------------------------------------------------------------------

function CreateAcademicSubjectForm() {
  const router = useRouter();
  const { mutateAsync: create, isPending } = useCreateAcademicSubject();

  const form = useForm<AcademicSubjectFormValues>({
    resolver: zodResolver(academicSubjectFormSchema),
    defaultValues: defaultAcademicSubjectValues,
  });

  const onSubmit = async (data: AcademicSubjectFormValues) => {
    const result = await create(data);
    if (result?.success) {
      router.push("/academic-subjects");
    }
  };

  return (
    <FormContent
      form={form}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={() => router.push("/academic-subjects")}
      mode="create"
    />
  );
}

// ---------------------------------------------------------------------------
// Edit Form
// ---------------------------------------------------------------------------

interface EditAcademicSubjectFormProps {
  id: string;
}

function EditAcademicSubjectForm({ id }: EditAcademicSubjectFormProps) {
  const router = useRouter();
  const { data: subject } = useAcademicSubjectById(id);
  const { mutateAsync: update, isPending } = useUpdateAcademicSubject();

  const form = useForm<UpdateAcademicSubjectValues>({
    resolver: zodResolver(updateAcademicSubjectSchema),
    defaultValues: {
      nameEn: subject?.nameEn ?? "",
      nameBn: subject?.nameBn ?? "",
      code: subject?.code ?? "",
      group: subject?.group ?? "",
      isActive: subject?.isActive ?? true,
      academicYearId: subject?.academicYearId ?? "",
      academicClassIds: subject?.classSubjects?.map((cs) => cs.academicClass.id) ?? [],
    },
  });

  const onSubmit = async (data: UpdateAcademicSubjectValues) => {
    const result = await update({ id, data });
    if (result?.success) {
      router.push("/academic-subjects");
    }
  };

  return (
    <FormContent
      form={form as any}
      isPending={isPending}
      onSubmit={onSubmit as any}
      onCancel={() => router.push("/academic-subjects")}
      mode="edit"
    />
  );
}

// ---------------------------------------------------------------------------
// Shared Form Content
// ---------------------------------------------------------------------------

interface FormContentProps {
  form: ReturnType<typeof useForm<AcademicSubjectFormValues>>;
  isPending: boolean;
  onSubmit: (data: AcademicSubjectFormValues) => Promise<void>;
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
  // Use hooks for dropdown options
  const { data: classesData } = useAcademicClassesForSelection();
  const { data: yearsData } = useAcademicYearsForSelection();

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
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      {yearsData?.map((year) => (
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
            name="academicClassIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Academic Classes
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={
                      classesData?.map((cls) => ({
                        label: cls.nameEn,
                        value: cls.id,
                      })) || []
                    }
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select Classes"
                    className="h-12 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all shadow-none"
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
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-primary" />
                  Subject Name (EN)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Physics"
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
                  <Bookmark className="w-3.5 h-3.5 text-primary" />
                  বিষয়ের নাম (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="যেমন: পদার্থবিজ্ঞান"
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  Subject Code
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="e.g. 101"
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5 text-primary" />
                  Group (Optional)
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value || "none"}
                    onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      <SelectItem value="none" className="font-medium text-slate-400">
                        None
                      </SelectItem>
                      {groupOptions.map((group) => (
                        <SelectItem
                          key={group.value}
                          value={String(group.value)}
                          className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary"
                        >
                          {group.label}
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
                      Keep this subject active for class assignment
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
            {mode === "create" ? "Create Subject" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function AcademicSubjectForm({ id }: AcademicSubjectFormProps) {
  if (id) return <EditAcademicSubjectForm id={id} />;
  return <CreateAcademicSubjectForm />;
}
