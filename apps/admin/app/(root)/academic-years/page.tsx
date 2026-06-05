import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { AcademicYearsView } from "@/modules/academic-years/ui/views/academic-years-view";

export const metadata: Metadata = {
  title: "Academic Years",
  description: "Manage global academic years and sessions",
};

const AcademicYearsPage = async () => {
  return <AcademicYearsView />;
};

export default AcademicYearsPage;
