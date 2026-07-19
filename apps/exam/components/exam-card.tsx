import Link from "next/link";
import React from "react";

interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    subject?: string | null;
    duration: number;
    score?: number | null;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    status?: string | null;
    totalMarks?: number | null;
    isPublic?: boolean | null;
  };
  href: string;
  actionText: string;
}

export function ExamCard({ exam, href, actionText }: ExamCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="card group relative overflow-hidden p-6 hover:-translate-y-1 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col h-full">
        
        {/* Header Badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="badge badge-primary">
            {exam.subject || "সাধারণ"}
          </span>
          {exam.status && (
            <span className={`badge ${exam.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>
              {exam.status === 'Published' ? 'প্রকাশিত' : exam.status === 'Draft' ? 'খসড়া' : exam.status === 'Completed' ? 'সম্পন্ন' : exam.status}
            </span>
          )}
          {exam.isPublic !== undefined && exam.isPublic !== null && (
            <span className={`badge ${exam.isPublic ? 'badge-primary' : 'badge-danger'}`}>
              {exam.isPublic ? 'পাবলিক' : 'প্রাইভেট'}
            </span>
          )}
        </div>

        <h3 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2">{exam.title}</h3>
        
        {/* Details Grid */}
        <div className="mb-6 grid grid-cols-2 gap-y-4 gap-x-3 text-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">সময়কাল</span>
            <span className="font-medium text-gray-800">{exam.duration} মিনিট</span>
          </div>
          {exam.totalMarks !== undefined && exam.totalMarks !== null && (
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">পূর্ণমান</span>
              <span className="font-medium text-gray-800">{exam.totalMarks}</span>
            </div>
          )}
          {exam.startDate && (
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">শুরু</span>
              <span className="font-medium text-gray-800" suppressHydrationWarning>
                {formatDate(exam.startDate)}
              </span>
            </div>
          )}
          {exam.endDate && (
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">শেষ</span>
              <span className="font-medium text-gray-800" suppressHydrationWarning>
                {formatDate(exam.endDate)}
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-auto pt-2">
          {exam.score !== undefined && exam.score !== null && (
            <div className="mb-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 border border-green-100">
              <span className="text-sm font-semibold text-green-800">আপনার স্কোর:</span>
              <span className="text-lg font-bold text-green-600">{exam.score.toFixed(1)}%</span>
            </div>
          )}

          {exam.startDate && new Date(exam.startDate) > new Date() ? (
            <button
              disabled
              className="btn-primary inline-flex w-full items-center justify-center opacity-50 cursor-not-allowed"
            >
              অপেক্ষা করুন...
            </button>
          ) : (
            <Link
              href={href}
              className="btn-primary inline-flex w-full items-center justify-center"
            >
              {actionText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
