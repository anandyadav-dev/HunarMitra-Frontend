"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Phone, Lock, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(24);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    
    const cleanedPhone = phoneNumber.trim();
    const phoneRegex = /^\+91\d{10}$/;
    
    if (!phoneRegex.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit phone number starting with +91.");
      return;
    }
    
    setIsLoading(true);
    try {
      await sendOtp(cleanedPhone);
      setStep(2);
      setTimer(24);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    
    const cleanedPhone = phoneNumber.trim();
    const cleanedOtp = otp.trim();
    const otpRegex = /^\d{6}$/;
    
    if (!otpRegex.test(cleanedOtp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    
    setIsLoading(true);
    try {
      await verifyOtp(cleanedPhone, cleanedOtp);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP or access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value.substring(value.length - 1);
    setOtpArray(newOtpArray);
    
    const newOtpString = newOtpArray.join("");
    setOtp(newOtpString);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && otpArray.join("").length === 6) {
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).replace(/\D/g, "");
    if (pastedData) {
      const newOtpArray = [...otpArray];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newOtpArray[i] = pastedData[i];
      }
      setOtpArray(newOtpArray);
      setOtp(newOtpArray.join(""));
      
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white font-bold text-2xl shadow-md shadow-gray-900/10">
            HM
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Hunar Mitra Operations Panel
          </h2>
          <p className="mt-1.5 text-xs font-medium text-gray-500">
            Access secure marketplace administrative console
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white px-8 py-8 border border-gray-200/80 rounded-xl shadow-sm shadow-gray-100/50">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 flex items-start gap-2 border border-red-100">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              {/* Phone Number Input */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Administrator Phone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={13}
                    placeholder="+919999999900"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="ml-2 h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  One Time Password (OTP)
                </label>
                <div className="flex gap-2 mb-2">
                  {otpArray.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className={`w-full aspect-square rounded-lg border bg-gray-50 text-center text-xl font-bold transition-colors focus:outline-none focus:border-gray-950 focus:ring-0 
                        ${digit ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-transparent'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                  <span>Sent to {phoneNumber}</span>
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (canResend) {
                          handleSendOtp();
                        }
                      }}
                      className={`${!canResend ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 hover:text-gray-950'} transition-colors`}
                    >
                      Resend ({timer}s)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="text-gray-700 hover:text-gray-950 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isLoading || otpArray.join("").length !== 6}
                className="group relative flex w-full justify-center rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Verify & Authenticate
                    <ArrowRight className="ml-2 h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Test Credentials Box */}
          <div className="mt-8 rounded-lg bg-gray-50 border border-gray-100 p-4">
            <div className="flex gap-2 items-start">
              <ShieldCheck className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-800">Quick Test Credentials</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                  Phone: <code className="font-semibold text-gray-900">+919999999900</code> <br />
                  OTP: <code className="font-semibold text-gray-900">123456</code>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
