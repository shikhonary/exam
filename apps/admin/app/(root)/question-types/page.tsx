import { Metadata } from "next";
import { QuestionTypesView } from "@/modules/question-types/ui/views/question-types-view";

export const metadata: Metadata = {
  title: "Question Types",
  description: "Manage global question types",
};

const QuestionTypesPage = async () => {
  return <QuestionTypesView />;
};

export default QuestionTypesPage;
