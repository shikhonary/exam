"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { ExamForm } from "../form/exam-form";

export function NewExamView() {
  return (
    <main className="container mx-auto px-6 py-12 lg:px-12 max-w-4xl relative z-10 animate-in fade-in duration-500">
      <Link
        href="/exams"
        className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Exams
      </Link>

      <div className="relative mb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
        />
        <div className="flex items-center gap-3 mb-3 relative">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <FileText size={22} />
          </div>
          <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
            New Exam
          </h1>
        </div>
        <div className="mt-1 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container relative" />
        <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70 relative">
          Create a new exam by providing the details below.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline/5 overflow-hidden">
        <div className="p-6 sm:p-8">
          <ExamForm />
        </div>
      </div>
    </main>
  );
}
