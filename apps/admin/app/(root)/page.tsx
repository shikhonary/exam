import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { DashboardOverview } from "@/modules/dashboard/ui/views/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard | Shikhonary Admin",
  description: "Admin dashboard overview — platform metrics and quick actions",
};

export default async function Page() {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="Dashboard" subtitle="Welcome back, Super Admin" />
        <DashboardOverview />
      </div>
    </HydrateClient>
  );
}
