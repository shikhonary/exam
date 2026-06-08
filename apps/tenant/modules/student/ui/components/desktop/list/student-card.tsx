"use client";

import React from "react";
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";
import { motion } from "framer-motion";
import Link from "next/link";

interface StudentWithRelations extends TenantTypes.Student {
  batch?: {
    id: string;
    name: string;
  } | null;
}

export interface StudentCardProps {
  student: StudentWithRelations;
  index: number;
  onDelete: (id: string, name: string) => void;
  onToggleActive?: (id: string) => void;
}

export function StudentCard({
  student,
  index,
  onDelete,
  onToggleActive,
}: StudentCardProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-[#131B2C] hover:bg-[#1A243A] border border-white/[0.05] hover:border-white/[0.1] rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col"
    >
      {/* Accent decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110" />
      
      <div className="p-6 pb-4 relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className="pr-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">ID: {student.studentId}</p>
            <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-2 leading-tight">
              {student.name}
            </h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-[rgba(0,229,160,0.08)] rounded-lg transition-colors bg-white/[0.02] flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#111b2e] border border-white/[0.08] rounded-xl p-1 shadow-xl">
              <DropdownMenuItem
                onClick={() => onToggleActive?.(student.id)}
                className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary m-1"
              >
                {student.isActive ? (
                  <><ToggleRight className="h-4 w-4 mr-2 text-primary" /> ইনঅ্যাক্টিভ করুন</>
                ) : (
                  <><ToggleLeft className="h-4 w-4 mr-2" /> অ্যাক্টিভ করুন</>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary m-1"
              >
                <Link href={`/students/edit/${student.id}`}>
                  <Edit className="w-4 h-4 mr-2" /> সম্পাদনা
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(student.id, student.name)}
                className="rounded-lg cursor-pointer font-medium text-[#ff4757] focus:text-[#ff4757] focus:bg-[rgba(255,71,87,0.08)] m-1"
              >
                <Trash2 className="w-4 h-4 mr-2" /> মুছুন
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <Badge className="bg-white/[0.06] hover:bg-white/[0.08] text-muted-foreground border-none font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-none">
            {student.className || "কোনো ক্লাস নেই"}
          </Badge>
          <Badge className="bg-white/[0.06] hover:bg-white/[0.08] text-muted-foreground border-none font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-none">
            {student.batch?.name || "কোনো ব্যাচ নেই"}
          </Badge>
        </div>

        <div className="mt-4 space-y-1">
          <div className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
            <span>রোল: {student.roll}</span>
            <span>ফোন: {student.primaryPhone}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto bg-white/[0.02] p-6 pt-2 border-t border-white/[0.05]">
        <div className="flex justify-between items-center mb-2">
          <Badge
            className={cn(
              "px-3 py-1 text-[10px] font-black rounded-md border-none shadow-none mt-2",
              student.isActive
                ? "bg-[rgba(0,229,160,0.10)] text-primary hover:bg-[rgba(0,229,160,0.15)]"
                : "bg-white/[0.06] text-muted-foreground hover:bg-white/[0.08]",
            )}
          >
            {student.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
          </Badge>
        </div>
        <Button
          asChild
          variant="outline"
          className="w-full bg-transparent border-white/[0.06] text-muted-foreground hover:bg-[rgba(0,229,160,0.08)] group-hover:border-[rgba(0,229,160,0.20)] group-hover:text-primary transition-all font-bold text-xs gap-2"
        >
          <Link href={`/students/${student.id}`}>
            <Eye className="w-4 h-4" />
            বিস্তারিত দেখুন
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
