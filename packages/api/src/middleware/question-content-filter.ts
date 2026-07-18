import { TRPCError } from "@trpc/server";
import { t } from "../trpc";

// Recursively traverse and strip properties
function stripProtectedFields(
  obj: any,
  stripAnswers: boolean,
  stripExplanations: boolean
): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      stripProtectedFields(item, stripAnswers, stripExplanations)
    );
  }

  if (typeof obj === "object" && !(obj instanceof Date)) {
    const newObj: any = { ...obj };
    
    if (stripAnswers && "answer" in newObj) {
      delete newObj.answer;
    }
    
    if (stripExplanations && "explanation" in newObj) {
      delete newObj.explanation;
    }

    for (const key of Object.keys(newObj)) {
      newObj[key] = stripProtectedFields(
        newObj[key],
        stripAnswers,
        stripExplanations
      );
    }
    
    return newObj;
  }

  return obj;
}

export const questionContentFilter = t.middleware(async ({ next, ctx }) => {
  if (!ctx.tenant) {
    return next();
  }

  const tenantWithPlan = await ctx.db.tenant.findUnique({
    where: { id: ctx.tenant.id },
    include: { subscription: { include: { plan: true } } },
  });

  const plan = tenantWithPlan?.subscription?.plan;
  if (!plan) return next();

  const stripAnswers = !plan.canViewAnswers;
  const stripExplanations = !plan.canViewExplanations;

  const result = await next();

  if (result.ok && (stripAnswers || stripExplanations)) {
    return {
      ...result,
      data: stripProtectedFields(result.data, stripAnswers, stripExplanations),
    };
  }

  return result;
});
