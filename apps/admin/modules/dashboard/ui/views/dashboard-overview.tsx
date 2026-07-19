"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Users,
  CreditCard,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Plus,
  HelpCircle,
  Activity,
  Ban,
  GraduationCap,
  FileText,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useTRPC } from "@/trpc/react";
import { useUserStats } from "@workspace/api-client";

const useTenants = () => ({ data: { items: [] }, isLoading: false });
const useSubscriptionStats = () => ({ data: { active: 0, canceled: 0, total: 0 }, isLoading: false });

// ─── Animation variants ───────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
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

// ─── Recent Tenants ───────────────────────────────────────────────────────────
function RecentTenantsTable() {
  const { data: tenantsData, isLoading } = useTenants();
  const tenants = (tenantsData as any)?.items?.slice(0, 6) ?? [];

  const statusColor = (isActive: boolean, isSuspended: boolean) => {
    if (isSuspended) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (isActive) return "bg-green-500/10 text-green-500 border-green-500/20";
    return "bg-muted text-muted-foreground border-border";
  };

  const dbStatusColor = (status: string) => {
    if (status === "READY") return "bg-green-500/10 text-green-500";
    if (status === "PROVISIONING") return "bg-yellow-500/10 text-yellow-500";
    if (status === "FAILED") return "bg-red-500/10 text-red-500";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <div>
          <h3 className="font-bold text-foreground">Recent Tenants</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Latest registered organizations</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
          <Link href="/tenants" className="flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : tenants.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-muted-foreground">
          <Building2 className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No tenants yet</p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/tenants/new"><Plus className="w-3.5 h-3.5 mr-1" /> Add First Tenant</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border/30">
          {tenants.map((tenant: any) => (
            <Link
              key={tenant.id}
              href={`/tenants/${tenant.id}`}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm border border-primary/20">
                {tenant.name?.charAt(0)?.toUpperCase() ?? "T"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {tenant.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{tenant.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dbStatusColor(tenant.databaseStatus)}`}>
                  {tenant.databaseStatus}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor(tenant.isActive, tenant.isSuspended)}`}>
                  {tenant.isSuspended ? "Suspended" : tenant.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Subscription Breakdown ───────────────────────────────────────────────────
function SubscriptionBreakdown() {
  const { data: stats, isLoading } = useSubscriptionStats();

  const statusItems = [
    { label: "Active", count: (stats as any)?.active ?? 0, color: "bg-green-500" },
    { label: "Canceled", count: (stats as any)?.canceled ?? 0, color: "bg-red-500" },
    { label: "Other", count: Math.max(0, ((stats as any)?.total ?? 0) - ((stats as any)?.active ?? 0) - ((stats as any)?.canceled ?? 0)), color: "bg-muted-foreground/40" },
  ];

  const total = statusItems.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <div>
          <h3 className="font-bold text-foreground">Subscription Status</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Current plan distribution</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
          <Link href="/subscriptions" className="flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>

      <div className="p-6 space-y-4">
        {/* Stacked bar */}
        {isLoading ? (
          <Skeleton className="h-3 w-full rounded-full" />
        ) : total > 0 ? (
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {statusItems.map(s =>
              s.count > 0 ? (
                <div
                  key={s.label}
                  className={`${s.color} transition-all duration-500`}
                  style={{ width: `${(s.count / total) * 100}%` }}
                />
              ) : null
            )}
          </div>
        ) : (
          <div className="h-3 rounded-full bg-muted" />
        )}

        {/* Legend */}
        <div className="space-y-2.5">
          {statusItems.map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-4 w-8" />
              ) : (
                <span className="text-sm font-bold text-foreground">{s.count}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
const quickActions = [
  { label: "Add Tenant", href: "/tenants/new", icon: Building2, color: "from-blue-600 to-blue-500" },
  { label: "Add User", href: "/users", icon: Users, color: "from-violet-600 to-violet-500" },
  { label: "New Plan", href: "/subscription-plans/new", icon: CreditCard, color: "from-emerald-600 to-emerald-500" },
  { label: "Academic Years", href: "/academic-years", icon: GraduationCap, color: "from-amber-600 to-amber-500" },
  { label: "Question Bank", href: "/mcqs", icon: HelpCircle, color: "from-rose-600 to-rose-500" },
  { label: "Question Papers", href: "/question-papers", icon: FileText, color: "from-teal-600 to-teal-500" },
];

// ─── Main Dashboard Overview ──────────────────────────────────────────────────
export function DashboardOverview() {
  const trpc = useTRPC();
  const { data: userStats, isLoading: loadingUsers } = useUserStats();
  const loadingTenants = false;
  const tenantStats = { total: 0, active: 0 };
  const loadingPlans = false;
  const planStats = { total: 0 };
  const loadingSubs = false;
  const subStats = { active: 0 };

  const stats = [
    {
      title: "Total Tenants",
      value: (tenantStats as any)?.total ?? 0,
      icon: Building2,
      colorClass: "text-blue-500 bg-blue-500/10",
      href: "/tenants",
      loading: loadingTenants,
    },
    {
      title: "Active Tenants",
      value: (tenantStats as any)?.active ?? 0,
      icon: CheckCircle2,
      colorClass: "text-green-500 bg-green-500/10",
      href: "/tenants",
      loading: loadingTenants,
    },
    {
      title: "Total Users",
      value: (userStats as any)?.total ?? 0,
      icon: Users,
      colorClass: "text-violet-500 bg-violet-500/10",
      href: "/users",
      loading: loadingUsers,
    },
    {
      title: "Active Users",
      value: (userStats as any)?.active ?? 0,
      icon: Activity,
      colorClass: "text-emerald-500 bg-emerald-500/10",
      href: "/users",
      loading: loadingUsers,
    },
    {
      title: "Subscriptions",
      value: (subStats as any)?.total ?? 0,
      icon: CreditCard,
      colorClass: "text-primary bg-primary/10",
      href: "/subscriptions",
      loading: loadingSubs,
    },
    {
      title: "Active Plans",
      value: (planStats as any)?.active ?? 0,
      icon: TrendingUp,
      colorClass: "text-amber-500 bg-amber-500/10",
      href: "/subscription-plans",
      loading: loadingPlans,
    },
    {
      title: "Suspended",
      value: (tenantStats as any)?.suspended ?? 0,
      icon: Ban,
      colorClass: "text-red-500 bg-red-500/10",
      href: "/tenants",
      loading: loadingTenants,
    },
    {
      title: "Inactive Tenants",
      value: (tenantStats as any)?.inactive ?? 0,
      icon: XCircle,
      colorClass: "text-muted-foreground bg-muted",
      href: "/tenants",
      loading: loadingTenants,
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-10 blur-3xl bg-primary -z-10" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl bg-accent -z-10" />

      <main className="container mx-auto px-6 py-10 lg:px-12 max-w-7xl space-y-10">
        {/* ── Page Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30 bg-primary/5">
                Live Overview
              </Badge>
            </div>
            <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-foreground leading-[1.15]">
              Dashboard
            </h1>
            <div className="mt-1.5 mb-3 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary/20" />
            <p className="text-sm text-muted-foreground font-medium max-w-lg italic opacity-70">
              Platform-wide metrics, recent activity, and quick administrative actions.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl border-border/60">
              <Link href="/tenants">
                <Building2 className="w-3.5 h-3.5 mr-1.5" />
                Tenants
              </Link>
            </Button>
            <Button asChild size="sm" className="h-9 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20">
              <Link href="/tenants/new">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Tenant
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* ── KPI Stats Grid ─────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((s) => (
            <motion.div key={s.title} variants={item}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main Content Grid ──────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Recent Tenants — takes 2 cols on large */}
          <motion.div variants={item} className="lg:col-span-2">
            <RecentTenantsTable />
          </motion.div>

          {/* Subscription Breakdown — 1 col */}
          <motion.div variants={item}>
            <SubscriptionBreakdown />
          </motion.div>
        </motion.div>

        {/* ── Quick Actions ──────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40">
                <h3 className="font-bold text-foreground">Quick Actions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Jump to common admin tasks</p>
              </div>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/30 transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Module Overview Cards ──────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            {
              title: "Academic Management",
              description: "Manage years, classes, subjects, chapters and topics",
              icon: GraduationCap,
              links: [
                { label: "Academic Years", href: "/academic-years" },
                { label: "Subjects", href: "/academic-subjects" },
              ],
              color: "from-amber-600 to-amber-500",
            },
            {
              title: "Question Bank",
              description: "MCQs, creative questions, short answers and papers",
              icon: HelpCircle,
              links: [
                { label: "MCQs", href: "/mcqs" },
                { label: "CQs", href: "/cqs" },
                { label: "Question Papers", href: "/question-papers" },
              ],
              color: "from-rose-600 to-rose-500",
            },
            {
              title: "Billing & Subscriptions",
              description: "Plans, active subscriptions and payment records",
              icon: CreditCard,
              links: [
                { label: "Plans", href: "/subscription-plans" },
                { label: "Subscriptions", href: "/subscriptions" },
              ],
              color: "from-emerald-600 to-emerald-500",
            },
            {
              title: "User Management",
              description: "Manage users and students across the platform",
              icon: Users,
              links: [
                { label: "Users", href: "/users" },
                { label: "Students", href: "/students" },
              ],
              color: "from-violet-600 to-violet-500",
            },
          ].map((module) => (
            <motion.div key={module.title} variants={item}>
              <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 p-5 h-full flex flex-col hover:border-primary/20 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <module.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{module.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{module.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-border/30">
                  {module.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
