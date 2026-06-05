import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { AcademicYearView } from "@/modules/academic-years/ui/views/academic-year-view";

export const metadata: Metadata = {
  title: "Academic Year Details",
  description: "View and manage academic year details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const AcademicYearDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.academicYear.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <AcademicYearView id={id} />
    </HydrateClient>
  );
};

export default AcademicYearDetailPage;
