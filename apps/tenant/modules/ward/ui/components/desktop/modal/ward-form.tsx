"use client";

import React from "react";
import { wardFormSchema, type WardFormValues } from "@workspace/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import {
  Activity,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Save,
  X,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface WardFormProps {
  initialData?: Partial<WardFormValues>;
  onSubmit: (values: WardFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export const WardForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: WardFormProps) => {
  const form = useForm<WardFormValues>({
    resolver: zodResolver(wardFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      displayName: initialData?.displayName || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Ward Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Ward Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Ward No. 01"
                  {...field}
                  className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:font-normal placeholder:text-slate-300"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Display Name */}
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Display Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Uttarpara Ward"
                  {...field}
                  className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:font-normal placeholder:text-slate-300"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group/toggle transition-all hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  field.value ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                )}>
                  <Activity className={cn("w-4 h-4", field.value && "scale-110")} />
                </div>
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-bold text-slate-700 leading-none cursor-pointer">
                    Active Status
                  </FormLabel>
                  <p className="text-[10px] text-slate-400 font-medium italic leading-none">
                    Currently operational
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

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-1.5 h-11 px-4 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50 border-none transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-md shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 border-none"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="w-4 h-4" strokeWidth={3} />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create Ward"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
