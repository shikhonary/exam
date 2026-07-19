import { EditExamView } from "../../../../../modules/exams/ui/views/edit-exam-view";

interface EditExamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditExamPage({ params }: EditExamPageProps) {
  const { id } = await params;
  return <EditExamView id={id} />;
}
