"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Minus, GripVertical, Save } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { useExamById, useAttachedMcqs, useSyncExamMcqs, useAllMcqs } from "@workspace/api-client";
import { toast } from "sonner";

export function ExamMcqManagerView({ examId }: { examId: string }) {
  const router = useRouter();

  // Fetch exam to get subject
  const { data: exam, isLoading: examLoading } = useExamById(examId);

  // Fetch available MCQs by subject
  const { data: availableMcqsData, isLoading: availableLoading } = useAllMcqs({ subject: exam?.subject });

  // Fetch currently attached MCQs
  const { data: attachedMcqsData, isLoading: attachedLoading } = useAttachedMcqs(examId);

  const { mutate: syncMcqs, isPending: isSyncing } = useSyncExamMcqs();

  // Local state for the attached list to allow immediate UI updates & drag/drop
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize selectedIds when attachedMcqsData loads
  useEffect(() => {
    if (attachedMcqsData && !hasChanges) {
      setSelectedIds(attachedMcqsData.map((em: any) => em.mcqId));
    }
  }, [attachedMcqsData]);

  const isLoading = examLoading || availableLoading || attachedLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!exam) {
    return <div className="p-8 text-center text-red-500">Exam not found</div>;
  }

  const allMcqs = availableMcqsData?.items || [];
  
  // Create a map for quick lookup
  const mcqMap = new Map(allMcqs.map((mcq: any) => [mcq.id, mcq]));
  // Add any attached MCQs that might not be in the current available list (e.g. if subject changed)
  attachedMcqsData?.forEach((em: any) => {
    if (!mcqMap.has(em.mcqId)) {
      mcqMap.set(em.mcqId, em.mcq);
    }
  });

  const availableIds = allMcqs
    .map((mcq: any) => mcq.id)
    .filter((id: string) => !selectedIds.includes(id));

  const handleAdd = (id: string) => {
    setSelectedIds((prev) => [...prev, id]);
    setHasChanges(true);
  };

  const handleRemove = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setHasChanges(true);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedIds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem as string);

    setSelectedIds(items);
    setHasChanges(true);
  };

  const handleSave = () => {
    syncMcqs(
      { examId, mcqIds: selectedIds },
      {
        onSuccess: () => {
          setHasChanges(false);
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/exams")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage MCQs</h1>
            <p className="text-muted-foreground text-sm">
              Exam: <span className="font-semibold text-foreground">{exam.title}</span> ({exam.subject})
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSyncing}
            className="flex items-center gap-2"
          >
            {isSyncing ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available MCQs */}
        <div className="flex flex-col h-[70vh]">
          <h2 className="font-semibold text-lg mb-4 flex justify-between items-center">
            <span>Available MCQs</span>
            <span className="text-sm font-normal text-muted-foreground">{availableIds.length} questions</span>
          </h2>
          <Card className="flex-1 overflow-y-auto p-4 bg-muted/30">
            {availableIds.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No available MCQs found for this subject.
              </div>
            ) : (
              <div className="space-y-3">
                {availableIds.map((id: string) => {
                  const mcq = mcqMap.get(id);
                  if (!mcq) return null;
                  return (
                    <div
                      key={id}
                      className="p-4 bg-card border border-border rounded-lg flex items-start justify-between gap-4 hover:border-primary/50 transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{mcq.question}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleAdd(id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Attached MCQs */}
        <div className="flex flex-col h-[70vh]">
          <h2 className="font-semibold text-lg mb-4 flex justify-between items-center">
            <span>Attached to Exam</span>
            <span className="text-sm font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {selectedIds.length} selected
            </span>
          </h2>
          
          <Card className="flex-1 overflow-hidden bg-muted/10">
            <div className="p-4 h-full overflow-y-auto">
              {selectedIds.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 opacity-50" />
                  </div>
                  <p>No questions attached yet.</p>
                  <p className="text-sm opacity-70">Click + on the left to add questions.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedIds.map((id, index) => {
                    const mcq = mcqMap.get(id);
                    if (!mcq) return null;
                    return (
                      <div
                        key={id}
                        className="p-4 bg-background border border-primary/20 shadow-sm rounded-lg flex items-center gap-3 group relative"
                      >
                        <div className="flex flex-col gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              if (index > 0) {
                                const newIds = [...selectedIds];
                                [newIds[index - 1], newIds[index]] = [newIds[index] as string, newIds[index - 1] as string];
                                setSelectedIds(newIds);
                                setHasChanges(true);
                              }
                            }}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                            disabled={index === 0}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                          </button>
                          <button
                            onClick={() => {
                              if (index < selectedIds.length - 1) {
                                const newIds = [...selectedIds];
                                [newIds[index + 1], newIds[index]] = [newIds[index] as string, newIds[index + 1] as string];
                                setSelectedIds(newIds);
                                setHasChanges(true);
                              }
                            }}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                            disabled={index === selectedIds.length - 1}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                          </button>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{mcq.question}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => handleRemove(id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
