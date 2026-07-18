import { Breadcrumb } from "@workspace/ui/components/breadcrumb";
import { ImportMcqForm } from "../form/import-mcq-form";
import { Upload } from "lucide-react";

export function ImportMcqView() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col gap-4">
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/" },
                { label: "MCQs", href: "/mcqs" },
                { label: "Import MCQs", href: "/mcqs/import" },
              ]}
            />
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                  Import MCQs
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Import multiple questions from JSON format.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <ImportMcqForm />
        </div>
      </div>
    </div>
  );
}
