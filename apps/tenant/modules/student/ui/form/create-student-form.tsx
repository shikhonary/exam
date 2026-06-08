"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, Form as FormProvider, zodResolver } from "@workspace/ui/components/form";
import { studentFormSchema, StudentFormValues } from "@workspace/schema";
import { useCreateStudent } from "@workspace/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { ChevronRight, ChevronLeft, Save } from "lucide-react";
import { StudentFormStepper } from "./student-form-stepper";

// Step Components
import { AcademicStep } from "./steps/academic-step";
import { PersonalStep } from "./steps/personal-step";
import { InstitutionStep } from "./steps/institution-step";
import { ContactStep } from "./steps/contact-step";
import { FinancialStep } from "./steps/financial-step";

const STORAGE_KEY = "student_form_draft";

export function CreateStudentForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { mutateAsync: createStudent, isPending } = useCreateStudent();

  const methods = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      studentId: "",
      name: "",
      email: "",
      academicClassId: "",
      batchId: "",
      institute: "",
      roll: "",
      group: "",
      shift: "DAY",
      section: "",
      fatherName: "",
      motherName: "",
      gender: "",
      bloodGroup: "",
      nationality: "BANGLADESHI",
      religion: "ISLAM",
      imageUrl: "",
      primaryPhone: "",
      secondaryPhone: "",
      presentAddress: "",
      permanentAddress: "",
      isActive: true,
      admissionFee: 0,
      monthlyFee: 0,
      academicYearId: "",
    },
    mode: "onTouched",
  });

  const { handleSubmit, trigger, watch, reset } = methods;

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        
        // Fix legacy draft values
        if (parsed.nationality === "Bangladeshi") parsed.nationality = "BANGLADESHI";
        if (!parsed.religion) parsed.religion = "ISLAM";
        if (!parsed.nationality) parsed.nationality = "BANGLADESHI";
        if (!parsed.shift) parsed.shift = "DAY";

        reset(parsed);
        toast.info("খসড়া থেকে তথ্য লোড করা হয়েছে", {
          description: "পূর্ববর্তী অসম্পূর্ণ ফর্ম পুনরুদ্ধার করা হয়েছে",
        });
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    setIsLoaded(true);
  }, [reset]);

  // Save to localStorage whenever values change
  useEffect(() => {
    if (isLoaded) {
      const subscription = watch((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isLoaded]);

  const stepFields: (keyof StudentFormValues)[][] = [
    // Step 1: Academic
    ["studentId", "academicYearId", "academicClassId", "batchId"],
    // Step 2: Personal
    ["name", "fatherName", "motherName", "dateOfBirth", "gender", "bloodGroup", "religion", "nationality", "imageUrl"],
    // Step 3: Institution
    ["institute", "roll", "group", "shift", "section"],
    // Step 4: Contact
    ["primaryPhone", "secondaryPhone", "email", "presentAddress", "permanentAddress"],
    // Step 5: Financial
    ["admissionFee", "monthlyFee", "isActive"],
  ];

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStepRef.current];
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      const nextStep = Math.min(currentStepRef.current + 1, 4);
      currentStepRef.current = nextStep;
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    const prevStep = Math.max(currentStepRef.current - 1, 0);
    currentStepRef.current = prevStep;
    setCurrentStep(prevStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: StudentFormValues) => {
    if (currentStepRef.current !== 4) return;
    try {
      await createStudent(data);
      localStorage.removeItem(STORAGE_KEY);
      router.push("/students");
    } catch (error) {
      console.error(error);
    }
  };


  if (!isLoaded) return null;

  return (
    <div className="max-w-4xl mx-auto bg-[#131B2C] rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/[0.02] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-2 sm:px-4 py-2">
        <StudentFormStepper currentStep={currentStep} />

        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-8">
            <div className="border-b border-white/[0.04] pb-4 mb-6 flex justify-start">
              <p className="text-xs font-medium text-muted-foreground">
                <span className="text-rose-500">*</span> চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে
              </p>
            </div>
            
            <div className="min-h-[400px]">
              {currentStep === 0 && <AcademicStep />}
              {currentStep === 1 && <PersonalStep />}
              {currentStep === 2 && <InstitutionStep />}
              {currentStep === 3 && <ContactStep />}
              {currentStep === 4 && <FinancialStep />}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || isPending}
                className="text-muted-foreground font-bold hover:bg-white/[0.08] transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                পূর্ববর্তী
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground font-bold px-8 hover:bg-primary/90 shadow-[0_8px_30px_rgba(0,229,160,0.2)] transition-all active:scale-95"
                >
                  পরবর্তী
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={isPending}
                  className="bg-primary text-primary-foreground font-bold px-8 hover:bg-primary/90 shadow-[0_8px_30px_rgba(0,229,160,0.2)] transition-all active:scale-95"
                >
                  {isPending ? "সেভ হচ্ছে..." : "সংরক্ষণ করুন"}
                  {!isPending && <Save className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
