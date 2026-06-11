"use client";

import React, { useRef, useState } from "react";
import { useForm, Form as FormProvider, zodResolver } from "@workspace/ui/components/form";
import { studentFormSchema, StudentFormValues } from "@workspace/schema";
import { useUpdateStudent } from "@workspace/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight, ChevronLeft, Save } from "lucide-react";
import { StudentFormStepper } from "./student-form-stepper";

// Step Components
import { AcademicStep } from "./steps/academic-step";
import { PersonalStep } from "./steps/personal-step";
import { InstitutionStep } from "./steps/institution-step";
import { ContactStep } from "./steps/contact-step";
import { FinancialStep } from "./steps/financial-step";

interface EditStudentFormProps {
  student: any;
}

export function EditStudentForm({ student }: EditStudentFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent();

  const methods = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as any,
    defaultValues: {
      studentId: student.studentId || "",
      name: student.name || "",
      email: student.email || "",
      academicClassId: student.academicClassId || "",
      batchId: student.batchId || "",
      institute: student.institute || "",
      roll: student.roll || "",
      group: student.group || "",
      shift: student.shift || "DAY",
      section: student.section || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
      gender: student.gender || "",
      bloodGroup: student.bloodGroup || "",
      nationality: student.nationality || "BANGLADESHI",
      religion: student.religion || "ISLAM",
      imageUrl: student.imageUrl || "",
      primaryPhone: student.primaryPhone || "",
      secondaryPhone: student.secondaryPhone || "",
      presentAddress: student.presentAddress || "",
      permanentAddress: student.permanentAddress || "",
      isActive: student.isActive ?? true,
      admissionFee: student.admissionFee ?? 0,
      monthlyFee: student.monthlyFee ?? 0,
      academicYearId: student.academicYearId || "",
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : "",
    },
    mode: "onTouched",
  });

  const { handleSubmit, trigger } = methods;

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
      await updateStudent({
        id: student.id,
        ...data,
      });
      toast.success("শিক্ষার্থীর তথ্য সফলভাবে আপডেট হয়েছে");
      router.push("/students");
    } catch (error) {
      console.error(error);
    }
  };

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
                  {isPending ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
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
