import { EditExamView } from "../../../../../modules/exams/ui/views/edit-exam-view";

interface EditExamPageProps {
  params: {
    id: string;
  };
}

export default function EditExamPage({ params }: EditExamPageProps) {
  return <EditExamView id={params.id} />;
}
