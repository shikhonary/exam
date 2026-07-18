import { EditStudentView } from "../../../../../modules/students/ui/views/edit-student-view";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditStudentView id={id} />;
}
