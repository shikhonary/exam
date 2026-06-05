import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SubscriptionPlansView } from "@/modules/subscription-plans/ui/views/subscription-plans-view";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: "Manage subscription plans and pricing for tenants",
};

const SubscriptionPlansPage = async () => {
  return <SubscriptionPlansView />;
};

export default SubscriptionPlansPage;
