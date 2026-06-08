"use client";

import React from "react";
import { CreateStudentForm } from "../form/create-student-form";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { motion } from "framer-motion";

export function StudentCreateView() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-foreground text-muted-foreground transition-all"
              >
                <Link href="/students">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,160,0.15)] flex items-center justify-center text-primary border border-[rgba(0,229,160,0.20)]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
                    নতুন শিক্ষার্থী
                  </h1>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    নতুন শিক্ষার্থীর তথ্য সিস্টেমে যুক্ত করুন
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <CreateStudentForm />
        </motion.div>
      </main>
    </div>
  );
}
