"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useDialog } from "../../hooks/useDialog";
import {
  Search,
  HardHat,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  FileText,
  Clock,
  MapPin,
  X,
} from "lucide-react";

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [kycStatus, setKycStatus] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Worker
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const { alert } = useDialog();

  // Rejection Dialog state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const categories = [
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "Mason",
    "Welder",
    "Mechanic",
    "Gardener",
    "Cleaning",
    "Laborer",
    "Barber",
    "Beautician",
    "Driver",
    "Tailor",
    "Cook",
  ];

  useEffect(() => {
    fetchWorkers();
  }, [page, category, kycStatus]);

  const fetchWorkers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.admin.getWorkers({
        skip: (page - 1) * limit,
        limit,
        kyc_status: kycStatus || undefined,
        category: category || undefined,
        search: search.trim() || undefined,
      });
      setWorkers(res.items);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || "Failed to load workers.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchWorkers();
  };

  const handleViewWorker = async (id: number) => {
    setSelectedWorkerId(id);
    setIsDetailLoading(true);
    try {
      const data = await api.admin.getWorker(id);
      setSelectedWorker(data);
    } catch (err: any) {
      alert("Error Loading Profile", err.message || "Failed to load worker profile.");
      setSelectedWorkerId(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleVerifyKyc = async (status: "approved" | "rejected") => {
    if (!selectedWorkerId) return;

    if (status === "rejected" && !rejectionReason.trim()) {
      alert("Input Required", "Please provide a reason for rejecting the KYC documents.");
      return;
    }

    setIsVerifying(true);
    try {
      await api.admin.verifyWorker(selectedWorkerId, status, status === "rejected" ? rejectionReason : undefined);
      setShowRejectModal(false);
      setRejectionReason("");
      
      const updated = await api.admin.getWorker(selectedWorkerId);
      setSelectedWorker(updated);
      fetchWorkers();
    } catch (err: any) {
      alert("Verification Failed", err.message || "Failed to submit KYC verification status.");
    } finally {
      setIsVerifying(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  // Format Aadhaar number with hyphens (e.g. 1234-5678-9012)
  const formatAadhaar = (aadhaar?: string) => {
    if (!aadhaar) return "Not Provided";
    const cleaned = aadhaar.replace(/\s+/g, "");
    if (cleaned.length === 12) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
    }
    return aadhaar;
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Artisans Verification & KYC</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Review worker specialties, onboarding documents, and approve or reject Aadhaar KYC verifications.
        </p>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Workers Table (2/3 width) */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* Filters Card */}
          <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by worker name, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-xs placeholder-gray-400 focus:border-gray-950 focus:bg-white focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category select */}
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-700 focus:border-gray-950 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

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
            ) : workers.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400 font-semibold">
                No worker profiles match your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500">
                  <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">Worker / ID</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Experience</th>
                      <th className="px-6 py-3.5">Hourly Rate</th>
                      <th className="px-6 py-3.5">Rating</th>
                      <th className="px-6 py-3.5">KYC Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {workers.map((w) => (
                      <tr
                        key={w.id}
                        onClick={() => handleViewWorker(w.id)}
                        className={`hover:bg-gray-50/50 cursor-pointer transition-colors ${
                          selectedWorkerId === w.id ? "bg-orange-50/30" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{w.user?.full_name || "Unregistered"}</p>
                          <span className="text-[10px] text-gray-400">ID: #{w.id} • Phone: {w.user?.phone_number}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{w.category}</td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{w.experience_years} Years</td>
                        <td className="px-6 py-4 font-bold text-gray-900">Rs. {w.pricing_per_hour}/hr</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {w.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {w.kyc_status === "approved" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 ring-1 ring-inset ring-green-600/15">
                              Approved
                            </span>
                          ) : w.kyc_status === "rejected" ? (
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
                            onClick={() => handleViewWorker(w.id)}
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

        {/* Worker Details Panel (1/3 width) */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm min-h-[400px]">
          {!selectedWorkerId ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="rounded-full bg-gray-50 p-3 text-gray-400">
                <HardHat className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xs font-bold text-gray-900 uppercase tracking-wider">No Worker Selected</h3>
              <p className="mt-1 text-xs text-gray-400 max-w-[200px] leading-relaxed">
                Click a worker in the table to display their verification checks and KYC document photos.
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
          ) : selectedWorker ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedWorker.user?.full_name || "Unregistered"}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Category: {selectedWorker.category}</p>
                </div>
                <button
                  onClick={() => { setSelectedWorker(null); setSelectedWorkerId(null); }}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Onboarding details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-gray-400" />
                  Onboarding Specs
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div>
                    <p className="text-gray-400 font-medium">Pricing Rate</p>
                    <p className="font-bold text-gray-900">Rs. {selectedWorker.pricing_per_hour}/hr</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Experience</p>
                    <p className="font-bold text-gray-900">{selectedWorker.experience_years} Years</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Availability</p>
                    <p className="font-bold text-gray-900 capitalize">{selectedWorker.availability_status?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Jobs completed</p>
                    <p className="font-bold text-gray-900">{selectedWorker.total_jobs_done} Jobs</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Location</p>
                    <p className="font-bold text-gray-900">{selectedWorker.city ? `${selectedWorker.area_mohalla || ''}, ${selectedWorker.city}` : 'Not Set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Work Radius</p>
                    <p className="font-bold text-gray-900">{selectedWorker.working_radius_km ? `${selectedWorker.working_radius_km} km` : 'N/A'}</p>
                  </div>
                </div>
                {/* Skills & Languages */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div>
                    <p className="text-gray-400 font-medium mb-1">Additional Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedWorker.additional_skills?.length ? (
                        selectedWorker.additional_skills.map((skill: string) => (
                          <span key={skill} className="bg-orange-100 text-orange-800 text-[10px] px-1.5 py-0.5 rounded">{skill}</span>
                        ))
                      ) : <span className="text-gray-500">None</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium mb-1">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedWorker.languages?.length ? (
                        selectedWorker.languages.map((lang: string) => (
                          <span key={lang} className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded">{lang}</span>
                        ))
                      ) : <span className="text-gray-500">None</span>}
                    </div>
                  </div>
                </div>
                {selectedWorker.bio && (
                  <p className="text-xs italic text-gray-500 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                    &quot;{selectedWorker.bio}&quot;
                  </p>
                )}
              </div>

              {/* KYC Document Checklist */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-gray-400" />
                  Aadhaar KYC Verification
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="text-gray-400 font-medium">Aadhaar Number</span>
                    <span className="font-bold text-gray-800">{formatAadhaar(selectedWorker.aadhaar_number)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="text-gray-400 font-medium">KYC verification status</span>
                    <span className={`font-bold uppercase tracking-wider text-[10px] ${
                      selectedWorker.kyc_status === "approved"
                        ? "text-green-600"
                        : selectedWorker.kyc_status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}>
                      {selectedWorker.kyc_status}
                    </span>
                  </div>
                  {selectedWorker.rejection_reason && (
                    <div className="p-2.5 rounded bg-red-50 text-red-700 text-[11px] font-semibold border border-red-100 flex items-start gap-1">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      <div>
                        <p className="font-bold">Rejection Reason:</p>
                        <p className="mt-0.5 font-normal">{selectedWorker.rejection_reason}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Uploaded Documents Grid */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Document Photos</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Selfie */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 text-center p-2">
                      <p className="text-[10px] font-bold text-gray-500 mb-1">Selfie Photo</p>
                      {selectedWorker.profile_picture ? (
                        <div className="h-28 w-full relative flex items-center justify-center overflow-hidden rounded bg-black/5">
                          <img
                            src={selectedWorker.profile_picture}
                            alt="Selfie"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-28 flex items-center justify-center text-gray-400 text-[10px]">No Photo</div>
                      )}
                    </div>
                    {/* Aadhaar Front */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 text-center p-2">
                      <p className="text-[10px] font-bold text-gray-500 mb-1">Aadhaar Front</p>
                      {selectedWorker.aadhaar_image_front ? (
                        <div className="h-28 w-full relative flex items-center justify-center overflow-hidden rounded bg-black/5">
                          <img
                            src={selectedWorker.aadhaar_image_front}
                            alt="Aadhaar Front"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-28 flex items-center justify-center text-gray-400 text-[10px]">No Photo</div>
                      )}
                    </div>
                  </div>
                  {/* Aadhaar Back */}
                  {selectedWorker.aadhaar_image_back && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 text-center p-2">
                      <p className="text-[10px] font-bold text-gray-500 mb-1">Aadhaar Card Back</p>
                      <div className="h-28 w-full relative flex items-center justify-center overflow-hidden rounded bg-black/5">
                        <img
                          src={selectedWorker.aadhaar_image_back}
                          alt="Aadhaar Back"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* KYC Approval Action Buttons */}
                {selectedWorker.kyc_status === "pending" && (
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

              {/* Booking History logs */}
              {selectedWorker.bookings_history && (
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Marketplace Jobs history ({selectedWorker.bookings_history.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-3">
                    {selectedWorker.bookings_history.map((b: any) => (
                      <div key={b.id} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-gray-800">#{b.id} - {b.customer_name}</p>
                          <span className="text-[10px] text-gray-400">{b.booking_date}</span>
                        </div>
                        <div className="text-right">
                          {b.total_amount !== null && (
                            <p className="font-bold text-gray-900">Rs. {b.total_amount}</p>
                          )}
                          <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">{b.status}</span>
                        </div>
                      </div>
                    ))}
                    {selectedWorker.bookings_history.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-400 font-medium">
                        No previous jobs logged for this worker.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : null}
        </div>

      </div>

      {/* Rejection Modal overlay dialog */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900">Reject KYC verification</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 hover:bg-gray-150 rounded-lg text-gray-400 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="reason" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Specify Reason for Rejection
              </label>
              <textarea
                id="reason"
                rows={3}
                placeholder="e.g. Aadhaar image too blurry or photo mismatch."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
              />
              <p className="text-[10px] text-gray-400 leading-normal">
                This message will be shown directly to the artisan in their mobile app to resubmit document details.
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
