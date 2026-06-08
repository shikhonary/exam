import { Metadata } from "next";
import { FiscalYearsView } from "@/modules/fiscal-year/ui/views/fiscal-years-view";

export const metadata: Metadata = {
  title: "অর্থবছর ব্যবস্থাপনা | UP-Hub",
  description: "ইউনিয়ন পরিষদের প্রশাসনিক এবং আর্থিক অর্থবছর পরিচালনা করুন।",
};

export default function FiscalYearsPage() {
  return <FiscalYearsView />;
}
