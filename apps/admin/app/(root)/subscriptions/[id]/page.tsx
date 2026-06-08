import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SubscriptionView } from "@/modules/subscriptions/ui/views/subscription-view";


export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Subscription Details",
  description: "View subscription details and history",
};

interface Props {
  params: Promise<{ id: string }>;
}

const SubscriptionPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.subscription.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <SubscriptionView id={id} />
    </HydrateClient>
  );
};

export default SubscriptionPage;
