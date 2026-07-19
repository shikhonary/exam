import { ExamDetailsView } from "../../../../modules/exams/ui/views/exam-details-view";

export default async function ExamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  return <ExamDetailsView examId={unwrappedParams.id} />;
}
