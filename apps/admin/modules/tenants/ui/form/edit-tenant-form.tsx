"use client";

import { Building2, ChevronLeft, Loader2, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import {
  tenantFormSchema,
  TenantFormValues,
  defaultTenantValues,
} from "@workspace/schema";
import { useTenantById, useUpdateTenant } from "@workspace/api-client";

import { BasicInfoStep } from "../components/basic-info-step";
import { ContactInfoStep } from "../components/contact-info-step";
import { DomainConfigStep } from "../components/domain-config-step";
import { SubscriptionStep } from "../components/subscription-step";
import { UsageLimitsStep } from "../components/usage-limit-step";
import { StepIndicator, steps } from "../components/step-indicator";
import { FormNavigation } from "../components/form-navigation";
import { useMultiStepForm } from "../hooks/use-multi-step-form";

interface EditTenantFormProps {
  tenantId: string;
}

export function EditTenantForm({ tenantId }: EditTenantFormProps) {
  const router = useRouter();
  const { data: tenant, isLoading: isLoadingTenant } = useTenantById(tenantId);
  const { mutate: updateTenant, isPending: isUpdating } = useUpdateTenant();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: defaultTenantValues,
  });

  const {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick,
    isValidating,
  } = useMultiStepForm(form, steps.length);

  const isLastStep = currentStep === steps.length;

  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        slug: tenant.slug,
        type: tenant.type as TenantFormValues["type"],
        description: tenant.description ?? "",
        logo: tenant.logo ?? "",
        currentAcademicYear: tenant.currentAcademicYear ?? "",
        email: tenant.email ?? "",
        phone: tenant.phone ?? "",
        address: tenant.address ?? "",
        city: tenant.city ?? "",
        state: tenant.state ?? "",
        postalCode: tenant.postalCode ?? "",
        subdomain: tenant.subdomain ?? "",
        customDomain: tenant.customDomain ?? "",
        planId: tenant.subscription?.plan?.id ?? "",
        isActive: tenant.isActive ?? true,
        customStudentLimit: tenant.customStudentLimit ?? undefined,
        customTeacherLimit: tenant.customTeacherLimit ?? undefined,
        customExamLimit: tenant.customExamLimit ?? undefined,
        customStorageLimit: tenant.customStorageLimit ?? undefined,
      });
    }
  }, [tenant, form]);

  const onSubmit = (data: TenantFormValues) => {
    updateTenant({ id: tenantId, ...data });
    router.push("/tenants");
  };

  const onNext = () => {
    if (isLastStep) {
      onSubmit(form.getValues());
    } else {
      handleNext();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <ContactInfoStep form={form} />;
      case 3:
        return <DomainConfigStep form={form} />;
      case 4:
        return <SubscriptionStep form={form} />;
      case 5:
        return <UsageLimitsStep form={form} />;
      default:
        return null;
    }
  };

  if (isLoadingTenant) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-500 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="w-fit -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-soft">
            <Building2 className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Edit Tenant
              </h1>
              {tenant?.isActive ? (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
                  Live
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest"
                >
                  Inactive
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground font-medium">
              Update institutional settings and configurations for{" "}
              <span className="text-primary font-bold">{tenant?.name}</span>
            </p>
          </div>
        </div>
      </div>

      <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles className="size-24 text-primary" />
            </div>

            <div className="px-8 pt-8 pb-2">
              <h2 className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  {(() => {
                    const StepIcon = steps[currentStep - 1]?.icon as any;
                    return <StepIcon className="h-4 w-4" />;
                  })()}
                </div>
                {steps[currentStep - 1]?.title}
              </h2>
              <p className="text-muted-foreground font-medium pl-[3.25rem] -mt-1">
                {steps[currentStep - 1]?.description}
              </p>
            </div>

            <CardContent className="p-8 pt-6">
              <div className="min-h-[300px] animate-in fade-in duration-300">
                {renderStepContent()}
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <FormNavigation
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  onPrevious={handlePrevious}
                  onNext={onNext}
                  isSubmitting={isUpdating}
                  isValidating={isValidating}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
