import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { AcademicClassesView } from "@/modules/academic-classes/ui/views/academic-classes-view";

export const metadata: Metadata = {
  title: "Academic Classes",
  description: "Manage global academic classes",
};

const AcademicClassesPage = async () => {
  return <AcademicClassesView />;
};

export default AcademicClassesPage;
