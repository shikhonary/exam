"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  useQuestionPaperById, 
  useQuestionPaperDistributionStatuses,
  useMCQsForAssignment,
  useCQsForAssignment,
  useBulkAssignMcqToQuestionPaper,
  useBulkAssignCqToQuestionPaper,
  useShortAnswersForAssignment,
  useBulkAssignShortAnswerToQuestionPaper
} from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { toast } from "@workspace/ui/components/sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { parseMathString } from "@/lib/math";

interface Props {
  paperId: string;
  distributionId: string;
}

export const DistributionPickerView: React.FC<Props> = ({ paperId, distributionId }) => {
  const router = useRouter();
  
  const { data: paperQuery, isLoading: paperLoading } = useQuestionPaperById(paperId);
  const { data: statuses, isLoading: statusesLoading } = useQuestionPaperDistributionStatuses(paperId);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const { mutateAsync: assignMcqs, isPending: isAssigningMcqs } = useBulkAssignMcqToQuestionPaper();
  const { mutateAsync: assignCqs, isPending: isAssigningCqs } = useBulkAssignCqToQuestionPaper();
  const { mutateAsync: assignShortAnswers, isPending: isAssigningShortAnswers } = useBulkAssignShortAnswerToQuestionPaper();

  const isAssigning = isAssigningMcqs || isAssigningCqs || isAssigningShortAnswers;

  if (paperLoading || statusesLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const distStatus = statuses?.find((s: any) => s.distributionId === distributionId);
  
  if (!distStatus) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-background">
        <p className="text-red-500 font-medium">Distribution not found.</p>
        <Button asChild className="mt-4">
          <Link href={`/question-papers/${paperId}/build`}>Go Back</Link>
        </Button>
      </div>
    );
  }

  const isCQ =
    distStatus.questionTypeId === "CQ" || // Or derive it correctly
    distStatus.status === "ACTIVE"; // Needs proper isCQ logic
    
  // Proper isCQ check based on existing distribution details
  // The backend might not return the full question type object in statuses, 
  // so let's rely on finding it in the paper's subjects.
  let isCqType = false;
  let isShortAnswerType = false;
  let qTypeName = "Questions";
  paperQuery?.subjects?.forEach((s: any) => {
    s.distributions?.forEach((d: any) => {
      if (d.id === distributionId) {
        qTypeName = d.questionType.nameEn;
        const nameEn = d.questionType.nameEn.toLowerCase();
        if (nameEn.includes("short")) {
          isShortAnswerType = true;
        } else if ((nameEn.includes("creative") || nameEn.includes("cq")) && !nameEn.includes("mcq")) {
          isCqType = true;
        } else if (d.questionType.nameBn?.includes("সৃজনশীল")) {
          isCqType = true;
        } else if (d.questionType.nameBn?.includes("সংক্ষিপ্ত")) {
          isShortAnswerType = true;
        }
      }
    });
  });

  return (
    <div className="flex flex-col h-screen bg-muted/20">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/question-papers/${paperId}/build`}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">
              Select {qTypeName}
            </h1>
            <span className="text-sm text-muted-foreground">
              (Target: {distStatus.targetCount})
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6 pb-24">
          
          {/* Filters Bar */}
          <div className="bg-card border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="flex-1">
              <Input 
                placeholder="Search questions..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md bg-muted/50"
              />
            </div>
            {/* Add more filters here (Board, Chapter, etc.) */}
          </div>

          {/* Question Grid */}
          <QuestionGrid 
            subjectId={distStatus.subjectId}
            questionTypeId={distStatus.questionTypeId}
            isCq={isCqType}
            isShortAnswer={isShortAnswerType}
            search={search}
            selectedIds={selectedIds}
            onToggle={(id) => {
              setSelectedIds(prev => {
                if (prev.includes(id)) {
                  return prev.filter(x => x !== id);
                }
                const maxAllowed = Math.max(0, distStatus.targetCount - distStatus.addedCount);
                if (prev.length >= maxAllowed) {
                  toast.error(`You can only select up to ${maxAllowed} more questions for this distribution.`);
                  return prev;
                }
                return [...prev, id];
              });
            }}
          />

        </div>
      </main>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card border shadow-xl rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-8">
          <div className="text-sm font-medium">
            <span className="text-primary">{selectedIds.length}</span> selected
            <span className="text-muted-foreground ml-2">
              (Need {Math.max(0, distStatus.targetCount - distStatus.addedCount)})
            </span>
          </div>
          <Button 
            className="rounded-full px-8"
            disabled={isAssigning}
            onClick={async () => {
              if (isShortAnswerType) {
                await assignShortAnswers({ questionPaperId: paperId, shortAnswerIds: selectedIds, distributionId });
              } else if (isCqType) {
                await assignCqs({ questionPaperId: paperId, cqIds: selectedIds, distributionId });
              } else {
                await assignMcqs({ questionPaperId: paperId, mcqIds: selectedIds, distributionId });
              }
              router.push(`/question-papers/${paperId}/build`);
            }}
          >
            {isAssigning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save & Continue
          </Button>
        </div>
      )}
    </div>
  );
};

function QuestionGrid({ 
  subjectId, 
  questionTypeId, 
  isCq, 
  isShortAnswer,
  search, 
  selectedIds, 
  onToggle 
}: { 
  subjectId: string, 
  questionTypeId: string, 
  isCq: boolean, 
  isShortAnswer: boolean,
  search: string, 
  selectedIds: string[], 
  onToggle: (id: string) => void 
}) {
  const mcqQuery = useMCQsForAssignment({ subjectId, questionTypeId, search, limit: 50 });
  const cqQuery = useCQsForAssignment({ subjectId, questionTypeId, search, limit: 50 });
  const shortAnswerQuery = useShortAnswersForAssignment({ subjectId, questionTypeId, search, limit: 50 });

  const isLoading = isShortAnswer ? shortAnswerQuery.isLoading : isCq ? cqQuery.isLoading : mcqQuery.isLoading;
  const questions = isShortAnswer ? shortAnswerQuery.data?.items : isCq ? cqQuery.data?.items : mcqQuery.data?.items;

  if (isLoading) {
    return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>;
  }

  if (!questions || questions.length === 0) {
    return <div className="py-20 text-center text-muted-foreground">No questions found matching your criteria.</div>;
  }

  return (
    <div className={`grid gap-6 ${isCq ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
      {questions.map((q: any) => (
        <div 
          key={q.id} 
          onClick={() => onToggle(q.id)}
          className={`bg-card border rounded-2xl p-5 cursor-pointer transition-all relative ${
            selectedIds.includes(q.id) 
              ? "border-primary ring-1 ring-primary shadow-md bg-primary/5" 
              : "hover:border-primary/50 hover:shadow-sm"
          }`}
        >
          <div className={`absolute top-4 right-4 w-5 h-5 rounded border flex items-center justify-center shrink-0 z-10 ${
              selectedIds.includes(q.id) ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
          }`}>
            {selectedIds.includes(q.id) && <span className="text-[10px]">✓</span>}
          </div>

          <div className="flex flex-wrap gap-2 mb-4 pr-12">
            {q.chapter && (
              <Badge variant="secondary" className="bg-secondary/50 text-xs font-normal">
                {q.chapter?.nameBn}
              </Badge>
            )}
            {q.type && (
              <Badge variant="outline" className="text-xs font-normal capitalize">
                {q.type.replace(/_/g, " ")}
              </Badge>
            )}
          </div>

          {isShortAnswer ? (
            <div className="flex flex-col gap-4">
              <div className="text-sm font-medium">
                {q.question}
              </div>
              {q.answer && (
                <div className="text-xs text-muted-foreground mt-2 border-l-2 pl-3">
                  <span className="font-semibold block mb-1">Answer:</span>
                  {q.answer}
                </div>
              )}
            </div>
          ) : isCq ? (
            <div className="flex flex-col gap-4">
              {q.context && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg whitespace-pre-wrap">
                  {q.context}
                </div>
              )}
              <div className="space-y-3 mt-2">
                {q.questionA && (
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-primary/20 bg-primary/5 text-primary font-bold text-sm">ক</span>
                    <span className="text-sm mt-0.5">{q.questionA}</span>
                  </div>
                )}
                {q.questionB && (
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-primary/20 bg-primary/5 text-primary font-bold text-sm">খ</span>
                    <span className="text-sm mt-0.5">{q.questionB}</span>
                  </div>
                )}
                {q.questionC && (
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-primary/20 bg-primary/5 text-primary font-bold text-sm">গ</span>
                    <span className="text-sm mt-0.5">{q.questionC}</span>
                  </div>
                )}
                {q.questionD && (
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-primary/20 bg-primary/5 text-primary font-bold text-sm">ঘ</span>
                    <span className="text-sm mt-0.5">{q.questionD}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {q.questionContext?.text && (
                <div 
                  className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg whitespace-pre-wrap" 
                >
                  {q.isMath ? parseMathString(q.questionContext.text) : <span dangerouslySetInnerHTML={{ __html: q.questionContext.text }} />}
                </div>
              )}
              {q.statements && q.statements.length > 0 && (
                <div className="text-sm space-y-2">
                  {q.statements.map((stmt: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <span className="font-medium text-muted-foreground">{["i", "ii", "iii", "iv"][i] || (i + 1)}.</span>
                      <span>{q.isMath ? parseMathString(stmt) : <span dangerouslySetInnerHTML={{ __html: stmt }} />}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 text-[15px] font-medium">
                  {q.isMath ? parseMathString(q.question) : <span dangerouslySetInnerHTML={{ __html: q.question }} />}
                </div>
              </div>
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {q.options.map((opt: string, i: number) => {
                    const label = ["ক", "খ", "গ", "ঘ"][i] || "";
                    
                    const cleanText = (str: string) => str ? String(str).replace(/<[^>]*>?/gm, '').replace(/\s+/g, '').trim() : "";
                    const isAnswer = 
                      q.answer === String(i + 1) || 
                      q.answer === label || 
                      q.answer === opt || 
                      cleanText(q.answer) === cleanText(opt);
                      
                    return (
                      <div key={i} className={`flex items-start gap-2 p-2.5 rounded-xl border transition-colors ${isAnswer ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400" : "bg-muted/30 border-transparent hover:border-primary/20"}`}>
                        <span className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border ${isAnswer ? "border-green-500/30 bg-green-500/20 text-green-800 dark:text-green-300" : "border-primary/20 bg-primary/5 text-primary"} font-bold text-[12px]`}>
                          {label}
                        </span>
                        <div className="text-sm mt-0.5 flex-1">
                          {q.isMath ? parseMathString(opt) : <span dangerouslySetInnerHTML={{ __html: opt }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {q.reference && (
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-muted/50">
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-dashed bg-muted/10">
                {q.reference}
              </Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
