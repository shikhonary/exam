"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStudentById } from "@workspace/api-client";
import { EditStudentForm } from "../form/edit-student-form";

interface EditStudentViewProps {
  studentId: string;
}

export const EditStudentView = ({ studentId }: EditStudentViewProps) => {
  const { data: student } = useStudentById(studentId);

  if (!student) return null;

  return (
    <>
      <main className="min-h-screen w-full">
        <div className="py-6 max-w-4xl mx-auto px-4 md:px-8">
          {/* Breadcrumb and Title Section */}
          <div className="mb-6">
            <Link
              href="/students"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-white/[0.04] border border-white/[0.08] transition-all group mb-4 w-fit px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">
                পিছনে ফিরে যান
              </span>
            </Link>
            <div className="flex flex-col gap-1 border-none shadow-none">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                শিক্ষার্থী সম্পাদনা
              </h2>
              <p className="text-muted-foreground text-sm">
                শিক্ষার্থীর ব্যক্তিগত, একাডেমিক এবং আর্থিক তথ্যাদি আপডেট করুন।
              </p>
            </div>
          </div>
          
          <EditStudentForm student={student} />
        </div>
      </main>
    </>
  );
};
