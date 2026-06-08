import { DashboardLayout } from "@/modules/layout/ui/layout/dashboard-layout";
import { Suspense } from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: RootLayoutProps) => {
  return (
    <DashboardLayout>
      <Suspense fallback={null}>{children}</Suspense>
    </DashboardLayout>
  );
};

export default Layout;
