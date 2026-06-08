"use client";

import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface StudentFormStepperProps {
  currentStep: number;
}

export const steps = [
  { id: 0, title: "একাডেমিক তথ্য", description: "Academic" },
  { id: 1, title: "ব্যক্তিগত তথ্য", description: "Personal" },
  { id: 2, title: "প্রাতিষ্ঠানিক তথ্য", description: "Institution" },
  { id: 3, title: "যোগাযোগ", description: "Contact" },
  { id: 4, title: "ফি ও অন্যান্য", description: "Financial" },
];

export function StudentFormStepper({ currentStep }: StudentFormStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/[0.06] rounded-full" />
        
        {/* Active Progress Bar */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0"
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? "rgba(0,229,160,1)" : "rgba(30,41,59,1)",
                  borderColor: isCompleted || isCurrent ? "rgba(0,229,160,1)" : "rgba(255,255,255,0.1)",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
                  isCompleted || isCurrent ? "text-background" : "text-muted-foreground bg-card"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 font-bold" />
                ) : (
                  <span className="text-xs font-bold">{step.id + 1}</span>
                )}
              </motion.div>
              
              <div className="absolute top-10 flex flex-col items-center w-24 text-center">
                <span
                  className={cn(
                    "text-[11px] font-bold transition-colors duration-300",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                <span className="text-[9px] text-muted-foreground opacity-60">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-10" /> {/* Spacer for absolute text */}
    </div>
  );
}
