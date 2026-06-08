import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { EditAcademicClassView } from "@/modules/academic-classes/ui/views/edit-academic-class-view";


export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Edit Academic Class",
  description: "Edit academic class settings",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditAcademicClassPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.academicClass.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <EditAcademicClassView id={id} />
    </HydrateClient>
  );
};

export default EditAcademicClassPage;
