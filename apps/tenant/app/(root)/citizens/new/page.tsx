"use client";

import {
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { NewCitizenForm } from "@/modules/citizen/ui/components/desktop/form/new-citizen-form";

export default function NewCitizenPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-container-lowest overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Page Header */}
      <div className="px-8 py-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="relative animate-in fade-in slide-in-from-top-4 duration-700">
          <Link href="/citizens" className="inline-flex items-center gap-2 text-xs font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest mb-4 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Citizen List
          </Link>
          <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline flex items-center gap-4">
            New Citizen Entry
          </h1>
          <div className="mt-2 mb-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary to-primary-container" />
          <p className="text-sm leading-6 text-on-surface-variant max-w-lg italic font-medium">
            Register a new citizen in the Union Parishad database with their identity and residence details.
          </p>
        </div>

        <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <UserPlus className="w-8 h-8" />
        </div>
      </div>

      {/* Form Content */}
      <div className="relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 fill-mode-both">
        <NewCitizenForm />
      </div>
    </div>
  );
}
