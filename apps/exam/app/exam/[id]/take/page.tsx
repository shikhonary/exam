"use client";

import React, { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useStartAttempt, useSubmitAnswer, useSubmitExam } from "@workspace/api-client";
import { useStudentStore } from "../../../../lib/student-store";
import { MCQQuestion } from "../../../../components/mcq-question";
import { Loader2, AlertCircle, Clock, CheckCircle2, XCircle, Check, BookOpen } from "lucide-react";

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const examId = unwrappedParams.id;
  const router = useRouter();
  const { studentId } = useStudentStore();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [attemptData, setAttemptData] = useState<any>(null);

  const startAttemptMutation = useStartAttempt();
  const submitAnswer = useSubmitAnswer();
  const submitExam = useSubmitExam();

  useEffect(() => {
    if (!studentId) {
      router.push(`/exam/${examId}/register`);
      return;
    }
    if (!attemptData && !startAttemptMutation.isPending && !startAttemptMutation.isError) {
      startAttemptMutation.mutate(
        { examId, studentId },
        {
          onSuccess: (res) => {
            setAttemptData(res.data);
            if (res.data?.duration) {
              const secs = Math.round(res.data.duration * 60);
              setTimeLeft(secs);
              setTotalTime(secs);
            }
            if (res.data?.previousAnswers) {
              const initAnswers: Record<string, string> = {};
              const initResults: Record<string, boolean> = {};
              res.data.previousAnswers.forEach((ans: any) => {
                initAnswers[ans.mcqId] = ans.selectedOption;
                initResults[ans.mcqId] = ans.isCorrect;
              });
              setAnswers(initAnswers);
              setAnswerResults(initResults);
            }
          },
        }
      );
    }
  }, [studentId, examId, router, attemptData, startAttemptMutation.isPending, startAttemptMutation.isError]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      if (attemptData?.id && !submitExam.isPending) {
        submitExam.mutate(
          { attemptId: attemptData.id },
          { onSuccess: (res) => router.push(`/exam/${examId}/result/${res.data.id}`) }
        );
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, attemptData?.id, submitExam.isPending, examId, router]);

  // Always-fresh refs so event handlers never capture stale closures
  const attemptIdRef = useRef<string | null>(null);
  const examIdRef   = useRef(examId);
  const routerRef   = useRef(router);
  const mutateRef   = useRef(submitExam.mutate);

  useEffect(() => { attemptIdRef.current = attemptData?.attemptId ?? null; }, [attemptData]);
  useEffect(() => { examIdRef.current   = examId;              }, [examId]);
  useEffect(() => { routerRef.current   = router;              }, [router]);
  useEffect(() => { mutateRef.current   = submitExam.mutate;   }, [submitExam.mutate]);

  // Tab-switch / window-hide auto-submit — registered once, uses refs for fresh values
  useEffect(() => {
    const doSubmit = () => {
      const aId = attemptIdRef.current;
      if (!aId) return;
      mutateRef.current(
        { attemptId: aId },
        {
          onSuccess: (res: any) =>
            routerRef.current.push(
              `/exam/${examIdRef.current}/result/${res.data.attemptId || res.data.id}`
            ),
        }
      );
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") doSubmit();
    };

    // pagehide fires on Edge when switching apps / closing tab
    const onPageHide = () => doSubmit();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []); // empty — register once, refs supply fresh values

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!studentId) return null;

  /* ── Loading ── */
  if (startAttemptMutation.isPending || (!attemptData && !startAttemptMutation.isError)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/80 border border-[var(--color-border)] shadow-md flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-[var(--color-primary)]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[var(--color-text)]">পরীক্ষা প্রস্তুত হচ্ছে</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">অনুগ্রহ করে একটু অপেক্ষা করুন…</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (startAttemptMutation.isError || !attemptData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 shadow-md flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">পরীক্ষা শুরু করা যাচ্ছে না</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">{startAttemptMutation.error?.message || "অজানা সমস্যা হয়েছে"}</p>
          <button
            onClick={() => router.push("/")}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            হোমে যান
          </button>
        </div>
      </div>
    );
  }

  const { attemptId, questions } = attemptData;
  const totalQuestions = questions?.length || 0;
  const answeredQuestions = Object.keys(answers).length;
  const correctAnswers = Object.values(answerResults).filter((v) => v === true).length;
  const incorrectAnswers = Object.values(answerResults).filter((v) => v === false).length;
  const timerPct = totalTime && timeLeft !== null ? (timeLeft / totalTime) * 100 : 100;
  const isUrgent = timeLeft !== null && timeLeft <= 300;
  const isWarning = timeLeft !== null && timeLeft <= 600 && timeLeft > 300;

  const playFeedbackSound = (isCorrect: boolean) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isCorrect) {
        // Cheerful ascending beep
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else {
        // Low disappointed buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    submitAnswer.mutate(
      { attemptId, mcqId: questionId, selectedOption: option },
      {
        onSuccess: (res) => {
          const isCorrect = res.data.isCorrect;
          setAnswerResults((prev) => ({ ...prev, [questionId]: isCorrect }));
          playFeedbackSound(isCorrect);
        },
      }
    );
  };

  const handleSubmit = () => {
    submitExam.mutate(
      { attemptId },
      { onSuccess: (res) => router.push(`/exam/${examId}/result/${res.data.id}`) }
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* ══ Sticky Header ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6">

          {/* 4-column stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4">

            {/* Total */}
            <div className="flex items-center gap-3 py-3.5 pr-4 sm:pr-6 border-r border-[var(--color-border)]">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold leading-none mb-0.5">মোট প্রশ্ন</p>
                <p className="font-bold text-lg leading-none text-[var(--color-text)] tabular-nums">{totalQuestions}</p>
              </div>
            </div>

            {/* Answered */}
            <div className="flex items-center gap-3 py-3.5 px-4 sm:px-6 sm:border-r border-[var(--color-border)]">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold leading-none mb-0.5">উত্তর দেওয়া</p>
                <p className="font-bold text-lg leading-none text-[var(--color-text)] tabular-nums">
                  {answeredQuestions}
                  <span className="text-[var(--color-text-muted)] font-normal text-xs"> / {totalQuestions}</span>
                </p>
              </div>
            </div>

            {/* Correct */}
            <div className="flex items-center gap-3 py-3.5 px-4 sm:px-6 border-t sm:border-t-0 border-r border-[var(--color-border)]">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[var(--color-success)] font-semibold leading-none mb-0.5">সঠিক</p>
                <p className="font-bold text-lg leading-none text-[var(--color-success)] tabular-nums">{correctAnswers}</p>
              </div>
            </div>

            {/* Incorrect */}
            <div className="flex items-center gap-3 py-3.5 pl-4 sm:pl-6 border-t sm:border-t-0 border-[var(--color-border)]">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-3.5 h-3.5 text-[var(--color-danger)]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[var(--color-danger)] font-semibold leading-none mb-0.5">ভুল</p>
                <p className="font-bold text-lg leading-none text-[var(--color-danger)] tabular-nums">{incorrectAnswers}</p>
              </div>
            </div>

          </div>

          {/* Timer row */}
          <div className="border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between py-1.5 gap-2">
              <div className={`flex items-center gap-1.5 text-xs font-mono font-semibold transition-colors ${isUrgent ? "text-[var(--color-danger)]" : isWarning ? "text-[var(--color-warning)]" : "text-[var(--color-text-secondary)]"
                }`}>
                <Clock className={`w-3 h-3 ${isUrgent ? "animate-pulse" : ""}`} />
                <span>{timeLeft !== null ? formatTime(timeLeft) : "--:--"}</span>
                <span className="text-border mx-0.5">·</span>
                <span className="font-normal text-[var(--color-text-secondary)]">
                  {answeredQuestions === totalQuestions ? "সব উত্তর দেওয়া হয়েছে ✓" : `${totalQuestions - answeredQuestions}টি বাকি আছে`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-mono">
                {submitAnswer.isPending && (
                  <span className="flex items-center gap-1 text-[10px]">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> সংরক্ষণ হচ্ছে…
                  </span>
                )}
                {totalTime ? formatTime(totalTime) : ""}
              </div>
            </div>
            {/* Timer progress bar */}
            <div className="h-1 w-full bg-[var(--color-bg-alt)] overflow-hidden rounded-full">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${isUrgent
                  ? "bg-gradient-to-r from-red-500 to-red-400"
                  : isWarning
                    ? "bg-gradient-to-r from-amber-500 to-amber-300"
                    : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                  }`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          </div>

        </div>
      </header>

      {/* ══ Questions ═══════════════════════════════════════════════ */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {questions.length === 0 ? (
            <div className="text-center py-20 text-[var(--color-text-muted)]">এই পরীক্ষায় কোনো প্রশ্ন পাওয়া যায়নি।</div>
          ) : (
            questions.map((q: any, idx: number) => {
              const isAnswered = !!answers[q.id];
              const isCorrect = answerResults[q.id] === true;
              const isWrong = answerResults[q.id] === false;

              return (
                <div
                  key={q.id}
                  className={`relative rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm transition-all duration-200 overflow-hidden ${isCorrect
                    ? "border-emerald-300"
                    : isWrong
                      ? "border-red-300"
                      : isAnswered
                        ? "border-[var(--color-primary-light)]"
                        : "border-[var(--color-border)]"
                    }`}
                >
                  {/* Status accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${isCorrect ? "bg-[var(--color-success)]" : isWrong ? "bg-[var(--color-danger)]" : isAnswered ? "bg-[var(--color-primary)]" : "bg-transparent"
                    }`} />

                  {/* Question number badge */}
                  <div className="flex items-center justify-between p-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isCorrect
                      ? "bg-emerald-50 text-[var(--color-success)]"
                      : isWrong
                        ? "bg-red-50 text-[var(--color-danger)]"
                        : isAnswered
                          ? "bg-indigo-50 text-[var(--color-primary)]"
                          : "bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]"
                      }`}>
                      {isCorrect && <CheckCircle2 className="w-3 h-3" />}
                      {isWrong && <XCircle className="w-3 h-3" />}
                      প্রশ্ন {idx + 1}
                    </span>
                  </div>

                  <div className="px-2">
                    <MCQQuestion
                      mcq={q}
                      selectedOption={answers[q.id] || null}
                      answerResult={answerResults[q.id] ?? null}
                      onOptionSelect={(option: string) => handleOptionSelect(q.id, option)}
                    />
                  </div>
                </div>
              );
            })
          )}

          {/* Submit button */}
          {questions.length > 0 && (
            <div className="pt-4 pb-10">
              <button
                onClick={handleSubmit}
                disabled={submitExam.isPending}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl btn-primary font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitExam.isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> পরীক্ষা জমা হচ্ছে…</>
                ) : (
                  <><Check className="w-5 h-5" /> পরীক্ষা জমা দিন</>
                )}
              </button>
              <p className="text-center text-xs text-[var(--color-text-secondary)] mt-3">
                {answeredQuestions === totalQuestions
                  ? "সব প্রশ্নের উত্তর দেওয়া হয়েছে। জমা দিতে প্রস্তুত!"
                  : `${totalQuestions - answeredQuestions}টি প্রশ্নের উত্তর এখনো দেওয়া হয়নি।`}
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
