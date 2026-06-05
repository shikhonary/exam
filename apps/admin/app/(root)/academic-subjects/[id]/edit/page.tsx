import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { EditAcademicSubjectView } from "@/modules/academic-subjects/ui/views/edit-academic-subject-view";

export const metadata: Metadata = {
  title: "Edit Academic Subject | Up Hub",
  description: "Update academic subject information",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditAcademicSubjectPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.academicSubject.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <EditAcademicSubjectView id={id} />
    </HydrateClient>
  );
};

export default EditAcademicSubjectPage;
