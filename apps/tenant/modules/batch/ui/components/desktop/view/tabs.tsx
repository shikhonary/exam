"use client";

import { cn } from "@workspace/ui/lib/utils";
export type TabMode = "overview" | "students" | "exams";

interface TabsProps {
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs: { id: TabMode; label: string }[] = [
    { id: "overview", label: "ওভারভিউ" },
    { id: "students", label: "শিক্ষার্থী" },
    { id: "exams", label: "পরীক্ষা" },
  ];

  return (
    <nav className="sticky top-0 z-30 flex gap-10 border-b border-white/[0.06] bg-background/95 backdrop-blur-md">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative text-sm font-semibold pb-3 transition-colors",
            activeTab === tab.id
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      ))}
    </nav>
  );
};
