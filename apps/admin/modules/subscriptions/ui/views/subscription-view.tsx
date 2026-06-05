"use client";

import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  XCircle,
  Edit,
  History,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

import {
  useSubscriptionById,
  useCancelSubscription,
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
function SubscriptionContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: sub } = useSubscriptionById(id);
  const { mutateAsync: cancelPlan, isPending: isCanceling } = useCancelSubscription();
  const { openDeleteModal } = useDeleteModal();

  if (!sub) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <XCircle className="mx-auto text-muted-foreground/40" size={40} />
          <p className="text-on-surface-variant">Subscription not found.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/subscriptions">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to list
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    openDeleteModal({
      entityId: sub.id,
      entityType: "subscription",
      entityName: `${sub.tenant?.name} (${sub.plan?.displayName})`,
      onConfirm: async (entityId) => {
        await cancelPlan({ id: entityId, data: { cancelAtPeriodEnd: true } });
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5">
            Active
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5">
            Canceled
          </Badge>
        );
      case "PAST_DUE":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5">
            Past Due
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground border-border rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5">
            {status}
          </Badge>
        );
    }
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
          <Link href="/subscriptions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Subscriptions
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {sub.status !== "CANCELED" && !sub.cancelAtPeriodEnd && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 text-xs rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isCanceling}
              onClick={handleCancel}
            >
              Cancel Plan
            </Button>
          )}

          <Button
            size="sm"
            asChild
            className="gap-2 text-xs rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
            variant="ghost"
          >
            <Link href={`/subscriptions/${sub.id}/edit`}>
              <Edit size={13} />
              Edit Setup
            </Link>
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
                <CreditCard size={32} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
                    {sub.tenant?.name || "Unknown Tenant"}
                  </h1>
                  {getStatusBadge(sub.status)}
                  {sub.cancelAtPeriodEnd && (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5">
                      <AlertTriangle size={9} className="mr-1 inline" />
                      Cancels at Period End
                    </Badge>
                  )}
                </div>

                <p className="text-on-surface-variant text-sm mt-1">
                  Plan: <span className="font-semibold text-on-surface">{sub.plan?.displayName}</span> 
                  <span className="mx-2 opacity-50">•</span>
                  Cycle: <span className="capitalize">{sub.billingCycle}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="details">
          <TabsList className="bg-muted/40 p-1.5 rounded-2xl border border-border/30 h-auto inline-flex">
            <TabsTrigger
              value="details"
              className="rounded-xl px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Billing Details
            </TabsTrigger>
            <TabsTrigger
              value="limits"
              className="rounded-xl px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Custom Limits
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-xl px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              History Log
            </TabsTrigger>
          </TabsList>

          {/* Details tab */}
          <TabsContent value="details" className="mt-6 focus-visible:outline-none">
            <Card className="rounded-2xl border-outline/5 shadow-none">
              <CardContent className="pt-6">
                <dl className="space-y-4 text-sm">
                  {[
                    { label: "ID", value: sub.id, mono: true },
                    { label: "Period Start", value: format(new Date(sub.currentPeriodStart), "PPP") },
                    { label: "Period End", value: format(new Date(sub.currentPeriodEnd), "PPP") },
                    { label: "Price per Month", value: `৳ ${sub.pricePerMonth}` },
                    { label: "Price per Year", value: sub.pricePerYear ? `৳ ${sub.pricePerYear}` : "N/A" },
                    { label: "Currency", value: sub.currency },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex gap-4">
                      <dt className="w-48 flex-shrink-0 font-medium text-on-surface-variant">
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

          {/* Limits tab */}
          <TabsContent value="limits" className="mt-6 focus-visible:outline-none">
            <Card className="rounded-2xl border-outline/5 shadow-none">
              <CardContent className="pt-6">
                <dl className="space-y-4 text-sm">
                  {[
                    { label: "Student Limit", value: sub.customStudentLimit ?? "Inherited from plan" },
                    { label: "Teacher Limit", value: sub.customTeacherLimit ?? "Inherited from plan" },
                    { label: "Storage Limit", value: sub.customStorageLimit ? `${sub.customStorageLimit} GB` : "Inherited from plan" },
                    { label: "Exam Limit", value: sub.customExamLimit ?? "Inherited from plan" },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex gap-4">
                      <dt className="w-48 flex-shrink-0 font-medium text-on-surface-variant">
                        {label}
                      </dt>
                      <dd
                        className={`flex-1 ${value.toString().includes('Inherited') ? 'text-on-surface-variant italic' : 'text-on-surface font-semibold'}`}
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History tab */}
          <TabsContent value="history" className="mt-6 focus-visible:outline-none">
            <Card className="rounded-2xl border-outline/5 shadow-none">
              <CardContent className="pt-6">
                {sub.history && sub.history.length > 0 ? (
                  <div className="relative border-l border-outline/20 ml-3 space-y-8 pb-4">
                    {sub.history.map((event: any, i: number) => (
                      <div key={event.id} className="relative pl-6">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                        <div className="text-xs text-on-surface-variant mb-1">
                          {format(new Date(event.createdAt), "PPP 'at' p")}
                        </div>
                        <div className="font-semibold text-sm text-on-surface mb-1">
                          {event.event.replace(/_/g, " ")}
                        </div>
                        <div className="text-sm text-on-surface-variant">
                          {event.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-on-surface-variant flex flex-col items-center">
                    <History className="w-8 h-8 opacity-20 mb-2" />
                    No history logs found.
                  </div>
                )}
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
interface SubscriptionViewProps {
  id: string;
}

export function SubscriptionView({ id }: SubscriptionViewProps) {
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
        <SubscriptionContent id={id} />
      </Suspense>
    </div>
  );
}
