"use client";

import { Search, X, RotateCcw, Bookmark, Layers, AlignLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  useShortAnswerFilters,
  useAcademicClassesForSelection,
  useAcademicSubjectsForSelection,
  useAcademicChaptersForSelection,
  useAcademicChapterTopicsForSelection,
} from "@workspace/api-client";

interface FilterProps {
  isLoading: boolean;
}

export const ShortAnswerFilters = ({ isLoading }: FilterProps) => {
  const [filters, setFilters] = useShortAnswerFilters();
  const [localClassId, setLocalClassId] = useState<string | null>(null);

  const { data: classesData } = useAcademicClassesForSelection();
  const { data: subjectsData } = useAcademicSubjectsForSelection(localClassId || undefined);
  const { data: chaptersData } = useAcademicChaptersForSelection(filters.subjectId || undefined);
  const { data: topicsData } = useAcademicChapterTopicsForSelection(filters.chapterId || undefined);

  const handleClassChange = (value: string | null) => {
    setLocalClassId(value);
    setFilters({
      ...filters,
      subjectId: null,
      chapterId: null,
      topicId: null,
      page: 1,
    });
  };

  const handleSubjectChange = (value: string | null) => {
    setFilters({
      ...filters,
      subjectId: value,
      chapterId: null,
      topicId: null,
      page: 1,
    });
  };

  const handleChapterChange = (value: string | null) => {
    setFilters({
      ...filters,
      chapterId: value,
      topicId: null,
      page: 1,
    });
  };

  const handleTopicChange = (value: string | null) => {
    setFilters({
      ...filters,
      topicId: value,
      page: 1,
    });
  };

  const hasActiveFilters =
    localClassId !== null ||
    filters.subjectId !== null ||
    filters.chapterId !== null ||
    filters.topicId !== null;

  const handleResetFilters = () => {
    setLocalClassId(null);
    setFilters({
      subjectId: null,
      chapterId: null,
      topicId: null,
      page: 1,
    });
  };

  const selectedClassLabel = classesData?.find((c: any) => c.id === localClassId)?.nameEn || "Class";
  const selectedSubjectLabel = subjectsData?.find((c: any) => c.id === filters.subjectId)?.nameEn || "Subject";
  const selectedChapterLabel = chaptersData?.find((c: any) => c.id === filters.chapterId)?.nameEn || "Chapter";
  const selectedTopicLabel = topicsData?.find((t: any) => t.id === filters.topicId)?.nameEn || "Topic";

  return (
    <div className="bg-card overflow-hidden border border-border/50 rounded-2xl shadow-sm mb-6">
      <div className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Class Filter (Local only) */}
          <div className="w-full sm:w-40 lg:w-48">
            <Select
              value={localClassId || "all"}
              onValueChange={(val) => handleClassChange(val === "all" ? null : val)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <Bookmark size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Classes" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="all" className="font-medium">All Classes</SelectItem>
                {classesData?.map((c: any) => (
                  <SelectItem key={c.id} value={c.id} className="font-medium">
                    {c.nameEn || c.nameBn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Filter */}
          <div className="w-full sm:w-40 lg:w-48">
            <Select
              value={filters.subjectId || "all"}
              onValueChange={(val) => handleSubjectChange(val === "all" ? null : val)}
              disabled={isLoading || !localClassId}
            >
              <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <Bookmark size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Subjects" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="all" className="font-medium">All Subjects</SelectItem>
                {subjectsData?.map((sub: any) => (
                  <SelectItem key={sub.id} value={sub.id} className="font-medium">
                    {sub.nameEn || sub.nameBn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chapter Filter */}
          <div className="w-full sm:w-40 lg:w-48">
            <Select
              value={filters.chapterId || "all"}
              onValueChange={(val) => handleChapterChange(val === "all" ? null : val)}
              disabled={isLoading || !filters.subjectId}
            >
              <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <Layers size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Chapters" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="all" className="font-medium">All Chapters</SelectItem>
                {chaptersData?.map((ch: any) => (
                  <SelectItem key={ch.id} value={ch.id} className="font-medium">
                    {ch.nameEn || ch.nameBn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Filter */}
          <div className="w-full sm:w-40 lg:w-48">
            <Select
              value={filters.topicId || "all"}
              onValueChange={(val) => handleTopicChange(val === "all" ? null : val)}
              disabled={isLoading || !filters.chapterId}
            >
              <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                <div className="flex items-center gap-2 text-left overflow-hidden">
                  <AlignLeft size={14} className="text-primary/60 flex-shrink-0" />
                  <SelectValue placeholder="All Topics" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="all" className="font-medium">All Topics</SelectItem>
                {topicsData?.map((t: any) => (
                  <SelectItem key={t.id} value={t.id} className="font-medium">
                    {t.nameEn || t.nameBn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-0 border-t border-border/50 mt-2">
              {localClassId && (
                <Badge variant="secondary" className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-background border border-primary/10 text-xs text-primary rounded-lg hover:bg-background">
                  <span className="font-semibold opacity-50 mr-1 text-foreground text-[10px] uppercase">Class:</span>
                  <span>{selectedClassLabel}</span>
                  <button onClick={() => { setLocalClassId(null); setFilters({ ...filters, subjectId: null, chapterId: null, topicId: null }); }} className="hover:text-destructive transition-colors ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.subjectId && (
                <Badge variant="secondary" className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-background border border-primary/10 text-xs text-primary rounded-lg hover:bg-background">
                  <span className="font-semibold opacity-50 mr-1 text-foreground text-[10px] uppercase">Subject:</span>
                  <span>{selectedSubjectLabel}</span>
                  <button onClick={() => setFilters({ ...filters, subjectId: null, chapterId: null, topicId: null })} className="hover:text-destructive transition-colors ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.chapterId && (
                <Badge variant="secondary" className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-background border border-primary/10 text-xs text-primary rounded-lg hover:bg-background">
                  <span className="font-semibold opacity-50 mr-1 text-foreground text-[10px] uppercase">Chapter:</span>
                  <span>{selectedChapterLabel}</span>
                  <button onClick={() => setFilters({ ...filters, chapterId: null, topicId: null })} className="hover:text-destructive transition-colors ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.topicId && (
                <Badge variant="secondary" className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-background border border-primary/10 text-xs text-primary rounded-lg hover:bg-background">
                  <span className="font-semibold opacity-50 mr-1 text-foreground text-[10px] uppercase">Topic:</span>
                  <span>{selectedTopicLabel}</span>
                  <button onClick={() => setFilters({ ...filters, topicId: null })} className="hover:text-destructive transition-colors ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                disabled={isLoading}
                className="mt-2 ml-auto text-[10px] font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
