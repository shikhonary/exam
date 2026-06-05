"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray } from "@workspace/ui/components/form";
import {
  CalendarDays,
  Plus,
  Trash2,
  Loader2,
  Save,
  BookOpen,
  X,
  Activity,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";

import {
  academicYearFormSchema,
  type AcademicYearFormValues,
  defaultAcademicYearValues,
  updateAcademicYearSchema,
  type UpdateAcademicYearValues,
} from "@workspace/schema";

import {
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useAcademicYearById,
  useAcademicClassesForSelection,
} from "@workspace/api-client";

import type { AcademicYearWithRelations } from "@workspace/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AcademicYearFormProps {
  /** If provided → edit mode */
  id?: string;
}

// (Removed static CLASSES array)

// ---------------------------------------------------------------------------
// Slug auto-generator
// ---------------------------------------------------------------------------
function toSlug(label: string) {
  return label.trim().replace(/\s+/g, "-").toLowerCase();
}

// ---------------------------------------------------------------------------
// Session sub-form
// ---------------------------------------------------------------------------
interface SessionFieldProps {
  index: number;
  form: ReturnType<typeof useForm<AcademicYearFormValues>>;
  onRemove: () => void;
  classes: { id: string; label: string }[];
  isClassesLoading: boolean;
}

function SessionField({ index, form, onRemove, classes, isClassesLoading }: SessionFieldProps) {
  const prefix = `sessions.${index}` as const;

  const selectedClassIds: string[] =
    form.watch(`sessions.${index}.classIds`) ?? [];

  const toggleClass = (classId: string) => {
    const current = form.getValues(`sessions.${index}.classIds`) ?? [];
    const next = current.includes(classId)
      ? current.filter((c) => c !== classId)
      : [...current, classId];
    form.setValue(`sessions.${index}.classIds`, next, { shouldValidate: true });
  };

  return (
    <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-6 space-y-6">
      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
        aria-label="Remove session"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
        <BookOpen size={16} className="text-primary" />
        Session {index + 1}
      </div>

      {/* Name */}
      <FormField
        control={form.control}
        name={`${prefix}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest">Session Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g. January–December, HSC Session…"
                className="h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
              />
            </FormControl>
            <FormMessage className="text-[11px] font-bold text-rose-500" />
          </FormItem>
        )}
      />

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${prefix}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest">Start Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between w-full hover:bg-slate-50 hover:text-slate-800 shadow-none",
                        !field.value && "text-slate-400 font-normal"
                      )}
                    >
                      {field.value instanceof Date && !isNaN(field.value.getTime())
                        ? format(field.value, "PPP")
                        : "Select date"}
                      <CalendarDays className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest">End Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between w-full hover:bg-slate-50 hover:text-slate-800 shadow-none",
                        !field.value && "text-slate-400 font-normal"
                      )}
                    >
                      {field.value instanceof Date && !isNaN(field.value.getTime())
                        ? format(field.value, "PPP")
                        : "Select date"}
                      <CalendarDays className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Class selector */}
      <div>
        <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3">
          Applicable Classes
        </FormLabel>
        
        {isClassesLoading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full bg-slate-200" />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <p className="text-xs text-slate-400 font-bold italic">No active classes found.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {classes.map((cls) => {
              const active = selectedClassIds.includes(cls.id);
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => toggleClass(cls.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-black border transition-all duration-200",
                    active
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                      : "bg-white text-slate-500 border-slate-200 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {cls.label}
                </button>
              );
            })}
          </div>
        )}
        {/* Show validation error for classIds */}
        <FormField
          control={form.control}
          name={`${prefix}.classIds`}
          render={() => <FormMessage className="mt-1 text-xs" />}
        />
      </div>

      {/* Active toggle */}
      <FormField
        control={form.control}
        name={`${prefix}.isActive`}
        render={({ field }) => (
          <FormItem className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group/toggle transition-all hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                  field.value
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                <Activity
                  className={cn("w-5 h-5", field.value && "scale-110")}
                />
              </div>
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-black text-slate-700 leading-none cursor-pointer">
                  Session Active
                </FormLabel>
                <p className="text-[10px] text-slate-400 font-bold leading-none">
                  Enable this session for use
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
  );
}

// ---------------------------------------------------------------------------
// Main form (Create mode)
// ---------------------------------------------------------------------------
function CreateAcademicYearForm() {
  const router = useRouter();
  const { mutateAsync: create, isPending } = useCreateAcademicYear();
  const { data: classesData, isLoading: isClassesLoading } = useAcademicClassesForSelection();
  const classes = (classesData ?? []).map((c) => ({
    id: c.id,
    label: c.nameEn,
  }));

  const form = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: defaultAcademicYearValues as AcademicYearFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sessions",
  });

  // Auto-generate slug from label
  const label = form.watch("label");
  useEffect(() => {
    if (label && !form.formState.dirtyFields.slug) {
      form.setValue("slug", toSlug(label), { shouldValidate: false });
    }
  }, [label, form]);

  const onSubmit = async (data: AcademicYearFormValues) => {
    const result = await create(data);
    if (result?.success) {
      router.push("/academic-years");
    }
  };

  return (
    <FormContent
      form={form}
      fields={fields}
      append={append}
      remove={remove}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={() => router.push("/academic-years")}
      mode="create"
      classes={classes}
      isClassesLoading={isClassesLoading}
    />
  );
}

// ---------------------------------------------------------------------------
// Edit form (wraps the same FormContent)
// ---------------------------------------------------------------------------
interface EditAcademicYearFormProps {
  id: string;
}

function EditAcademicYearForm({ id }: EditAcademicYearFormProps) {
  const router = useRouter();
  const { data: year } = useAcademicYearById(id);
  const { data: classesData, isLoading: isClassesLoading } = useAcademicClassesForSelection();
  const classes = (classesData ?? []).map((c) => ({
    id: c.id,
    label: c.nameEn,
  }));
  const { mutateAsync: update, isPending } = useUpdateAcademicYear();
  const form = useForm<UpdateAcademicYearValues>({
    resolver: zodResolver(updateAcademicYearSchema),
    defaultValues: {},
  });

  // Populate form once data loads
  useEffect(() => {
    if (year) {
      form.reset({
        label: year.label,
        slug: year.slug,
        startDate: new Date(year.startDate),
        endDate: new Date(year.endDate),
        isCurrent: year.isCurrent,
        isActive: year.isActive,
      });
    }
  }, [year, form]);

  const onSubmit = async (data: UpdateAcademicYearValues) => {
    const result = await update({ id, ...data });
    if (result?.success) {
      router.push(`/academic-years/${id}`);
    }
  };

// ---------------------------------------------------------------------------
// Edit form view
// ---------------------------------------------------------------------------
  return (
    <div className="p-8 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <YearFields form={form as any} />

          <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/academic-years/${id}`)}
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
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared year-level fields
// ---------------------------------------------------------------------------
function YearFields({ form }: { form: ReturnType<typeof useForm<AcademicYearFormValues>> }) {
  return (
    <>
      {/* Label + Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                Year Label
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. 2025 or 2025-26"
                  className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                />
              </FormControl>
              <FormDescription className="text-xs font-medium text-slate-400">
                Format: &apos;2025&apos; or &apos;2025-26&apos;
              </FormDescription>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                Slug
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="auto-generated URL-safe identifier"
                  className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-sans placeholder:font-normal placeholder:text-slate-300"
                />
              </FormControl>
              <FormDescription className="text-xs font-medium text-slate-400">
                URL-safe identifier (e.g. 2025-26)
              </FormDescription>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                Global Start Date
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between w-full hover:bg-slate-100 hover:text-slate-800 shadow-none",
                        !field.value && "text-slate-400 font-normal"
                      )}
                    >
                      {field.value instanceof Date && !isNaN(field.value.getTime())
                        ? format(field.value, "PPP")
                        : "Select date"}
                      <CalendarDays className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                Global End Date
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between w-full hover:bg-slate-100 hover:text-slate-800 shadow-none",
                        !field.value && "text-slate-400 font-normal"
                      )}
                    >
                      {field.value instanceof Date && !isNaN(field.value.getTime())
                        ? format(field.value, "PPP")
                        : "Select date"}
                      <CalendarDays className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
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
                  <CalendarDays
                    className={cn("w-5 h-5", field.value && "scale-110")}
                  />
                </div>
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-black text-slate-700 leading-none cursor-pointer">
                    Active Status
                  </FormLabel>
                  <p className="text-[10px] text-slate-400 font-bold leading-none">
                    Keep this year active in the system
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

        <FormField
          control={form.control}
          name="isCurrent"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group/toggle transition-all hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                    field.value
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-200 text-slate-400"
                  )}
                >
                  <Star
                    className={cn("w-5 h-5", field.value && "scale-110")}
                  />
                </div>
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-black text-slate-700 leading-none cursor-pointer">
                    Current Year
                  </FormLabel>
                  <p className="text-[10px] text-slate-400 font-bold leading-none">
                    Set as default active year for users
                  </p>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Shared form content wrapper (create mode only — edit uses EditAcademicYearForm)
// ---------------------------------------------------------------------------
interface FormContentProps {
  form: ReturnType<typeof useForm<AcademicYearFormValues>>;
  fields: ReturnType<typeof useFieldArray<AcademicYearFormValues, "sessions">>["fields"];
  append: ReturnType<typeof useFieldArray<AcademicYearFormValues, "sessions">>["append"];
  remove: ReturnType<typeof useFieldArray<AcademicYearFormValues, "sessions">>["remove"];
  isPending: boolean;
  onSubmit: (data: AcademicYearFormValues) => Promise<void>;
  onCancel: () => void;
  mode: "create" | "edit";
  classes: { id: string; label: string }[];
  isClassesLoading: boolean;
}

function FormContent({
  form,
  fields,
  append,
  remove,
  isPending,
  onSubmit,
  onCancel,
  classes,
  isClassesLoading,
  mode,
}: FormContentProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
        {/* ── Year-level fields ── */}
        <div className="space-y-6">
          <YearFields form={form} />
        </div>

        {/* ── Sessions ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">
                Sessions
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1">
                Add one or more sessions for different class groups (e.g.
                Jan–Dec for Classes 2–10, Jul–Jun for HSC).
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-2 text-xs font-black rounded-xl border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900"
              onClick={() =>
                append({
                  name: "",
                  startDate: new Date(),
                  endDate: new Date(),
                  classIds: [],
                  isActive: true,
                })
              }
            >
              <Plus size={14} strokeWidth={3} />
              Add Session
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                <BookOpen className="text-slate-300" size={28} />
              </div>
              <p className="text-sm font-bold text-slate-500">
                No sessions yet. Click &ldquo;Add Session&rdquo; to define class groups.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <SessionField
                key={field.id}
                index={index}
                form={form}
                onRemove={() => remove(index)}
                classes={classes}
                isClassesLoading={isClassesLoading}
              />
            ))}
          </div>
        </div>

        <Separator className="opacity-20" />

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
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
            {mode === "create" ? "Create Academic Year" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Public export — auto-switches between create / edit
// ---------------------------------------------------------------------------
export function AcademicYearForm({ id }: AcademicYearFormProps) {
  if (id) return <EditAcademicYearForm id={id} />;
  return <CreateAcademicYearForm />;
}
