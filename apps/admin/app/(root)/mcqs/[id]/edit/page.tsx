import { Metadata } from "next";
import { EditMcqView } from "../../../../../modules/mcqs/ui/views/edit-mcq-view";

export const metadata: Metadata = {
  title: "Edit MCQ | Admin Dashboard",
  description: "Edit multiple choice question details",
};

export default async function EditMcqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditMcqView id={id} />;
}
