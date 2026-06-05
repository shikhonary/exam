import { Metadata } from "next";



import { BatchesView } from "@/modules/batch/ui/views/batches-view";

export const metadata: Metadata = {
  title: "Batches",
  description: "Batches",
};

const Batches = async () => {
  return (
    <BatchesView />
  );
};

export default Batches;
