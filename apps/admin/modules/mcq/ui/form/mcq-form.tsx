"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Trash2, Plus, FileText, Bookmark, Layers, AlignLeft, 
  CheckCircle, MessageSquare, Link as LinkIcon, Type, Save, X, Loader2, FileQuestion, Hash
} from "lucide-react";
import { mcqFormSchema, type MCQFormValues, defaultMCQValues } from "@workspace/schema";
import {
  useCreateMCQ,
  useUpdateMCQ,
  useMCQById,
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
  useFieldArray,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { toast } from "@workspace/ui/components/sonner";

interface McqFormProps {
  mcqId?: string;
}

export const McqForm = ({ mcqId }: McqFormProps) => {
  const router = useRouter();
  const isEditing = !!mcqId;

  const { data: mcqData, isLoading: isLoadingMcq } = useMCQById(mcqId as string);
  const { mutateAsync: createMcq, isPending: isCreating } = useCreateMCQ();
  const { mutateAsync: updateMcq, isPending: isUpdating } = useUpdateMCQ();

  const [localClassId, setLocalClassId] = useState<string>("");
  const [correctOptionIndex, setCorrectOptionIndex] = useState<string>("");

  const form = useForm<MCQFormValues>({
    resolver: zodResolver(mcqFormSchema),
    defaultValues: defaultMCQValues,
  });

  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control: form.control,
    name: "reference" as never, // Need to cast since it's just an array of strings but useFieldArray expects objects ideally. We'll handle it below differently.
  });

  const watchSubjectId = form.watch("subjectId");
  const watchChapterId = form.watch("chapterId");
  const watchOptions = form.watch("options");

  const { data: classesData } = useAcademicClassesForSelection();
  const { data: subjectsData } = useAcademicSubjectsForSelection(localClassId || undefined);
  const { data: chaptersData } = useAcademicChaptersForSelection(watchSubjectId || undefined);
  const { data: topicsData } = useAcademicChapterTopicsForSelection(watchChapterId || undefined);
  const { data: questionTypesData } = useQuestionTypesForSelection();

  useEffect(() => {
    if (mcqData && isEditing) {
      form.reset({
        ...mcqData,
        options: mcqData.options?.length ? mcqData.options : ["", "", "", ""],
        questionContext: mcqData.context || null,
        contextId: mcqData.contextId || "",
      });

      // Find which option matches the answer
      if (mcqData.answer && mcqData.options?.length) {
        const idx = mcqData.options.findIndex(opt => opt === mcqData.answer);
        if (idx !== -1) {
          setCorrectOptionIndex(idx.toString());
        }
      }
    }
  }, [mcqData, isEditing, form]);

  const handleCorrectOptionChange = (val: string) => {
    setCorrectOptionIndex(val);
    if (val !== "none") {
      const idx = parseInt(val);
      form.setValue("answer", form.getValues().options[idx] || "");
    } else {
      form.setValue("answer", "");
    }
  };

  const onSubmit = async (data: MCQFormValues) => {
    try {
      // Ensure answer is in sync with the selected option index before submit
      if (correctOptionIndex && correctOptionIndex !== "none") {
        data.answer = data.options[parseInt(correctOptionIndex)];
      }

      if (isEditing) {
        await updateMcq({ id: mcqId, data });
        toast.success("MCQ updated successfully");
      } else {
        await createMcq(data);
        toast.success("MCQ created successfully");
      }
      router.push("/mcqs");
    } catch (error) {
      toast.error("Failed to save MCQ");
      console.error(error);
    }
  };

  if (isEditing && isLoadingMcq) return <div>Loading...</div>;

  const isPending = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 p-6 md:p-8">
          {/* QUESTION CONTENT SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3 mb-6">
              <FileQuestion className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-slate-800">MCQ Content</h2>
            </div>
            
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft className="w-3.5 h-3.5 text-primary" />
                    Question *
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is the capital of Bangladesh?" className="min-h-[80px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((idx) => (
                <FormField key={idx} control={form.control} name={`options.${idx}`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                      <span className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-primary" /> Option {String.fromCharCode(65 + idx)} *</span>
                      {correctOptionIndex === idx.toString() && (
                        <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Correct Answer</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`} 
                        className={`h-12 px-4 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 ${correctOptionIndex === idx.toString() ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-100'}`} 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          if (correctOptionIndex === idx.toString()) {
                            form.setValue("answer", e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold text-rose-500" />
                  </FormItem>
                )} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-primary" /> Correct Answer *</FormLabel>
                <Select value={correctOptionIndex || ""} onValueChange={handleCorrectOptionChange}>
                  <FormControl>
                    <SelectTrigger className="h-12 w-full px-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-400/40 transition-all">
                      <SelectValue placeholder="Select correct option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                    {[0, 1, 2, 3].map((idx) => (
                      <SelectItem key={idx} value={idx.toString()} className="rounded-lg font-medium cursor-pointer focus:bg-emerald-100 focus:text-emerald-800">
                        Option {String.fromCharCode(65 + idx)}: {watchOptions[idx] ? (watchOptions[idx].slice(0, 30) + (watchOptions[idx].length > 30 ? "..." : "")) : "(Empty)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Hidden input to ensure zod validation passes */}
                <input type="hidden" {...form.register("answer")} />
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            </div>
            
            <FormField control={form.control} name="explanation" render={({ field }) => (
              <FormItem className="pt-2">
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" /> Explanation (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Explain why the answer is correct..." className="min-h-[80px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )} />
          </div>

          {/* CONTEXT SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-slate-800">Passage / Shared Context (Optional)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <FormField control={form.control} name="questionContext.title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Type className="w-3.5 h-3.5 text-primary" /> Context Title</FormLabel>
                  <FormControl><Input placeholder="E.g. Read the passage below" className="h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
              <FormField control={form.control} name="questionContext.url" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LinkIcon className="w-3.5 h-3.5 text-primary" /> Media URL</FormLabel>
                  <FormControl><Input placeholder="https://..." className="h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
              <FormField control={form.control} name="questionContext.text" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><AlignLeft className="w-3.5 h-3.5 text-primary" /> Context Passage / Text</FormLabel>
                  <FormControl><Textarea placeholder="The passage goes here..." className="min-h-[100px] p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
            </div>
          </div>

          {/* METADATA SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3 mb-6">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-slate-800">Classification Details</h2>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {!isEditing && (
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
               )}

              <FormField control={form.control} name="subjectId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Bookmark className="w-3.5 h-3.5 text-primary" /> Subject *</FormLabel>
                  <Select onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("chapterId", "");
                    form.setValue("topicId", "");
                  }} value={field.value} disabled={!isEditing && !localClassId && !field.value}>
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
                        <SelectItem key={qt.id} value={qt.id} className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">
                          {qt.nameEn || qt.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-primary" /> Board / General *</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. GENERAL" className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300" {...field} value={field.value || "GENERAL"} />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="session" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Hash className="w-3.5 h-3.5 text-primary" /> Session Year *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2024" className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <FormField control={form.control} name="isMath" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-bold text-slate-700">Mathematical Equation?</FormLabel>
                    <p className="text-[11px] text-slate-500">
                      Enable if this question uses LaTeX or mathematical formulas.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="ml-4"
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>

        <div className="flex items-center gap-3 pt-6 border-t border-outline/5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/mcqs")}
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
            {isEditing ? "Save Changes" : "Create MCQ"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
