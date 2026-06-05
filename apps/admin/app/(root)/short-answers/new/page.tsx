import { ShortAnswerForm } from "@/modules/short-answer/ui/form/short-answer-form";

export const metadata = {
  title: "Create Short Answer | Up Hub",
  description: "Create a new Short Answer",
};

export default function NewShortAnswerPage() {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-8 px-8">
        <h1 className="text-3xl font-bold">Create New Short Answer</h1>
        <p className="text-muted-foreground mt-2">
          Add a new short answer to the question bank.
        </p>
      </div>
      <ShortAnswerForm />
    </div>
  );
}
