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
import { useRouter } from "next/navigation";

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

  const { alert } = useDialog();
  const router = useRouter();

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
    router.push(`/contractors/${id}`);
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
      <div className="w-full">
        
        {/* Contractors Table */}
        <div className="w-full space-y-4">
          
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
                  <thead className="bg-gray-50 dark:bg-[#1a2536] text-[10px] text-gray-500 dark:text-[#94A3B8] uppercase font-bold border-b border-gray-100 dark:border-[#ffffff]/5">
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
                          <p className="font-bold text-gray-900 truncate max-w-[150px]" title={c.company_name || "Company Not Set"}>{c.company_name || "Company Not Set"}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          <div className="truncate max-w-[150px]" title={c.user?.full_name || "Unregistered"}>{c.user?.full_name || "Unregistered"}</div>
                          <span className="text-[10px] text-gray-400 font-normal whitespace-nowrap">{c.user?.phone_number}</span>
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
      </div>
    </div>
  );
}

