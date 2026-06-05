import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { AcademicYearForm } from "@/modules/academic-years/ui/form/academic-year-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit Academic Year",
  description: "Edit academic year settings",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditAcademicYearPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.academicYear.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen bg-surface relative isolate">
        <div
          aria-hidden
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
        />

        <main className="container mx-auto px-6 py-12 lg:px-12 max-w-4xl relative z-10">
          <div className="mb-8">
            <Link
              href={`/academic-years/${id}`}
              className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-6 -ml-1 transition-colors"
            >
              ← Back to Academic Year
            </Link>

            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
              Edit Academic Year
            </h1>
            <p className="text-on-surface-variant mt-1">
              Update the year settings. Sessions are managed from the detail view.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline/5 overflow-hidden">
            <AcademicYearForm id={id} />
          </div>
        </main>
      </div>
    </HydrateClient>
  );
};

export default EditAcademicYearPage;
