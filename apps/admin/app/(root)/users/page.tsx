import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient } from "@/trpc/server";

import { UsersView } from "@/modules/users/ui/views/users-view";

import { userLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage platform users",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const UsersPage = async ({ searchParams }: Props) => {
  const params = await userLoader(searchParams);

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <UsersView />
      </div>
    </HydrateClient>
  );
};

export default UsersPage;
