"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Loader2,
  Plus,
  Save,
  X,
  HelpCircle,
  Book,
  List,
} from "lucide-react";

import {
  mcqFormSchema,
  updateMcqSchema,
  type McqFormValues,
  type UpdateMcqValues,
  defaultMcqValues,
} from "@workspace/schema";
import {
  useCreateMcq,
  useUpdateMcq,
  useMcqById,
} from "@workspace/api-client";
import { mcqTypeOptions, subjects } from "@workspace/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface McqFormProps {
  id?: string;
}

// ---------------------------------------------------------------------------
// Main Form (Create Mode)
// ---------------------------------------------------------------------------

function CreateMcqForm() {
  const router = useRouter();
  const { mutateAsync: create, isPending } = useCreateMcq();

  const form = useForm<McqFormValues>({
    resolver: zodResolver(mcqFormSchema) as any,
    defaultValues: defaultMcqValues,
  });

  const onSubmit = async (data: McqFormValues) => {
    const result = await create(data);
    if (result?.success) {
      router.push("/mcqs");
    }
  };

  return (
    <FormContent
      form={form}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={() => router.push("/mcqs")}
      mode="create"
    />
  );
}

// ---------------------------------------------------------------------------
// Edit Form
// ---------------------------------------------------------------------------

interface EditMcqFormProps {
  id: string;
}

function EditMcqForm({ id }: EditMcqFormProps) {
  const router = useRouter();
  const { data: mcq } = useMcqById(id);
  const { mutateAsync: update, isPending } = useUpdateMcq();

  const form = useForm<UpdateMcqValues>({
    resolver: zodResolver(updateMcqSchema) as any,
    defaultValues: {
      question: "",
      answer: "",
      type: "",
      options: ["", "", "", ""],
      statements: [],
      isMath: false,
      reference: [],
      subject: "",
    },
  });

  useEffect(() => {
    if (mcq) {
      form.reset({
        question: mcq.question ?? "",
        answer: mcq.answer ?? "",
        type: mcq.type ?? "",
        options: (mcq.options as string[]) ?? ["", "", "", ""],
        statements: (mcq.statements as string[]) ?? [],
        isMath: mcq.isMath ?? false,
        reference: (mcq.reference as string[]) ?? [],
        subject: mcq.subject ?? "",
      });
    }
  }, [mcq, form]);

  const onSubmit = async (data: UpdateMcqValues) => {
    const result = await update({ id, data });
    if (result?.success) {
      router.push("/mcqs");
    }
  };

  return (
    <FormContent
      form={form as any}
      isPending={isPending}
      onSubmit={onSubmit as any}
      onCancel={() => router.push("/mcqs")}
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
  onSubmit: any;
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  Question
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. What is the capital of France?"
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Book className="w-3.5 h-3.5 text-primary" />
                  Subject
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                    {subjects.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="font-bold">
                        {option.labelEn} - {option.labelBn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <List className="w-3.5 h-3.5 text-primary" />
                  Type
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select MCQ type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                    {mcqTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="font-bold">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  Answer (Exact Match)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Paris"
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          {/* Options Section */}
          <div className="md:col-span-2 space-y-4">
            <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <List className="w-3.5 h-3.5 text-primary" />
              Options
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`options.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Option ${index + 1}`}
                          className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold text-rose-500" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
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
            {mode === "create" ? "Create MCQ" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function McqForm({ id }: McqFormProps) {
  if (id) return <EditMcqForm id={id} />;
  return <CreateMcqForm />;
}
