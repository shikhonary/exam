import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { VillagesView } from "@/modules/village/ui/views/villages-view";

export const metadata: Metadata = {
  title: "Villages",
  description: "Union Parishad Villages Management",
};

const Villages = async () => {
  prefetch(trpc.village.getStats.queryOptions());
  prefetch(trpc.ward.forSelection.queryOptions());

  return (
    <HydrateClient>
      <VillagesView />
    </HydrateClient>
  );
};

export default Villages;
