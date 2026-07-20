"use client";

import { useEffect, useState } from "react";

import { useUpcomingExam, usePublishedExams } from "@workspace/api-client";
import { ExamCard } from "../components/exam-card";
import { CountdownTimer } from "../components/countdown-timer";
import Link from "next/link";
import { useStudentStore } from "../lib/student-store";
import { PromoModal } from "../components/promo-modal";

export default function HomePage() {
  const { data: upcomingData, isLoading: loadingUpcoming } = useUpcomingExam();
    
  const { data: publishedData, isLoading: loadingPublished } = usePublishedExams(1, 10);

  const upcomingExam = upcomingData;
  const publishedExams = publishedData?.items || [];

  const [isOngoing, setIsOngoing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (upcomingExam?.startDate) {
      const checkStatus = () => {
        const now = new Date();
        const start = new Date(upcomingExam.startDate as any);
        const end = upcomingExam.endDate ? new Date(upcomingExam.endDate as any) : null;
        setIsOngoing(start <= now && (!end || end > now));
      };
      checkStatus();
      const interval = setInterval(checkStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [upcomingExam]);

  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      <PromoModal />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {loadingUpcoming ? (
              <div className="py-10 text-center text-gray-500">আসন্ন পরীক্ষার তথ্য লোড হচ্ছে...</div>
            ) : upcomingExam && upcomingExam.startDate ? (
              <div className="py-10">
                {isMounted && isOngoing ? (
                  <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl p-[3px]">
                    <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-50"></div>
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-[14px] p-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-bold text-red-500 uppercase tracking-widest">চলমান পরীক্ষা</span>
                            <h2 className="text-2xl font-bold text-gray-900 mt-1">{upcomingExam.title}</h2>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href="/leaderboard"
                            className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-6 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                          >
                            লিডারবোর্ড
                          </Link>
                          <Link
                            href={`/exam/${upcomingExam.id}/register`}
                            className="btn-primary whitespace-nowrap px-8 py-3"
                          >
                            পরীক্ষায় অংশ নিন
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <CountdownTimer 
                      targetDate={upcomingExam.startDate} 
                      title={`আসন্ন পরীক্ষা: ${upcomingExam.title}`} 
                    />
                      <div className="mt-12 flex items-center justify-center gap-x-6">
                        <Link
                          href="/leaderboard"
                          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-600 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] ring-1 ring-indigo-200 transition-all duration-300 hover:scale-105 hover:bg-indigo-50 hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)] hover:ring-indigo-300"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            লিডারবোর্ড দেখুন 
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-gray-900">
                  বর্তমানে কোনো আসন্ন পরীক্ষা নেই
                </h1>
                <p className="text-lg leading-8 text-gray-600 mb-10">
                  আমাদের চলমান পরীক্ষাগুলোতে অংশ নিতে নিচে স্ক্রল করুন অথবা বিগত পরীক্ষাগুলোর ফলাফল দেখতে লিডারবোর্ড ভিজিট করুন।
                </p>
                <div className="flex items-center justify-center gap-x-6">
                  <Link
                    href="/leaderboard"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-600 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] ring-1 ring-indigo-200 transition-all duration-300 hover:scale-105 hover:bg-indigo-50 hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)] hover:ring-indigo-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      লিডারবোর্ড দেখুন 
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        
        {/* Upcoming Exam Section - Removed as it is now in the hero section */}

        {/* Published Exams Section */}
        <div>
          <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl text-gray-900">
            চলমান পরীক্ষা সমূহ
          </h2>
          
          {loadingPublished ? (
            <div className="py-10 text-center text-gray-500">পরীক্ষার তালিকা লোড হচ্ছে...</div>
          ) : publishedExams.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publishedExams.map((exam) => (
                <ExamCard 
                  key={exam.id} 
                  exam={exam} 
                  href={`/exam/${exam.id}/register`}
                  actionText="পরীক্ষায় অংশ নিন" 
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white/50 p-10 text-center text-gray-500 backdrop-blur-sm">
              এই মুহূর্তে কোনো পরীক্ষা উপলব্ধ নেই। অনুগ্রহ করে পরে আবার চেক করুন।
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
