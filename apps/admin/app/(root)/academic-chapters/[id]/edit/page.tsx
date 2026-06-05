import { EditAcademicChapterView } from "@/modules/academic-chapters/ui/views/edit-academic-chapter-view";

export const metadata = {
  title: "Edit Academic Chapter | Up Hub",
  description: "Edit an existing academic chapter",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAcademicChapterPage({ params }: PageProps) {
  const { id } = await params;
  return <EditAcademicChapterView id={id} />;
}
