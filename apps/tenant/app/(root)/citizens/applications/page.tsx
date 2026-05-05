import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CitizenApplicationsView } from "@/modules/citizen/ui/views/citizen-applications-view";

export const metadata: Metadata = {
  title: "Citizen Applications",
  description: "Review and manage citizen registration applications",
};

const CitizenApplicationsPage = async () => {
  // Prefetch data for SSR
  prefetch(trpc.citizenApplication.list.queryOptions({ page: 1, limit: 10 }));
  prefetch(trpc.citizenApplication.getStats.queryOptions());

  return (
    <HydrateClient>
      <CitizenApplicationsView />
    </HydrateClient>
  );
};

export default CitizenApplicationsPage;
