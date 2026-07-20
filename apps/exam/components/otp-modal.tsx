"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useVerifyOtp, useResendOtp } from "@workspace/api-client";

export function OtpModal({
  isOpen,
  onClose,
  onSuccess,
  mobile,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  mobile: string;
}) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(120);
      setOtp("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const handleVerify = () => {
    verifyMutation.mutate(
      { mobile, code: otp },
      {
        onSuccess: (res) => {
          toast.success("ওটিপি সফলভাবে যাচাই করা হয়েছে");
          onSuccess(res.data);
        }
      }
    );
  };

  const handleResend = () => {
    resendMutation.mutate(
      { mobile },
      {
        onSuccess: () => {
          toast.success("আপনার মোবাইলে নতুন ওটিপি পাঠানো হয়েছে");
          setTimeLeft(120);
        }
      }
    );
  };

  if (!isOpen) return null;

  const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="card p-6 w-full max-w-sm bg-white rounded-xl shadow-xl flex flex-col relative">
        <h2 className="text-xl font-bold mb-2">ওটিপি লিখুন</h2>
        <p className="text-sm text-gray-600 mb-6">আমরা {mobile} নম্বরে একটি ৬-ডিজিটের কোড পাঠিয়েছি</p>
        
        <input 
          type="text" 
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={verifyMutation.isPending}
          placeholder="Enter OTP"
          className="input w-full mb-6 text-center text-2xl tracking-widest font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleVerify}
            disabled={otp.length !== 6 || verifyMutation.isPending}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifyMutation.isPending ? "যাচাই করা হচ্ছে..." : "ওটিপি যাচাই করুন"}
          </button>
          
          <button 
            onClick={handleResend}
            disabled={resendMutation.isPending || timeLeft > 0}
            className={`text-sm transition-colors ${timeLeft > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"}`}
          >
            {resendMutation.isPending 
              ? "পাঠানো হচ্ছে..." 
              : timeLeft > 0 
                ? `আবার ওটিপি পাঠান (${formattedTime})` 
                : "আবার ওটিপি পাঠান"}
          </button>
          
          <button 
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 mt-2 transition-colors"
          >
            বাতিল করুন
          </button>
        </div>
      </div>
    </div>
  );
}
