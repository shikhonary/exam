import * as React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { cn } from "@workspace/ui/lib/utils";

type MCQ = {
  id: string;
  question: string;
  options: string[];
  type: string;
  isMath: boolean;
  statements: string[];
};

interface MCQQuestionProps {
  mcq: MCQ;
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
  readOnly?: boolean;
  correctAnswer?: string;  // used for result view
  answerResult?: boolean | null; // true = correct, false = wrong, null/undefined = pending
}

export function MCQQuestion({ mcq, selectedOption, onOptionSelect, readOnly, correctAnswer, answerResult }: MCQQuestionProps) {
  const renderText = (text: string) => {
    if (mcq.isMath) {
      return <BlockMath math={text} />;
    }
    return <span>{text}</span>;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="bg-card text-card-foreground p-2 md:p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4 leading-relaxed">
          {renderText(mcq.question)}
        </h3>

        {mcq.statements && mcq.statements.length > 0 && (
          <div className="pl-4 mb-6 space-y-2 border-l-2 border-primary/30">
            {mcq.statements.map((statement, idx) => (
              <div key={idx} className="text-muted-foreground flex gap-3">
                <span className="font-mono text-sm opacity-50">{idx + 1}.</span>
                <div>{renderText(statement)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {mcq.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = correctAnswer === option;
            const isWrongSelected = readOnly && isSelected && !isCorrect;
            // Once any option is chosen, lock all other options
            const isLocked = !readOnly && !!selectedOption && !isSelected;

            let cardClassName = "p-2 rounded-xl border-2 transition-all duration-200 flex items-center gap-3";

            if (readOnly) {
              if (isCorrect) {
                cardClassName = cn(cardClassName, "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400");
              } else if (isWrongSelected) {
                cardClassName = cn(cardClassName, "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400");
              } else {
                cardClassName = cn(cardClassName, "border-border/50 bg-muted/30 opacity-60");
              }
            } else {
              if (isSelected) {
                if (answerResult === true) {
                  cardClassName = cn(cardClassName, "border-green-500 bg-green-50 ring-1 ring-green-500 cursor-not-allowed");
                } else if (answerResult === false) {
                  cardClassName = cn(cardClassName, "border-red-500 bg-red-50 ring-1 ring-red-500 cursor-not-allowed");
                } else {
                  cardClassName = cn(cardClassName, "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.15)] ring-1 ring-primary cursor-not-allowed");
                }
              } else if (isLocked) {
                cardClassName = cn(cardClassName, "border-border/40 bg-muted/20 opacity-40 cursor-not-allowed select-none");
              } else {
                cardClassName = cn(cardClassName, "border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer");
              }
            }

            return (
              <div
                key={idx}
                className={cardClassName}
                onClick={() => !readOnly && !isLocked && onOptionSelect(option)}
              >
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center font-medium",
                  isSelected && !readOnly && answerResult === true  ? "border-green-500 text-green-600 bg-green-50" :
                  isSelected && !readOnly && answerResult === false ? "border-red-500 text-red-600 bg-red-50" :
                  isSelected && !readOnly ? "border-primary text-primary" :
                  isCorrect ? "border-green-500 text-green-500" :
                  isWrongSelected ? "border-red-500 text-red-500" :
                  "border-muted-foreground/30 text-muted-foreground"
                )}>
                  {['ক', 'খ', 'গ', 'ঘ'][idx] || String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 overflow-hidden">
                  {renderText(option)}
                </div>
                {readOnly && isCorrect && (
                  <div className="text-green-500 ml-auto">✓</div>
                )}
                {readOnly && isWrongSelected && (
                  <div className="text-red-500 ml-auto">✗</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
