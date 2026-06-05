import { CqImportView } from "@/modules/cq/ui/views/cq-import-view";

export const metadata = {
  title: "Import CQs | Up Hub",
  description: "Bulk import Creative Questions from JSON",
};

export default function ImportCqPage() {
  return <CqImportView />;
}
