"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({ targetDate, title }: { targetDate: string | Date; title: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="animate-pulse h-24 bg-gray-200 rounded-2xl w-full max-w-3xl mx-auto"></div>;
  }

  const TimeBox = ({ label, value }: { label: string; value: number }) => (
    <div className="card flex flex-col items-center justify-center p-4 sm:p-6 shadow-[0_4px_20px_rgba(99,102,241,0.05)]">
      <span className="text-3xl sm:text-5xl font-bold text-indigo-600 tracking-wider font-mono">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs sm:text-sm text-gray-500 mt-2 uppercase tracking-widest font-semibold">
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl text-gray-900 font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full">
        <TimeBox label="দিন" value={timeLeft.days} />
        <TimeBox label="ঘন্টা" value={timeLeft.hours} />
        <TimeBox label="মিনিট" value={timeLeft.minutes} />
        <TimeBox label="সেকেন্ড" value={timeLeft.seconds} />
      </div>
    </div>
  );
}
