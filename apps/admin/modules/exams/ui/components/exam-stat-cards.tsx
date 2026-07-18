"use client";

import { FileText } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Card, CardContent } from "@workspace/ui/components/card";
import { memo } from "react";

interface ExamStatCardsProps {
  stats: { total: number } | undefined;
  isLoading: boolean;
}

export const ExamStatCards = memo(function ExamStatCards({
  stats,
  isLoading,
}: ExamStatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(1)].map((_, i) => (
          <Card
            key={i}
            className="border-none shadow-ambient bg-surface-container-lowest overflow-hidden rounded-2xl"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-none shadow-ambient hover:shadow-soft transition-all duration-300 bg-surface-container-lowest overflow-hidden group rounded-2xl">
        <CardContent className="p-6 relative">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface-variant/70 uppercase tracking-wider mb-1">
                Total Exams
              </p>
              <h3 className="text-3xl font-black text-on-surface font-headline tracking-tight group-hover:text-primary transition-colors">
                {stats?.total || 0}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
