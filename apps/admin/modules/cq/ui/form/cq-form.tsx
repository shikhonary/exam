"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Trash2, Plus, FileText, Bookmark, Layers, AlignLeft, 
  CheckCircle, MessageSquare, Link as LinkIcon, Type, Save, X, Loader2 
} from "lucide-react";
import { cqFormSchema, type CqFormSchema } from "@workspace/schema";
import {
  useCreateCQ,
  useUpdateCQ,
  useCQById,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { toast } from "@workspace/ui/components/sonner";

interface CqFormProps {
  cqId?: string;
}

export const CqForm = ({ cqId }: CqFormProps) => {
  const router = useRouter();
  const isEditing = !!cqId;

  const { data: cqData, isLoading: isLoadingCq } = useCQById(cqId as string);
  const { mutateAsync: createCq, isPending: isCreating } = useCreateCQ();
  const { mutateAsync: updateCq, isPending: isUpdating } = useUpdateCQ();

  const [localClassId, setLocalClassId] = useState<string>("");

  const form = useForm<CqFormSchema>({
    resolver: zodResolver(cqFormSchema),
    defaultValues: {
      questionA: "",
      questionB: "",
      questionC: "",
      questionD: "",
      context: "",
      reference: [],
      subjectId: "",
      chapterId: "",
      topicId: "",
      questionTypeId: "",
      attachments: [],
      answer: {
        answerA: "",
        answerB: "",
        answerC: "",
        answerD: "",
        explanation: "",
      },
    },
  });

  const { fields: attachmentFields, append: appendAttachment, remove: removeAttachment } = useFieldArray({
    control: form.control,
    name: "attachments",
  });

  const watchSubjectId = form.watch("subjectId");
  const watchChapterId = form.watch("chapterId");

  const { data: classesData } = useAcademicClassesForSelection();
  const { data: subjectsData } = useAcademicSubjectsForSelection(localClassId || undefined);
  const { data: chaptersData } = useAcademicChaptersForSelection(watchSubjectId || undefined);
  const { data: topicsData } = useAcademicChapterTopicsForSelection(watchChapterId || undefined);
  const { data: questionTypesData } = useQuestionTypesForSelection();

  useEffect(() => {
    if (cqData && isEditing) {
      form.reset({
        ...cqData,
        answer: cqData.answer || {
          answerA: "",
          answerB: "",
          answerC: "",
          answerD: "",
          explanation: "",
        },
      });
    }
  }, [cqData, isEditing, form]);

  const onSubmit = async (data: CqFormSchema) => {
    try {
      if (isEditing) {
        await updateCq({ id: cqId, data });
        toast.success("CQ updated successfully");
      } else {
        await createCq(data);
        toast.success("CQ created successfully");
      }
      router.push("/cqs");
    } catch (error) {
      toast.error("Failed to save CQ");
      console.error(error);
    }
  };

  if (isEditing && isLoadingCq) return <div>Loading...</div>;

  const isPending = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 p-6 md:p-8">
          {/* QUESTION CONTENT SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-slate-800">Question Content</h2>
            </div>
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft className="w-3.5 h-3.5 text-primary" />
                    Context / Scenario (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Read the following passage and answer..." className="h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="questionA" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-primary" /> Question ক</FormLabel>
                  <FormControl><Input placeholder="Define..." className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300" {...field} /></FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
              <FormField control={form.control} name="questionB" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-primary" /> Question খ</FormLabel>
                  <FormControl><Input placeholder="Explain..." className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300" {...field} /></FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
              <FormField control={form.control} name="questionC" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-primary" /> Question গ</FormLabel>
                  <FormControl><Textarea placeholder="Apply..." className="min-h-[80px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none" {...field} /></FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
              <FormField control={form.control} name="questionD" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-primary" /> Question ঘ (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Analyze..." className="min-h-[80px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )} />
            </div>
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
                        <SelectItem key={qt.id} value={qt.id} className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">
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

          {/* ATTACHMENTS SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3 mb-6">
              <LinkIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-slate-800">Attachments</h2>
            </div>
            <div className="space-y-4">
              {attachmentFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start p-6 border border-slate-100 rounded-2xl bg-slate-50 shadow-sm relative group">
                  <FormField
                    control={form.control}
                    name={`attachments.${index}.fileUrl`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LinkIcon className="w-3.5 h-3.5 text-primary" /> File URL</FormLabel>
                        <FormControl><Input placeholder="https://..." className="h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300" {...field} /></FormControl>
                        <FormMessage className="text-[11px] font-bold text-rose-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attachments.${index}.fileType`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-primary" /> File Type</FormLabel>
                        <FormControl><Input placeholder="image/jpeg" className="h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300" {...field} /></FormControl>
                        <FormMessage className="text-[11px] font-bold text-rose-500" />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all" onClick={() => removeAttachment(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2" onClick={() => appendAttachment({ fileUrl: "", fileType: "" })}>
                <Plus className="h-5 w-5" strokeWidth={3} /> Add Attachment
              </Button>
            </div>
          </div>

        <div className="flex items-center gap-3 pt-6 border-t border-outline/5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/cqs")}
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
            {isEditing ? "Save Changes" : "Create CQ"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
