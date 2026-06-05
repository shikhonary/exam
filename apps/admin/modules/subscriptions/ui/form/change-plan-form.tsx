"use client";

import { useRouter } from "next/navigation";
import { Loader2, Save, X, RefreshCw } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

import { 
  useChangeSubscriptionPlan,
  useSubscriptionPlans,
  useSubscriptionById
} from "@workspace/api-client";
import {
  changeSubscriptionPlanSchema,
  type ChangeSubscriptionPlanValues,
} from "@workspace/schema";

interface ChangePlanFormProps {
  id: string;
}

export function ChangePlanForm({ id }: ChangePlanFormProps) {
  const router = useRouter();
  
  const { data: subscription, isLoading: isQueryLoading } = useSubscriptionById(id);
  const { data: plansData, isLoading: isLoadingPlans } = useSubscriptionPlans({ limit: 50 });
  const { mutateAsync: changePlan, isPending } = useChangeSubscriptionPlan();

  const form = useForm<ChangeSubscriptionPlanValues>({
    resolver: zodResolver(changeSubscriptionPlanSchema),
    defaultValues: {
      planId: "",
      reason: "",
    },
  });

  const onSubmit = async (data: ChangeSubscriptionPlanValues) => {
    try {
      const result = await changePlan({ id, data });
      if (result?.success) {
        router.push(`/subscriptions/${id}`);
      }
    } catch (error) {
      console.error("Failed to change plan", error);
    }
  };

  const isDataLoading = isLoadingPlans || isQueryLoading;

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-2xl border border-outline/5 shadow-ambient">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm font-bold text-on-surface-variant">
          Loading plans...
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">
        
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-primary" />
                  New Subscription Plan
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                      <SelectValue placeholder="Select New Plan" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline/10 shadow-ambient max-h-60">
                      {plansData?.items
                        ?.filter((plan: any) => plan.id !== subscription?.planId)
                        .map((plan: any) => (
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
                <FormDescription className="text-xs font-medium opacity-60">
                  Select a new plan to upgrade or downgrade this tenant.
                </FormDescription>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Reason (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. User requested upgrade"
                    {...field}
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
            onClick={() => router.push(`/subscriptions/${id}`)}
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
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Confirm Change Plan
          </Button>
        </div>
      </form>
    </Form>
  );
}
