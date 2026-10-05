"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useDialog } from "../../../hooks/useDialog";
import { 
  ArrowLeft, Building2, ShieldCheck, AlertCircle, FileText, 
  CheckCircle, X, MapPin, Briefcase, Star, 
  Users, Image as ImageIcon, PhoneCall
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContractorDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { alert } = useDialog();
  const [contractor, setContractor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchContractorDetails();
  }, [params.id]);

  const fetchContractorDetails = async () => {
    setIsLoading(true);
    try {
      const res = await api.admin.getContractor(params.id);
      setContractor(res);
    } catch (err: any) {
      setError(err.message || "Failed to load contractor details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyKyc = async (statusStr: "approved" | "rejected") => {
    setIsVerifying(true);
    try {
      await api.admin.verifyContractor(contractor.id, statusStr, statusStr === "rejected" ? rejectionReason : undefined);
      alert("KYC Updated", `Contractor KYC status has been updated to ${statusStr}.`);
      setShowRejectModal(false);
      fetchContractorDetails();
    } catch (err: any) {
      alert("Error", err.message || "Failed to verify KYC status.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-lg font-semibold text-gray-900">{error}</p>
        <button onClick={() => router.push("/contractors")} className="px-4 py-2 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors">Go Back</button>
      </div>
    );
  }

  if (!contractor) return <div className="p-8 text-center text-gray-500">Contractor not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/contractors")}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Contractor Profile
              {contractor.kyc_status === 'approved' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
            </h1>
            <p className="text-sm text-gray-500">Detailed view and verification controls</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Profile */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden mb-4 relative">
              <Building2 className="h-10 w-10 text-gray-400" />
              {contractor.company_logo && (
                <img src={contractor.company_logo} alt="Company Logo" className="absolute inset-0 h-full w-full object-cover" />
              )}
            </div>
            
            <h2 className="text-lg font-bold text-gray-900">{contractor.company_name || contractor.user?.full_name || "Unknown Company"}</h2>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 mt-2">
              {contractor.specialization || "General Contracting"}
            </div>

            <div className="w-full border-t border-gray-100 mt-6 pt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><PhoneCall className="h-4 w-4"/> Phone</span>
                <span className="font-medium text-gray-900">{contractor.user?.phone_number || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><MapPin className="h-4 w-4"/> Location</span>
                <span className="font-medium text-gray-900 truncate max-w-[120px]">{contractor.city ? `${contractor.city}` : 'Not Set'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><Star className="h-4 w-4"/> Rating</span>
                <span className="font-bold text-gray-900 flex items-center gap-1">{contractor.rating || "New"}</span>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-900">Business Info</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Details</span>
                <p className="text-sm text-gray-900">{contractor.company_name || "N/A"}</p>
                <p className="text-sm text-gray-900 mt-1">{contractor.registration_number ? `Reg No: ${contractor.registration_number}` : "No Reg Number"}</p>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Year Established</span>
                <p className="text-sm text-gray-900">{contractor.year_established || "Unknown"}</p>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Workers Managed</span>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600"/> {contractor.total_workers_managed || 0} Workers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: KYC */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* KYC Verification Module */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {/* Status Bar */}
            <div className={`h-1 w-full ${
              contractor.kyc_status === "approved" ? "bg-emerald-500" : 
              contractor.kyc_status === "rejected" ? "bg-red-500" : "bg-amber-400"
            }`}></div>

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  Business Verification (KYC)
                </h3>
                <p className="text-xs text-gray-500 mt-1">Review business documents provided by the contractor.</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  contractor.kyc_status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  contractor.kyc_status === "rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                  "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {contractor.kyc_status}
              </div>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GST / Tax ID */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" /> GST / Registration Number
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 inline-block w-full">
                    <span className="text-base font-mono font-bold text-gray-800 tracking-wider">
                      {contractor.registration_number || "Not Provided"}
                    </span>
                  </div>
                </div>

                {/* Company Type */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> Specialization
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 inline-block w-full">
                    <span className="text-base font-bold text-gray-800">
                      {contractor.specialization || "General"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <ImageIcon className="h-3.5 w-3.5" /> Business Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Reg Doc */}
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col items-center justify-center min-h-[160px] relative group overflow-hidden">
                    {contractor.registration_doc_url ? (
                      <>
                        <img src={contractor.registration_doc_url} alt="Doc" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={contractor.registration_doc_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white px-3 py-1.5 border border-white/30 rounded-md backdrop-blur-sm hover:bg-white/20">View Full</a>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs font-medium text-gray-500">No Document Uploaded</p>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-[10px] text-white font-semibold">Registration Doc</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {contractor.kyc_status === 'pending' && (
              <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isVerifying}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleVerifyKyc("approved")}
                  disabled={isVerifying}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="h-4 w-4" /> Approve KYC
                </button>
              </div>
            )}
            
            {contractor.kyc_status === 'rejected' && contractor.rejection_reason && (
              <div className="p-4 bg-red-50 border-t border-red-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">Rejection Reason</h4>
                  <p className="text-sm text-red-700 mt-1">{contractor.rejection_reason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Reject Verification</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-500">Please provide a reason for rejecting this contractor&apos;s KYC application.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reason for rejection</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 border"
                  rows={4}
                  placeholder="E.g. Document image is blurry..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyKyc("rejected")}
                disabled={!rejectionReason.trim() || isVerifying}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isVerifying ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
