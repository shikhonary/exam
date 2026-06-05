import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { SubscriptionsView } from "@/modules/subscriptions/ui/views/subscriptions-view";

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Manage tenant subscriptions",
};

const SubscriptionsPage = () => {
  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
};

export default SubscriptionsPage;
