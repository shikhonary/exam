"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, File, Layers, BookOpen, Bookmark } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

// Types extracted matching the Prisma include structure
type SubTopic = {
  id: string;
  name: string;
  displayName: string;
  position: number;
};

type Topic = {
  id: string;
  nameEn: string;
  nameBn: string;
  position: number;
  subtopics: SubTopic[];
};

type Chapter = {
  id: string;
  nameEn: string;
  nameBn: string;
  position: number;
  topics: Topic[];
};

type Subject = {
  id: string;
  nameEn: string;
  nameBn: string;
  chapters: Chapter[];
};

type ClassSubject = {
  id: string;
  position: number;
  academicSubject: Subject;
};

type Class = {
  id: string;
  nameEn: string;
  nameBn: string;
  level: string;
  position: number;
  classSubjects: ClassSubject[];
};

interface HierarchyTreeProps {
  data: Class[];
}

const TreeNode = ({
  title,
  subtitle,
  icon,
  childrenNodes,
  level = 0,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  childrenNodes?: React.ReactNode;
  level?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!childrenNodes;

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center py-2 px-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors",
          level > 0 && "ml-4 border-l pl-4"
        )}
        onClick={() => setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      >
        <div className="w-5 h-5 flex items-center justify-center mr-1 text-muted-foreground">
          {hasChildren ? (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="w-4 h-4" /> // spacing
          )}
        </div>
        <div className="w-5 h-5 flex items-center justify-center mr-2 text-muted-foreground">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none">{title}</span>
          {subtitle && <span className="text-xs text-muted-foreground mt-1">{subtitle}</span>}
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="flex flex-col space-y-1 mt-1">
          {childrenNodes}
        </div>
      )}
    </div>
  );
};

export const HierarchyTree = ({ data }: HierarchyTreeProps) => {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-muted-foreground border rounded-md">No academic hierarchy data found.</div>;
  }

  return (
    <div className="w-full border rounded-lg p-4 bg-background">
      {data.map((c) => (
        <TreeNode
          key={c.id}
          title={c.nameEn}
          subtitle={`Class Level: ${c.level}`}
          icon={<Layers className="h-4 w-4" />}
          level={0}
          childrenNodes={c.classSubjects.map((cs) => (
            <TreeNode
              key={cs.id}
              title={cs.academicSubject.nameEn}
              icon={<BookOpen className="h-4 w-4" />}
              level={1}
              childrenNodes={cs.academicSubject.chapters.map((ch) => (
                <TreeNode
                  key={ch.id}
                  title={ch.nameEn}
                  icon={<Bookmark className="h-4 w-4" />}
                  level={2}
                  childrenNodes={ch.topics.map((t) => (
                    <TreeNode
                      key={t.id}
                      title={t.nameEn}
                      icon={<Folder className="h-4 w-4" />}
                      level={3}
                      childrenNodes={t.subtopics.map((st) => (
                        <TreeNode
                          key={st.id}
                          title={st.displayName || st.name}
                          icon={<File className="h-4 w-4" />}
                          level={4}
                        />
                      ))}
                    />
                  ))}
                />
              ))}
            />
          ))}
        />
      ))}
    </div>
  );
};
