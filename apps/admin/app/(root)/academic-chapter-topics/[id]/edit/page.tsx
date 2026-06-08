import { EditAcademicChapterTopicView } from "@/modules/academic-chapter-topics/ui/views/edit-academic-chapter-topic-view";


export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit Academic Topic | Up Hub",
  description: "Edit an existing academic chapter",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAcademicChapterTopicPage({ params }: PageProps) {
  const { id } = await params;
  return <EditAcademicChapterTopicView id={id} />;
}
