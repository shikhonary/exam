"use client";

import React from "react";
import { Plus, Layers } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Filters } from "./filters";
import { useCreateCounterModal } from "@workspace/ui/hooks/use-create-counter-modal";

export const Header = () => {
  const { onOpen } = useCreateCounterModal();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/[0.06]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[rgba(0,229,160,0.15)] flex items-center justify-center text-primary border border-[rgba(0,229,160,0.20)]">
              <Layers className="w-5 h-5" />
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
          </div>

          <div className="min-w-0 py-1">
            <h1 className="text-base font-bold tracking-tight text-foreground leading-normal">
              কাউন্টার
            </h1>
            <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[200px]">
              শিক্ষার্থীদের জন্য কাউন্টার নির্ধারণ ও পরিচালনা করুন।
            </p>
          </div>
        </div>

        {/* Add button */}
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <Button
            onClick={onOpen}
            className="
              flex items-center gap-1.5
              bg-[#131B2C] hover:bg-[#1A243A] text-primary border border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.5)]
              font-bold text-[11px] h-9 px-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 group
            "
          >
            <Plus strokeWidth={3} className="w-3.5 h-3.5 transition-transform duration-300 group-active:rotate-90 group-active:scale-110" />
            <span>নতুন যোগ করুন</span>
          </Button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <div className="w-full">
          <Filters />
        </div>
      </div>
    </header>
  );
};
