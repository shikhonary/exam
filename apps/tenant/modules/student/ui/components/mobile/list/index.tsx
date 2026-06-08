"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./header";
import { Stats } from "./stats";
import { StudentCard } from "./card";
import { Pagination } from "./pagination";
import { TenantTypes } from "@workspace/db";
import { Card } from "@workspace/ui/components/card";
import { User } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface StudentWithRelations extends TenantTypes.Student {
  batch?: {
    id: string;
    name: string;
  } | null;
}

interface MobileListProps {
  isLoading: boolean;
  students: StudentWithRelations[];
  total: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const MobileList = ({
  isLoading,
  students,
  total,
  onToggleActive,
  onDelete,
}: MobileListProps) => {
  return (
    <div className="bg-background min-h-screen flex flex-col font-sans pb-20">
      <Header />

      <main className="flex-grow py-6 flex flex-col">
        <Stats total={total} />

        <div className="px-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-card rounded-xl border border-white/[0.06] overflow-hidden"
                >
                  <div className="flex">
                    <div className="w-[3px] flex-shrink-0 bg-white/[0.10]" />
                    <div className="flex-1 p-4">
                      {/* Top section */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="space-y-2 min-w-0 flex-1">
                          <Skeleton className="h-4 w-3/4 bg-white/[0.06]" />
                          <Skeleton className="h-3 w-1/2 bg-white/[0.06]" />
                        </div>
                        <Skeleton className="h-4 w-12 rounded-full bg-white/[0.06] flex-shrink-0" />
                      </div>
                      
                      {/* Details row */}
                      <div className="space-y-1.5 mb-4 mt-4">
                        <div className="flex justify-between">
                          <Skeleton className="h-2 w-8 bg-white/[0.06]" />
                          <Skeleton className="h-2 w-10 bg-white/[0.06]" />
                        </div>
                        <Skeleton className="h-1 w-full rounded-full bg-white/[0.06]" />
                      </div>

                      {/* Action row */}
                      <div className="flex gap-2">
                        <Skeleton className="flex-1 h-9 rounded-lg bg-white/[0.04]" />
                        <Skeleton className="w-9 h-9 rounded-lg bg-white/[0.04] flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : students.length > 0 ? (
              students.map((student, i) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  index={i}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <Card className="text-center py-20 text-muted-foreground font-medium rounded-3xl border-white/[0.06] bg-card shadow-sm mx-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center text-[#4a607d]">
                    <User className="w-10 h-10" />
                  </div>
                  <p className="text-lg text-foreground font-bold tracking-tight">
                    কোনো রেকর্ড নেই
                  </p>
                  <p className="text-sm text-muted-foreground">
                    আপনার ফিল্টার বা অনুসন্ধান শব্দ পরিবর্তন করে চেষ্টা করুন
                  </p>
                </div>
              </Card>
            )}
          </AnimatePresence>
        </div>

        <Pagination total={total} />
      </main>
    </div>
  );
};
