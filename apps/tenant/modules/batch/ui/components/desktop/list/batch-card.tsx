"use client";

import React from "react";
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Layers3,
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";
import { motion } from "framer-motion";
import Link from "next/link";

interface BatchWithRelations extends TenantTypes.Batch {
  _count: {
    students: number;
  };
}

export interface BatchCardProps {
  batch: BatchWithRelations;
  index: number;
  onDelete: (id: string, name: string) => void;
  onToggleActive?: (id: string) => void;
}

export function BatchCard({
  batch,
  index,
  onDelete,
  onToggleActive,
}: BatchCardProps) {
  const capacityPercentage = Math.min(
    (batch._count.students / batch.capacity) * 100,
    100,
  );

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
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">ব্যাচ</p>
            <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-2 leading-tight">
              {batch.name}
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
                onClick={() => onToggleActive?.(batch.id)}
                className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary m-1"
              >
                {batch.isActive ? (
                  <><ToggleRight className="h-4 w-4 mr-2 text-primary" /> ইনঅ্যাক্টিভ করুন</>
                ) : (
                  <><ToggleLeft className="h-4 w-4 mr-2" /> অ্যাক্টিভ করুন</>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-medium text-foreground focus:bg-[rgba(0,229,160,0.08)] focus:text-primary m-1"
              >
                <Link href={`/batches/edit/${batch.id}`}>
                  <Edit className="w-4 h-4 mr-2" /> সম্পাদনা
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(batch.id, batch.name)}
                className="rounded-lg cursor-pointer font-medium text-[#ff4757] focus:text-[#ff4757] focus:bg-[rgba(255,71,87,0.08)] m-1"
              >
                <Trash2 className="w-4 h-4 mr-2" /> মুছুন
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-white/[0.06] hover:bg-white/[0.08] text-muted-foreground border-none font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-none">
                {batch.className || "কোনো ক্লাস নেই"}
              </Badge>
              <Badge className="bg-white/[0.06] hover:bg-white/[0.08] text-muted-foreground border-none font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-none">
                {batch.academicYear}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">ভর্তি</span>
                <span className="text-foreground flex items-center gap-1.5">
                  {batch._count.students}/{batch.capacity}
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      capacityPercentage >= 100
                        ? "bg-[#ff4757]"
                        : capacityPercentage >= 90
                          ? "bg-amber-500 animate-pulse"
                          : "bg-primary",
                    )}
                  />
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${capacityPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    capacityPercentage >= 100
                      ? "bg-[#ff4757]"
                      : "bg-primary",
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-auto bg-white/[0.02] p-6 pt-2 border-t border-white/[0.05]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <Avatar
                    key={i}
                    className="w-8 h-8 border-2 border-background ring-1 ring-white/[0.06]"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${batch.id}${i}`}
                    />
                    <AvatarFallback className="text-[10px] font-bold bg-white/[0.06] text-muted-foreground">
                      ST
                    </AvatarFallback>
                  </Avatar>
                ))}
                {batch._count.students > 3 && (
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] border-2 border-background flex items-center justify-center text-[10px] font-black text-muted-foreground ring-1 ring-white/[0.06]">
                    +{batch._count.students - 3}
                  </div>
                )}
              </div>
              <Badge
                className={cn(
                  "px-3 py-1 text-[10px] font-black rounded-md border-none shadow-none",
                  batch.isActive
                    ? "bg-[rgba(0,229,160,0.10)] text-primary hover:bg-[rgba(0,229,160,0.15)]"
                    : "bg-white/[0.06] text-muted-foreground hover:bg-white/[0.08]",
                )}
              >
                {batch.isActive ? "অ্যাক্টিভ" : "ইনঅ্যাক্টিভ"}
              </Badge>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full bg-transparent border-white/[0.06] text-muted-foreground hover:bg-[rgba(0,229,160,0.08)] group-hover:border-[rgba(0,229,160,0.20)] group-hover:text-primary transition-all font-bold text-xs gap-2"
            >
              <Link href={`/batches/${batch.id}`}>
                <Eye className="w-4 h-4" />
                বিস্তারিত দেখুন
              </Link>
            </Button>
        </div>
    </motion.div>
  );
}
