"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useAttemptResult } from "@workspace/api-client";
import { MCQQuestion } from "../../../../../components/mcq-question";
import {
  Loader2, ArrowLeft, Trophy, XCircle, CheckCircle,
  HelpCircle, BookOpen, Share2, Copy, Check as CheckIcon,
  ClipboardCheck,
} from "lucide-react";

/* ── Facebook brand icon (inline SVG) ─────────────────────── */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [fbToast, setFbToast] = useState(false);

  const { data: resultData, isLoading, error } = useAttemptResult(
    unwrappedParams.attemptId
  );

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/80 border border-[var(--color-border)] shadow-md flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-[var(--color-primary)]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[var(--color-text)]">ফলাফল লোড হচ্ছে</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">অনুগ্রহ করে একটু অপেক্ষা করুন…</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !resultData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 shadow-md flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">ফলাফল পাওয়া যায়নি</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {error?.message || "ফলাফল খুঁজে পাওয়া যায়নি"}
          </p>
          <button onClick={() => router.push("/")} className="btn-primary px-6 py-2.5 text-sm">
            হোমে যান
          </button>
        </div>
      </div>
    );
  }

  const attempt      = resultData;
  const totalAttempted = attempt.correctAnswers + attempt.wrongAnswers;
  const totalQuestions = attempt.answers.length;
  const score          = attempt.score;
  const examTitle      = (attempt as any).exam?.title ?? "পরীক্ষা";

  /* ── Score theming ── */
  const scoreColor =
    score >= 80 ? "text-[var(--color-success)]"
    : score >= 50 ? "text-[var(--color-warning)]"
    : "text-[var(--color-danger)]";

  const scoreBg =
    score >= 80 ? "border-emerald-200"
    : score >= 50 ? "border-amber-200"
    : "border-red-200";

  const scoreLabel =
    score >= 80 ? "চমৎকার! অসাধারণ ফলাফল 🎉"
    : score >= 50 ? "ভালো করেছেন! আরও চেষ্টা করুন 💪"
    : "হাল ছাড়বেন না, আরও পরিশ্রম করুন 📚";

  const scoreEmoji = score >= 80 ? "🏆" : score >= 50 ? "📊" : "📉";

  /* ── Facebook share ── */
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareText =
`${scoreEmoji} পরীক্ষার ফলাফল — ${examTitle}

👤 পরীক্ষার্থী: ${attempt.student.name}
📊 স্কোর: ${score.toFixed(1)}%
✅ সঠিক উত্তর: ${attempt.correctAnswers}টি
❌ ভুল উত্তর: ${attempt.wrongAnswers}টি
📚 মোট প্রশ্ন: ${totalQuestions}টি

${scoreLabel}`;

  const handleFacebookShare = async () => {
    // Step 1 — copy the template text to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      /* clipboard blocked — user can still paste from the copy button */
    }
    // Step 2 — show instruction toast for 7 seconds
    setFbToast(true);
    setTimeout(() => setFbToast(false), 7000);
    // Step 3 — open Facebook new-post composer after short delay
    setTimeout(() => {
      window.open("https://www.facebook.com", "_blank", "width=900,height=650,scrollbars=yes,resizable=yes");
    }, 400);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback: do nothing */
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* ══ Header ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            হোমে ফিরুন
          </button>
          <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
            <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
            পরীক্ষার ফলাফল
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* ══ Main ════════════════════════════════════════════════ */}
      <main className="flex-1 py-8 px-4 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Score Summary Card ── */}
          <div className={`relative rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden ${scoreBg}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />

            <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-[var(--color-border)] flex items-center justify-center shadow-sm">
                <Trophy className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                  <span className="font-semibold text-[var(--color-text)]">{attempt.student.name}</span> এর ফলাফল
                </p>
                <p className={`text-5xl font-extrabold tabular-nums ${scoreColor}`}>
                  {score.toFixed(1)}%
                </p>
                <p className={`text-sm font-medium mt-2 ${scoreColor}`}>{scoreLabel}</p>
              </div>
            </div>

            {/* 4-stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[var(--color-border)]">
              <div className="flex flex-col items-center py-4 px-3 border-r border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-0.5">মোট প্রশ্ন</p>
                <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{totalQuestions}</p>
              </div>
              <div className="flex flex-col items-center py-4 px-3 sm:border-r border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center mb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-0.5">উত্তর দেওয়া</p>
                <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{totalAttempted}</p>
              </div>
              <div className="flex flex-col items-center py-4 px-3 border-t sm:border-t-0 border-r border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--color-success)]" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-success)] font-semibold mb-0.5">সঠিক</p>
                <p className="text-2xl font-bold text-[var(--color-success)] tabular-nums">{attempt.correctAnswers}</p>
              </div>
              <div className="flex flex-col items-center py-4 px-3 border-t sm:border-t-0 border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-2">
                  <XCircle className="w-3.5 h-3.5 text-[var(--color-danger)]" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-danger)] font-semibold mb-0.5">ভুল</p>
                <p className="text-2xl font-bold text-[var(--color-danger)] tabular-nums">{attempt.wrongAnswers}</p>
              </div>
            </div>
          </div>

          {/* ── Facebook Share Card ── */}
          <div className="relative rounded-2xl border border-[var(--color-border)] bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
            {/* Left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1877F2] rounded-l-2xl" />

            <div className="p-5 pl-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1877F2]/10 flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-4 h-4 text-[#1877F2]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm leading-none mb-0.5">ফলাফল শেয়ার করুন</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">আপনার বন্ধুদের সাথে এই ফলাফল শেয়ার করুন</p>
                </div>
              </div>

              {/* Toast — shows after clicking FB share */}
              {fbToast && (
                <div className="mb-4 flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-800">
                  <ClipboardCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold leading-snug mb-1">টেক্সট কপি হয়েছে! ✓</p>
                    <p className="text-xs leading-relaxed text-emerald-700">
                      Facebook খুলেছে — নতুন পোস্ট তৈরি করুন এবং
                      <kbd className="mx-1 px-1.5 py-0.5 rounded bg-emerald-200 font-mono text-[11px]">Ctrl+V</kbd>
                      চাপুন।
                    </p>
                  </div>
                </div>
              )}

              {/* Preview box */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4 mb-4 text-[var(--color-text-secondary)] whitespace-pre-line leading-relaxed font-mono text-xs">
                {shareText}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleFacebookShare}
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] active:bg-[#1464d8] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                >
                  <FacebookIcon className="w-4 h-4" />
                  ফেসবুকে শেয়ার করুন
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)] font-medium text-sm transition-all"
                  title="টেক্সট কপি করুন"
                >
                  {copied
                    ? <><CheckIcon className="w-4 h-4 text-[var(--color-success)]" /> কপি হয়েছে</>
                    : <><Copy className="w-4 h-4" /> কপি করুন</>
                  }
                </button>
              </div>

              <p className="text-[11px] text-[var(--color-text-muted)] mt-3 text-center">
                ফেসবুক নিরাপত্তার কারণে স্বয়ংক্রিয়ভাবে টেক্সট বসাতে পারে না —
                বোতাম চাপলে টেক্সট কপি হয়ে যাবে, শুধু পেস্ট করুন।
              </p>
            </div>
          </div>

          {/* ── Detailed Review ── */}
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] inline-block" />
              বিস্তারিত পর্যালোচনা
            </h3>

            {attempt.answers.length === 0 ? (
              <div className="text-center text-[var(--color-text-muted)] py-16 bg-white/50 rounded-2xl border border-dashed border-[var(--color-border)]">
                এই পরীক্ষায় কোনো প্রশ্নের উত্তর দেওয়া হয়নি।
              </div>
            ) : (
              <div className="space-y-5">
                {attempt.answers.map((ans: any, idx: number) => {
                  const isCorrect = ans.isCorrect;
                  return (
                    <div
                      key={ans.id}
                      className={`relative rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden ${
                        isCorrect ? "border-emerald-300" : "border-red-300"
                      }`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                        isCorrect ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"
                      }`} />
                      <div className="px-5 pt-5 pb-3 pl-6">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isCorrect
                            ? "bg-emerald-50 text-[var(--color-success)]"
                            : "bg-red-50 text-[var(--color-danger)]"
                        }`}>
                          {isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          প্রশ্ন {idx + 1} — {isCorrect ? "সঠিক" : "ভুল"}
                        </span>
                      </div>
                      <div className="px-5 pb-5 pl-6">
                        <MCQQuestion
                          mcq={ans.mcq}
                          selectedOption={ans.selectedOption}
                          onOptionSelect={() => {}}
                          readOnly={true}
                          correctAnswer={ans.mcq.answer}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Back button ── */}
          <div className="pt-2 pb-6">
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl btn-primary font-semibold text-base"
            >
              <ArrowLeft className="w-5 h-5" />
              হোম পেজে ফিরে যান
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
