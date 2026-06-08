"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import {
  useSubjectQuestionTypes,
  useAssignQuestionTypesToSubject,
  useRemoveSubjectQuestionType,
  useUpdateSubjectQuestionTypeLabel,
  useQuestionTypesForSelection,
} from "@workspace/api-client";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SubjectQuestionTypeManagerProps {
  subjectId: string;
}

// ---------------------------------------------------------------------------
// Inline edit row
// ---------------------------------------------------------------------------

function EditableRow({
  id,
  subjectId,
  label,
  questionType,
}: {
  id: string;
  subjectId: string;
  label: string;
  questionType: { id: string; nameEn: string; nameBn: string };
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);

  const { mutateAsync: updateLabel, isPending: isUpdating } =
    useUpdateSubjectQuestionTypeLabel(subjectId);
  const { mutateAsync: remove, isPending: isRemoving } =
    useRemoveSubjectQuestionType(subjectId);

  const handleSave = async () => {
    if (!value.trim()) return;
    await updateLabel({ id, data: { label: value.trim() } });
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl group transition-all hover:border-primary/20 hover:bg-primary/5">
      {/* Type info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-700 leading-none truncate">
          {questionType.nameEn}
        </p>
        {questionType.nameBn && (
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{questionType.nameBn}</p>
        )}
      </div>

      {/* Label (editable) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {editing ? (
          <>
            <Input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-8 w-24 px-2 text-xs font-bold rounded-xl border-primary/40 focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") { setEditing(false); setValue(label); }
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              disabled={isUpdating}
              className="h-7 w-7 rounded-lg text-emerald-600 hover:bg-emerald-50"
            >
              {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => { setEditing(false); setValue(label); }}
              className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <>
            <Badge
              variant="outline"
              className="font-mono bg-white text-primary border-primary/20 h-6 text-[11px] cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => setEditing(true)}
            >
              {label}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditing(true)}
              className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary hover:bg-primary/10"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </>
        )}

        {/* Remove */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => remove({ id })}
          disabled={isRemoving}
          className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-destructive hover:bg-destructive/10"
        >
          {isRemoving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add form
// ---------------------------------------------------------------------------

function AddQuestionTypeRow({
  subjectId,
  alreadyAssignedIds,
}: {
  subjectId: string;
  alreadyAssignedIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [label, setLabel] = useState("");

  const { data: allTypes } = useQuestionTypesForSelection();
  const { mutateAsync: assign, isPending } = useAssignQuestionTypesToSubject();

  const available = (allTypes ?? []).filter((t) => !alreadyAssignedIds.includes(t.id));

  const handleAdd = async () => {
    if (!selectedId || !label.trim()) return;
    await assign({ subjectId, items: [{ questionTypeId: selectedId, label: label.trim() }] });
    setSelectedId("");
    setLabel("");
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={available.length === 0}
        className="w-full h-10 rounded-2xl border-dashed border-primary/30 text-primary hover:bg-primary/5 text-xs font-bold gap-2"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={3} />
        {available.length === 0 ? "All question types assigned" : "Assign Question Type"}
      </Button>
    );
  }

  return (
    <div className="flex items-end gap-2 p-3 bg-primary/5 border border-primary/10 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Type picker */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</p>
        <Select value={selectedId} onValueChange={(v) => {
          setSelectedId(v);
          const found = allTypes?.find((t) => t.id === v);
          if (found && !label) setLabel(found.label);
        }}>
          <SelectTrigger className="h-9 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
            {available.map((t) => (
              <SelectItem key={t.id} value={t.id} className="font-medium text-xs">
                {t.nameEn} <span className="opacity-40 ml-1">({t.label})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Label override */}
      <div className="w-28 flex-shrink-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Label</p>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. MCQ"
          className="h-9 px-3 text-xs font-bold bg-white border border-slate-100 rounded-xl"
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setOpen(false); }}
        />
      </div>

      {/* Actions */}
      <Button
        type="button"
        size="icon"
        onClick={handleAdd}
        disabled={!selectedId || !label.trim() || isPending}
        className="h-9 w-9 rounded-xl bg-primary text-white shadow-md shadow-primary/25 flex-shrink-0"
      >
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => setOpen(false)}
        className="h-9 w-9 rounded-xl flex-shrink-0 text-slate-400 hover:bg-slate-100"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Manager panel
// ---------------------------------------------------------------------------

export function SubjectQuestionTypeManager({ subjectId }: SubjectQuestionTypeManagerProps) {
  const { data: assigned, isLoading } = useSubjectQuestionTypes(subjectId);

  return (
    <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <HelpCircle className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
            Question Types
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Assign allowed question types for this subject
          </p>
        </div>
        <Badge
          variant="secondary"
          className="ml-auto text-[10px] font-black bg-primary/10 text-primary border-0"
        >
          {assigned?.length ?? 0} assigned
        </Badge>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary/40" />
          </div>
        ) : assigned && assigned.length > 0 ? (
          assigned.map((item) => (
            <EditableRow
              key={item.id}
              id={item.id}
              subjectId={subjectId}
              label={item.label}
              questionType={item.questionType}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-6 text-center">
            <div>
              <HelpCircle className="h-8 w-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">No question types assigned yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Add row */}
      <AddQuestionTypeRow
        subjectId={subjectId}
        alreadyAssignedIds={assigned?.map((a) => a.questionTypeId) ?? []}
      />
    </div>
  );
}
