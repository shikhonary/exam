"use client";

import React from "react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import { useBuilderStore } from "../../../store/use-builder-store";
import { MCQItem, CQItem } from "../../../types";

export const QuestionPickerPanel: React.FC = () => {
  const setItems = useBuilderStore((state) => state.setItems);
  const items = useBuilderStore((state) => state.items);

  const addMockMCQ = () => {
    const newItem: MCQItem = {
      id: Date.now().toString(),
      type: "MCQ",
      orderIndex: items.length,
      number: items.filter(i => i.type !== "HEADER").length + 1,
      mcqType: "single",
      question: "What is the capital of France?",
      options: [
        { label: "ক", text: "Paris" },
        { label: "খ", text: "London" },
        { label: "গ", text: "Berlin" },
        { label: "ঘ", text: "Madrid" },
      ],
      correctAnswer: "Paris"
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search questions..." className="pl-8" />
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select questions to add to the paper.</p>
          
          <button 
            onClick={addMockMCQ}
            className="w-full text-left p-3 border rounded-lg hover:border-primary transition-colors text-sm"
          >
            <div className="font-medium mb-1">What is the capital of France?</div>
            <div className="text-muted-foreground text-xs line-clamp-1">Options: Paris, London, Berlin, Madrid</div>
          </button>
        </div>
      </ScrollArea>
    </div>
  );
};
