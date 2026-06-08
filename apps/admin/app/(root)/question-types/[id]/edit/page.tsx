import { Metadata } from "next";
import { EditQuestionTypeView } from "@/modules/question-types/ui/views/edit-question-type-view";


export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Edit Question Type",
  description: "Update question type details",
};

interface EditQuestionTypePageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditQuestionTypePage = async ({ params }: EditQuestionTypePageProps) => {
  const { id } = await params;
  return <EditQuestionTypeView id={id} />;
};

export default EditQuestionTypePage;
