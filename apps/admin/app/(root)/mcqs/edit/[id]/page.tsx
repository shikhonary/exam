import { McqForm } from "@/modules/mcq/ui/form/mcq-form";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";


export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit MCQ | Up Hub",
  description: "Edit Multiple Choice Question",
};

export default async function EditMcqPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-surface relative isolate">
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-4xl relative z-10">
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-6 -ml-4 text-on-surface-variant hover:text-on-surface"
          >
            <Link href="/mcqs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Multiple Choice Questions
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Edit3 size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
              Edit MCQ
            </h1>
          </div>
          <p className="text-on-surface-variant ml-14">
            Modify the details of this multiple choice question.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline/5 overflow-hidden">
          <McqForm mcqId={resolvedParams.id} />
        </div>
      </main>
    </div>
  );
}
