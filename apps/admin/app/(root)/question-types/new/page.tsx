import { Metadata } from "next";
import { NewQuestionTypeView } from "@/modules/question-types/ui/views/new-question-type-view";

export const metadata: Metadata = {
  title: "New Question Type",
  description: "Create a new question type",
};

const NewQuestionTypePage = async () => {
  return <NewQuestionTypeView />;
};

export default NewQuestionTypePage;
