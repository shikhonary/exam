"use client";

import React from "react";
import { motion } from "framer-motion";
import { RouterOutput } from "@workspace/api";
import { Edit2, Trash2, Calendar, Hash } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

type Counter = RouterOutput["counter"]["list"]["data"]["items"][number];

interface CounterCardProps {
  fee: Counter;
  index: number;
  onEdit: (fee: Counter) => void;
  onDelete: (id: string, name: string) => void;
}

export const CounterCard = ({
  fee,
  index,
  onEdit,
  onDelete,
}: CounterCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card rounded-xl border border-white/[0.06] overflow-hidden shadow-sm"
    >
      <div className="flex">
        <div className="w-[3px] flex-shrink-0 bg-primary" />
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-white truncate">
                {fee.type}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                {fee.academicYear}
              </p>
            </div>
            <div className="px-2 py-1 flex items-center rounded-md bg-primary/10 border border-primary/20 text-primary font-bold text-xs whitespace-nowrap">
              <Hash className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} />{fee.value}
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.05]">
            <Button
              variant="secondary"
              className="flex-1 h-9 bg-white/[0.04] hover:bg-white/[0.08] text-white border-none font-medium"
              onClick={() => onEdit(fee)}
            >
              <Edit2 className="w-4 h-4 mr-2 text-blue-400" />
              এডিট
            </Button>
            <Button
              variant="ghost"
              className="w-9 h-9 p-0 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-none flex-shrink-0"
              onClick={() => onDelete(fee.id, `${fee.type} - ${fee.academicYear}`)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
