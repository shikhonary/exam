import { TRPCError } from "@trpc/server";
import { t } from "../trpc";
import { type Context } from "../trpc/context";

export const creditGuard = (requiredCredits: number) =>
  t.middleware(async ({ next, ctx }) => {
    if (!ctx.tenant) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Tenant context is required",
      });
    }

    const tenant = await ctx.db.tenant.findUnique({
      where: { id: ctx.tenant.id },
      select: { creditBalance: true },
    });

    if (!tenant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tenant not found",
      });
    }

    if (tenant.creditBalance < requiredCredits) {
      throw new TRPCError({
        code: "PAYMENT_REQUIRED",
        message: `Insufficient credits. Required: ${requiredCredits}, Available: ${tenant.creditBalance}`,
      });
    }

    return next({
      ctx,
    });
  });
