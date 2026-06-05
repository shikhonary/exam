import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { EditSubscriptionForm } from "@/modules/subscriptions/ui/form/subscription-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Edit Subscription",
  description: "Edit subscription limits and settings",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditSubscriptionPage = async ({ params }: Props) => {
  const { id } = await params;
  void prefetch(trpc.subscription.getById.queryOptions({ id }));

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
              href={`/subscriptions/${id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Subscription
            </Link>

            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
              Edit Subscription Limits
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              Override limits or pricing for this specific tenant.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl shadow-ambient border border-outline/5 overflow-hidden">
            <EditSubscriptionForm id={id} />
          </div>
        </main>
      </div>
    </HydrateClient>
  );
};

export default EditSubscriptionPage;
