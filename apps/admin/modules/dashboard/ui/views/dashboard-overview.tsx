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
import { Button } from "@workspace/ui/components/button";
import { useDashboardOverview } from "@workspace/api-client";

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
    <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 p-4 md:p-5 lg:p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 group h-full">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 truncate">
            {title}
          </p>
          {loading ? (
            <Skeleton className="h-8 md:h-10 w-16 md:w-20 mt-1" />
          ) : (
            <p className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight mt-1">
              {value}
            </p>
          )}
        </div>
        <div className={`p-2 md:p-3 rounded-xl ${colorClass} flex-shrink-0 ml-2 md:ml-3`}>
          <Icon className="h-4 w-4 md:h-6 md:w-6" />
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
  const { data: dashboardData, isLoading } = useDashboardOverview();
  
  const stats = dashboardData?.stats;
  const recentStudents = dashboardData?.recentStudents || [];
  const recentExams = dashboardData?.recentExams || [];
  const ongoingExams = dashboardData?.ongoingExams || [];

  return (
    <div className="p-6 md:p-12 pt-0 max-w-7xl mx-auto space-y-8">
      {ongoingExams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-2xl p-6 shadow-sm mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <h2 className="text-xl font-bold tracking-tight text-primary">Ongoing Exams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoingExams.map((exam) => (
              <div key={exam.id} className="bg-card border border-border/50 rounded-xl p-4 flex flex-col gap-2 shadow-sm transition-all hover:border-primary/30">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold line-clamp-1">{exam.title}</h3>
                  <div className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-primary text-primary-foreground ml-2 shrink-0">Live</div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{exam.subject}</p>
                <div className="text-xs font-medium mt-1">Duration: {exam.duration} min</div>
                <div className="mt-2 pt-2 border-t border-border/50">
                  <Button asChild size="sm" variant="outline" className="w-full bg-background hover:bg-muted">
                    <Link href={`/exams/${exam.id}`}>Monitor Exam</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
      >
        <motion.div variants={item} className="h-full">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            href="/users"
            loading={isLoading}
            colorClass="text-blue-500 bg-blue-500/10"
          />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents ?? 0}
            icon={GraduationCap}
            href="/students"
            loading={isLoading}
            colorClass="text-green-500 bg-green-500/10"
          />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatCard
            title="Total Exams"
            value={stats?.totalExams ?? 0}
            icon={FileText}
            href="/exams"
            loading={isLoading}
            colorClass="text-purple-500 bg-purple-500/10"
          />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatCard
            title="Total MCQs"
            value={stats?.totalMcqs ?? 0}
            icon={HelpCircle}
            href="/mcqs"
            loading={isLoading}
            colorClass="text-orange-500 bg-orange-500/10"
          />
        </motion.div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Students */}
        <motion.div variants={item} className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-tight">Recent Students</h2>
            <Link href="/students" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : recentStudents.length > 0 ? (
              recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between group p-3 hover:bg-surface-container-low/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.mobile || student.studentId || "No contact info"}</p>
                    </div>
                  </div>
                  <Link href={`/students/${student.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent students found.</p>
            )}
          </div>
        </motion.div>

        {/* Recent Exams */}
        <motion.div variants={item} className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-tight">Recent Exams</h2>
            <Link href="/exams" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : recentExams.length > 0 ? (
              recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between group p-3 hover:bg-surface-container-low/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold line-clamp-1">{exam.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container font-medium text-muted-foreground">
                          {exam.subject}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 font-medium text-primary uppercase">
                          {exam.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/exams/${exam.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent exams found.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
