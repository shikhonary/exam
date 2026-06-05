"use client";

import { useState } from "react";

import { useBatchDetails } from "@workspace/api-client";
import { Header as DesktopHeader } from "../components/desktop/view/header";
import { Stats as DesktopStats } from "../components/desktop/view/stats";
import { Tabs as DesktopTabs } from "../components/desktop/view/tabs";
import { Overview as DesktopOverview } from "../components/desktop/view/overview";
import { Sidebar as DesktopSidebar } from "../components/desktop/view/sidebar";
import { StudentsTab as DesktopStudents } from "../components/desktop/view/students-tab";
import { ExamsTab as DesktopExams } from "../components/desktop/view/exams-tab";
import { BatchViewMobile } from "../components/mobile/view";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface BatchViewProps {
  id: string;
}

export type TabMode = "overview" | "students" | "exams";

export const BatchView = ({ id }: BatchViewProps) => {
  const [activeTab, setActiveTab] = useState<TabMode>("overview");

  const { data: batch, isLoading } = useBatchDetails(id);

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block min-h-screen bg-background">
        <DesktopHeader batch={batch ?? undefined} isLoading={isLoading} />

        <main className="max-w-[1440px] mx-auto px-8 pt-4 pb-12 space-y-8">
          <DesktopStats 
            stats={batch?.stats ?? { totalStudents: 0, inactiveStudents: 0, totalExams: 0 }} 
            capacity={batch?.capacity ?? 0} 
            isLoading={isLoading} 
          />

          <DesktopTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {activeTab === "overview" && (
              <>
                <div className="lg:col-span-7 space-y-8">
                  <DesktopOverview batch={batch ?? undefined} isLoading={isLoading} />
                </div>
                <div className="lg:col-span-5 space-y-8">
                  <DesktopSidebar batch={batch ?? undefined} isLoading={isLoading} />
                </div>
              </>
            )}

            {activeTab === "students" && (
              <div className="lg:col-span-12">
                <DesktopStudents isLoading={isLoading} />
              </div>
            )}

            {activeTab === "exams" && (
              <div className="lg:col-span-12">
                <DesktopExams isLoading={isLoading} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <BatchViewMobile
          batch={batch ?? undefined}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
