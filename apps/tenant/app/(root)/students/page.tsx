import { Metadata } from "next";
import { StudentsView } from "@/modules/student/ui/views/students-view";

export const metadata: Metadata = {
  title: "Students | UP HUB",
  description: "Manage students for your institution.",
};

export default function StudentsPage() {
  return <StudentsView />;
}
