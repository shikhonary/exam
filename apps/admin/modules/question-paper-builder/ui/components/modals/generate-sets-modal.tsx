import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { useBuilderStore } from "../../../store/use-builder-store";
import { MCQItem, PaperItem } from "../../../types";
import { useCreateQuestionPaper, useUpdateQuestionPaperSettings, useUpdateQuestionPaper } from "@workspace/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface GenerateSetsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalPaperTitle: string;
  originalPaper: any;
}

const SET_CODES = ["ক", "খ", "গ", "ঘ"];

// Helper to shuffle an array (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArr[i];
    newArr[i] = newArr[j]!;
    newArr[j] = temp!;
  }
  return newArr;
};

export const GenerateSetsModal: React.FC<GenerateSetsModalProps> = ({
  open,
  onOpenChange,
  originalPaperTitle,
  originalPaper,
}) => {
  const { calculatedBlocks, settings, paperId } = useBuilderStore();
  const { mutateAsync: createPaper } = useCreateQuestionPaper();
  const { mutateAsync: updatePaper } = useUpdateQuestionPaper();
  const { mutateAsync: updateSettings } = useUpdateQuestionPaperSettings();
  const [isGenerating, setIsGenerating] = useState(false);
  const [numSets, setNumSets] = useState(4);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const mcqBlocks = calculatedBlocks.filter(b => b.type === "question-mcq");
      
      const requests = [];
      const baseTitle = originalPaperTitle.replace(/ - Set [ক-হ]$/, "").trim();

      for (let i = 0; i < numSets; i++) {
        const setCode = SET_CODES[i];
        
        const newSettings = {
          ...settings,
          showSetCode: true,
          setCode: setCode,
        };

        if (i === 0) {
          // Set "ক" is the master paper itself! 
          // We rename it and update its settings to show Set Code. 
          // We do NOT lock it with settings.blocks, so it remains dynamically editable.
          if (paperId) {
            requests.push(
              updatePaper({
                id: paperId,
                data: { title: `${baseTitle} - Set ${setCode}` },
              }).then(() =>
                updateSettings({
                  questionPaperId: paperId,
                  settings: newSettings,
                })
              )
            );
          }
          continue;
        }

        // For subsequent sets (খ, গ, ঘ), generate fully shuffled and locked papers
        
        // 1. Group MCQs by shared context
        const clusters: typeof mcqBlocks[] = [];
        let currentCluster: typeof mcqBlocks = [];
        
        for (const block of mcqBlocks) {
          const ctxText = block.data.item.data.questionContext?.text;
          if (currentCluster.length === 0) {
            currentCluster.push(block);
          } else {
            const firstCtxText = currentCluster[0]!.data.item.data.questionContext?.text;
            if (ctxText && firstCtxText === ctxText) {
              currentCluster.push(block);
            } else {
              clusters.push(currentCluster);
              currentCluster = [block];
            }
          }
        }
        if (currentCluster.length > 0) {
          clusters.push(currentCluster);
        }

        // 2. Shuffle clusters, then flatten
        const shuffledClusters = shuffleArray(clusters);
        let flattenedMcqs = shuffledClusters.flat();

        // 3. Shuffle options within each MCQ and extract original slot numbers
        flattenedMcqs = flattenedMcqs.map((block) => {
          const mcqItem = block.data.item.data;
          const originalOptions = [...(mcqItem.options || [])];
          const newOptions = shuffleArray(originalOptions); // array of strings
          
          let newAnswer = mcqItem.answer;
          const optionLabels = ["ক", "খ", "গ", "ঘ"];
          if (mcqItem.answer && optionLabels.includes(mcqItem.answer)) {
             const originalIndex = optionLabels.indexOf(mcqItem.answer);
             const correctText = originalOptions[originalIndex];
             const newIndex = newOptions.indexOf(correctText);
             if (newIndex !== -1) {
                newAnswer = optionLabels[newIndex];
             }
          }

          return {
            ...block,
            data: {
              ...block.data,
              item: {
                ...block.data.item,
                data: {
                  ...mcqItem,
                  options: newOptions,
                  answer: newAnswer,
                }
              }
            }
          };
        });

        // 4. Assign the target orderIndex to each MCQ based on its new slot
        // so we can calculate context instructions accurately.
        const targetOrderIndices = mcqBlocks.map(b => b.data.item.orderIndex);
        flattenedMcqs.forEach((block, index) => {
          block.data.item.orderIndex = targetOrderIndices[index];
        });

        const toBengaliDigits = (num: number | string): string => {
          const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
          return num.toString().split("").map((digit) => (/\d/.test(digit) ? bengaliDigits[parseInt(digit)] : digit)).join("");
        };

        // 5. Recalculate hideContext and contextInstruction for the shuffled MCQs
        flattenedMcqs = flattenedMcqs.map((block, idx) => {
          let hideContext = false;
          let contextInstruction = "";
          const currText = block.data.item.data.questionContext?.text;

          if (idx > 0) {
            const prevText = flattenedMcqs[idx - 1]!.data.item.data.questionContext?.text;
            if (currText && prevText === currText) {
              hideContext = true;
            }
          }

          if (!hideContext && currText) {
            let sharedCount = 1;
            for (let j = idx + 1; j < flattenedMcqs.length; j++) {
              if (flattenedMcqs[j]!.data.item.data.questionContext?.text === currText) {
                sharedCount++;
              } else {
                break;
              }
            }
            
            const startNumBn = toBengaliDigits(block.data.item.orderIndex + 1);
            if (sharedCount === 1) {
              contextInstruction = `নিচের উদ্দীপকের আলোকে ${startNumBn} নং প্রশ্নের উত্তর দাও:`;
            } else if (sharedCount === 2) {
              const endNumBn = toBengaliDigits(flattenedMcqs[idx + 1]!.data.item.orderIndex + 1);
              contextInstruction = `নিচের উদ্দীপকের আলোকে ${startNumBn} ও ${endNumBn} নং প্রশ্নগুলোর উত্তর দাও:`;
            } else {
              const endNumBn = toBengaliDigits(flattenedMcqs[idx + sharedCount - 1]!.data.item.orderIndex + 1);
              contextInstruction = `নিচের উদ্দীপকের আলোকে ${startNumBn} - ${endNumBn} নং প্রশ্নগুলোর উত্তর দাও:`;
            }
          }

          return {
            ...block,
            data: {
              ...block.data,
              hideContext,
              contextInstruction
            }
          };
        });

        // 6. Reconstruct the full canvas blocks array
        let mcqIndex = 0;
        const fullyNumberedBlocks = calculatedBlocks.map(block => {
          if (block.type === "question-mcq") {
            const targetBlock = flattenedMcqs[mcqIndex];
            mcqIndex++;
            return targetBlock;
          }
          return block;
        });

        // 5. Build base paper payload
        const payload = {
          title: `${baseTitle} - Set ${setCode}`,
          examName: originalPaper.examName || "Exam",
          classId: originalPaper.classId,
          subjectIds: originalPaper.subjects?.map((s: any) => s.subjectId) || [],
          total: originalPaper.total || 0,
          timeInMinutes: originalPaper.timeInMinutes || 0,
          status: "Draft" as const,
        };

        // 6. Push a chain of requests: create paper -> update settings with items
        requests.push(
          createPaper(payload).then((res) => {
            if (res?.data?.id) {
              return updateSettings({
                questionPaperId: res.data.id,
                settings: {
                  ...newSettings,
                  blocks: fullyNumberedBlocks, // Save the fully rendered canvas blocks inside settings!
                },
              });
            }
          })
        );
      }

      await Promise.all(requests);
      toast.success(`${numSets} sets generated and saved successfully!`);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate sets. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Question Paper Sets</DialogTitle>
          <DialogDescription>
            This will create fully independent, shuffled versions of your question paper. 
            CQ questions and Headers will remain untouched, while MCQ questions and their options will be randomized.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Number of Sets to Generate</label>
            <div className="flex gap-2">
              {[2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setNumSets(num)}
                  className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors
                    ${numSets === num ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}
                >
                  {num} Sets
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium mb-1">Set Codes to be generated:</p>
            <div className="flex gap-2">
              {SET_CODES.slice(0, numSets).map(code => (
                <span key={code} className="px-2 py-1 bg-background border rounded-md shadow-sm">
                  Set {code}
                </span>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate {numSets} Sets
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
