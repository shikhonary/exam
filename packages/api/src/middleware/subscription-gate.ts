import { TRPCError } from "@trpc/server";
import { t } from "../trpc";
import { type Context } from "../trpc/context";

type RequiredFeatures = {
  requireAnswers?: boolean;
  requireExplanations?: boolean;
  requireOmr?: boolean;
  requirePdfExport?: boolean;
  requireAiChat?: boolean;
};

export const subscriptionGate = (features: RequiredFeatures) =>
  t.middleware(async ({ next, ctx }) => {
    // This middleware expects to be run after isTenantMember
    if (!ctx.tenant) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Tenant context is required",
      });
    }

    const tenantWithPlan = await ctx.db.tenant.findUnique({
      where: { id: ctx.tenant.id },
      include: { subscription: { include: { plan: true } } },
    });

    const plan = tenantWithPlan?.subscription?.plan;

    if (!plan) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No active subscription plan found.",
      });
    }

    if (features.requireAnswers && !plan.canViewAnswers) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your current plan does not allow viewing answers.",
      });
    }

    if (features.requireExplanations && !plan.canViewExplanations) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your current plan does not allow viewing explanations.",
      });
    }

    if (features.requireOmr && !plan.canUseOmr) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your current plan does not allow OMR usage.",
      });
    }

    if (features.requirePdfExport && !plan.canExportPdf) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your current plan does not allow PDF export.",
      });
    }

    if (features.requireAiChat && !plan.canUseAiChat) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your current plan does not allow AI Chat features.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        subscriptionPlan: plan,
      },
    });
  });
