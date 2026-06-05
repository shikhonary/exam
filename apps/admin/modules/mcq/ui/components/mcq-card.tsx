"use client";

import { useState } from "react";
import { Check, Edit, Trash2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { type Mcq } from "@workspace/schema";
import { parseMathString } from "@/lib/math";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { mcqTypeOptions } from "@workspace/utils/constants";

export type McqCardItem = Mcq & {
  subject?: { name: string; nameEn?: string; nameBn?: string };
  chapter?: { name: string; nameEn?: string; nameBn?: string };
  topic?: { name: string; nameEn?: string; nameBn?: string };
  context?: { id: string; text?: string | null; url?: string | null; title?: string | null } | null;
};

interface McqCardProps {
  mcq: McqCardItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: () => void;
  onUpdate?: (updatedMcq: McqCardItem) => void;
  isLoading?: boolean;
}

type EditField = "question" | "explanation" | "reference" | "context" | `statement-${number}` | `option-${number}` | "answer" | null;

export const McqCard = ({
  mcq,
  selected = false,
  onSelect,
  onDelete,
  onUpdate,
  isLoading = false,
}: McqCardProps) => {
  const [editingField, setEditingField] = useState<EditField>(null);
  const [editData, setEditData] = useState({
    question: mcq.question || "",
    explanation: mcq.explanation || "",
    reference: mcq.reference || [],
    contextText: mcq.context?.text || "",
    statements: mcq.statements || [],
    options: mcq.options || [],
    answer: mcq.answer || "",
  });
  
  const handleBlur = () => {
    if (editingField) {
      if (onUpdate) {
        const updatedContext = mcq.context ? { ...mcq.context, text: editData.contextText } : mcq.context;
        onUpdate({ 
          ...mcq, 
          question: editData.question,
          explanation: editData.explanation,
          reference: editData.reference,
          statements: editData.statements,
          options: editData.options,
          answer: editData.answer,
          context: updatedContext,
          questionContext: updatedContext // Sync for backend API
        });
      }
      setEditingField(null);
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2",
        selected ? "border-primary/50 bg-primary/5" : "border-transparent hover:border-border"
      )}
    >
      <div
        className={cn(
          "absolute top-4 right-4 z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary/50"
        )}
        onClick={() => onSelect?.(mcq.id)}
      >
        {selected && <Check className="h-4 w-4" />}
      </div>

      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-2 pr-10">
          <Badge variant="secondary" className="bg-secondary/50">
            {mcq.subject?.nameEn || mcq.subject?.nameBn || mcq.subject?.name || "No Subject"}
          </Badge>
          {mcq.chapter && (
            <Badge variant="outline" className="text-muted-foreground border-dashed">
              {mcq.chapter.nameEn || mcq.chapter.nameBn || mcq.chapter.name}
            </Badge>
          )}
          {mcq.topic && (
            <Badge variant="outline" className="text-muted-foreground border-dotted">
              {mcq.topic.nameEn || mcq.topic.nameBn || mcq.topic.name}
            </Badge>
          )}
          {editingField === "type" ? (
            <div className="w-36">
              <Select 
                value={mcq.type} 
                onValueChange={(v) => {
                  if (onUpdate) onUpdate({ ...mcq, type: v });
                  setEditingField(null);
                }}
                onOpenChange={(open) => { if (!open) setEditingField(null); }}
                defaultOpen
              >
                <SelectTrigger className="h-6 text-xs px-2 py-0 border-primary/20 bg-primary/5 text-primary/70 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mcqTypeOptions.map(opt => (
                     <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Badge 
              variant="outline" 
              className="text-primary/70 border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
              onDoubleClick={() => setEditingField("type")}
              title="Double-click to edit type"
            >
              {mcqTypeOptions.find(o => o.value === mcq.type)?.label || mcq.type}
            </Badge>
          )}

          <Badge 
            variant="outline" 
            className={cn(
              "cursor-pointer transition-colors", 
              mcq.isMath ? "text-indigo-500 border-indigo-200 bg-indigo-50 hover:bg-indigo-100" : "text-muted-foreground border-dashed hover:bg-muted"
            )}
            onClick={() => onUpdate?.({ ...mcq, isMath: !mcq.isMath })}
            title="Click to toggle Math formatting"
          >
            Math {mcq.isMath ? "On" : "Off"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {mcq.context && (
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg mb-4 transition-colors">
              <p className="font-bold mb-1 text-foreground/70">{mcq.context.title || "Context"}</p>
              {editingField === "context" ? (
                <Textarea
                  value={editData.contextText}
                  onChange={(e) => setEditData({ ...editData, contextText: e.target.value })}
                  onBlur={handleBlur}
                  autoFocus
                  className="mt-1"
                />
              ) : (
                <div
                  className="whitespace-pre-wrap cursor-text hover:bg-muted/50 p-1 -m-1 rounded transition-colors"
                  onDoubleClick={() => setEditingField("context")}
                  title="Double-click to edit"
                >
                  {mcq.context.text ? parseMathString(mcq.context.text) : null}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            {editingField === "question" ? (
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Question</label>
                <Textarea 
                  value={editData.question} 
                  onChange={(e) => setEditData({ ...editData, question: e.target.value })} 
                  onBlur={handleBlur}
                  className="mt-1"
                  autoFocus
                />
              </div>
            ) : (
              <p 
                className="text-base font-bold cursor-text hover:bg-muted/10 p-1 -m-1 rounded transition-colors"
                onDoubleClick={() => setEditingField("question")}
                title="Double-click to edit"
              >
                {parseMathString(mcq.question)}
              </p>
            )}

            {mcq.statements && mcq.statements.length > 0 && (
              <div className="py-2 pl-4 space-y-1">
                {mcq.statements.map((stmt, i) => (
                  <div key={i} className="text-sm font-medium text-slate-700 flex gap-2">
                    <span className="text-primary font-bold mt-1">{["i", "ii", "iii", "iv", "v"][i] || i + 1}.</span> 
                    {editingField === `statement-${i}` ? (
                      <Input
                        value={editData.statements[i]}
                        onChange={(e) => {
                          const newStatements = [...editData.statements];
                          newStatements[i] = e.target.value;
                          setEditData({ ...editData, statements: newStatements });
                        }}
                        onBlur={handleBlur}
                        autoFocus
                        className="h-8"
                      />
                    ) : (
                      <span 
                        className="cursor-text hover:bg-muted/10 p-1 -m-1 rounded transition-colors flex-1"
                        onDoubleClick={() => setEditingField(`statement-${i}`)}
                        title="Double-click to edit"
                      >
                        {parseMathString(stmt)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 pb-2 space-y-2">
              {mcq.options.map((opt, i) => {
                const isCorrect = mcq.answer === opt;
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border", 
                      isCorrect ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 font-medium" : "border-border/50 bg-background/50"
                    )}
                  >
                    <div 
                      className={cn(
                        "flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold cursor-pointer transition-colors", 
                        isCorrect ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:bg-emerald-200"
                      )}
                      onClick={() => {
                        setEditData({ ...editData, answer: opt });
                        if (onUpdate) onUpdate({ ...mcq, answer: opt });
                      }}
                      title="Click to set as correct answer"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    {editingField === `option-${i}` ? (
                      <Input
                        value={editData.options[i]}
                        onChange={(e) => {
                          const newOptions = [...editData.options];
                          const oldOpt = newOptions[i];
                          newOptions[i] = e.target.value;
                          // If this was the answer, update the answer too
                          const newAnswer = editData.answer === oldOpt ? e.target.value : editData.answer;
                          setEditData({ ...editData, options: newOptions, answer: newAnswer });
                        }}
                        onBlur={handleBlur}
                        autoFocus
                        className="h-8 flex-1"
                      />
                    ) : (
                      <span 
                        className="text-sm cursor-text hover:bg-muted/10 p-1 -m-1 rounded transition-colors flex-1"
                        onDoubleClick={() => setEditingField(`option-${i}`)}
                        title="Double-click to edit"
                      >
                        {parseMathString(opt)}
                      </span>
                    )}
                    {isCorrect && <Check className="h-4 w-4 ml-auto text-emerald-500" />}
                  </div>
                );
              })}
            </div>

            {editingField === "explanation" ? (
              <div className="pt-2">
                <label className="text-xs font-semibold text-muted-foreground">Explanation</label>
                <Textarea 
                  value={editData.explanation} 
                  onChange={(e) => setEditData({ ...editData, explanation: e.target.value })} 
                  onBlur={handleBlur}
                  className="mt-1"
                  autoFocus
                />
              </div>
            ) : mcq.explanation ? (
              <div 
                className="text-sm text-muted-foreground bg-sky-50/50 border border-sky-100 p-3 rounded-lg whitespace-pre-wrap cursor-text hover:bg-sky-50 transition-colors mt-2"
                onDoubleClick={() => setEditingField("explanation")}
                title="Double-click to edit explanation"
              >
                <div className="flex gap-2 items-center text-sky-700 font-bold mb-1 text-xs uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" /> Explanation
                </div>
                {parseMathString(mcq.explanation)}
              </div>
            ) : null}

            {editingField === "reference" ? (
              <div className="pt-3">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" /> References (One per line)
                </label>
                <Textarea 
                  value={editData.reference.join("\n")} 
                  onChange={(e) => setEditData({ ...editData, reference: e.target.value.split("\n").filter(r => r.trim() !== "") })} 
                  onBlur={handleBlur}
                  className="mt-1 text-xs font-mono"
                  autoFocus
                  placeholder="https://example.com/ref1&#10;https://example.com/ref2"
                />
              </div>
            ) : mcq.reference && mcq.reference.length > 0 ? (
              <div 
                className="pt-2 mt-4 border-t border-muted/50 cursor-text hover:bg-muted/10 p-2 -mx-2 rounded transition-colors"
                onDoubleClick={() => setEditingField("reference")}
                title="Double-click to edit references"
              >
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                  <LinkIcon className="h-3 w-3" /> References
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {mcq.reference.map((ref, i) => (
                    <li key={i} className="text-xs text-primary/80 hover:text-primary truncate marker:text-primary/50">
                      <a href={ref.startsWith('http') ? ref : `https://${ref}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                        {ref}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t bg-muted/10 flex justify-end gap-2">
        {editingField === null && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Delete</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export const McqCardSkeleton = () => {
  return (
    <Card className="group relative overflow-hidden border-2 border-transparent">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-2 pr-10">
          <Skeleton className="h-6 w-24 bg-surface-container rounded-full" />
          <Skeleton className="h-6 w-20 bg-surface-container rounded-full opacity-70" />
          <Skeleton className="h-6 w-28 bg-surface-container rounded-full opacity-60" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-[90%] bg-surface-container" />
        </div>
        <div className="space-y-2 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg bg-surface-container" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t bg-muted/10 flex justify-end gap-2">
        <Skeleton className="h-8 w-16 bg-surface-container rounded-md" />
        <Skeleton className="h-8 w-8 bg-surface-container rounded-md" />
      </CardFooter>
    </Card>
  );
};
