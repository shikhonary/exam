"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  FileText,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { 
  useUserStats, 
  useStudentStats, 
  useExamStats, 
  useMcqStats 
} from "@workspace/api-client";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass?: string;
  href?: string;
  loading?: boolean;
}

function StatCard({ title, value, icon: Icon, colorClass = "text-primary bg-primary/10", href, loading }: StatCardProps) {
  const content = (
    <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 p-5 lg:p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 group h-full">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
            {title}
          </p>
          {loading ? (
            <Skeleton className="h-10 w-20 mt-1" />
          ) : (
            <p className="text-3xl lg:text-4xl font-black text-foreground tracking-tight mt-1">
              {value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass} flex-shrink-0 ml-3`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {href && (
        <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
          <span>View all</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}

export const DashboardOverview = () => {
  const { data: userStats, isLoading: isUserLoading } = useUserStats();
  const { data: studentStats, isLoading: isStudentLoading } = useStudentStats();
  const { data: examStats, isLoading: isExamLoading } = useExamStats();
  const { data: mcqStats, isLoading: isMcqLoading } = useMcqStats();

  return (
    <div className="p-6 md:p-12 pt-0 max-w-7xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item} className="h-full">
          <StatCard
            title="Total Users"
            value={userStats?.total ?? 0}
            icon={Users}
            href="/users"
            loading={isUserLoading}
            colorClass="text-blue-500 bg-blue-500/10"
          />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatCard
            title="Total Students"
            value={studentStats?.total ?? 0}
            icon={GraduationCap}
            href="/students"
            loading={isStudentLoading}
            colorClass="text-green-500 bg-green-500/10"
          />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatCard
            title="Total Exams"
            value={examStats?.total ?? 0}
            icon={FileText}
            href="/exams"
            loading={isExamLoading}
            colorClass="text-purple-500 bg-purple-500/10"
          />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatCard
            title="Total MCQs"
            value={mcqStats?.total ?? 0}
            icon={HelpCircle}
            href="/mcqs"
            loading={isMcqLoading}
            colorClass="text-orange-500 bg-orange-500/10"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
