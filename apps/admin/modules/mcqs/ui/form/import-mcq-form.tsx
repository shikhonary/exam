"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import { useImportMcqs } from "@workspace/api-client";
import { mcqFormSchema, type McqFormValues } from "@workspace/schema";
import { toast } from "@workspace/ui/components/sonner";
import { z } from "zod";
import { subjects } from "@workspace/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export function ImportMcqForm() {
  const router = useRouter();
  const { mutateAsync: importMcqs, isPending } = useImportMcqs();
  const [jsonInput, setJsonInput] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const previewData = useMemo(() => {
    if (!jsonInput.trim() || !selectedSubject) return null;
    try {
      const parsedData = JSON.parse(jsonInput);
      const dataArray = (Array.isArray(parsedData) ? parsedData : [parsedData]).map((item) => ({
        ...item,
        subject: selectedSubject,
      }));
      const validatedData = z.array(mcqFormSchema).parse(dataArray);
      return validatedData as McqFormValues[];
    } catch {
      return null;
    }
  }, [jsonInput, selectedSubject]);

  const handleSubmit = async () => {
    if (!previewData) {
      toast.error("Please enter valid JSON data matching the MCQ schema.");
      return;
    }

    try {
      const result = await importMcqs(previewData);
      if (result?.success) {
        router.push("/mcqs");
      }
    } catch (error) {
      toast.error("Failed to import data.");
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2">
            Select Subject
          </p>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-[300px] h-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/40 font-semibold">
              <SelectValue placeholder="Choose a subject..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient max-h-[300px]">
              {subjects.map((subject) => (
                <SelectItem
                  key={subject.value}
                  value={subject.value}
                  className="font-bold"
                >
                  {subject.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-700 mb-2">
            Paste JSON Data
          </p>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            disabled={!selectedSubject}
            placeholder={!selectedSubject ? "Please select a subject first..." : "[\n  {\n    \"question\": \"What is the primary function of ribosomes?\",\n    \"answer\": \"Protein synthesis\",\n    \"type\": \"single-choice\",\n    \"options\": [\n      \"Protein synthesis\",\n      \"Energy production\",\n      \"DNA replication\",\n      \"Waste elimination\"\n    ],\n    \"statements\": [],\n    \"isMath\": false,\n    \"reference\": [\"Biology 101\", \"Chapter 3: Cell Structure\"]\n  }\n]"}
            className="h-[250px] font-mono text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/40 transition-all p-4 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>Preview</span>
            {previewData && (
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {previewData.length} valid MCQs
              </span>
            )}
          </p>
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
            {!jsonInput.trim() ? (
              <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
                <p className="text-sm">Paste JSON to see preview</p>
              </div>
            ) : !previewData ? (
              <div className="h-[200px] flex flex-col items-center justify-center text-rose-400">
                <p className="text-sm font-medium">Invalid JSON or Schema Mismatch</p>
                <p className="text-xs mt-1 text-slate-400">Check formatting and required fields</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previewData.map((mcq, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group transition-all hover:border-primary/30">
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                          {mcq.type}
                        </span>
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{mcq.question}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                        {mcq.subject}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      {mcq.options.map((opt, oIdx) => {
                        const isCorrect = Array.isArray(mcq.answer) 
                          ? mcq.answer.includes(opt)
                          : mcq.answer === opt || (mcq.type === 'multiple-statement' && String(mcq.answer).includes(String(oIdx + 1)));
                          
                        return (
                          <div
                            key={oIdx}
                            className={`text-xs px-3 py-2 rounded-lg border flex items-center gap-2 ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold"
                                : "bg-slate-50 border-slate-100 text-slate-600"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] border ${isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'}`}>
                              {String.fromCharCode(65 + oIdx)}
                            </div>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !previewData}
          className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-md shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 border-none"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" strokeWidth={3} />
          )}
          Import {previewData ? previewData.length : ""} MCQs
        </Button>
      </div>
    </div>
  );
}
