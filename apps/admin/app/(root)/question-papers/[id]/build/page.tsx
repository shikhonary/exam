import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { QuestionPaperBuilderView } from "@/modules/question-paper-builder/ui/views/question-paper-builder-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Question Paper Builder",
  description: "Build and design your question paper",
};

interface Props {
  params: Promise<{ id: string }>;
}

const QuestionPaperBuilderPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.questionPaper.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <QuestionPaperBuilderView paperId={id} />
    </HydrateClient>
  );
};

export default QuestionPaperBuilderPage;
