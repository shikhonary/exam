"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}


// ─── Main Header ──────────────────────────────────────────────────────────
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="sticky top-0 z-30 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-xl border-b border-border/40 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-6 lg:px-8 py-3">
        {/* Left: Title */}
        <div className="min-w-0 flex-1 pl-12 lg:pl-0">
          <div className="flex flex-col">
            <h1 className="font-display text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 truncate tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground font-medium mt-0.5 truncate flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search anything..."
              className="pl-10 pr-12 w-56 lg:w-80 bg-secondary/50 border-transparent hover:bg-secondary/80 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all rounded-full h-10 shadow-inner"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 h-5 select-none items-center gap-1 rounded-full border border-border/50 bg-background/50 px-2 font-mono text-[10px] font-medium text-muted-foreground hidden lg:flex shadow-sm">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
