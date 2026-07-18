import { Metadata } from "next";
import { NewMcqView } from "../../../../modules/mcqs/ui/views/new-mcq-view";

export const metadata: Metadata = {
  title: "New MCQ | Admin Dashboard",
  description: "Create a new multiple choice question",
};

export default function NewMcqPage() {
  return <NewMcqView />;
}
