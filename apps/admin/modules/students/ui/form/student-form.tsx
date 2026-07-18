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
  Loader2,
  Plus,
  Save,
  X,
  User,
  Hash,
  Phone,
} from "lucide-react";

import {
  studentFormSchema,
  updateStudentSchema,
  type StudentFormValues,
  type UpdateStudentValues,
  defaultStudentValues,
} from "@workspace/schema";
import {
  useCreateStudent,
  useUpdateStudent,
  useStudentById,
} from "@workspace/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StudentFormProps {
  id?: string;
}

// ---------------------------------------------------------------------------
// Main Form (Create Mode)
// ---------------------------------------------------------------------------

function CreateStudentForm() {
  const router = useRouter();
  const { mutateAsync: create, isPending } = useCreateStudent();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as any,
    defaultValues: defaultStudentValues,
  });

  const onSubmit = async (data: StudentFormValues) => {
    const result = await create(data);
    if (result?.success) {
      router.push("/students");
    }
  };

  return (
    <FormContent
      form={form}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={() => router.push("/students")}
      mode="create"
    />
  );
}

// ---------------------------------------------------------------------------
// Edit Form
// ---------------------------------------------------------------------------

interface EditStudentFormProps {
  id: string;
}

function EditStudentForm({ id }: EditStudentFormProps) {
  const router = useRouter();
  const { data: student } = useStudentById(id);
  const { mutateAsync: update, isPending } = useUpdateStudent();

  const form = useForm<UpdateStudentValues>({
    resolver: zodResolver(updateStudentSchema) as any,
    defaultValues: {
      name: "",
      studentId: "",
      mobile: "",
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name ?? "",
        studentId: student.studentId ?? "",
        mobile: student.mobile ?? "",
      });
    }
  }, [student, form]);

  const onSubmit = async (data: UpdateStudentValues) => {
    const result = await update({ id, data });
    if (result?.success) {
      router.push("/students");
    }
  };

  return (
    <FormContent
      form={form as any}
      isPending={isPending}
      onSubmit={onSubmit as any}
      onCancel={() => router.push("/students")}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Student Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. John Doe"
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  Student ID
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="e.g. STD-2026-001"
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
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  Mobile Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. 01700000000"
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
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
            {mode === "create" ? "Create Student" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function StudentForm({ id }: StudentFormProps) {
  if (id) return <EditStudentForm id={id} />;
  return <CreateStudentForm />;
}
