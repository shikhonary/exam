"use client";

import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useCreateCounterModal } from "@workspace/ui/hooks/use-create-counter-modal";

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  const { onOpen } = useCreateCounterModal();

  return (
    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-foreground font-headline">
          {title}
        </h1>
        <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-primary/80" />
        <p className="text-sm text-muted-foreground max-w-lg">{description}</p>
      </div>

      <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <Button
          onClick={onOpen}
          className="group bg-[#131B2C] hover:bg-[#1A243A] text-primary border border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] font-bold text-sm px-5 py-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          <Plus size={16} strokeWidth={3} className="mr-1.5 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
          <span>নতুন যোগ করুন</span>
        </Button>
      </div>
    </div>
  );
}
