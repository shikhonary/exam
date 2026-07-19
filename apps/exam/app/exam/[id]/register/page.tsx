"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegisterStudent } from "@workspace/api-client";
import { useStudentStore } from "@/lib/student-store";
import { OtpModal } from "@/components/otp-modal";

export default function RegisterPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const examId = params.id;
  const router = useRouter();
  
  const studentStore = useStudentStore();
  const [name, setName] = useState(studentStore.name || "");
  const [mobile, setMobile] = useState(studentStore.mobile || "");
  const [inputStudentId, setInputStudentId] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const registerMutation = useRegisterStudent();

  const handleStartDirectly = () => {
    router.push(`/exam/${examId}/take`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) {
      toast.error("নাম এবং মোবাইল নম্বর আবশ্যক");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(mobile)) {
      toast.error("সঠিক বাংলাদেশী মোবাইল নম্বর প্রয়োজন (যেমন: 01712345678)");
      return;
    }
    
    registerMutation.mutate(
      { name, mobile, studentId: inputStudentId || studentStore.studentId || undefined },
      {
        onSuccess: (res) => {
          if (res.data) {
            toast.success("আপনার মোবাইলে ওটিপি পাঠানো হয়েছে");
            setShowOtp(true);
          }
        }
      }
    );
  };

  const handleOtpSuccess = (data: any) => {
    const newStudentId = data?.studentId || data?.id || studentStore.studentId || "pending-id";
    studentStore.setStudent({
      studentId: newStudentId,
      name,
      mobile,
    });
    studentStore.setVerified(true);
    setShowOtp(false);
    // Let the component re-render so they can see the rules before explicitly starting
  };

  // If already verified, allow direct start
  if (studentStore.isVerified && studentStore.mobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2 sm:p-4">
        <div className="card p-4 sm:p-8 max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">স্বাগতম, {studentStore.name}!</h1>
            <p className="text-gray-600">আপনার মোবাইল নম্বর ({studentStore.mobile}) সফলভাবে যাচাই করা হয়েছে।</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-5 mb-6 sm:mb-8">
            <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              পরীক্ষার নিয়মাবলী ও সতর্কতা
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-orange-900">
              <li><strong>ট্যাব পরিবর্তন নিষেধ:</strong> পরীক্ষার চলাকালীন ব্রাউজারের ট্যাব পরিবর্তন করলে বা অন্য উইন্ডোতে গেলে পরীক্ষা স্বয়ংক্রিয়ভাবে সাবমিট হয়ে যাবে।</li>
              <li><strong>নির্দিষ্ট সময়:</strong> নির্ধারিত সময়ের মধ্যেই পরীক্ষা শেষ করতে হবে। সময় শেষ হলে স্বয়ংক্রিয়ভাবে খাতা জমা হয়ে যাবে।</li>
              <li><strong>একবার সুযোগ:</strong> একবার পরীক্ষা শুরু করলে তা বাতিল বা পুনরায় শুরু করার কোনো সুযোগ নেই।</li>
              <li><strong>ইন্টারনেট:</strong> পরীক্ষা চলাকালীন নিরবচ্ছিন্ন ইন্টারনেট সংযোগ নিশ্চিত করুন।</li>
            </ul>
          </div>

          <button 
            onClick={handleStartDirectly}
            className="btn-primary w-full py-4 text-lg font-bold shadow-lg shadow-indigo-200"
          >
            আমি নিয়মাবলী পড়েছি এবং পরীক্ষা শুরু করতে প্রস্তুত
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2 sm:p-4">
      <div className="card p-4 sm:p-8 max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">শিক্ষার্থী নিবন্ধন</h1>
          <p className="text-gray-500 text-sm">আপনার পরীক্ষা শুরু করতে অনুগ্রহ করে নিবন্ধন করুন</p>
        </div>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">পুরো নাম</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={registerMutation.isPending}
              className="input w-full disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="আপনার পুরো নাম লিখুন"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">স্টুডেন্ট আইডি (ঐচ্ছিক)</label>
            <input 
              type="text" 
              value={inputStudentId}
              onChange={(e) => setInputStudentId(e.target.value)}
              disabled={registerMutation.isPending}
              className="input w-full disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="আপনার স্টুডেন্ট আইডি লিখুন"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">মোবাইল নম্বর</label>
            <input 
              type="tel" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={registerMutation.isPending}
              className="input w-full disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="01xxxxxxxxx"
            />
            <p className="text-xs text-gray-500 mt-1.5">এই নম্বরে একটি ৬-ডিজিটের ওটিপি পাঠানো হবে।</p>
          </div>
          
          <button 
            type="submit" 
            disabled={registerMutation.isPending}
            className="btn-primary w-full mt-2 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? "ওটিপি পাঠানো হচ্ছে..." : "ওটিপি পান"}
          </button>
        </form>
      </div>

      <OtpModal 
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onSuccess={handleOtpSuccess}
        mobile={mobile}
      />
    </div>
  );
}
