import { Metadata } from "next";
import { QuestionPapersView } from "@/modules/question-paper-builder/ui/views/question-papers-view";

export const metadata: Metadata = {
  title: "Question Papers",
  description: "Manage and build your question papers here.",
};

export default function QuestionPapersPage() {
  return <QuestionPapersView />;
}
