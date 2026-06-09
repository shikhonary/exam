import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { EditQuestionPaperView } from "@/modules/question-paper-builder/ui/views/edit-question-paper-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Edit Question Paper",
  description: "Edit metadata of your question paper",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditQuestionPaperPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.questionPaper.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <EditQuestionPaperView paperId={id} />
    </HydrateClient>
  );
};

export default EditQuestionPaperPage;
