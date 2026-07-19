"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { useExamById } from "@workspace/api-client";

function ExamDetailsContent({ examId }: { examId: string }) {
  const { data: exam, isLoading } = useExamById(examId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-on-surface-variant animate-pulse">
        Loading exam details...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-error">
        <p>Exam not found or you don't have permission to view it.</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/exams">Back to Exams</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto space-y-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-on-surface-variant hover:text-on-surface">
            <Link href="/exams">
              <ArrowLeft size={16} className="mr-2" />
              Back to Exams
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">
              {exam.title}
            </h1>
            <div className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
              exam.status === "Published" ? "bg-primary/10 text-primary" : "bg-surface-variant text-on-surface-variant"
            }`}>
              {exam.status}
            </div>
          </div>
          <p className="text-on-surface-variant mt-2 text-sm italic">
            Subject: <span className="font-semibold text-on-surface">{exam.subject}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="rounded-xl">
            <Link href={`/exams/${exam.id}/mcqs`}>
              <Settings size={16} className="mr-2" />
              Manage MCQs
            </Link>
          </Button>
          <Button asChild className="rounded-xl shadow-lg shadow-primary/20">
            <Link href={`/exams/${exam.id}/edit`}>
              <Edit size={16} className="mr-2" />
              Edit Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline/10 shadow-sm flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Total Marks</h3>
            <p className="text-2xl font-bold text-on-surface">{exam.totalMarks}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Duration</h3>
            <p className="text-2xl font-bold text-on-surface">{exam.duration} mins</p>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Start Date</h3>
            <p className="text-lg text-on-surface font-medium">
              {exam.startDate ? new Date(exam.startDate).toLocaleString() : "Not set"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">End Date</h3>
            <p className="text-lg text-on-surface font-medium">
              {exam.endDate ? new Date(exam.endDate).toLocaleString() : "Not set"}
            </p>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-4">Participating Students</h2>
        {(!exam.attempts || exam.attempts.length === 0) ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline/10 shadow-sm p-8 text-center text-on-surface-variant italic">
            No students have participated in this exam yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exam.attempts.map((attempt: any) => (
              <div key={attempt.id} className="bg-surface-container-lowest rounded-2xl border border-outline/10 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="font-semibold text-lg text-on-surface line-clamp-1">
                    {attempt.student?.name || "Unknown"}
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    attempt.status === "Submitted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {attempt.status}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-2 pt-4 border-t border-outline/5">
                  <span className="text-sm text-on-surface-variant font-medium">Score</span>
                  <span className="text-xl font-bold text-primary">
                    {attempt.score} <span className="text-sm text-on-surface-variant font-normal">/ {exam.totalMarks}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ExamDetailsView({ examId }: { examId: string }) {
  return (
    <div className="min-h-screen bg-surface relative isolate py-12 px-6">
      <div
        aria-hidden
        className="absolute top-[10%] left-[20%] w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <Suspense fallback={null}>
        <ExamDetailsContent examId={examId} />
      </Suspense>
    </div>
  );
}
