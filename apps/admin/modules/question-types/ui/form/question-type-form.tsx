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
  HelpCircle,
  Loader2,
  Plus,
  Save,
  X,
  Type,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { QuestionTypeSubjectManager } from "../components/question-type-subject-manager";

import {
  questionTypeFormSchema,
  updateQuestionTypeSchema,
  type QuestionTypeFormValues,
  type UpdateQuestionTypeValues,
  defaultQuestionTypeValues,
} from "@workspace/schema";
import {
  useCreateQuestionType,
  useUpdateQuestionType,
  useQuestionTypeById,
} from "@workspace/api-client";

interface QuestionTypeFormProps {
  id?: string;
}

function CreateQuestionTypeForm() {
  const router = useRouter();
  const { mutateAsync: create, isPending } = useCreateQuestionType();

  const form = useForm<QuestionTypeFormValues>({
    resolver: zodResolver(questionTypeFormSchema) as any,
    defaultValues: defaultQuestionTypeValues,
  });

  const onSubmit = async (data: QuestionTypeFormValues) => {
    const result = await create(data);
    if (result?.success) {
      router.push("/question-types");
    }
  };

  return (
    <FormContent
      form={form}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={() => router.push("/question-types")}
      mode="create"
    />
  );
}

interface EditQuestionTypeFormProps {
  id: string;
}

function EditQuestionTypeForm({ id }: EditQuestionTypeFormProps) {
  const router = useRouter();
  const { data: questionType } = useQuestionTypeById(id);
  const { mutateAsync: update, isPending } = useUpdateQuestionType();

  const form = useForm<UpdateQuestionTypeValues>({
    resolver: zodResolver(updateQuestionTypeSchema) as any,
    defaultValues: {
      nameEn: questionType?.nameEn ?? "",
      nameBn: questionType?.nameBn ?? "",
      isActive: questionType?.isActive ?? true,
    },
  });

  const onSubmit = async (data: UpdateQuestionTypeValues) => {
    const result = await update({ id, data });
    if (result?.success) {
      router.push("/question-types");
    }
  };

  return (
    <div className="divide-y divide-outline/5">
      <FormContent
        form={form as any}
        isPending={isPending}
        onSubmit={onSubmit as any}
        onCancel={() => router.push("/question-types")}
        mode="edit"
      />
      {/* Subject Assignments — outside the <form> to avoid accidental submission */}
      <div className="p-6 md:p-8">
        <QuestionTypeSubjectManager questionTypeId={id} />
      </div>
    </div>
  );
}

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
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  Type Name (EN)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Multiple Choice"
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
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  প্রশ্নের ধরন (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="যেমন: বহুনির্বাচনী"
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
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
                      Keep this question type active for usage
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
            {mode === "create" ? "Create Question Type" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function QuestionTypeForm({ id }: QuestionTypeFormProps) {
  if (id) return <EditQuestionTypeForm id={id} />;
  return <CreateQuestionTypeForm />;
}
