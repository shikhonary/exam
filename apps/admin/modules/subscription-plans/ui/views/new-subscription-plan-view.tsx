"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { SubscriptionPlanForm } from "../form/subscription-plan-form";

export function NewSubscriptionPlanView() {
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
            <Link href="/subscription-plans">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subscription Plans
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <CreditCard size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
              Create Subscription Plan
            </h1>
          </div>
          <p className="text-on-surface-variant ml-14">
            Define a subscription tier and configure its pricing and limits.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline/5 overflow-hidden">
          <Suspense fallback={<div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" /></div>}>
            <SubscriptionPlanForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
