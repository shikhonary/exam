"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, FileText, Bookmark, Layers, AlignLeft, 
  Link as LinkIcon, Type, Save, X, Loader2, MessageSquare
} from "lucide-react";
import { shortAnswerFormSchema, type ShortAnswerFormSchema } from "@workspace/schema";
import {
  useCreateShortAnswer,
  useUpdateShortAnswer,
  useShortAnswerById,
  useAcademicClassesForSelection,
  useAcademicSubjectsForSelection,
  useAcademicChaptersForSelection,
  useAcademicChapterTopicsForSelection,
  useQuestionTypesForSelection,
} from "@workspace/api-client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  zodResolver,
  useForm,
} from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { toast } from "@workspace/ui/components/sonner";

interface ShortAnswerFormProps {
  id?: string;
}

export const ShortAnswerForm = ({ id }: ShortAnswerFormProps) => {
  const router = useRouter();
  const isEditing = !!id;

  const { data: itemData, isLoading: isLoadingItem } = useShortAnswerById(id as string);
  const { mutateAsync: createItem, isPending: isCreating } = useCreateShortAnswer();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateShortAnswer();

  const [localClassId, setLocalClassId] = useState<string>("");

  const form = useForm<ShortAnswerFormSchema>({
    resolver: zodResolver(shortAnswerFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      reference: [],
      subjectId: "",
      chapterId: "",
      topicId: "",
      questionTypeId: "",
    },
  });

  const watchSubjectId = form.watch("subjectId");
  const watchChapterId = form.watch("chapterId");

  const { data: classesData } = useAcademicClassesForSelection();
  const { data: subjectsData } = useAcademicSubjectsForSelection(localClassId || undefined);
  const { data: chaptersData } = useAcademicChaptersForSelection(watchSubjectId || undefined);
  const { data: topicsData } = useAcademicChapterTopicsForSelection(watchChapterId || undefined);
  const { data: questionTypesData } = useQuestionTypesForSelection();

  useEffect(() => {
    if (itemData && isEditing) {
      form.reset({
        ...itemData,
        answer: itemData.answer || "",
      });
    }
  }, [itemData, isEditing, form]);

  const onSubmit = async (data: ShortAnswerFormSchema) => {
    try {
      if (isEditing) {
        await updateItem({ id: id, data });
      } else {
        await createItem(data);
      }
      router.push("/short-answers");
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditing && isLoadingItem) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const isPending = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 p-6 md:p-8">
          {/* QUESTION & ANSWER SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-slate-800">Content</h2>
            </div>
            
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Question *
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your question here..." 
                      className="min-h-[120px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none" 
                      {...field} 
                    />
                  </FormControl>
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
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    Answer (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide an answer or explanation..." 
                      className="min-h-[160px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5 text-primary" />
                    References (One per line)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="https://example.com/ref1&#10;https://example.com/ref2" 
                      className="min-h-[80px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-sans placeholder:font-normal placeholder:text-slate-300 resize-none" 
                      value={field.value?.join("\n") || ""}
                      onChange={(e) => field.onChange(e.target.value.split("\n").filter(r => r.trim() !== ""))}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />
          </div>


          {/* METADATA SECTION */}
          {!isEditing && (
            <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3 mb-6">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-slate-800">Classification Details</h2>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="space-y-2">
                 <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Bookmark className="w-3.5 h-3.5 text-primary" /> Class</FormLabel>
                 <Select
                   value={localClassId || ""}
                   onValueChange={(val) => {
                     setLocalClassId(val);
                     form.setValue("subjectId", "");
                     form.setValue("chapterId", "");
                     form.setValue("topicId", "");
                   }}
                 >
                   <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                     <SelectValue placeholder="Select class" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                     {(classesData as any[])?.map((c) => (
                       <SelectItem key={c.id} value={c.id} className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">
                         {c.nameEn || c.nameBn}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

              <FormField control={form.control} name="subjectId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Bookmark className="w-3.5 h-3.5 text-primary" /> Subject *</FormLabel>
                  <Select onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("chapterId", "");
                    form.setValue("topicId", "");
                  }} value={field.value} disabled={!localClassId && !field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      {(subjectsData as any[])?.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">
                          {s.nameEn || s.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="chapterId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-primary" /> Chapter *</FormLabel>
                  <Select onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("topicId", "");
                  }} value={field.value} disabled={!watchSubjectId}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      {(chaptersData as any[])?.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">
                          {c.nameEn || c.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />

              <FormField control={form.control} name="topicId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><AlignLeft className="w-3.5 h-3.5 text-primary" /> Topic (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!watchChapterId}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      {(topicsData as any[])?.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">
                          {t.nameEn || t.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />

              <FormField control={form.control} name="questionTypeId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Type className="w-3.5 h-3.5 text-primary" /> Question Type (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      {(questionTypesData as any[])?.map((qt) => (
                        <SelectItem key={qt.id} value={qt.id} className="font-medium rounded-lg">
                          {qt.nameEn || qt.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
            </div>
          </div>
          )}

        <div className="flex items-center gap-3 pt-6 border-t border-outline/5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/short-answers")}
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
            ) : isEditing ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" strokeWidth={3} />
            )}
            {isEditing ? "Save Changes" : "Create Short Answer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
