"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Phone, Lock, ArrowRight, Loader2, ShieldCheck, AlertCircle, Sparkles, Activity, BarChart3 } from "lucide-react";

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

  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    
    const cleanedPhone = `+91${phoneNumber.trim()}`;
    const phoneRegex = /^\+91\d{10}$/;
    
    if (!phoneRegex.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit phone number.");
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

  const handleVerifyOtp = async (e?: React.FormEvent, directOtp?: string) => {
    if (e) e.preventDefault();
    setError(null);
    
    const cleanedPhone = `+91${phoneNumber.trim()}`;
    const cleanedOtp = (directOtp || otp).trim();
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

    if (newOtpString.length === 6) {
      handleVerifyOtp(undefined, newOtpString);
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
      
      const newOtpString = newOtpArray.join("");
      setOtp(newOtpString);
      
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();

      if (newOtpString.length === 6) {
        handleVerifyOtp(undefined, newOtpString);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-bg font-sans selection:bg-orange-100 selection:text-orange-900 dark:selection:bg-orange-900 dark:selection:text-orange-100">
      {/* Left Branding Panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gray-900 lg:flex lg:flex-col lg:justify-center p-14 xl:p-20">
        {/* Dynamic Premium Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-800 via-orange-600 to-orange-950 opacity-95" />
        {/* Subtle decorative circles */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-400 opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-900 opacity-40 blur-3xl" />
        
        {/* Logo at Absolute Top Left */}
        <div className="absolute top-14 left-14 xl:top-20 xl:left-20 z-20 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 font-bold text-2xl shadow-xl">
            HM
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#ffffff]">Hunar Mitra</span>
        </div>
        
        {/* Centered Main Content & Grid */}
        <div className="relative z-10 mt-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#ffffff]/10 px-4 py-1.5 text-sm font-bold backdrop-blur-md border border-[#ffffff]/20 shadow-sm text-[#ffffff]">
            <Sparkles className="h-4 w-4 text-orange-200" />
            <span>Operations Panel</span>
          </div>
          <h1 className="text-[2.75rem] xl:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1] text-[#ffffff]">
            Empowering the <br/> workforce of tomorrow.
          </h1>
          <p className="text-orange-50/90 text-lg max-w-md font-medium leading-relaxed mb-12">
            Secure administrative console. Manage bookings, verify partners, and oversee marketplace operations efficiently.
          </p>

          {/* Premium Feature Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="rounded-2xl bg-[#ffffff]/10 backdrop-blur-md border border-[#ffffff]/10 p-5 shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <ShieldCheck className="h-7 w-7 text-orange-200 mb-3" />
              <h3 className="text-[#ffffff] font-bold text-sm mb-1">Secure & Encrypted</h3>
              <p className="text-orange-50/70 text-xs font-medium leading-snug">Bank-grade security for platform operations.</p>
            </div>
            <div className="rounded-2xl bg-[#ffffff]/10 backdrop-blur-md border border-[#ffffff]/10 p-5 shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <BarChart3 className="h-7 w-7 text-orange-200 mb-3" />
              <h3 className="text-[#ffffff] font-bold text-sm mb-1">Real-time Analytics</h3>
              <p className="text-orange-50/70 text-xs font-medium leading-snug">Live tracking of all marketplace metrics.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24 relative bg-gray-50/30 dark:bg-transparent">
        <div className="mx-auto w-full max-w-sm lg:max-w-md relative z-10">
          
          <div className="relative bg-white dark:bg-[#ffffff]/5 dark:backdrop-blur-2xl p-8 lg:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-100 dark:border-[#ffffff]/10 overflow-hidden">
            {/* Subtle internal gradient for dark mode glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff]/10 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
            
            <div className="relative z-10">
              
              {/* Mobile Logo Header */}
              <div className="flex flex-col items-center text-center lg:hidden mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-[#ffffff] font-bold text-2xl shadow-lg shadow-orange-600/30 mb-4">
                  HM
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ffffff]">
                  Hunar Mitra
                </h2>
                <p className="mt-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Operations Panel
                </p>
              </div>

              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#ffffff]">
                  {step === 1 ? "Welcome back" : "Verify your identity"}
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 dark:text-[#94A3B8] font-medium">
                  {step === 1 ? "Please enter your details to sign in." : "We've sent a secure verification code to your device."}
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-8 rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-sm font-medium text-red-700 dark:text-red-400 flex items-start gap-3 border border-red-100 dark:border-red-500/20 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {step === 1 ? (
                <form className="space-y-6" onSubmit={handleSendOtp}>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest mb-2.5">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 gap-2 transition-colors group-focus-within:text-orange-600 dark:group-focus-within:text-orange-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 150" className="w-6 h-4 rounded-sm shadow-sm object-cover">
                          <rect width="225" height="150" fill="#FF9933"/>
                          <rect width="225" height="50" y="50" fill="#FFFFFF"/>
                          <rect width="225" height="50" y="100" fill="#138808"/>
                          <circle cx="112.5" cy="75" r="20" fill="#000080"/>
                          <circle cx="112.5" cy="75" r="16" fill="#FFFFFF"/>
                          <circle cx="112.5" cy="75" r="4" fill="#000080"/>
                          <path d="M112.5,55 L112.5,95 M92.5,75 L132.5,75 M98.3,60.8 L126.7,89.2 M98.3,89.2 L126.7,60.8" stroke="#000080" strokeWidth="2"/>
                        </svg>
                        <span className="text-sm font-bold text-gray-900 dark:text-[#E2E8F0] group-focus-within:text-orange-600 dark:group-focus-within:text-orange-400 transition-colors">+91</span>
                        <svg className="h-3 w-3 text-gray-600 dark:text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                        </svg>
                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 ml-1"></div>
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Enter Your Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="block w-full rounded-2xl border border-gray-200 dark:border-[#ffffff]/10 bg-gray-50/50 dark:bg-[#000000]/20 py-3.5 pl-[7.5rem] pr-4 text-sm font-medium text-gray-900 dark:text-[#ffffff] placeholder-gray-500 dark:placeholder-gray-400 focus:border-orange-600 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-[#000000]/40 focus:outline-none focus:ring-4 focus:ring-orange-600/10 dark:focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center items-center rounded-2xl bg-orange-600 dark:bg-orange-500 px-4 py-3.5 text-sm font-bold text-[#ffffff] shadow-lg shadow-orange-600/25 dark:shadow-orange-900/50 hover:bg-orange-700 dark:hover:bg-orange-400 hover:shadow-orange-600/40 dark:hover:shadow-orange-900/60 focus:outline-none focus:ring-4 focus:ring-orange-600/20 dark:focus:ring-orange-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Continue with Phone
                        <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest mb-4">
                      Enter Verification Code
                    </label>
                    <div className="flex gap-3 mb-4">
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
                          className={`w-full aspect-square rounded-2xl border-2 bg-gray-50/50 dark:bg-[#000000]/20 text-center text-xl font-extrabold transition-all focus:outline-none focus:border-orange-600 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-[#000000]/40 focus:ring-4 focus:ring-orange-600/10 dark:focus:ring-orange-500/20
                            ${digit ? 'border-orange-200 dark:border-orange-500/50 text-orange-950 dark:text-[#ffffff]' : 'border-gray-200 dark:border-[#ffffff]/10 text-transparent'}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 px-1">
                      <span>+91 {phoneNumber}</span>
                      <div className="flex gap-4">
                        <button 
                          type="button" 
                          onClick={() => {
                            if (canResend) {
                              handleSendOtp();
                            }
                          }}
                          className={`${!canResend ? 'opacity-40 cursor-not-allowed' : 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline'} transition-all`}
                        >
                          Resend {timer > 0 && `(${timer}s)`}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setStep(1)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#ffffff] transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerifyOtp()}
                    disabled={isLoading || otpArray.join("").length !== 6}
                    className="group relative flex w-full justify-center items-center rounded-2xl bg-orange-600 dark:bg-orange-500 px-4 py-3.5 text-sm font-bold text-[#ffffff] shadow-lg shadow-orange-600/25 dark:shadow-orange-900/50 hover:bg-orange-700 dark:hover:bg-orange-400 hover:shadow-orange-600/40 dark:hover:shadow-orange-900/60 focus:outline-none focus:ring-4 focus:ring-orange-600/20 dark:focus:ring-orange-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Secure Login
                        <ShieldCheck className="ml-2 h-5 w-5 opacity-70 group-hover:opacity-100 transition-all" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Test Credentials Box */}
              <div className="mt-8 rounded-2xl bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100/50 dark:border-orange-500/20 p-5 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff]/40 dark:from-[#ffffff]/5 to-transparent pointer-events-none" />
                <div className="relative z-10 flex gap-3 items-start">
                  <div className="rounded-full bg-orange-100 dark:bg-orange-500/20 p-2">
                    <ShieldCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-orange-950 dark:text-[#66C2A6]">Test Credentials</h4>
                    <div className="mt-2 space-y-1 text-xs font-medium text-orange-900/70 dark:text-[#A8DFD4]">
                      <div className="flex items-center gap-2">
                        <span>Phone:</span>
                        <code className="rounded bg-white dark:bg-[#000000]/40 px-1.5 py-0.5 text-orange-700 dark:text-[#66C2A6] font-bold shadow-sm border border-orange-100/50 dark:border-[#ffffff]/10">9999999900</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>OTP:</span>
                        <code className="rounded bg-white dark:bg-[#000000]/40 px-1.5 py-0.5 text-orange-700 dark:text-[#66C2A6] font-bold shadow-sm border border-orange-100/50 dark:border-[#ffffff]/10">123456</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



