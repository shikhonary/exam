import { McqImportView } from "@/modules/mcq/ui/views/mcq-import-view";

export const metadata = {
  title: "Import MCQs | Up Hub",
  description: "Bulk import Multiple Choice Questions from JSON",
};

export default function ImportMcqPage() {
  return <McqImportView />;
}
