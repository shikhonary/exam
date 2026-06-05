import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SubscriptionPlanView } from "@/modules/subscription-plans/ui/views/subscription-plan-view";

export const metadata: Metadata = {
  title: "Subscription Plan Details",
  description: "View subscription plan details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const SubscriptionPlanPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.subscriptionPlan.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <SubscriptionPlanView id={id} />
    </HydrateClient>
  );
};

export default SubscriptionPlanPage;
