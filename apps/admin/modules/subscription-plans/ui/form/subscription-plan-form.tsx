"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X, Plus, CreditCard } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  subscriptionPlanFormSchema,
  type SubscriptionPlanFormValues,
  defaultSubscriptionPlanValues,
} from "@workspace/schema";
import { TENANT_SUBSCRIPTION_PLAN } from "@workspace/utils/constants";
import {
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useSubscriptionPlanById,
} from "@workspace/api-client";
import { cn } from "@workspace/ui/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SubscriptionPlanFormProps {
  id?: string;
}

// ---------------------------------------------------------------------------
// Main form (Create mode)
// ---------------------------------------------------------------------------
function CreateSubscriptionPlanForm() {
  const router = useRouter();
  const { mutateAsync: create, isPending } = useCreateSubscriptionPlan();

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanFormSchema),
    defaultValues: defaultSubscriptionPlanValues as SubscriptionPlanFormValues,
  });

  const onSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      await create(data);
      router.push("/subscription-plans");
    } catch (error) {
      // Handled by hook
    }
  };

  return (
    <FormContent
      form={form}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={() => router.push("/subscription-plans")}
      mode="create"
    />
  );
}

// ---------------------------------------------------------------------------
// Edit form
// ---------------------------------------------------------------------------
function EditSubscriptionPlanForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: plan } = useSubscriptionPlanById(id);
  const { mutateAsync: update, isPending } = useUpdateSubscriptionPlan();

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanFormSchema),
    defaultValues: defaultSubscriptionPlanValues as SubscriptionPlanFormValues,
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        displayName: plan.displayName,
        description: plan.description || "",
        monthlyPriceBDT: plan.monthlyPriceBDT,
        yearlyPriceBDT: plan.yearlyPriceBDT,
        monthlyPriceUSD: plan.monthlyPriceUSD,
        yearlyPriceUSD: plan.yearlyPriceUSD,
        defaultStudentLimit: plan.defaultStudentLimit,
        defaultTeacherLimit: plan.defaultTeacherLimit,
        defaultStorageLimit: plan.defaultStorageLimit,
        defaultExamLimit: plan.defaultExamLimit,
        features: (plan.features as Record<string, boolean>) || {},
        isActive: plan.isActive,
        isPopular: plan.isPopular,
      });
    }
  }, [plan, form]);

  const onSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      await update({ id, data });
      router.push(`/subscription-plans/${id}`);
    } catch (error) {
      // Handled by hook
    }
  };

  return (
    <div className="p-8 space-y-8">
      <FormContent
        form={form}
        isPending={isPending}
        onSubmit={onSubmit}
        onCancel={() => router.push(`/subscription-plans/${id}`)}
        mode="edit"
        injected={true}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared fields
// ---------------------------------------------------------------------------
function PlanFields({ form }: { form: ReturnType<typeof useForm<SubscriptionPlanFormValues>> }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
                Plan Tier (System Name)
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                    <SelectValue placeholder="Select a plan tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TENANT_SUBSCRIPTION_PLAN).map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-xs font-medium text-slate-400">
                The system-level tier identifier.
              </FormDescription>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
                Display Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Starter Plan"
                  {...field}
                  className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300"
                />
              </FormControl>
              <FormDescription className="text-xs font-medium text-slate-400">
                The name displayed to customers.
              </FormDescription>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the plan benefits..."
                  {...field}
                  className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-slate-300 min-h-[100px]"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">
          Pricing Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 border-dashed">
          <FormField
            control={form.control}
            name="monthlyPriceBDT"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500">Monthly Price (BDT)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="h-12 bg-white rounded-xl" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearlyPriceBDT"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500">Yearly Price (BDT)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="h-12 bg-white rounded-xl" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyPriceUSD"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500">Monthly Price (USD)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="h-12 bg-white rounded-xl" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearlyPriceUSD"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500">Yearly Price (USD)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="h-12 bg-white rounded-xl" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">
          Plan Limits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 border-dashed">
          <FormField
            control={form.control}
            name="defaultStudentLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500">Student Limit</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="h-12 bg-white rounded-xl" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultTeacherLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500">Teacher Limit</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="h-12 bg-white rounded-xl" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultStorageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500">Storage Limit (GB)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="h-12 bg-white rounded-xl" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultExamLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500">Exam Limit</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="h-12 bg-white rounded-xl" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group/toggle transition-all hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                    field.value
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-200 text-slate-400"
                  )}
                >
                  <CreditCard className={cn("w-5 h-5", field.value && "scale-110")} />
                </div>
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-black text-slate-700 leading-none cursor-pointer">
                    Active Plan
                  </FormLabel>
                  <p className="text-[10px] text-slate-400 font-bold leading-none">
                    Makes this plan available for subscriptions.
                  </p>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPopular"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group/toggle transition-all hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                    field.value
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-200 text-slate-400"
                  )}
                >
                  <CreditCard className={cn("w-5 h-5", field.value && "scale-110")} />
                </div>
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-black text-slate-700 leading-none cursor-pointer">
                    Mark as Popular
                  </FormLabel>
                  <p className="text-[10px] text-slate-400 font-bold leading-none">
                    Highlights this plan on the pricing page.
                  </p>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Shared form content wrapper
// ---------------------------------------------------------------------------
interface FormContentProps {
  form: ReturnType<typeof useForm<SubscriptionPlanFormValues>>;
  isPending: boolean;
  onSubmit: (data: SubscriptionPlanFormValues) => Promise<void>;
  onCancel: () => void;
  mode: "create" | "edit";
  injected?: boolean;
}

function FormContent({
  form,
  isPending,
  onSubmit,
  onCancel,
  mode,
  injected,
}: FormContentProps) {
  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
        <div className="space-y-6">
          <PlanFields form={form} />
        </div>

        <Separator className="opacity-20" />

        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
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
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-md shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 border-none"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="w-4 h-4" strokeWidth={3} />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "create" ? "Create Subscription Plan" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (injected) {
    return content;
  }

  return content;
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------
export function SubscriptionPlanForm({ id }: SubscriptionPlanFormProps) {
  if (id) return <EditSubscriptionPlanForm id={id} />;
  return <CreateSubscriptionPlanForm />;
}
