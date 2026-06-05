"use client";

import { Header } from "./header";
import { Tabs } from "./tabs";
import { Stats } from "./stats";
import { TabMode } from "../../../views/batch-view";
import { InfoSection } from "./info-section";
import { RecentExams } from "./recent-exams";
import { TopPerformers } from "./top-performers";
import { StudentsTab } from "./students-tab";
import { ExamsTab } from "./exams-tab";
import { TenantTypes } from "@workspace/db";
import { motion, AnimatePresence } from "framer-motion";

interface BatchWithRelations extends TenantTypes.Batch {
  stats: {
    totalStudents: number;
    inactiveStudents: number;
    totalExams: number;
  };
}

interface BatchViewMobileProps {
  batch?: BatchWithRelations;
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
  isLoading?: boolean;
}

export const BatchViewMobile = ({
  batch,
  activeTab,
  onTabChange,
  isLoading,
}: BatchViewMobileProps) => {
  return (
    <div className="min-h-screen bg-background pb-12 pt-16">
      <Header batch={batch} isLoading={isLoading} />
      
      <div className="mt-4 mb-2">
        <Stats 
          stats={batch?.stats ?? { totalStudents: 0, inactiveStudents: 0, totalExams: 0 }} 
          capacity={batch?.capacity ?? 0} 
          isLoading={isLoading} 
        />
      </div>

      <Tabs activeTab={activeTab} onTabChange={onTabChange} />

      <main className="pt-6 px-4 max-w-2xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <InfoSection batch={batch} studentCount={batch?.stats?.totalStudents ?? 0} isLoading={isLoading} />
              <RecentExams isLoading={isLoading} />
              <TopPerformers isLoading={isLoading} />
            </motion.div>
          )}

          {activeTab === "students" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StudentsTab isLoading={isLoading} />
            </motion.div>
          )}

          {activeTab === "exams" && (
            <motion.div
              key="exams"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ExamsTab isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
