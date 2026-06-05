import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { NewSubscriptionPlanView } from "@/modules/subscription-plans/ui/views/new-subscription-plan-view";

export const metadata: Metadata = {
  title: "New Subscription Plan",
  description: "Create a new subscription plan",
};

export default function NewSubscriptionPlanPage() {
  return (
    <HydrateClient>
      <NewSubscriptionPlanView />
    </HydrateClient>
  );
}
