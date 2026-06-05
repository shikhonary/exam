import { PrismaClient } from "@workspace/db";
import { TRPCError } from "@trpc/server";
import {
  SubscriptionFormValues,
  UpdateSubscriptionValues,
  ChangeSubscriptionPlanValues,
  CancelSubscriptionValues,
} from "@workspace/schema";

export class SubscriptionService {
  constructor(private db: PrismaClient) {}

  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    tenantId?: string;
    status?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      tenantId,
      status,
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { tenant: { name: { contains: search, mode: "insensitive" } } },
        { plan: { displayName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.db.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          tenant: { select: { id: true, name: true, slug: true } },
          plan: { select: { id: true, displayName: true, name: true } },
        },
      }),
      this.db.subscription.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const subscription = await this.db.subscription.findUnique({
      where: { id },
      include: {
        tenant: { select: { id: true, name: true, slug: true } },
        plan: { 
          select: { 
            id: true, 
            displayName: true, 
            name: true,
            defaultStudentLimit: true,
            defaultTeacherLimit: true,
            defaultExamLimit: true,
            defaultStorageLimit: true
          } 
        },
        history: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription not found",
      });
    }

    return subscription;
  }

  async getByTenantId(tenantId: string) {
    const subscription = await this.db.subscription.findUnique({
      where: { tenantId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription not found for this tenant",
      });
    }

    return subscription;
  }

  async getStats() {
    const [total, active, canceled] = await Promise.all([
      this.db.subscription.count(),
      this.db.subscription.count({ where: { status: "ACTIVE" } }),
      this.db.subscription.count({ where: { status: "CANCELED" } }),
    ]);

    return {
      total,
      active,
      canceled,
    };
  }

  async create(data: SubscriptionFormValues) {
    // Check if tenant already has a subscription
    const existing = await this.db.subscription.findUnique({
      where: { tenantId: data.tenantId },
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Tenant already has a subscription",
      });
    }

    // Determine current period dates
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    if (data.billingCycle === "monthly") {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }

    let trialEndsAt: Date | null = null;
    if (data.trialDays && data.trialDays > 0) {
      trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + data.trialDays);
    }

    const subscription = await this.db.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          tenantId: data.tenantId,
          planId: data.planId,
          status: data.status,
          billingCycle: data.billingCycle,
          pricePerMonth: data.pricePerMonth,
          pricePerYear: data.pricePerYear || null,
          customStudentLimit: data.customStudentLimit || null,
          customTeacherLimit: data.customTeacherLimit || null,
          customExamLimit: data.customExamLimit || null,
          customStorageLimit: data.customStorageLimit || null,
          currentPeriodStart,
          currentPeriodEnd,
          trialEndsAt,
          currency: "BDT",
        },
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId: sub.id,
          event: "CREATED",
          toPlanId: data.planId,
          toStatus: data.status,
          reason: "Initial subscription creation",
          metadata: JSON.stringify(data),
        },
      });

      return sub;
    });

    return subscription;
  }

  async update(id: string, data: UpdateSubscriptionValues) {
    const existing = await this.db.subscription.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription not found",
      });
    }

    const subscription = await this.db.$transaction(async (tx) => {
      const sub = await tx.subscription.update({
        where: { id },
        data: {
          status: data.status,
          billingCycle: data.billingCycle,
          pricePerMonth: data.pricePerMonth,
          pricePerYear: data.pricePerYear,
          customStudentLimit: data.customStudentLimit,
          customTeacherLimit: data.customTeacherLimit,
          customExamLimit: data.customExamLimit,
          customStorageLimit: data.customStorageLimit,
        },
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId: sub.id,
          event: "UPDATED",
          fromStatus: existing.status,
          toStatus: data.status || existing.status,
          reason: "Manual admin override",
          metadata: JSON.stringify(data),
        },
      });

      return sub;
    });

    return subscription;
  }

  async changePlan(id: string, data: ChangeSubscriptionPlanValues) {
    const existing = await this.db.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription not found",
      });
    }

    const newPlan = await this.db.subscriptionPlan.findUnique({
      where: { id: data.planId },
    });

    if (!newPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "New plan not found",
      });
    }

    // Default price from new plan based on current billing cycle
    const pricePerMonth = newPlan.monthlyPriceBDT;
    const pricePerYear = newPlan.yearlyPriceBDT;

    const subscription = await this.db.$transaction(async (tx) => {
      const sub = await tx.subscription.update({
        where: { id },
        data: {
          planId: data.planId,
          pricePerMonth,
          pricePerYear,
        },
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId: sub.id,
          event: "PLAN_CHANGED",
          fromPlanId: existing.planId,
          toPlanId: data.planId,
          reason: data.reason || "Plan change request",
        },
      });

      return sub;
    });

    return subscription;
  }

  async cancel(id: string, data: CancelSubscriptionValues) {
    const existing = await this.db.subscription.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription not found",
      });
    }

    const subscription = await this.db.$transaction(async (tx) => {
      const updateData: any = {
        cancelReason: data.reason || "Canceled by admin",
      };

      let toStatus = existing.status;

      if (data.cancelAtPeriodEnd) {
        updateData.cancelAtPeriodEnd = true;
      } else {
        updateData.status = "CANCELED";
        updateData.canceledAt = new Date();
        updateData.cancelAtPeriodEnd = false;
        toStatus = "CANCELED";
      }

      const sub = await tx.subscription.update({
        where: { id },
        data: updateData,
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId: sub.id,
          event: data.cancelAtPeriodEnd ? "CANCEL_SCHEDULED" : "CANCELED",
          fromStatus: existing.status,
          toStatus,
          reason: data.reason || "Subscription cancellation",
        },
      });

      return sub;
    });

    return subscription;
  }
}
