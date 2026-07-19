import { ExamMcqManagerView } from "../../../../modules/exams/ui/views/exam-mcq-manager-view";

export default async function ExamManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  return <ExamMcqManagerView examId={unwrappedParams.id} />;
}
