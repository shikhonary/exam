import { Metadata } from "next";


import { BatchView } from "@/modules/batch/ui/views/batch-view";

export const metadata: Metadata = {
  title: "Batch Details",
  description: "Batch details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const BatchDetails = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <BatchView id={id} />
    </div>
  );
};

export default BatchDetails;
