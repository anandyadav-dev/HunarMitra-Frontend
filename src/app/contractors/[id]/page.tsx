"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useDialog } from "../../../hooks/useDialog";
import {
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  FileText,
  Briefcase,
  ArrowLeft,
  Image as ImageIcon,
  IndianRupee,
  MapPin,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContractorDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedContractor, setSelectedContractor] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { alert } = useDialog();

  // Rejection Dialog state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchContractorDetails();
  }, [params.id]);

  const fetchContractorDetails = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getContractor(params.id);
      setSelectedContractor(data);
    } catch (err: any) {
      setError(err.message || "Failed to load contractor profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyKyc = async (status: "approved" | "rejected") => {
    if (status === "rejected" && !rejectionReason.trim()) {
      alert("Input Required", "Please provide a reason for rejecting the contractor registration.");
      return;
    }

    setIsVerifying(true);
    try {
      await api.admin.verifyContractor(params.id, status, status === "rejected" ? rejectionReason : undefined);
      setShowRejectModal(false);
      setRejectionReason("");
      
      await fetchContractorDetails();
      
      alert("Verification Success", `Contractor KYC status updated to ${status}.`);
    } catch (err: any) {
      alert("Verification Failed", err.message || "Failed to submit contractor KYC status.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-xl font-semibold text-gray-900">{error}</p>
        <button onClick={() => router.push("/contractors")} className="text-emerald-500 hover:underline">Go Back</button>
      </div>
    );
  }

  if (!selectedContractor) return <div className="p-8 text-center text-gray-500 mt-20">Contractor not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 mt-4">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm">
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500"></div>
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar / Logo */}
            <div className="-mt-12 sm:-mt-16 h-24 w-24 sm:h-32 sm:w-32 rounded-2xl border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg shrink-0 mx-auto sm:mx-0">
              {selectedContractor.profile_picture ? (
                <img src={selectedContractor.profile_picture} alt={selectedContractor.company_name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-10 w-10 sm:h-14 sm:w-14 text-gray-400" />
              )}
            </div>
            
            {/* Name & Title */}
            <div className="flex-1 text-center sm:text-left pt-2 sm:pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {selectedContractor.company_name || "Company Not Set"}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit mx-auto sm:mx-0">
                  Registered Contractor
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Rep: <span className="font-semibold text-gray-700">{selectedContractor.user?.full_name}</span></span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => router.push("/contractors")} 
              className="absolute top-4 right-4 sm:static sm:mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all shadow-sm sm:shadow-none backdrop-blur-md self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Back to Contractors</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details & Stats */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{selectedContractor.experience_years || 0} Years</p>
            </div>
            
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Representative Phone</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{selectedContractor.user?.phone_number}</p>
            </div>
          </div>

          {/* Business Details */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-5 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" />
                Business Profile
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">GST Number</h4>
                  {selectedContractor.gst_number ? (
                    <p className="text-lg font-mono font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 inline-block">
                      {selectedContractor.gst_number}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">Not Provided</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">PAN Number</h4>
                  {selectedContractor.pan_number ? (
                    <p className="text-lg font-mono font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 inline-block">
                      {selectedContractor.pan_number}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">Not Provided</p>
                  )}
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
                <Building2 className="h-5 w-5 text-emerald-500" />
                Business KYC Verification
              </h3>
              
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedContractor.kyc_status === "approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : selectedContractor.kyc_status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {selectedContractor.kyc_status}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col space-y-6">
              
              {selectedContractor.rejection_reason && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-800">Rejection Reason</p>
                    <p className="mt-1 text-sm text-red-700 leading-relaxed">{selectedContractor.rejection_reason}</p>
                  </div>
                </div>
              )}

              {/* Document Images */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Business Documents</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Business License */}
                  <div className="group relative rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden aspect-square flex flex-col items-center justify-center transition-colors">
                    {selectedContractor.business_license ? (
                      <>
                        <img src={selectedContractor.business_license} alt="Business License" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-medium text-sm">View Document</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <FileText className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium text-center px-2">No License<br/>Uploaded</span>
                      </div>
                    )}
                    {!selectedContractor.business_license && <span className="absolute bottom-2 left-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">License</span>}
                  </div>

                  {/* Company Logo/Profile Photo */}
                  <div className="group relative rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden aspect-square flex flex-col items-center justify-center transition-colors">
                    {selectedContractor.profile_picture ? (
                      <>
                        <img src={selectedContractor.profile_picture} alt="Company Logo" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-medium text-sm">View Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium text-center px-2">No Company<br/>Logo</span>
                      </div>
                    )}
                    {!selectedContractor.profile_picture && <span className="absolute bottom-2 left-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logo</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedContractor.kyc_status === "pending" && (
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
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
              />
              <p className="text-xs text-gray-500">This reason will be visible to the contractor in their app.</p>
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
