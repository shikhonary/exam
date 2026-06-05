import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { TenantsView } from "@/modules/tenants/ui/views/tenants-view";

import { tenantLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Tenants",
  description: "Manage tenants",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Tenants = async ({ searchParams }: Props) => {
  const params = await tenantLoader(searchParams);

  return (
    <HydrateClient>
      <div className="min-h-screen">

        <TenantsView />
      </div>
    </HydrateClient>
  );
};

export default Tenants;
