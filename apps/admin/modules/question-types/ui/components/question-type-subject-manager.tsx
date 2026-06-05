"use client";

import { useState } from "react";
import {
  Plus, Trash2, Pencil, Check, X, Bookmark, Loader2,
} from "lucide-react";
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
import {
  useSubjectsByQuestionType,
  useAssignQuestionTypeToSubject,
  useRemoveSubjectQuestionTypeByQT,
  useUpdateSubjectQTLabelByQT,
} from "@workspace/api-client";
import { useAcademicSubjectsForSelection, useAcademicYearsForSelection, useAcademicClassesForSelection } from "@workspace/api-client";
import type { SubjectQuestionTypeWithSubject } from "@workspace/api";

// ---------------------------------------------------------------------------
// Inline edit row — one subject linked to this question type
// ---------------------------------------------------------------------------

function SubjectRow({
  item,
  questionTypeId,
}: {
  item: SubjectQuestionTypeWithSubject;
  questionTypeId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [labelVal, setLabelVal] = useState(item.label);

  const { mutateAsync: updateLabel, isPending: isUpdating } =
    useUpdateSubjectQTLabelByQT(questionTypeId);
  const { mutateAsync: remove, isPending: isRemoving } =
    useRemoveSubjectQuestionTypeByQT(questionTypeId);

  const handleSave = async () => {
    if (!labelVal.trim()) return;
    await updateLabel({ id: item.id, data: { label: labelVal.trim() } });
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl group transition-all hover:border-primary/20 hover:bg-primary/5">
      {/* Subject info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-700 leading-none truncate">
          {item.subject.nameEn}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {item.subject.nameBn && (
            <span className="text-[11px] text-slate-400 truncate">{item.subject.nameBn}</span>
          )}
          {item.subject.code && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-mono border-slate-200 text-slate-400">
              {item.subject.code}
            </Badge>
          )}
        </div>
      </div>

      {/* Label override (editable) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {editing ? (
          <>
            <Input
              autoFocus
              value={labelVal}
              onChange={(e) => setLabelVal(e.target.value)}
              className="h-8 w-24 px-2 text-xs font-bold rounded-xl border-primary/40 focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") { setEditing(false); setLabelVal(item.label); }
              }}
            />
            <Button
              size="icon" variant="ghost" onClick={handleSave} disabled={isUpdating}
              className="h-7 w-7 rounded-lg text-emerald-600 hover:bg-emerald-50"
            >
              {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            </Button>
            <Button
              size="icon" variant="ghost"
              onClick={() => { setEditing(false); setLabelVal(item.label); }}
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
              title="Click to edit label"
            >
              {item.label}
            </Badge>
            <Button
              size="icon" variant="ghost" onClick={() => setEditing(true)}
              className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary hover:bg-primary/10"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </>
        )}

        {/* Remove */}
        <Button
          size="icon" variant="ghost"
          onClick={() => remove({ id: item.id })}
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
// Add subject row
// ---------------------------------------------------------------------------

function AddSubjectRow({
  questionTypeId,
  alreadyAssignedSubjectIds,
}: {
  questionTypeId: string;
  alreadyAssignedSubjectIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string | undefined>(undefined);
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [label, setLabel] = useState("");

  const { data: academicYears } = useAcademicYearsForSelection();
  const { data: academicClasses } = useAcademicClassesForSelection();
  const { data: allSubjects } = useAcademicSubjectsForSelection(selectedClassId, selectedAcademicYearId);
  const { mutateAsync: assign, isPending } = useAssignQuestionTypeToSubject(questionTypeId);

  const available = (allSubjects ?? []).filter(
    (s) => !alreadyAssignedSubjectIds.includes(s.id),
  );

  const handleAdd = async () => {
    if (!selectedSubjectId || !label.trim()) return;
    await assign({ questionTypeId, subjectId: selectedSubjectId, label: label.trim() });
    setSelectedSubjectId("");
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
        {available.length === 0 ? "All subjects assigned" : "Add to Subject"}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Top Row: Year, Class and Subject */}
      <div className="flex gap-3">
        {/* Academic Year picker */}
        <div className="w-28 flex-shrink-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Year</p>
          <Select
            value={selectedAcademicYearId ?? ""}
            onValueChange={(v) => {
              setSelectedAcademicYearId(v);
              setSelectedSubjectId("");
            }}
          >
            <SelectTrigger className="h-9 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <SelectValue placeholder="Select year..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              {academicYears?.map((y) => (
                <SelectItem key={y.id} value={y.id} className="font-medium text-xs">
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Academic Class picker */}
        <div className="w-28 flex-shrink-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Class</p>
          <Select
            value={selectedClassId ?? ""}
            onValueChange={(v) => {
              setSelectedClassId(v);
              setSelectedSubjectId("");
            }}
          >
            <SelectTrigger className="h-9 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <SelectValue placeholder="Select class..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              {academicClasses?.map((c) => (
                <SelectItem key={c.id} value={c.id} className="font-medium text-xs">
                  {c.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject picker */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</p>
          <Select
            value={selectedSubjectId}
            onValueChange={(v) => {
              setSelectedSubjectId(v);
              // auto-fill label from question type's default label if empty
              if (!label) setLabel("");
            }}
            disabled={!selectedAcademicYearId || !selectedClassId}
          >
            <SelectTrigger className="h-9 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <SelectValue placeholder={!selectedAcademicYearId || !selectedClassId ? "Select year & class first" : "Select subject..."} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              {available.map((s) => (
                <SelectItem key={s.id} value={s.id} className="font-medium text-xs">
                  {s.nameEn}
                  {s.code && <span className="opacity-40 ml-1">({s.code})</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bottom Row: Label and Buttons */}
      <div className="flex items-end gap-3">
        {/* Label */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Label</p>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. MCQ"
            className="h-9 px-3 w-full text-xs font-bold bg-white border border-slate-100 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setOpen(false);
            }}
          />
        </div>

        {/* Confirm / cancel */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            type="button" size="icon" onClick={handleAdd}
            disabled={!selectedSubjectId || !label.trim() || isPending}
            className="h-9 w-9 rounded-xl bg-primary text-white shadow-md shadow-primary/25"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          </Button>
          <Button
            type="button" size="icon" variant="ghost" onClick={() => setOpen(false)}
            className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel — used inside the QuestionType edit form
// ---------------------------------------------------------------------------

interface QuestionTypeSubjectManagerProps {
  questionTypeId: string;
}

export function QuestionTypeSubjectManager({ questionTypeId }: QuestionTypeSubjectManagerProps) {
  const { data: assignments, isLoading } = useSubjectsByQuestionType(questionTypeId);

  return (
    <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <Bookmark className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
            Subject Assignments
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Subjects that use this question type
          </p>
        </div>
        <Badge
          variant="secondary"
          className="ml-auto text-[10px] font-black bg-primary/10 text-primary border-0"
        >
          {assignments?.length ?? 0} subject{assignments?.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary/40" />
          </div>
        ) : assignments && assignments.length > 0 ? (
          assignments.map((item) => (
            <SubjectRow key={item.id} item={item} questionTypeId={questionTypeId} />
          ))
        ) : (
          <div className="flex items-center justify-center py-6 text-center">
            <div>
              <Bookmark className="h-8 w-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">Not assigned to any subject yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Add row */}
      <AddSubjectRow
        questionTypeId={questionTypeId}
        alreadyAssignedSubjectIds={assignments?.map((a) => a.subjectId) ?? []}
      />
    </div>
  );
}
