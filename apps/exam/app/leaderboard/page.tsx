"use client";

import { useState } from "react";
import { useExamLeaderboard } from "@workspace/api-client";
import Link from "next/link";
import { ArrowLeft, Trophy, Clock, Target, Loader2, Layers } from "lucide-react";

export default function LeaderboardPage() {
  const [page, setPage] = useState<number>(1);
  const limit = 20;

  const { data: leaderboardData, isLoading: loadingLeaderboard } = useExamLeaderboard(page, limit);
  const leaderboardItems = leaderboardData?.items || [];
  const totalPages = leaderboardData?.meta?.totalPages || 1;

  // Converts English numbers to Bengali numerals
  const toBengaliNumber = (num: number | string) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => bengaliDigits[+w] || w);
  };

  const formatTimeMs = (diffInMs: number) => {
    if (!diffInMs && diffInMs !== 0) return "প্রযোজ্য নয়";
    const diffInSeconds = Math.floor(diffInMs / 1000);
    
    if (diffInSeconds < 60) return `${toBengaliNumber(diffInSeconds)} সেকেন্ড`;
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    return `${toBengaliNumber(minutes)} মি ${toBengaliNumber(seconds)} সে`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* ══ Header ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            হোমে ফিরুন
          </Link>
          <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
            <Trophy className="w-4 h-4 text-[var(--color-primary)]" />
            লিডারবোর্ড
          </div>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* ══ Main ════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 pb-24">
        
        {/* Controls */}
        <div className="mb-6 bg-white/70 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              সেরাদের তালিকা (গ্লোবাল)
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              সকল পরীক্ষায় অংশগ্রহণকারীদের সামগ্রিক ফলাফল
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white/70 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden relative">
          
          {loadingLeaderboard ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
              <p className="text-[var(--color-text-secondary)] font-medium">লিডারবোর্ড লোড হচ্ছে...</p>
            </div>
          ) : leaderboardItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[var(--color-bg-alt)]/50 border-b border-[var(--color-border)] text-xs uppercase text-[var(--color-text-muted)] font-bold tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4 w-20 text-center">র‍্যাঙ্ক</th>
                    <th scope="col" className="px-6 py-4">পরীক্ষার্থীর নাম</th>
                    <th scope="col" className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> অংশগ্রহণকৃত পরীক্ষা
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Target className="w-3.5 h-3.5" /> মোট স্কোর
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> মোট সময়
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {leaderboardItems.map((item: any, index) => {
                    const rank = (page - 1) * limit + index + 1;
                    const student = item.student;
                    
                    // Ranking styles
                    let rankDisplay = <span className="font-semibold text-[var(--color-text-secondary)]">{toBengaliNumber(rank)}</span>;
                    if (rank === 1) rankDisplay = <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-600 border border-amber-200 shadow-sm font-bold text-sm mx-auto">১</span>;
                    if (rank === 2) rankDisplay = <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shadow-sm font-bold text-sm mx-auto">২</span>;
                    if (rank === 3) rankDisplay = <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-700 border border-orange-200 shadow-sm font-bold text-sm mx-auto">৩</span>;

                    return (
                      <tr key={item.id} className="transition-colors hover:bg-white/40">
                        <td className="px-6 py-4 text-center">
                          {rankDisplay}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[var(--color-text)]">
                            {student?.name || "অজানা পরীক্ষার্থী"}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            আইডি: {toBengaliNumber(student?.studentId || "--")}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-medium text-[var(--color-text-secondary)]">
                            {toBengaliNumber(item.examsTaken)} টি
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-[var(--color-success)] border border-emerald-100 font-bold tabular-nums">
                            {toBengaliNumber(item.score.toFixed(1))}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-[var(--color-text-secondary)] font-medium tabular-nums">
                          {formatTimeMs(item.totalTimeMs)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]/30 px-6 py-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)] disabled:opacity-50 transition-colors shadow-sm"
                  >
                    পূর্ববর্তী
                  </button>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    পৃষ্ঠা {toBengaliNumber(page)} / {toBengaliNumber(totalPages)}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)] disabled:opacity-50 transition-colors shadow-sm"
                  >
                    পরবর্তী
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-[var(--color-border)]" />
              <p className="text-[var(--color-text-secondary)] font-medium">
                এখনও কোনো ফলাফল নেই।
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
