"use client";

import { useState } from "react";
import { Check, Edit, Trash2, Link as LinkIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { type CQ } from "@workspace/schema";

export type CqCardItem = CQ & {
  subject?: { name: string; nameEn?: string; nameBn?: string };
  chapter?: { name: string; nameEn?: string; nameBn?: string };
  topic?: { name: string; nameEn?: string; nameBn?: string };
  questionType?: { nameEn: string; nameBn: string; label?: string };
};

interface CqCardProps {
  cq: CqCardItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: () => void;
  onUpdate?: (updatedCq: CqCardItem) => void;
  isLoading?: boolean;
}

type EditField = "context" | "questionA" | "questionB" | "questionC" | "questionD" | "reference" | null;

export const CqCard = ({
  cq,
  selected = false,
  onSelect,
  onDelete,
  onUpdate,
  isLoading = false,
}: CqCardProps) => {
  const [editingField, setEditingField] = useState<EditField>(null);
  const [editData, setEditData] = useState({
    context: cq.context || "",
    questionA: cq.questionA || "",
    questionB: cq.questionB || "",
    questionC: cq.questionC || "",
    questionD: cq.questionD || "",
    reference: cq.reference || [],
  });
  
  const handleBlur = () => {
    if (editingField) {
      if (onUpdate) {
        onUpdate({ ...cq, ...editData });
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
        onClick={() => onSelect?.(cq.id)}
      >
        {selected && <Check className="h-4 w-4" />}
      </div>

      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-2 pr-10">
          <Badge variant="secondary" className="bg-secondary/50">
            {cq.subject?.nameEn || cq.subject?.nameBn || cq.subject?.name || "No Subject"}
          </Badge>
          {cq.chapter && (
            <Badge variant="outline" className="text-muted-foreground border-dashed">
              {cq.chapter.nameEn || cq.chapter.nameBn || cq.chapter.name}
            </Badge>
          )}
          {cq.topic && (
            <Badge variant="outline" className="text-muted-foreground border-dotted">
              {cq.topic.nameEn || cq.topic.nameBn || cq.topic.name}
            </Badge>
          )}
          {cq.questionType && (
            <Badge variant="outline" className="text-primary/70 border-primary/20 bg-primary/5">
              {cq.questionType.nameEn || cq.questionType.nameBn || cq.questionType.label}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {editingField === "context" ? (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Context</label>
              <Textarea 
                value={editData.context} 
                onChange={(e) => setEditData({ ...editData, context: e.target.value })} 
                onBlur={handleBlur}
                className="mt-1"
                placeholder="Context..."
                autoFocus
              />
            </div>
          ) : cq.context ? (
            <div 
              onDoubleClick={() => setEditingField("context")}
              className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg whitespace-pre-wrap mb-4 cursor-text hover:bg-muted/50 transition-colors"
              title="Double-click to edit context"
            >
              {cq.context}
            </div>
          ) : null}

          <div className="space-y-2">
            {editingField === "questionA" ? (
              <div>
                <label className="text-xs font-semibold text-muted-foreground">ক)</label>
                <Input 
                  value={editData.questionA} 
                  onChange={(e) => setEditData({ ...editData, questionA: e.target.value })} 
                  onBlur={handleBlur}
                  className="mt-1"
                  autoFocus
                />
              </div>
            ) : (
              <p 
                className="text-sm font-medium cursor-text hover:bg-muted/10 p-1 -m-1 rounded transition-colors"
                onDoubleClick={() => setEditingField("questionA")}
                title="Double-click to edit"
              >
                <span className="font-bold mr-2 text-primary">ক)</span>
                {cq.questionA}
              </p>
            )}

            {editingField === "questionB" ? (
              <div>
                <label className="text-xs font-semibold text-muted-foreground">খ)</label>
                <Input 
                  value={editData.questionB} 
                  onChange={(e) => setEditData({ ...editData, questionB: e.target.value })} 
                  onBlur={handleBlur}
                  className="mt-1"
                  autoFocus
                />
              </div>
            ) : (
              <p 
                className="text-sm text-muted-foreground cursor-text hover:bg-muted/10 p-1 -m-1 rounded transition-colors"
                onDoubleClick={() => setEditingField("questionB")}
                title="Double-click to edit"
              >
                <span className="font-bold mr-2 text-primary">খ)</span>
                {cq.questionB}
              </p>
            )}

            {editingField === "questionC" ? (
              <div>
                <label className="text-xs font-semibold text-muted-foreground">গ)</label>
                <Textarea 
                  value={editData.questionC} 
                  onChange={(e) => setEditData({ ...editData, questionC: e.target.value })} 
                  onBlur={handleBlur}
                  className="mt-1"
                  autoFocus
                />
              </div>
            ) : (
              <p 
                className="text-sm text-muted-foreground cursor-text hover:bg-muted/10 p-1 -m-1 rounded transition-colors"
                onDoubleClick={() => setEditingField("questionC")}
                title="Double-click to edit"
              >
                <span className="font-bold mr-2 text-primary">গ)</span>
                {cq.questionC}
              </p>
            )}

            {editingField === "questionD" ? (
              <div>
                <label className="text-xs font-semibold text-muted-foreground">ঘ)</label>
                <Textarea 
                  value={editData.questionD} 
                  onChange={(e) => setEditData({ ...editData, questionD: e.target.value })} 
                  onBlur={handleBlur}
                  className="mt-1"
                  autoFocus
                />
              </div>
            ) : cq.questionD ? (
              <p 
                className="text-sm text-muted-foreground cursor-text hover:bg-muted/10 p-1 -m-1 rounded transition-colors"
                onDoubleClick={() => setEditingField("questionD")}
                title="Double-click to edit"
              >
                <span className="font-bold mr-2 text-primary">ঘ)</span>
                {cq.questionD}
              </p>
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
            ) : cq.reference && cq.reference.length > 0 ? (
              <div 
                className="pt-2 mt-4 border-t border-muted/50 cursor-text hover:bg-muted/10 p-2 -mx-2 rounded transition-colors"
                onDoubleClick={() => setEditingField("reference")}
                title="Double-click to edit references"
              >
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                  <LinkIcon className="h-3 w-3" /> References
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {cq.reference.map((ref, i) => (
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
        {editingField === null && (
          <>
            <Link href={`/cqs/edit/${cq.id}`}>
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

export const CqCardSkeleton = () => {
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
          <Skeleton className="h-4 w-full bg-surface-container" />
          <Skeleton className="h-4 w-[90%] bg-surface-container" />
          <Skeleton className="h-4 w-[60%] bg-surface-container" />
        </div>
        <div className="space-y-4 pt-4 border-t border-dashed">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-5 w-5 rounded bg-surface-container shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full bg-surface-container" />
                <Skeleton className="h-4 w-2/3 bg-surface-container" />
              </div>
            </div>
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
