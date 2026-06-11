import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditStudentView } from "@/modules/student/ui/views/edit-student-view";

export const metadata: Metadata = {
  title: "Edit Student",
  description: "Edit student details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditStudent = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.student.getById.queryOptions(id));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <EditStudentView studentId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditStudent;
