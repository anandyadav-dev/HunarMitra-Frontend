"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Wallet,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  User,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Stats summaries
  const [totalBalances, setTotalBalances] = useState(0.0);
  const [totalRevenue, setTotalRevenue] = useState(0.0);

  // Filters
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Balance Adjustment Dialog
  const [selectedWallet, setSelectedWallet] = useState<any | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustDescription, setAdjustDescription] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  useEffect(() => {
    fetchWallets();
    fetchStatsSummaries();
  }, [page]);

  const fetchWallets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.admin.getWallets({
        skip: (page - 1) * limit,
        limit,
        search: search.trim() || undefined,
      });
      setWallets(res.items);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || "Failed to load wallet registries.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatsSummaries = async () => {
    try {
      const statsData = await api.admin.getStats();
      setTotalBalances(statsData.total_balances);
      setTotalRevenue(statsData.total_revenue);
    } catch (err) {
      console.error("Failed to load aggregate financial figures", err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchWallets();
  };

  const handleOpenAdjust = (w: any) => {
    setSelectedWallet(w);
    setAdjustType("credit");
    setAdjustAmount("");
    setAdjustDescription("");
    setAdjustError(null);
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    setAdjustError(null);

    const amountVal = parseFloat(adjustAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      setAdjustError("Please specify a valid adjustment amount greater than zero.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.admin.adjustWalletBalance(
        selectedWallet.id,
        amountVal,
        adjustType,
        adjustDescription.trim() || undefined
      );
      setShowAdjustModal(false);
      
      // Refresh database records
      fetchWallets();
      fetchStatsSummaries();
    } catch (err: any) {
      setAdjustError(err.message || "Failed to submit wallet balance adjustment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Wallet Ledgers & Escrow Volume</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Monitor escrow hold balances, clear artisan payouts, and execute manual credit/debit adjustments.
        </p>
      </div>

      {/* Financial Aggregates Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Ledger holds */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total User Balances Hold</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs text-gray-400 font-bold">Rs.</span>
            <span className="text-xl font-bold text-gray-950">{totalBalances.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Combined balance of all platform wallets.</p>
        </div>

        {/* Total Clearing Volume */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Aggregate Marketplace Volume</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs text-gray-400 font-bold">Rs.</span>
            <span className="text-xl font-bold text-gray-950">{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Sum of all successfully completed service invoices.</p>
        </div>

        {/* Platform cut (escrow model) */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Gross Escrow Deposits</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs text-gray-400 font-bold">Rs.</span>
            <span className="text-xl font-bold text-gray-950">{(totalBalances + totalRevenue).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Total gross transactional funds processed.</p>
        </div>
      </div>

      {/* Filters & Registries Table */}
      <div className="space-y-4">
        
        {/* Search filter */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search wallets by customer/artisan name or phone number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-xs placeholder-gray-400 focus:border-gray-950 focus:bg-white focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Search Wallets
            </button>
          </form>
        </div>

        {/* Wallets Table */}
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
          ) : wallets.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400 font-semibold">
              No wallet profiles match your search filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500">
                <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Wallet / ID</th>
                    <th className="px-6 py-3.5">Account holder</th>
                    <th className="px-6 py-3.5">Phone</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Ledger balance</th>
                    <th className="px-6 py-3.5">Last updated</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wallets.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">#W-{w.id}</p>
                        <span className="text-[10px] text-gray-400 font-medium">User ID: #{w.user_id}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-700">{w.user?.full_name || "Unregistered"}</td>
                      <td className="px-6 py-4 font-medium text-gray-600">{w.user?.phone_number}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {w.user?.roles?.map((r: string) => (
                            <span
                              key={r}
                              className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-950">
                        Rs. {w.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-semibold">{new Date(w.last_updated).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(w)}
                          className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          Adjust Balance
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

      {/* Adjust Balance Modal */}
      {showAdjustModal && selectedWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAdjustSubmit}
            className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900">Adjust Wallet Balance</h3>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="p-1 hover:bg-gray-150 rounded-lg text-gray-400 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Wallet Info Header */}
            <div className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-1">
              <p className="font-bold text-gray-700">Account: {selectedWallet.user?.full_name}</p>
              <p className="text-gray-500">Phone: {selectedWallet.user?.phone_number}</p>
              <p className="font-semibold text-gray-800">Current Balance: Rs. {selectedWallet.balance.toLocaleString()}</p>
            </div>

            {adjustError && (
              <div className="rounded-lg bg-red-50 p-2.5 text-[11px] font-semibold text-red-700 border border-red-100 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{adjustError}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              
              {/* Type Select */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Adjustment Operation Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="radio"
                      name="adj-type"
                      checked={adjustType === "credit"}
                      onChange={() => setAdjustType("credit")}
                      className="text-gray-900 focus:ring-0"
                    />
                    <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-150">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Credit (Add Funds)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="radio"
                      name="adj-type"
                      checked={adjustType === "debit"}
                      onChange={() => setAdjustType("debit")}
                      className="text-gray-900 focus:ring-0"
                    />
                    <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-150">
                      <ArrowDownRight className="h-3.5 w-3.5" />
                      Debit (Deduct Funds)
                    </span>
                  </label>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-1.5">
                <label htmlFor="amount" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Adjustment Amount (INR)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="100.00"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              {/* Description input */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Audit description
                </label>
                <input
                  id="description"
                  type="text"
                  placeholder="e.g. Compensate customer support ticket #12"
                  value={adjustDescription}
                  onChange={(e) => setAdjustDescription(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 py-2.5 px-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? "Adjusting..." : "Apply Adjustment"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
