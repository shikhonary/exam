import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { NewAcademicYearView } from "@/modules/academic-years/ui/views/new-academic-year-view";

export const metadata: Metadata = {
  title: "New Academic Year",
  description: "Create a new academic year",
};

const NewAcademicYearPage = () => (
  <HydrateClient>
    <NewAcademicYearView />
  </HydrateClient>
);

export default NewAcademicYearPage;
