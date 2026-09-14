"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useDialog } from "../../hooks/useDialog";
import {
  Search,
  Building2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Clock,
  X,
  Briefcase,
} from "lucide-react";

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [kycStatus, setKycStatus] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Contractor
  const [selectedContractorId, setSelectedContractorId] = useState<number | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const { alert } = useDialog();

  // Rejection Dialog state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchContractors();
  }, [page, kycStatus]);

  const fetchContractors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.admin.getContractors({
        skip: (page - 1) * limit,
        limit,
        kyc_status: kycStatus || undefined,
        search: search.trim() || undefined,
      });
      setContractors(res.items);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || "Failed to load contractors.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchContractors();
  };

  const handleViewContractor = async (id: number) => {
    setSelectedContractorId(id);
    setIsDetailLoading(true);
    try {
      const data = await api.admin.getContractor(id.toString());
      setSelectedContractor(data);
    } catch (err: any) {
      alert("Error Loading Profile", err.message || "Failed to load contractor profile.");
      setSelectedContractorId(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleVerifyKyc = async (status: "approved" | "rejected") => {
    if (!selectedContractorId) return;

    if (status === "rejected" && !rejectionReason.trim()) {
      alert("Input Required", "Please provide a reason for rejecting the contractor registration.");
      return;
    }

    setIsVerifying(true);
    try {
      await api.admin.verifyContractor(selectedContractorId.toString(), status, status === "rejected" ? rejectionReason : undefined);
      setShowRejectModal(false);
      setRejectionReason("");
      
      const updated = await api.admin.getContractor(selectedContractorId.toString());
      setSelectedContractor(updated);
      fetchContractors();
    } catch (err: any) {
      alert("Verification Failed", err.message || "Failed to submit contractor KYC status.");
    } finally {
      setIsVerifying(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Contractors & Corporate Partners</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Verify registered building, civil structure, or renovation contractors. Review GSTIN, PAN, and business licenses.
        </p>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Contractors Table (2/3 width) */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* Filters Card */}
          <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company name, GST, representative..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-xs placeholder-gray-400 focus:border-gray-950 focus:bg-white focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* KYC status select */}
                <select
                  value={kycStatus}
                  onChange={(e) => { setKycStatus(e.target.value); setPage(1); }}
                  className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-700 focus:border-gray-950 focus:outline-none"
                >
                  <option value="">All KYC Statuses</option>
                  <option value="pending">Pending Verification</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* Table Card */}
          <div className="rounded-xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-150 rounded animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-xs text-red-600 font-semibold flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ) : contractors.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400 font-semibold">
                No contractor profiles match your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500">
                  <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">Company / Partner</th>
                      <th className="px-6 py-3.5">Representative</th>
                      <th className="px-6 py-3.5">GST Number</th>
                      <th className="px-6 py-3.5">PAN Card</th>
                      <th className="px-6 py-3.5">KYC Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contractors.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => handleViewContractor(c.id)}
                        className={`hover:bg-gray-50/50 cursor-pointer transition-colors ${
                          selectedContractorId === c.id ? "bg-orange-50/30" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{c.company_name || "Company Not Set"}</p>
                          <span className="text-[10px] text-gray-400">Partner ID: #{c.id}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          {c.user?.full_name || "Unregistered"} <br />
                          <span className="text-[10px] text-gray-400 font-normal">{c.user?.phone_number}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{c.gst_number || "None"}</td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{c.pan_number || "None"}</td>
                        <td className="px-6 py-4">
                          {c.kyc_status === "approved" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 ring-1 ring-inset ring-green-600/15">
                              Approved
                            </span>
                          ) : c.kyc_status === "rejected" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 ring-1 ring-inset ring-red-600/15">
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold text-yellow-700 ring-1 ring-inset ring-yellow-600/15 animate-pulse">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleViewContractor(c.id)}
                            className="p-1 text-gray-400 hover:text-gray-950 hover:bg-gray-100 rounded"
                            title="Verify Profile"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-150 px-6 py-3.5 flex items-center justify-between bg-gray-50/50">
                <span className="text-xs text-gray-500 font-semibold">
                  Showing page <span className="font-bold text-gray-900">{page}</span> of{" "}
                  <span className="font-bold text-gray-900">{totalPages}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contractor Details Panel (1/3 width) */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm min-h-[400px]">
          {!selectedContractorId ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="rounded-full bg-gray-50 p-3 text-gray-400">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xs font-bold text-gray-900 uppercase tracking-wider">No Contractor Selected</h3>
              <p className="mt-1 text-xs text-gray-400 max-w-[200px] leading-relaxed">
                Click a contractor row in the table to display their verification checks and GST/Licensing documents.
              </p>
            </div>
          ) : isDetailLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded" />
              </div>
              <div className="h-40 bg-gray-100 rounded" />
            </div>
          ) : selectedContractor ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedContractor.company_name || "Company Not Set"}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Representative: {selectedContractor.user?.full_name}</p>
                </div>
                <button
                  onClick={() => { setSelectedContractor(null); setSelectedContractorId(null); }}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Representative Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-gray-400" />
                  Representative Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div>
                    <p className="text-gray-400 font-medium">Rep Name</p>
                    <p className="font-bold text-gray-900">{selectedContractor.user?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Rep Phone</p>
                    <p className="font-bold text-gray-900">{selectedContractor.user?.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Verified State</p>
                    <p className="font-bold text-gray-900">{selectedContractor.user?.is_verified ? "Verified User" : "Unverified User"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Joined Date</p>
                    <p className="font-bold text-gray-900">{new Date(selectedContractor.user?.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  Company Specs
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div>
                    <p className="text-gray-400 font-medium">City Location</p>
                    <p className="font-bold text-gray-900">{selectedContractor.city || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Experience</p>
                    <p className="font-bold text-gray-900">{selectedContractor.experience_years ? `${selectedContractor.experience_years} Years` : 'Not specified'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 font-medium mb-1">Work Types</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedContractor.work_types?.length ? (
                        selectedContractor.work_types.map((type: string) => (
                          <span key={type} className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded">{type}</span>
                        ))
                      ) : <span className="text-gray-500">None selected</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* KYC Document Checklist */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-gray-400" />
                  Company Credentials KYC Check
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="text-gray-400 font-medium">GSTIN</span>
                    <span className="font-bold text-gray-800">{selectedContractor.gst_number || "Not Provided"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="text-gray-400 font-medium">PAN Card Number</span>
                    <span className="font-bold text-gray-800">{selectedContractor.pan_number || "Not Provided"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="text-gray-400 font-medium">KYC verification status</span>
                    <span className={`font-bold uppercase tracking-wider text-[10px] ${
                      selectedContractor.kyc_status === "approved"
                        ? "text-green-600"
                        : selectedContractor.kyc_status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}>
                      {selectedContractor.kyc_status}
                    </span>
                  </div>
                  {selectedContractor.rejection_reason && (
                    <div className="p-2.5 rounded bg-red-50 text-red-700 text-[11px] font-semibold border border-red-100 flex items-start gap-1">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      <div>
                        <p className="font-bold">Rejection Reason:</p>
                        <p className="mt-0.5 font-normal">{selectedContractor.rejection_reason}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Uploaded Documents Grid */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Document Scans</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Logo/Pic */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 text-center p-2">
                      <p className="text-[10px] font-bold text-gray-500 mb-1">Company logo</p>
                      {selectedContractor.profile_picture ? (
                        <div className="h-28 w-full relative flex items-center justify-center overflow-hidden rounded bg-black/5">
                          <img
                            src={selectedContractor.profile_picture}
                            alt="Logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-28 flex items-center justify-center text-gray-400 text-[10px]">No Photo</div>
                      )}
                    </div>
                    {/* Business License */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 text-center p-2">
                      <p className="text-[10px] font-bold text-gray-500 mb-1">Business License</p>
                      {selectedContractor.business_license ? (
                        <div className="h-28 w-full relative flex items-center justify-center overflow-hidden rounded bg-black/5">
                          <img
                            src={selectedContractor.business_license}
                            alt="License"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-28 flex items-center justify-center text-gray-400 text-[10px]">No Scan</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* KYC Approval Action Buttons */}
                {selectedContractor.kyc_status === "pending" && (
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => handleVerifyKyc("approved")}
                      disabled={isVerifying}
                      className="flex-1 rounded-lg bg-green-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-green-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve KYC
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={isVerifying}
                      className="flex-1 rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject KYC
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </div>

      </div>

      {/* Rejection Modal overlay dialog */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900">Reject Corporate KYC</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 hover:bg-gray-150 rounded-lg text-gray-400 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="reason" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Reason for Rejection
              </label>
              <textarea
                id="reason"
                rows={3}
                placeholder="e.g. Invalid GSTIN registration, business license expired."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
              />
              <p className="text-[10px] text-gray-400 leading-normal">
                Feedback reason will be sent to the contractor profile updates panel.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifyKyc("rejected")}
                disabled={isVerifying}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
              >
                {isVerifying ? "Rejecting..." : "Submit Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
