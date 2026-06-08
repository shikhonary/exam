import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ChangePlanView } from "@/modules/subscriptions/ui/views/change-plan-view";


export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Change Subscription Plan | up hub Admin",
  description: "Upgrade or downgrade a tenant's subscription plan",
};

interface ChangePlanPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChangePlanPage({ params }: ChangePlanPageProps) {
  const resolvedParams = await params;
  
  void prefetch(trpc.subscription.getById.queryOptions({ id: resolvedParams.id }));
  void prefetch(trpc.subscriptionPlan.list.queryOptions({ limit: 50 }));

  return (
    <HydrateClient>
      <ChangePlanView id={resolvedParams.id} />
    </HydrateClient>
  );
}
