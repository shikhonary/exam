"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
import { Checkbox } from "@workspace/ui/components/checkbox";
import { FormCalendar } from "@workspace/ui/shared/form-calendar";

import {
  examFormSchema,
  type ExamFormValues,
} from "@workspace/schema";
import { useCreateExam, useUpdateExam } from "@workspace/api-client";
import { subjects } from "@workspace/utils";
import type { Exam } from "@workspace/db";

interface ExamFormProps {
  initialData?: Exam;
  isEdit?: boolean;
}

export function ExamForm({ initialData, isEdit }: ExamFormProps) {
  const router = useRouter();

  const { mutateAsync: createExam, isPending: isCreating } = useCreateExam();
  const { mutateAsync: updateExam, isPending: isUpdating } = useUpdateExam();

  const isLoading = isCreating || isUpdating;

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema) as any,
    defaultValues: initialData
      ? {
        title: initialData.title,
        subject: initialData.subject,
        duration: initialData.duration,
        totalMarks: initialData.totalMarks,
        status: initialData.status as "Draft" | "Published" | "Completed",
        isPublic: initialData.isPublic,
        startDate: initialData.startDate ? new Date(initialData.startDate) : undefined,
        endDate: initialData.endDate ? new Date(initialData.endDate) : undefined,
      }
      : {
        title: "",
        subject: "",
        duration: 60,
        totalMarks: 100,
        status: "Draft",
        isPublic: true,
      },
  });

  const onSubmit = async (data: ExamFormValues) => {
    try {
      if (isEdit && initialData) {
        await updateExam({
          id: initialData.id,
          data,
        });
      } else {
        await createExam(data);
      }
      router.push("/exams");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-on-surface">Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter exam title"
                    className="bg-surface-container-lowest border-outline/20 focus-visible:ring-primary h-11"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-on-surface">Subject *</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-surface-container-lowest border-outline/20 h-11">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.labelEn} - {option.labelBn}
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
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-on-surface">Duration (minutes) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    className="bg-surface-container-lowest border-outline/20 focus-visible:ring-primary h-11"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-on-surface">Total Marks *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="bg-surface-container-lowest border-outline/20 focus-visible:ring-primary h-11"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-on-surface">Status</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-surface-container-lowest border-outline/20 h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormCalendar
            name="startDate"
            label="Start Date"
            placeholder="Pick a start date"
            disabled={isLoading}
            withTime
          />

          <FormCalendar
            name="endDate"
            label="End Date"
            placeholder="Pick an end date"
            disabled={isLoading}
            withTime
          />

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-outline/20 p-4 bg-surface-container-lowest h-11 items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-bold text-on-surface cursor-pointer">
                    Public Exam
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-outline/10">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => router.push("/exams")}
            className="h-11 px-8 rounded-xl font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white min-w-[140px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Update Exam"
            ) : (
              "Create Exam"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
