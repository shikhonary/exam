import { ShortAnswerImportView } from "@/modules/short-answer/ui/views/short-answer-import-view";

export const metadata = {
  title: "Import Short Answers | Up Hub",
  description: "Bulk import Short Answers via JSON",
};

export default function ImportShortAnswersPage() {
  return <ShortAnswerImportView />;
}
