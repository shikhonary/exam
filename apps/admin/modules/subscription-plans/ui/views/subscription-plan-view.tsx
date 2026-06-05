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
  Star,
  Users,
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
  useSubscriptionPlanById,
  useActivateSubscriptionPlan,
  useDeactivateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  useSetSubscriptionPlanPopularity,
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
function SubscriptionPlanContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: plan } = useSubscriptionPlanById(id);
  const { mutateAsync: activatePlan, isPending: isActivating } = useActivateSubscriptionPlan();
  const { mutateAsync: deactivatePlan, isPending: isDeactivating } = useDeactivateSubscriptionPlan();
  const { mutateAsync: setPopular, isPending: isSettingPopular } = useSetSubscriptionPlanPopularity();
  const { mutateAsync: deletePlan, isPending: isDeleting } = useDeleteSubscriptionPlan();
  const { openDeleteModal } = useDeleteModal();

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <XCircle className="mx-auto text-muted-foreground/40" size={40} />
          <p className="text-on-surface-variant">Subscription plan not found.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/subscription-plans">
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
      entityId: plan.id,
      entityType: "subscription plan",
      entityName: plan.displayName,
      onConfirm: async (entityId) => {
        await deletePlan({ id: entityId });
        router.push("/subscription-plans");
      },
    });
  };

  const isTogglingStatus = isActivating || isDeactivating;

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
          <Link href="/subscription-plans">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Subscription Plans
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-xs rounded-xl"
            disabled={isSettingPopular}
            onClick={() => setPopular({ id: plan.id, isPopular: !plan.isPopular })}
          >
            <Star size={13} className={plan.isPopular ? "fill-amber-400 text-amber-500" : ""} />
            {plan.isPopular ? "Unmark Popular" : "Mark Popular"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-xs rounded-xl"
            disabled={isTogglingStatus}
            onClick={() => plan.isActive ? deactivatePlan({ id: plan.id }) : activatePlan({ id: plan.id })}
          >
            {plan.isActive ? (
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
            <Link href={`/subscription-plans/${plan.id}/edit`}>
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
                <CreditCard size={32} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
                    {plan.displayName}
                  </h1>
                  {plan.isPopular && (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5">
                      <Star size={9} className="mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}
                  <Badge
                    className={`rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5 ${
                      plan.isActive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-on-surface-variant text-sm font-mono mt-1">
                  System Name: {plan.name}
                </p>

                <div className="flex flex-wrap gap-4 mt-3 text-xs text-on-surface-variant">
                  {plan.description && (
                    <span className="flex items-center gap-1 max-w-2xl line-clamp-1">
                      {plan.description}
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
        <Tabs defaultValue="details">
          <TabsList className="bg-muted/40 p-1.5 rounded-2xl border border-border/30 h-auto inline-flex">
            <TabsTrigger
              value="details"
              className="rounded-xl px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Plan Details
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="rounded-xl px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Pricing
            </TabsTrigger>
            <TabsTrigger
              value="limits"
              className="rounded-xl px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Resource Limits
            </TabsTrigger>
          </TabsList>

          {/* Details tab */}
          <TabsContent value="details" className="mt-6 focus-visible:outline-none">
            <Card className="rounded-2xl border-outline/5 shadow-none">
              <CardContent className="pt-6">
                <dl className="space-y-4 text-sm">
                  {[
                    { label: "ID", value: plan.id, mono: true },
                    { label: "Display Name", value: plan.displayName },
                    { label: "System Name", value: plan.name, mono: true },
                    { label: "Description", value: plan.description || "N/A" },
                    {
                      label: "Status",
                      value: plan.isActive ? "Active" : "Inactive",
                    },
                    {
                      label: "Popular Plan",
                      value: plan.isPopular ? "Yes" : "No",
                    },
                    {
                      label: "Created At",
                      value: format(new Date(plan.createdAt), "EEEE, d MMMM yyyy"),
                    },
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

          {/* Pricing tab */}
          <TabsContent value="pricing" className="mt-6 focus-visible:outline-none">
            <Card className="rounded-2xl border-outline/5 shadow-none">
              <CardContent className="pt-6">
                <dl className="space-y-4 text-sm">
                  {[
                    { label: "Monthly Price (BDT)", value: `৳ ${plan.monthlyPriceBDT}` },
                    { label: "Yearly Price (BDT)", value: `৳ ${plan.yearlyPriceBDT}` },
                    { label: "Monthly Price (USD)", value: `$ ${plan.monthlyPriceUSD}` },
                    { label: "Yearly Price (USD)", value: `$ ${plan.yearlyPriceUSD}` },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex gap-4">
                      <dt className="w-48 flex-shrink-0 font-medium text-on-surface-variant">
                        {label}
                      </dt>
                      <dd
                        className={`flex-1 font-bold text-on-surface ${mono ? "font-mono text-xs" : ""}`}
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
                    { label: "Student Limit", value: plan.defaultStudentLimit },
                    { label: "Teacher Limit", value: plan.defaultTeacherLimit },
                    { label: "Storage Limit", value: `${plan.defaultStorageLimit} GB` },
                    { label: "Exam Limit", value: plan.defaultExamLimit },
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

        </Tabs>
      </motion.div>
    </motion.main>
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------
interface SubscriptionPlanViewProps {
  id: string;
}

export function SubscriptionPlanView({ id }: SubscriptionPlanViewProps) {
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
        <SubscriptionPlanContent id={id} />
      </Suspense>
    </div>
  );
}
