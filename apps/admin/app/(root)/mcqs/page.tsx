import { Metadata } from "next";
import { McqsView } from "../../../modules/mcqs/ui/views/mcqs-view";

export const metadata: Metadata = {
  title: "MCQs Management | Admin Dashboard",
  description: "Manage multiple choice questions across the platform",
};

export default function McqsPage() {
  return <McqsView />;
}
