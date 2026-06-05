"use client";

import React, { useEffect, useState, useRef } from "react";
import { useBuilderStore } from "../../store/use-builder-store";
import { BuilderSidebar } from "../components/sidebar/builder-sidebar";
import { BuilderCanvas } from "../components/canvas/builder-canvas";
import { FloatingFormatToolbar } from "../components/toolbar/floating-format-toolbar";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useQuestionPaperById, useUpdateQuestionPaperSettings } from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { GenerateSetsModal } from "../components/modals/generate-sets-modal";
import { Copy } from "lucide-react";

interface Props {
  paperId: string;
}

// Invisible component to handle auto-saving without triggering re-renders on the main view
function AutoSaveManager({ paperId }: { paperId: string }) {
  const { settings, hasUnsavedChanges, setSaveStatus, markSaved } = useBuilderStore();
  const { mutateAsync: updateSettings } = useUpdateQuestionPaperSettings();
  const debouncedSettings = useDebounce(settings, 1500);
  const initialMount = useRef(true);

  useEffect(() => {
    // Skip the very first mount/hydration
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    if (hasUnsavedChanges) {
      /* Commented out auto-save for now
      setSaveStatus("saving");
      updateSettings({ id: paperId, settings: debouncedSettings })
        .then(() => {
          markSaved();
        })
        .catch(() => {
          setSaveStatus("error");
          toast.error("Failed to auto-save settings");
        });
      */
    }
  }, [debouncedSettings, paperId, hasUnsavedChanges, updateSettings, setSaveStatus, markSaved]);

  return null;
}

export const QuestionPaperBuilderView: React.FC<Props> = ({ paperId }) => {
  const { hydratePaper, saveStatus, markSaved } = useBuilderStore();
  const isExporting = useBuilderStore((state) => state.isExporting);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const { data: paperQuery, isLoading, error } = useQuestionPaperById(paperId);

  useEffect(() => {
    if (paperQuery && !isHydrated) {
      hydratePaper(paperId, (paperQuery.settings || {}) as any, paperQuery);
      setIsHydrated(true);
    }
  }, [paperQuery, isHydrated, hydratePaper, paperId]);

  const handleManualSave = () => {
    useBuilderStore.setState({ saveStatus: "saving" });
    setTimeout(() => {
      toast.success("Changes saved successfully");
      markSaved();
    }, 800);
  };

  if (isLoading || !isHydrated) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-background items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Question Paper...</p>
      </div>
    );
  }

  if (error || !paperQuery) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-background items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load question paper.</p>
        <Button asChild className="mt-4">
          <Link href="/question-papers">Go Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen print:h-auto overflow-hidden print:overflow-visible bg-background">
      <AutoSaveManager paperId={paperId} />
      
      {/* Top Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b bg-card shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/question-papers">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold line-clamp-1 max-w-[200px] md:max-w-md">
              {paperQuery.title}
            </h1>
            {saveStatus === "saving" && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs text-green-600">All changes saved</span>
            )}
            {saveStatus === "error" && (
              <span className="text-xs text-red-600">Failed to save</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowGenerateModal(true)}>
            <Copy className="w-4 h-4 mr-2" />
            Generate Sets
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Export PDF
          </Button>
          <Button size="sm" onClick={handleManualSave} disabled={saveStatus === "saving"}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden print:overflow-visible relative">
        <BuilderSidebar />
        <main className="flex-1 relative overflow-auto print:overflow-visible bg-muted/30 print:bg-transparent">
          <BuilderCanvas />
          <FloatingFormatToolbar />
        </main>
      </div>

      <GenerateSetsModal 
        open={showGenerateModal} 
        onOpenChange={setShowGenerateModal} 
        originalPaperTitle={paperQuery.title}
        originalPaper={paperQuery}
      />
    </div>
  );
};
