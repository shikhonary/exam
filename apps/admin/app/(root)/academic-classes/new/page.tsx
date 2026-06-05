import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { NewAcademicClassView } from "@/modules/academic-classes/ui/views/new-academic-class-view";

export const metadata: Metadata = {
  title: "Create Academic Class",
  description: "Create a new academic class",
};

const NewAcademicClassPage = () => {
  return (
    <HydrateClient>
      <NewAcademicClassView />
    </HydrateClient>
  );
};

export default NewAcademicClassPage;
