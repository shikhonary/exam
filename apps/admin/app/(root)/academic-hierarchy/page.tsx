import { Metadata } from "next";
import { HierarchyView } from "@/modules/academic-hierarchy/ui/views/hierarchy-view";

export const metadata: Metadata = {
  title: "Academic Hierarchy",
  description: "View the entire academic structure",
};

const AcademicHierarchyPage = () => {
  return <HierarchyView />;
};

export default AcademicHierarchyPage;
