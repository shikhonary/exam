"use client";

import { EditBatchForm } from "./desktop/edit-batch-form";
import { TenantTypes } from "@workspace/db";

interface BatchEditFormProps {
  batch: TenantTypes.Batch;
}

export const BatchEditForm = ({ batch }: BatchEditFormProps) => {
  return <EditBatchForm batch={batch} />;
};
