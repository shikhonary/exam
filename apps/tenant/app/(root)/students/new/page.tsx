import { Metadata } from "next";
import { StudentCreateView } from "@/modules/student/ui/views/student-create-view";

export const metadata: Metadata = {
  title: "Add New Student | UP HUB",
  description: "Add a new student to your institution.",
};

export default function NewStudentPage() {
  return <StudentCreateView />;
}
