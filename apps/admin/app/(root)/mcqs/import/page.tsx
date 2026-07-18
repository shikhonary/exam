import { Metadata } from "next";
import { ImportMcqView } from "../../../../modules/mcqs/ui/views/import-mcq-view";

export const metadata: Metadata = {
  title: "Import MCQs",
  description: "Import multiple choice questions from JSON format",
};

export default function ImportMcqPage() {
  return <ImportMcqView />;
}
