import React from "react";
import { DistributionPickerView } from "@/modules/question-paper-builder/ui/views/distribution-picker-view";


export const dynamic = "force-dynamic";
interface Props {
  params: Promise<{
    id: string;
    distributionId: string;
  }>;
}

export default async function PickerPage({ params }: Props) {
  const { id, distributionId } = await params;
  return <DistributionPickerView paperId={id} distributionId={distributionId} />;
}
