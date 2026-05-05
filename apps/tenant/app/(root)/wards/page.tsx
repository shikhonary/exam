import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { WardsView } from "@/modules/ward/ui/views/wards-view";

export const metadata: Metadata = {
  title: "Wards",
  description: "Union Parishad Wards Management",
};

const Wards = async () => {
  prefetch(trpc.ward.getStats.queryOptions());

  return (
    <HydrateClient>
      <WardsView />
    </HydrateClient>
  );
};

export default Wards;
