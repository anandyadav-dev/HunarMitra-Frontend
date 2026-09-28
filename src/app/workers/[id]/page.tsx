"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useDialog } from "../../../hooks/useDialog";
import { ArrowLeft, User, ShieldCheck, AlertCircle, FileText, CheckCircle, XCircle, Clock, X, MapPin, Briefcase, Star, IndianRupee, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkerDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { alert } = useDialog();
  const [worker, setWorker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rejection Dialog state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchWorkerDetails();
  }, [params.id]);

  const fetchWorkerDetails = async () => {
    setIsLoading(true);
    try {
      const res = await api.admin.getWorker(params.id);
      setWorker(res);
    } catch (err: any) {
      setError(err.message || "Failed to load worker details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyKyc = async (statusStr: "approved" | "rejected") => {
    setIsVerifying(true);
    try {
      await api.admin.verifyWorker(worker.id, statusStr, statusStr === "rejected" ? rejectionReason : undefined);
      alert(
        "KYC Updated",
        `Worker KYC status has been updated to ${statusStr}.`
      );
      setShowRejectModal(false);
      fetchWorkerDetails();
    } catch (err: any) {
      alert("Error", err.message || "Failed to verify KYC status.");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatAadhaar = (val: string) => {
    if (!val) return "Not Provided";
    return val.replace(/(\d{4})/g, '$1-').replace(/-$/, '');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-xl font-semibold text-gray-900">{error}</p>
        <button onClick={() => router.push("/workers")} className="text-indigo-500 hover:underline">Go Back</button>
      </div>
    );
  }

  if (!worker) return <div className="p-8 text-center text-gray-500 mt-20">Worker not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 mt-4">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="-mt-12 sm:-mt-16 h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg shrink-0 mx-auto sm:mx-0">
              {worker.profile_picture ? (
                <img src={worker.profile_picture} alt={worker.user?.full_name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              )}
            </div>
            
            {/* Name & Title */}
            <div className="flex-1 text-center sm:text-left pt-2 sm:pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {worker.user?.full_name || "Unregistered Worker"}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 w-fit mx-auto sm:mx-0">
                  {worker.category}
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{worker.city ? `${worker.area_mohalla || ''}, ${worker.city}` : 'Location Not Set'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold text-gray-700">{worker.rating}</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => router.push("/workers")} 
              className="absolute top-4 right-4 sm:static sm:mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all shadow-sm sm:shadow-none backdrop-blur-md self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Back to Workers</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details & Stats */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <IndianRupee className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</p>
              <p className="text-lg font-bold text-gray-900 mt-1">₹{worker.pricing_per_hour}/hr</p>
            </div>
            
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{worker.experience_years} Yrs</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
              <p className="text-sm font-bold text-gray-900 mt-1 capitalize leading-tight">
                {worker.availability_status?.replace('_', ' ')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jobs Done</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{worker.total_jobs_done}</p>
            </div>
          </div>

          {/* Skills & Bio */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-5 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                Professional Profile
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {worker.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">About</h4>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200 italic">
                    &quot;{worker.bio}&quot;
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Additional Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {worker.additional_skills?.length ? (
                      worker.additional_skills.map((skill: string) => (
                        <span key={skill} className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm px-3 py-1.5 rounded-lg font-medium shadow-sm">
                          {skill}
                        </span>
                      ))
                    ) : <span className="text-gray-400 italic text-sm">No additional skills listed</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {worker.languages?.length ? (
                      worker.languages.map((lang: string) => (
                        <span key={lang} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm px-3 py-1.5 rounded-lg font-medium shadow-sm">
                          {lang}
                        </span>
                      ))
                    ) : <span className="text-gray-400 italic text-sm">Not specified</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: KYC & Documents */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="border-b border-gray-200 p-5 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                KYC Verification
              </h3>
              
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                worker.kyc_status === "approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : worker.kyc_status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {worker.kyc_status}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col space-y-6">
              
              {/* Aadhaar Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Aadhaar Number</p>
                  <p className="text-xl font-mono font-bold text-gray-900 tracking-widest bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                    {formatAadhaar(worker.aadhaar_number)}
                  </p>
                </div>
              </div>

              {worker.rejection_reason && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-800">Rejection Reason</p>
                    <p className="mt-1 text-sm text-red-700 leading-relaxed">{worker.rejection_reason}</p>
                  </div>
                </div>
              )}

              {/* Document Images */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Document Evidence</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Selfie */}
                  <div className="group relative rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden aspect-square flex flex-col items-center justify-center transition-colors">
                    {worker.profile_picture ? (
                      <>
                        <img src={worker.profile_picture} alt="Selfie" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-medium text-sm">View Full Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium">No Selfie</span>
                      </div>
                    )}
                    {!worker.profile_picture && <span className="absolute bottom-2 left-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Selfie</span>}
                  </div>
                  
                  {/* Aadhaar Front */}
                  <div className="group relative rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden aspect-square flex flex-col items-center justify-center transition-colors">
                    {worker.aadhaar_image_front ? (
                      <>
                        <img src={worker.aadhaar_image_front} alt="Aadhaar Front" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-medium text-sm">View Full Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <FileText className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium">No Document</span>
                      </div>
                    )}
                    {!worker.aadhaar_image_front && <span className="absolute bottom-2 left-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aadhaar Front</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {worker.kyc_status === "pending" && (
                <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
                  <button
                    onClick={() => handleVerifyKyc("approved")}
                    disabled={isVerifying}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Approve KYC
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isVerifying}
                    className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <XCircle className="h-5 w-5" />
                    Reject KYC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Reject Verification
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-700">
                Reason for Rejection
              </label>
              <textarea
                id="reason"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why the KYC is being rejected..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
              />
              <p className="text-xs text-gray-500">This reason will be visible to the worker in their app.</p>
            </div>
            
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyKyc("rejected")}
                disabled={!rejectionReason.trim()}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
