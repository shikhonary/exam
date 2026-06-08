"use client";

import React from "react";
import { User } from "lucide-react";
import { TenantTypes } from "@workspace/db";
import { StudentCard } from "./student-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface StudentWithRelations extends TenantTypes.Student {
  batch?: {
    id: string;
    name: string;
  } | null;
}

interface StudentGridProps {
  students: StudentWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export function StudentGrid({
  students,
  isLoading,
  onToggleActive,
  onDelete,
}: StudentGridProps) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="overflow-hidden bg-card border border-white/[0.06] rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <Skeleton className="w-12 h-12 rounded-lg bg-white/[0.06]" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
                <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
                <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <Skeleton className="h-6 w-3/4 bg-white/[0.06]" />
              <Skeleton className="h-4 w-1/2 bg-white/[0.06]" />
            </div>
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-6 w-20 rounded-full bg-white/[0.06]" />
              <Skeleton className="h-6 w-24 rounded-full bg-white/[0.06]" />
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12 bg-white/[0.06]" />
                <Skeleton className="h-3 w-10 bg-white/[0.06]" />
              </div>
              <Skeleton className="h-2 w-full rounded-full bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-white/[0.04] rounded-full flex items-center justify-center text-[#4a607d]">
          <User size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground">
            কোনো রেকর্ড নেই
          </h3>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm">
            ফিল্টার পরিবর্তন করুন অথবা নতুন যোগ করুন।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
      {students.map((student, i) => (
        <StudentCard
          key={student.id}
          student={student}
          index={i}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}
