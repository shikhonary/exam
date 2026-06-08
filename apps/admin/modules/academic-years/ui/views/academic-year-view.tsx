"use client";

import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Star,
  CheckCircle2,
  XCircle,
  BookOpen,
  GraduationCap,
  Users,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

import {
  useAcademicYearById,
  useSetCurrentAcademicYear,
  useToggleAcademicYearActive,
  useDeleteAcademicYear,
} from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

// ---------------------------------------------------------------------------
// Inner content
// ---------------------------------------------------------------------------
function AcademicYearContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: year } = useAcademicYearById(id);
  const { mutateAsync: setCurrent, isPending: isSettingCurrent } = useSetCurrentAcademicYear();
  const { mutateAsync: toggleActive, isPending: isToggling } = useToggleAcademicYearActive();
  const { mutateAsync: deleteYear, isPending: isDeleting } = useDeleteAcademicYear();
  const { openDeleteModal } = useDeleteModal();

  if (!year) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <XCircle className="mx-auto text-muted-foreground/40" size={40} />
          <p className="text-on-surface-variant">Academic year not found.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/academic-years">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to list
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    openDeleteModal({
      entityId: year.id,
      entityType: "academicYear",
      entityName: year.label,
      onConfirm: async (entityId) => {
        await deleteYear({ id: entityId });
        router.push("/academic-years");
      },
    });
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-6 py-12 lg:px-12 max-w-5xl relative z-10"
    >
      {/* ── Back + Actions ── */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <Button
          asChild
          variant="ghost"
          className="text-on-surface-variant hover:text-on-surface -ml-3"
        >
          <Link href="/academic-years">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Academic Years
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {!year.isCurrent && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 text-xs rounded-xl"
              disabled={isSettingCurrent}
              onClick={() => setCurrent({ id: year.id })}
            >
              <Star size={13} />
              Set as Current
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-xs rounded-xl"
            disabled={isToggling}
            onClick={() => toggleActive({ id: year.id })}
          >
            {year.isActive ? (
              <>
                <XCircle size={13} />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                Activate
              </>
            )}
          </Button>

          <Button
            size="sm"
            asChild
            className="gap-2 text-xs rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
            variant="ghost"
          >
            <Link href={`/academic-years/${year.id}/edit`}>
              <Edit size={13} />
              Edit
            </Link>
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="gap-2 text-xs rounded-xl opacity-80 hover:opacity-100"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </motion.div>

      {/* ── Header card ── */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-outline/5 shadow-ambient mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              {/* Icon */}
              <div className="p-4 rounded-2xl bg-primary/10 text-primary w-fit">
                <CalendarDays size={32} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
                    {year.label}
                  </h1>
                  {year.isCurrent && (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5">
                      <Star size={9} className="mr-1" />
                      Current
                    </Badge>
                  )}
                  <Badge
                    className={`rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5 ${
                      year.isActive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {year.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-on-surface-variant text-sm font-mono">
                  {year.slug}
                </p>

                <div className="flex flex-wrap gap-4 mt-3 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    {format(new Date(year.startDate), "d MMM yyyy")} →{" "}
                    {format(new Date(year.endDate), "d MMM yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} />
                    {year.sessions.length} session
                    {year.sessions.length !== 1 ? "s" : ""}
                  </span>
                  {year._count && (
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {year._count.tenants} tenant
                      {year._count.tenants !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="sessions">
          <TabsList className="bg-muted/40 p-1.5 rounded-2xl border border-border/30 h-auto inline-flex">
            <TabsTrigger
              value="sessions"
              className="rounded-xl px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Sessions ({year.sessions.length})
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-xl px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Details
            </TabsTrigger>
          </TabsList>

          {/* Sessions tab */}
          <TabsContent value="sessions" className="mt-6 focus-visible:outline-none">
            {year.sessions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-outline/20 p-12 text-center">
                <BookOpen className="mx-auto mb-3 text-on-surface-variant/30" size={36} />
                <p className="text-on-surface-variant">
                  No sessions defined for this academic year.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4 rounded-xl">
                  <Link href={`/academic-years/${year.id}/edit`}>
                    Add Sessions
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {year.sessions.map((session, idx) => (
                  <Card
                    key={session.id}
                    className="rounded-2xl border-outline/5 shadow-none hover:shadow-ambient transition-shadow"
                  >
                    <CardHeader className="pb-2 flex flex-row items-start gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5">
                        <BookOpen size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-sm font-semibold">
                            {session.name}
                          </CardTitle>
                          <Badge
                            className={`rounded-full text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                              session.isActive
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {session.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {format(new Date(session.startDate), "d MMM yyyy")} →{" "}
                          {format(new Date(session.endDate), "d MMM yyyy")}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <Separator className="opacity-10 mb-3" />
                      <div className="flex flex-wrap gap-1.5">
                        {session.classes.length === 0 ? (
                          <span className="text-xs text-on-surface-variant italic">
                            No classes assigned
                          </span>
                        ) : (
                          session.classes.map(({ academicClass }) => (
                            <Badge
                              key={academicClass.id}
                              variant="secondary"
                              className="rounded-full text-[10px] font-semibold gap-1 px-2.5"
                            >
                              <GraduationCap size={9} />
                              {academicClass.nameEn}{academicClass.nameBn ? ` (${academicClass.nameBn})` : ""}
                            </Badge>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Details tab */}
          <TabsContent value="details" className="mt-6 focus-visible:outline-none">
            <Card className="rounded-2xl border-outline/5 shadow-none">
              <CardContent className="pt-6">
                <dl className="space-y-4 text-sm">
                  {[
                    { label: "ID", value: year.id, mono: true },
                    { label: "Label", value: year.label },
                    { label: "Slug", value: year.slug, mono: true },
                    {
                      label: "Start Date",
                      value: format(new Date(year.startDate), "EEEE, d MMMM yyyy"),
                    },
                    {
                      label: "End Date",
                      value: format(new Date(year.endDate), "EEEE, d MMMM yyyy"),
                    },
                    {
                      label: "Status",
                      value: year.isActive ? "Active" : "Inactive",
                    },
                    {
                      label: "Current Year",
                      value: year.isCurrent ? "Yes" : "No",
                    },
                    {
                      label: "Linked Tenants",
                      value: String(year._count?.tenants ?? 0),
                    },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex gap-4">
                      <dt className="w-36 flex-shrink-0 font-medium text-on-surface-variant">
                        {label}
                      </dt>
                      <dd
                        className={`flex-1 text-on-surface ${mono ? "font-mono text-xs" : ""}`}
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.main>
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------
interface AcademicYearViewProps {
  id: string;
}

export function AcademicYearView({ id }: AcademicYearViewProps) {
  return (
    <div className="min-h-screen bg-surface relative isolate">
      <div
        aria-hidden
        className="absolute top-[10%] -right-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <AcademicYearContent id={id} />
      </Suspense>
    </div>
  );
}
