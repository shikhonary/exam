"use client";

import { useState } from "react";
import { Check, Edit, Trash2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Textarea } from "@workspace/ui/components/textarea";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { type ShortAnswer } from "@workspace/schema";

export type ShortAnswerCardItem = ShortAnswer & {
  subject?: { name: string; nameEn?: string; nameBn?: string };
  chapter?: { name: string; nameEn?: string; nameBn?: string };
  topic?: { name: string; nameEn?: string; nameBn?: string };
  questionType?: { nameEn: string; nameBn: string; label?: string };
};

interface ShortAnswerCardProps {
  item: ShortAnswerCardItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: () => void;
  onUpdate?: (updatedItem: ShortAnswerCardItem) => void;
  isLoading?: boolean;
}

type EditField = "question" | "answer" | "reference" | null;

export const ShortAnswerCard = ({
  item,
  selected = false,
  onSelect,
  onDelete,
  onUpdate,
  isLoading = false,
}: ShortAnswerCardProps) => {
  const [editingField, setEditingField] = useState<EditField>(null);
  const [editData, setEditData] = useState({
    question: item.question || "",
    answer: item.answer || "",
    reference: item.reference || [],
  });
  
  const handleBlur = () => {
    if (editingField) {
      if (onUpdate) {
        onUpdate({ ...item, ...editData });
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
        onClick={() => onSelect?.(item.id)}
      >
        {selected && <Check className="h-4 w-4" />}
      </div>

      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-2 pr-10">
          <Badge variant="secondary" className="bg-secondary/50">
            {item.subject?.nameEn || item.subject?.nameBn || item.subject?.name || "No Subject"}
          </Badge>
          {item.chapter && (
            <Badge variant="outline" className="text-muted-foreground border-dashed">
              {item.chapter.nameEn || item.chapter.nameBn || item.chapter.name}
            </Badge>
          )}
          {item.topic && (
            <Badge variant="outline" className="text-muted-foreground border-dotted">
              {item.topic.nameEn || item.topic.nameBn || item.topic.name}
            </Badge>
          )}
          {item.questionType && (
            <Badge variant="outline" className="text-primary/70 border-primary/20 bg-primary/5">
              {item.questionType.nameEn || item.questionType.nameBn || item.questionType.label}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* QUESTION FIELD */}
          {editingField === "question" ? (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Question</label>
              <Textarea 
                value={editData.question} 
                onChange={(e) => setEditData({ ...editData, question: e.target.value })} 
                onBlur={handleBlur}
                className="mt-1"
                placeholder="Type your question..."
                autoFocus
              />
            </div>
          ) : (
            <div 
              onDoubleClick={() => setEditingField("question")}
              className="text-lg font-bold text-foreground p-2 -mx-2 rounded-lg cursor-text hover:bg-muted/30 transition-colors"
              title="Double-click to edit question"
            >
              {item.question}
            </div>
          )}

          {/* ANSWER FIELD */}
          {editingField === "answer" ? (
            <div className="pt-2">
              <label className="text-xs font-semibold text-muted-foreground">Answer (Optional)</label>
              <Textarea 
                value={editData.answer} 
                onChange={(e) => setEditData({ ...editData, answer: e.target.value })} 
                onBlur={handleBlur}
                className="mt-1"
                placeholder="Type the answer..."
                autoFocus
              />
            </div>
          ) : item.answer ? (
            <div 
              className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg whitespace-pre-wrap cursor-text hover:bg-primary/10 transition-colors"
              onDoubleClick={() => setEditingField("answer")}
              title="Double-click to edit answer"
            >
              <span className="font-bold text-primary block mb-1">Answer:</span>
              {item.answer}
            </div>
          ) : (
            <div 
              className="text-xs text-muted-foreground/50 p-2 -mx-2 rounded-lg cursor-text hover:bg-muted/10 transition-colors flex items-center gap-2"
              onDoubleClick={() => setEditingField("answer")}
              title="Double-click to add an answer"
            >
              <AlertCircle className="w-4 h-4" /> No answer provided. Double-click to add one.
            </div>
          )}

          {/* REFERENCE FIELD */}
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
          ) : item.reference && item.reference.length > 0 ? (
            <div 
              className="pt-2 mt-4 border-t border-muted/50 cursor-text hover:bg-muted/10 p-2 -mx-2 rounded transition-colors"
              onDoubleClick={() => setEditingField("reference")}
              title="Double-click to edit references"
            >
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                <LinkIcon className="h-3 w-3" /> References
              </p>
              <ul className="list-disc list-inside space-y-1">
                {item.reference.map((ref, i) => (
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
      </CardContent>

      <CardFooter className="pt-4 border-t bg-muted/10 flex justify-end gap-2">
        {editingField === null && (
          <>
            <Link href={`/short-answers/edit/${item.id}`}>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Edit className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Edit</span>
              </Button>
            </Link>
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
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export const ShortAnswerCardSkeleton = () => {
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
          <Skeleton className="h-6 w-full bg-surface-container" />
          <Skeleton className="h-20 w-full bg-surface-container mt-4" />
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t bg-muted/10 flex justify-end gap-2">
        <Skeleton className="h-8 w-16 bg-surface-container rounded-md" />
        <Skeleton className="h-8 w-8 bg-surface-container rounded-md" />
      </CardFooter>
    </Card>
  );
};
