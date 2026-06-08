"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Sparkles,
  FileText,
  BookOpen,
  Save,
  Plus,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
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
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";

import {
  questionPaperFormSchema,
  QuestionPaperFormValues,
  defaultQuestionPaperValues,
} from "@workspace/schema";
import {
  useUpdateQuestionPaper,
  useQuestionPaperById,
  useAcademicClassesForSelection,
  useAcademicSubjectsForSelection,
} from "@workspace/api-client";

import {
  BreakdownTable,
  MarkDistributionRow,
  rowTotal,
} from "./breakdown-table";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface PaperDistribution {
  id: string;
  questionTypeId: string;
  marksPerQuestion: number;
  questionCount: number;
  questionsToAttempt: number | null;
}

interface PaperSubject {
  id: string;
  subjectId: string;
  distributions: PaperDistribution[];
}

interface QuestionPaperData {
  title: string;
  classId: string;
  examName: string;
  total: number;
  timeInMinutes: number;
  description?: string;
  status: string;
  subjects: PaperSubject[];
}

// ─── EditPaperForm ────────────────────────────────────────────────────────────

interface EditPaperFormProps {
  paperId: string;
}

export const EditPaperForm = ({ paperId }: EditPaperFormProps) => {
  const router = useRouter();
  const { data: paper, isLoading: isFetching } = useQuestionPaperById(paperId);
  const { mutateAsync: updatePaper, isPending } = useUpdateQuestionPaper();
  const { data: classes } = useAcademicClassesForSelection();

  const form = useForm<QuestionPaperFormValues>({
    resolver: zodResolver(questionPaperFormSchema),
    defaultValues: defaultQuestionPaperValues,
  });

  const [selectedClassId, setSelectedClassId] = React.useState<
    string | undefined
  >(undefined);
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>(
    [],
  );
  const [activeSubjectId, setActiveSubjectId] = React.useState<string | null>(
    null,
  );

  const { data: subjects } = useAcademicSubjectsForSelection(selectedClassId);

  const breakdownRegistry = React.useRef<
    Map<string, () => MarkDistributionRow[]>
  >(new Map());

  // Initialize form with existing paper data
  React.useEffect(() => {
    if (paper) {
      const p = paper as QuestionPaperData;
      const subjectIds = p.subjects?.map((s) => s.subjectId) || [];
      form.reset({
        title: p.title || "",
        classId: p.classId || "",
        examName: p.examName || "",
        total: p.total || 0,
        timeInMinutes: p.timeInMinutes || 0,
        description: p.description || "",
        status: (p.status as "Draft" | "Published") ?? "Draft",
        subjectIds: subjectIds,
      });

      setSelectedClassId(p.classId);
      setSelectedSubjectIds(subjectIds);
      if (subjectIds.length > 0) {
        setActiveSubjectId(subjectIds[0] || null);
      }
    }
  }, [paper, form]);

  const handleClassChange = (classId: string) => {
    form.setValue("subjectIds", []);
    setSelectedClassId(classId);
    setSelectedSubjectIds([]);
    setActiveSubjectId(null);
    breakdownRegistry.current.clear();
  };

  const handleSubjectChange = (newIds: string[]) => {
    setSelectedSubjectIds(newIds);
    form.setValue("subjectIds", newIds);

    if (newIds.length === 0) {
      setActiveSubjectId(null);
    } else if (!activeSubjectId || !newIds.includes(activeSubjectId)) {
      setActiveSubjectId(newIds[0] || null);
    }
  };

  const distributionsBySubject = React.useMemo(() => {
    if (!paper?.subjects) return new Map<string, MarkDistributionRow[]>();
    const map = new Map<string, MarkDistributionRow[]>();
    const p = paper as QuestionPaperData;
    p.subjects.forEach((ps) => {
      map.set(
        ps.subjectId,
        ps.distributions.map((d) => ({
          id: d.id,
          questionTypeId: d.questionTypeId,
          marksPerQuestion: d.marksPerQuestion,
          questionCount: d.questionCount,
          questionsToAttempt: d.questionsToAttempt,
        })),
      );
    });
    return map;
  }, [paper]);

  const onSubmit = React.useCallback(
    async (data: QuestionPaperFormValues) => {
      try {
        const subjectBreakdowns = selectedSubjectIds.map((sid) => {
          const getRows = breakdownRegistry.current.get(sid);
          const rows = getRows?.() ?? [];
          return {
            subjectId: sid,
            distributions: rows.map((r) => ({
              questionTypeId: r.questionTypeId,
              marksPerQuestion: r.marksPerQuestion,
              questionCount: r.questionCount,
              totalMarks: rowTotal(r),
              questionsToAttempt: r.questionsToAttempt,
            })),
          };
        });

        await updatePaper({
          id: paperId,
          data: {
            ...data,
            subjectBreakdowns,
          },
        });
        router.push(`/question-papers/${paperId}/build`);
      } catch (error) {
        console.error(error);
      }
    },
    [paperId, selectedSubjectIds, updatePaper, router],
  );

  // Wrapper to satisfy lint vs "accessing refs during render"
  // Even though it's inside handleSubmit, the linter sometimes flags
  // the ref capture in the callback.
  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading paper data...
        </p>
      </div>
    );
  }

  const subjectsData =
    (subjects as { id: string; nameBn: string }[]) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
      <Form {...form}>
        <form onSubmit={handleSubmission} className="space-y-8 p-6 md:p-8">
          
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Paper Details
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Document Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Annual Exam – Grade 10"
                      {...field}
                      disabled={isPending}
                      className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      Class / Grade *
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={selectedClassId ?? ""}
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleClassChange(val);
                        }}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                          {classes?.map(
                            (c: { id: string; nameBn: string }) => (
                              <SelectItem
                                key={c.id}
                                value={c.id}
                                className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary"
                              >
                                {c.nameBn}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold text-rose-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="examName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      Examination Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Annual Exam 2024"
                        {...field}
                        disabled={isPending}
                        className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold text-rose-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5 text-primary" />
                      Total Marks
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isPending}
                        className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold text-rose-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeInMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      Duration (Min)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="180"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isPending}
                        className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subjectIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    Target Subjects *
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      {...field}
                      options={subjectsData.map((s) => ({
                        label: s.nameBn,
                        value: s.id,
                      }))}
                      selected={selectedSubjectIds}
                      onChange={(vals) => {
                        field.onChange(vals);
                        handleSubjectChange(vals);
                      }}
                      placeholder={
                        selectedClassId
                          ? "Select subjects..."
                          : "Select a class first"
                      }
                      disabled={isPending || !selectedClassId}
                      className="h-12 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all shadow-none"
                    />
                  </FormControl>
                  {!subjectsData.length && selectedClassId && (
                    <p className="text-[11px] font-bold text-rose-500 italic">
                      No subjects found for the selected class.
                    </p>
                  )}
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Description / Instructions
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Internal notes or header instructions..."
                      {...field}
                      disabled={isPending}
                      className="min-h-[100px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Mark Breakdown */}
          {selectedSubjectIds.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Mark Breakdown
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {selectedSubjectIds.map((sid) => {
                  const subject = subjectsData.find((s) => s.id === sid);
                  return (
                    <button
                      key={sid}
                      type="button"
                      onClick={() => setActiveSubjectId(sid)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        activeSubjectId === sid
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      {subject?.nameBn ?? sid}
                    </button>
                  );
                })}
              </div>

              {selectedSubjectIds.map((sid) => {
                const subject = subjectsData.find((s) => s.id === sid);
                return (
                  <div
                    key={sid}
                    className={
                      activeSubjectId === sid ? "block space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100" : "hidden"
                    }
                  >
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                      {subject?.nameBn ?? sid} — Mark Distribution
                    </p>
                    <BreakdownTable
                      subjectId={sid}
                      initialRows={distributionsBySubject.get(sid)}
                      registryRef={breakdownRegistry}
                      disabled={isPending}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3 pt-6 border-t border-outline/5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 h-12 px-6 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50 border-none transition-all"
            >
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
};
