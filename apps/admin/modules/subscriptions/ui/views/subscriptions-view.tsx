"use client";

import Link from "next/link";
import { Plus, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { useSubscriptions, useCancelSubscription, useSubscriptionStats } from "@workspace/api-client";
import { SubscriptionTable } from "../components/subscription-table";
import { SubscriptionFilters } from "../components/subscription-filters";
import { SubscriptionStats } from "../components/subscription-stats";
import { Pagination } from "@/modules/subscription-plans/ui/components/pagination";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function SubscriptionsContent() {
  const { openDeleteModal } = useDeleteModal();
  const { data, isLoading: isQueryLoading } = useSubscriptions();
  const { data: statsData, isLoading: isStatsLoading } = useSubscriptionStats();
  const { mutateAsync: cancelPlan, isPending: isCanceling } = useCancelSubscription();

  const isLoading = isQueryLoading || isCanceling;

  const handleCancel = (sub: any) => {
    openDeleteModal({
      entityId: sub.id,
      entityType: "subscription",
      entityName: `${sub.tenant?.name || "Unknown Tenant"} (${sub.plan?.displayName || "Unknown Plan"})`,
      onConfirm: async (entityId) => {
        await cancelPlan({ id: entityId, data: { cancelAtPeriodEnd: true } });
      },
    });
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10"
    >
      {/* Header */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
        />
        <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <CreditCard size={22} />
            </div>
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              Subscriptions
            </h1>
          </div>
          <div className="mt-1 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
          <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
            Manage tenant subscriptions, pricing overrides, and billing cycles.
          </p>
        </div>

        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <Button
            asChild
            className="
              group relative overflow-hidden
              inline-flex items-center gap-2
              bg-gradient-to-br from-primary to-primary-container
              text-white font-black text-sm
              px-6 py-3 rounded-[16px]
              border-0
              shadow-lg shadow-primary/25
              hover:shadow-xl hover:shadow-primary/30
              hover:scale-[1.03]
              active:scale-[0.97]
              transition-all duration-200 ease-out
              h-12
            "
          >
            <Link href="/subscriptions/new">
              <span className="relative flex items-center justify-center rounded-lg bg-white/20 p-0.5">
                <Plus size={16} strokeWidth={3} />
              </span>
              <span className="relative">New Subscription</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <SubscriptionStats stats={statsData} isLoading={isStatsLoading} />
      </div>

      {/* Table Area */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate animate-in slide-in-from-bottom-8 duration-700 delay-200">
        <SubscriptionFilters isLoading={isLoading} />
        
        <SubscriptionTable 
          subscriptions={data?.items ?? []} 
          isLoading={isLoading} 
          onCancel={handleCancel} 
        />

        <Pagination totalItem={data?.meta?.total ?? 0} />
      </div>
    </motion.main>
  );
}

export function SubscriptionsView() {
  return (
    <div className="min-h-screen bg-surface relative isolate">
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />
      <SubscriptionsContent />
    </div>
  );
}

