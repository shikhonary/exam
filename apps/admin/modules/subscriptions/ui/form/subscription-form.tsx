"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Loader2,
  Plus,
  Save,
  X,
  Building2,
  CreditCard,
  Activity,
  CalendarDays,
  Banknote,
  Users,
  HardDrive,
  FileText,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

import {
  useCreateSubscription,
  useUpdateSubscription,
  useSubscriptionById,
  useTenants,
  useSubscriptionPlans,
} from "@workspace/api-client";
import {
  subscriptionFormSchema,
  SubscriptionFormValues,
  defaultSubscriptionValues,
} from "@workspace/schema";

// ---------------------------------------------------------------------------
// Create Mode
// ---------------------------------------------------------------------------
export function CreateSubscriptionForm() {
  const router = useRouter();
  const { mutateAsync: create, isPending: isCreating } = useCreateSubscription();

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema) as any,
    defaultValues: defaultSubscriptionValues as SubscriptionFormValues,
  });

  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      const result = await create(data);
      if (result?.success) {
        router.push(`/subscriptions/${result.data?.id}`);
      }
    } catch (error) {
      console.error("Failed to save subscription", error);
    }
  };

  return (
    <FormContent
      form={form}
      isPending={isCreating}
      onSubmit={onSubmit}
      onCancel={() => router.push("/subscriptions")}
      mode="create"
    />
  );
}

// ---------------------------------------------------------------------------
// Edit Mode
// ---------------------------------------------------------------------------
interface EditSubscriptionFormProps {
  id: string;
}

export function EditSubscriptionForm({ id }: EditSubscriptionFormProps) {
  const router = useRouter();
  const { data: subscription, isLoading: isQueryLoading } = useSubscriptionById(id);
  const { mutateAsync: update, isPending: isUpdatePending } = useUpdateSubscription();

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema) as any,
    defaultValues: defaultSubscriptionValues as SubscriptionFormValues,
  });

  useEffect(() => {
    if (subscription) {
      form.reset({
        tenantId: subscription.tenantId,
        planId: subscription.planId,
        status: subscription.status,
        billingCycle: subscription.billingCycle,
        pricePerMonth: subscription.pricePerMonth,
        pricePerYear: subscription.pricePerYear,
        customStudentLimit: subscription.customStudentLimit ?? subscription.plan?.defaultStudentLimit ?? null,
        customTeacherLimit: subscription.customTeacherLimit ?? subscription.plan?.defaultTeacherLimit ?? null,
        customExamLimit: subscription.customExamLimit ?? subscription.plan?.defaultExamLimit ?? null,
        customStorageLimit: subscription.customStorageLimit ?? subscription.plan?.defaultStorageLimit ?? null,
        trialDays: 0,
      });
    }
  }, [subscription, form]);

  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      const result = await update({ id, data });
      if (result?.success) {
        router.push(`/subscriptions/${id}`);
      }
    } catch (error) {
      console.error("Failed to update subscription", error);
    }
  };

  if (isQueryLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-2xl border border-outline/5 shadow-ambient">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm font-bold text-on-surface-variant">
          Loading subscription data...
        </p>
      </div>
    );
  }

  return (
    <FormContent
      form={form}
      isPending={isUpdatePending}
      onSubmit={onSubmit}
      onCancel={() => router.push(`/subscriptions/${id}`)}
      mode="edit"
    />
  );
}

// ---------------------------------------------------------------------------
// Form Content
// ---------------------------------------------------------------------------
interface FormContentProps {
  form: any;
  isPending: boolean;
  onSubmit: any;
  onCancel: () => void;
  mode: "create" | "edit";
}

function FormContent({ form, isPending, onSubmit, onCancel, mode }: FormContentProps) {
  const { data: tenantsData, isLoading: isLoadingTenants } = useTenants();
  const { data: plansData, isLoading: isLoadingPlans } = useSubscriptionPlans();
  
  const { watch, setValue } = form;
  const selectedPlanId = watch("planId");

  // Auto-fill overrides on create based on selected plan
  useEffect(() => {
    if (mode === "create" && selectedPlanId && plansData?.items) {
      const plan = plansData.items.find((p: any) => p.id === selectedPlanId);
      if (plan) {
        setValue("pricePerMonth", plan.monthlyPriceBDT);
        setValue("pricePerYear", plan.yearlyPriceBDT);
        setValue("customStudentLimit", plan.defaultStudentLimit);
        setValue("customTeacherLimit", plan.defaultTeacherLimit);
        setValue("customExamLimit", plan.defaultExamLimit);
        setValue("customStorageLimit", plan.defaultStorageLimit);
      }
    }
  }, [selectedPlanId, mode, plansData, setValue]);

  const selectedPlan = selectedPlanId && plansData?.items 
    ? plansData.items.find((p: any) => p.id === selectedPlanId) 
    : null;

  const isDataLoading = isLoadingTenants || isLoadingPlans;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">
        
        {/* Core Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  Tenant
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mode === "edit" || isDataLoading}
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                      <SelectValue placeholder="Select Tenant" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient max-h-60">
                      {tenantsData?.items?.map((tenant: any) => (
                        <SelectItem
                          key={tenant.id}
                          value={tenant.id}
                          className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary"
                        >
                          {tenant.name} ({tenant.slug})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  Subscription Plan
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mode === "edit" || isDataLoading}
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient max-h-60">
                      {plansData?.items?.map((plan: any) => (
                        <SelectItem
                          key={plan.id}
                          value={plan.id}
                          className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary"
                        >
                          {plan.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {mode === "edit" && (
                  <FormDescription className="text-xs font-medium opacity-60">
                    Use "Change Plan" action to modify.
                  </FormDescription>
                )}
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  Status
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      <SelectItem value="ACTIVE" className="rounded-lg font-medium text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50">Active</SelectItem>
                      <SelectItem value="PAST_DUE" className="rounded-lg font-medium text-amber-600 focus:text-amber-700 focus:bg-amber-50">Past Due</SelectItem>
                      <SelectItem value="CANCELED" className="rounded-lg font-medium text-red-600 focus:text-red-700 focus:bg-red-50">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-primary" />
                  Billing Cycle
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                      <SelectItem value="monthly" className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">Monthly</SelectItem>
                      <SelectItem value="yearly" className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pricePerMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Banknote className="w-3.5 h-3.5 text-primary" />
                  Monthly Price (BDT)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={selectedPlan ? `Default: ${selectedPlan.monthlyPriceBDT}` : "e.g. 5000"}
                    {...field}
                    value={field.value ?? ""}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Banknote className="w-3.5 h-3.5 text-primary" />
                  Yearly Price (BDT)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={selectedPlan?.yearlyPriceBDT ? `Default: ${selectedPlan.yearlyPriceBDT}` : "e.g. 50000"}
                    {...field}
                    value={field.value ?? ""}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="h-px bg-outline/10 w-full my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="customStudentLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  Student Limit
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={selectedPlan ? `Default: ${selectedPlan.defaultStudentLimit}` : "Default"}
                    {...field}
                    value={field.value ?? ""}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customTeacherLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  Teacher Limit
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={selectedPlan ? `Default: ${selectedPlan.defaultTeacherLimit}` : "Default"}
                    {...field}
                    value={field.value ?? ""}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="customExamLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Exam Limit
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={selectedPlan ? `Default: ${selectedPlan.defaultExamLimit}` : "Default"}
                    {...field}
                    value={field.value ?? ""}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customStorageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-primary" />
                  Storage Limit (GB)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={selectedPlan ? `Default: ${selectedPlan.defaultStorageLimit} GB` : "Default"}
                    {...field}
                    value={field.value ?? ""}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-outline/5">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-2 h-12 px-6 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50 border-none transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending || isDataLoading}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-md shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 border-none"
          >
            {isPending || isDataLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="w-4 h-4" strokeWidth={3} />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "create" ? "Create Subscription" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
