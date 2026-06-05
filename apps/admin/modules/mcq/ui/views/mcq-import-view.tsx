"use client";

import { useState } from "react";
import { 
  useBulkCreateMCQs,
  useAcademicClassesForSelection,
  useAcademicSubjectsForSelection,
  useAcademicChaptersForSelection,
  useAcademicChapterTopicsForSelection,
  useQuestionTypesForSelection,
} from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { toast } from "@workspace/ui/components/sonner";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
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
import { McqCard } from "../components/mcq-card";

export const McqImportView = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const { mutateAsync: bulkCreateMCQs, isPending } = useBulkCreateMCQs();
  const router = useRouter();

  const [globalClassId, setGlobalClassId] = useState("");
  const [globalSubjectId, setGlobalSubjectId] = useState("");
  const [globalChapterId, setGlobalChapterId] = useState("");
  const [globalTopicId, setGlobalTopicId] = useState("");
  const [globalQuestionTypeId, setGlobalQuestionTypeId] = useState("");

  const { data: classes } = useAcademicClassesForSelection();
  const { data: subjects } = useAcademicSubjectsForSelection(globalClassId || undefined);
  const { data: chapters } = useAcademicChaptersForSelection(globalSubjectId || undefined);
  const { data: topics } = useAcademicChapterTopicsForSelection(globalChapterId || undefined);
  const { data: questionTypes } = useQuestionTypesForSelection();

  const handlePreview = () => {
    if (!globalClassId || !globalSubjectId || !globalChapterId) {
      toast.error("Please select Class, Subject, and Chapter first.");
      return;
    }
    try {
      if (!jsonInput.trim()) {
        toast.error("Please paste JSON data to import.");
        return;
      }
      
      // AI-generated JSON often contains unescaped single backslashes for LaTeX (like \(, \text, \frac)
      // which will crash JSON.parse() or be wrongly parsed (e.g. \f as form feed, \t as tab).
      // We automatically fix this by escaping any backslash that isn't already escaped 
      // and isn't a valid JSON control character like \n or \".
      const cleanedInput = jsonInput.replace(/(?<!\\)\\(?![n"\\/])/g, '\\\\');
      
      const parsedData = JSON.parse(cleanedInput);
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      const processedData = dataArray.map((item) => {
        // Map context to questionContext for backend API validation
        const rawCtx = item.context || item.questionContext;
        const ctx = typeof rawCtx === "string" ? { text: rawCtx } : rawCtx;
        
        return {
          ...item,
          session: item.session ? Number(item.session) : new Date().getFullYear(),
          questionUrl: item.questionUrl || "",
          subjectId: globalSubjectId,
          chapterId: globalChapterId,
          topicId: globalTopicId || undefined,
          questionTypeId: globalQuestionTypeId || undefined,
          questionContext: ctx,
          context: ctx, // Keep context for frontend preview
          explanation: item.explanation == null ? "" : String(item.explanation),
        };
      });
      
      setPreviewData(processedData);
    } catch (error) {
      toast.error("Invalid JSON format. Please check your data.");
      console.error(error);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData) return;
    try {
      await bulkCreateMCQs(previewData);
      router.push("/mcqs");
    } catch (error) {
      toast.error("Failed to import MCQs.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Import MCQs</h1>
        <p className="text-muted-foreground">
          {previewData 
            ? `Previewing ${previewData.length} Multiple Choice Questions for import.` 
            : "Paste your JSON data below to preview and bulk import MCQs."}
        </p>
      </div>
      
      {!previewData ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Classification Card */}
          <Card className="bg-card/80 backdrop-blur-2xl border-border/60 rounded-[2.5rem] overflow-hidden shadow-large relative transition-all duration-500 hover:shadow-glow/5">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Layers className="size-24 text-primary" />
            </div>
            <CardHeader className="pb-4 px-8 pt-8">
              <CardTitle className="text-2xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Academic Classification
              </CardTitle>
              <CardDescription className="font-bold text-muted-foreground/80">
                Apply classification to all imported MCQs
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Class */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Class *
                  </label>
                  <Select
                    value={globalClassId}
                    onValueChange={(v) => {
                      setGlobalClassId(v);
                      setGlobalSubjectId("");
                      setGlobalChapterId("");
                      setGlobalTopicId("");
                    }}
                  >
                    <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      {(classes as any[])?.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="font-medium rounded-lg">
                          {c.nameEn || c.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Subject *
                  </label>
                  <Select
                    value={globalSubjectId}
                    onValueChange={(v) => {
                      setGlobalSubjectId(v);
                      setGlobalChapterId("");
                      setGlobalTopicId("");
                    }}
                    disabled={!globalClassId}
                  >
                    <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      {(subjects as any[])?.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="font-medium rounded-lg">
                          {s.nameEn || s.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Chapter */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Chapter *
                  </label>
                  <Select
                    value={globalChapterId}
                    onValueChange={(v) => {
                      setGlobalChapterId(v);
                      setGlobalTopicId("");
                    }}
                    disabled={!globalSubjectId}
                  >
                    <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      {(chapters as any[])?.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="font-medium rounded-lg">
                          {c.nameEn || c.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Topic <span className="normal-case text-muted-foreground/50 font-normal">(optional)</span>
                  </label>
                  <Select
                    value={globalTopicId}
                    onValueChange={(v) => {
                      setGlobalTopicId(v);
                    }}
                    disabled={!globalChapterId}
                  >
                    <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      {(topics as any[])?.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="font-medium rounded-lg">
                          {t.nameEn || t.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Type */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Question Type <span className="normal-case text-muted-foreground/50 font-normal">(optional)</span>
                  </label>
                  <Select
                    value={globalQuestionTypeId}
                    onValueChange={(v) => setGlobalQuestionTypeId(v)}
                  >
                    <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      {(questionTypes as any[])?.map((qt) => (
                        <SelectItem key={qt.id} value={qt.id} className="font-medium rounded-lg">
                          {qt.nameEn || qt.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Textarea
            placeholder='[{"question": "What is 2+2?", "options": ["1","2","3","4"], "answer": "4", "type": "GENERAL", "session": 2024, "isMath": true}]'
            className="min-h-[400px] font-mono text-sm"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.push("/mcqs")}>
              Cancel
            </Button>
            <Button onClick={handlePreview}>
              Preview JSON
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 gap-4 p-2 border rounded-xl bg-muted/10">
            {previewData.map((mcq, idx) => (
              <McqCard
                key={idx}
                mcq={{ ...mcq, id: `preview-${idx}` }}
                onUpdate={(updatedMcq) => {
                  setPreviewData((prev) =>
                    prev ? prev.map((p, i) => (i === idx ? { ...p, ...updatedMcq } : p)) : null
                  );
                  toast.success("MCQ updated locally");
                }}
                onDelete={() => {
                  setPreviewData((prev) =>
                    prev ? prev.filter((_, i) => i !== idx) : null
                  );
                  toast.success("MCQ removed from import list");
                }}
              />
            ))}
          </div>
          <div className="flex justify-end gap-4 border-t pt-4">
            <Button variant="outline" onClick={() => setPreviewData(null)} disabled={isPending}>
              Back to Edit
            </Button>
            <Button onClick={handleConfirmImport} disabled={isPending}>
              {isPending ? "Importing..." : `Confirm Import (${previewData.length})`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
