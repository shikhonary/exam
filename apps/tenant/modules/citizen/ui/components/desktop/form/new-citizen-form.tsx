"use client";

import { useState } from "react";
import {
  Form,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import {
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { citizenApplicationSchema, type CitizenApplicationFormValues } from "@workspace/schema";
import { useCreateCitizenApplication, useVillagesForSelection, useWardsForSelection } from "@workspace/api-client";
import { IdentityStep } from "./identity-step";
import { AddressStep } from "./address-step";
import { ContactStep } from "./contact-step";
import { ReviewStep } from "./review-step";
import {
  GENDER,
  MARITAL_STATUS,
  RELIGION,
  RESIDENT_STATUS,
} from "@workspace/utils";

const STEPS = [
  { id: 1, title: "Identity", icon: User },
  { id: 2, title: "Residence", icon: MapPin },
  { id: 3, title: "Contact", icon: Phone },
  { id: 4, title: "Review", icon: CheckCircle2 },
];

export const NewCitizenForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { mutateAsync: createCitizen, isPending } = useCreateCitizenApplication();

  // Dynamic Data Hooks
  const { data: wards = [] } = useWardsForSelection();
  const { data: villages = [] } = useVillagesForSelection();

  const form = useForm<CitizenApplicationFormValues>({
    resolver: zodResolver(citizenApplicationSchema),
    mode: "onChange",
    defaultValues: {
      fullNameEn: "",
      fullNameBn: "",
      nid: "",
      birthRegistrationNo: "",
      passportNo: "",
      dateOfBirth: undefined,
      fatherNameEn: "",
      fatherNameBn: "",
      motherNameEn: "",
      motherNameBn: "",
      occupation: "",
      residentStatus: RESIDENT_STATUS.RESIDENT,
      educationalQualification: "",
      religion: RELIGION.ISLAM,
      gender: GENDER.MALE,
      maritalStatus: MARITAL_STATUS.SINGLE,
      presentVillageEn: "",
      presentVillageBn: "",
      presentRoadBlockSectorEn: "",
      presentRoadBlockSectorBn: "",
      presentHoldingNo: "",
      presentWardNo: 1,
      presentDistrict: "",
      presentUpazila: "",
      presentPostOffice: "",
      permanentVillageEn: "",
      permanentVillageBn: "",
      permanentRoadBlockSectorEn: "",
      permanentRoadBlockSectorBn: "",
      permanentHoldingNo: "",
      permanentWardNo: 1,
      permanentDistrict: "",
      permanentUpazila: "",
      permanentPostOffice: "",
      mobile: "",
      email: "",
      commentsBn: "",
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["fullNameBn", "fatherNameBn", "motherNameBn", "gender", "religion", "dateOfBirth", "nid"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["presentWardNo", "presentVillageBn", "presentPostOffice", "presentUpazila", "presentDistrict"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["mobile"];
    }

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  async function onSubmit(data: CitizenApplicationFormValues) {
    try {
      await createCitizen(data);
      router.push("/citizens");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="pb-20 px-4 md:px-8 w-full max-w-5xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 z-10",
                    isCompleted ? "bg-primary border-primary text-white shadow-glow" :
                      isActive ? "bg-white border-primary text-primary shadow-ambient" :
                        "bg-white border-slate-200 text-slate-400"
                  )}
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                  isActive || isCompleted ? "text-primary" : "text-slate-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {currentStep === 1 && <IdentityStep form={form} />}
          {currentStep === 2 && <AddressStep form={form} wards={wards} villages={villages} />}
          {currentStep === 3 && <ContactStep form={form} />}
          {currentStep === 4 && <ReviewStep form={form} />}

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-10 border-t border-slate-100">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                className="h-14 px-8 bg-white border border-outline/30 hover:bg-slate-50 text-on-surface-variant font-bold rounded-[20px] transition-all active:scale-[0.98] text-sm flex items-center gap-2"
                disabled={isPending}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            )}

            <div className="flex-1" />

            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
                className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-[20px] flex items-center justify-center gap-3 transition-all shadow-glow hover:scale-[1.01] active:scale-[0.98] border-none text-base"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-14 px-10 gradient-signature hover:opacity-90 text-white font-black rounded-[20px] flex items-center justify-center gap-3 transition-all shadow-glow hover:scale-[1.01] active:scale-[0.98] border-none text-base tracking-tight"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
