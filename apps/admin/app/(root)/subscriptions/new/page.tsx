import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { NewSubscriptionView } from "@/modules/subscriptions/ui/views/new-subscription-view";

export const metadata: Metadata = {
  title: "New Subscription",
  description: "Create a new subscription for a tenant",
};

const NewSubscriptionPage = () => {
  return (
    <HydrateClient>
      <NewSubscriptionView />
    </HydrateClient>
  );
};

export default NewSubscriptionPage;
