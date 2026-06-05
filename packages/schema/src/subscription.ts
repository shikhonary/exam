import { z } from "zod";

// Base schemas
export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  planId: z.string().uuid(),
  status: z.string(),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  trialEndsAt: z.date().nullable(),
  billingCycle: z.string(),
  currency: z.string(),
  pricePerMonth: z.number().int().min(0),
  pricePerYear: z.number().int().min(0).nullable(),
  paymentProvider: z.string().nullable(),
  externalId: z.string().nullable(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.date().nullable(),
  cancelReason: z.string().nullable(),
  customStudentLimit: z.number().int().min(0).nullable(),
  customTeacherLimit: z.number().int().min(0).nullable(),
  customExamLimit: z.number().int().min(0).nullable(),
  customStorageLimit: z.number().int().min(0).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;

// Form schemas
export const subscriptionFormSchema = z.object({
  tenantId: z.string().uuid({ message: "Tenant ID is required" }),
  planId: z.string().uuid({ message: "Plan ID is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  billingCycle: z.string().min(1, { message: "Billing cycle is required" }),
  pricePerMonth: z.coerce.number().int().min(0),
  pricePerYear: z.coerce.number().int().min(0).optional().nullable(),
  customStudentLimit: z.coerce.number().int().min(0).optional().nullable(),
  customTeacherLimit: z.coerce.number().int().min(0).optional().nullable(),
  customExamLimit: z.coerce.number().int().min(0).optional().nullable(),
  customStorageLimit: z.coerce.number().int().min(0).optional().nullable(),
  trialDays: z.coerce.number().int().min(0).optional().default(0),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export const defaultSubscriptionValues: Partial<SubscriptionFormValues> = {
  status: "ACTIVE",
  billingCycle: "monthly",
  pricePerMonth: 0,
  trialDays: 0,
};

// Update schema
export const updateSubscriptionSchema = subscriptionFormSchema.partial();
export type UpdateSubscriptionValues = z.infer<typeof updateSubscriptionSchema>;

// Change Plan Schema
export const changeSubscriptionPlanSchema = z.object({
  planId: z.string().uuid({ message: "New Plan ID is required" }),
  reason: z.string().optional(),
});
export type ChangeSubscriptionPlanValues = z.infer<typeof changeSubscriptionPlanSchema>;

// Cancel Schema
export const cancelSubscriptionSchema = z.object({
  reason: z.string().optional(),
  cancelAtPeriodEnd: z.boolean().default(false),
});
export type CancelSubscriptionValues = z.infer<typeof cancelSubscriptionSchema>;
