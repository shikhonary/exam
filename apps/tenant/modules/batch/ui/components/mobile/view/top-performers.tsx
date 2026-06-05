"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const TopPerformers = ({ isLoading }: { isLoading?: boolean }) => {
  const performers = [
    {
      rank: 1,
      name: "রহিম আহমেদ",
      section: "বিজ্ঞান বিভাগ",
      score: 98.5,
      avatar: "https://i.pravatar.cc/150?u=1",
      rankColor: "bg-amber-500",
    },
    {
      rank: 2,
      name: "ফাতেমা বেগম",
      section: "বিজ্ঞান বিভাগ",
      score: 96.2,
      avatar: "https://i.pravatar.cc/150?u=2",
      rankColor: "bg-slate-400",
    },
    {
      rank: 3,
      name: "নুসরাত জাহান",
      section: "বিজ্ঞান বিভাগ",
      score: 94.8,
      avatar: "https://i.pravatar.cc/150?u=3",
      rankColor: "bg-orange-500",
    },
  ];

  return (
    <section className="space-y-4 pb-12">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          শীর্ষ পারফর্মার
        </h2>
      </div>

      <div className="bg-[#131B2C] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02]">
        <div className="divide-y divide-white/[0.06]">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center px-4 py-4 gap-4">
                <Skeleton className="w-10 h-10 rounded-full bg-white/[0.04]" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-4 w-3/4 bg-white/[0.04]" />
                  <Skeleton className="h-3 w-1/2 bg-white/[0.04]" />
                </div>
                <Skeleton className="w-8 h-8 rounded-full bg-white/[0.04]" />
              </div>
            ))
          ) : (
            performers.map((student) => (
              <div key={student.rank} className="flex items-center px-4 py-4 gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-[#131B2C] shadow-sm">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="text-[10px] font-bold bg-white/[0.06] text-muted-foreground">ST</AvatarFallback>
                </Avatar>
                <div className={`absolute -top-1 -right-1 w-5 h-5 ${student.rankColor} rounded-full flex items-center justify-center text-[10px] font-black text-[#131B2C] shadow-sm border-2 border-[#131B2C]`}>
                  {student.rank}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate">
                  {student.name}
                </h4>
                <p className="text-[11px] text-muted-foreground font-medium">
                  র‍্যাঙ্ক ০{student.rank} • {student.section}
                </p>
              </div>
              <div className="text-right">
                <p className="text-md font-black text-primary leading-none">
                  {student.score}
                </p>
                <p className="text-[9px] uppercase font-bold text-muted-foreground mt-1 tracking-tighter">
                  মোট স্কোর
                </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
