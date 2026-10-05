"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useDialog } from "../../hooks/useDialog";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import StatusConfirmationModal from "../../components/StatusConfirmationModal";
import {
  Search,
  Filter,
  UserCheck,
  UserMinus,
  Trash2,
  Eye,
  X,
  Calendar,
  Wallet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Building2,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isVerified, setIsVerified] = useState<string>("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected User Detail Pane
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [itemToChangeStatus, setItemToChangeStatus] = useState<any>(null);
  const [pendingStatus, setPendingStatus] = useState<"suspend" | "activate">("suspend");
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const { alert, confirm } = useDialog();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, [page, role, isVerified]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const verifiedParam = isVerified === "verified" ? true : isVerified === "unverified" ? false : undefined;
      const res = await api.admin.getUsers({
        skip: (page - 1) * limit,
        limit,
        role: role || undefined,
        search: search.trim() || undefined,
        is_verified: verifiedParam,
      });
      setUsers(res.items);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve user list.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDeleteClick = (e: React.MouseEvent, user: any) => {
    e.stopPropagation();
    setItemToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.admin.deleteUser(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchUsers();
    } catch (err: any) {
      alert("Error", err.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewUser = async (id: number) => {
    router.push(`/users/${id}`);
  };

  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>, user: any) => {
    e.stopPropagation();
    const val = e.target.value;
    
    setItemToChangeStatus(user);
    setPendingStatus(val === "active" ? "activate" : "suspend");
    setStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!itemToChangeStatus) return;
    setIsChangingStatus(true);
    try {
      await api.admin.updateUserStatus(itemToChangeStatus.id, pendingStatus === "activate");
      setStatusModalOpen(false);
      setItemToChangeStatus(null);
      fetchUsers();
    } catch (err: any) {
      alert("Error", err.message || "Failed to update account status");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent, user: any) => {
    e.stopPropagation();
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Customers Registry</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Oversee platform accounts, view booking history, and adjust wallet balances.
        </p>
      </div>

      {/* Main Container Split */}
      <div className="w-full">
        
        {/* Table & Controls Area */}
        <div className="w-full space-y-4">
          
          {/* Filters Bar */}
          <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-xs placeholder-gray-400 focus:border-gray-950 focus:bg-white focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Role select */}
                <select
                  value={role}
                  onChange={(e) => { setRole(e.target.value); setPage(1); }}
                  className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-700 focus:border-gray-950 focus:outline-none"
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="worker">Worker / Artisan</option>
                  <option value="contractor">Contractor</option>
                  <option value="admin">Administrator</option>
                </select>

                {/* Verification select */}
                <select
                  value={isVerified}
                  onChange={(e) => { setIsVerified(e.target.value); setPage(1); }}
                  className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-700 focus:border-gray-950 focus:outline-none"
                >
                  <option value="all">All Verification Statuses</option>
                  <option value="verified">Verified Accounts</option>
                  <option value="unverified">Unverified Accounts</option>
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

          {/* Customers Table */}
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
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400 font-semibold">
                No user accounts match your search queries.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500">
                  <thead className="bg-gray-50 dark:bg-[#1a2536] text-[10px] text-gray-500 dark:text-[#94A3B8] uppercase font-bold border-b border-gray-100 dark:border-[#ffffff]/5">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Contact</th>
                      <th className="px-6 py-3.5">Roles</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Account</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className={`hover:bg-gray-50/50 cursor-pointer transition-colors ${
                          selectedUserId === u.id ? "bg-orange-50/30" : ""
                        }`}
                        onClick={() => router.push(`/users/${u.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                              {(u.full_name || "U")[0].toUpperCase()}
                            </div>
                            <p className="font-bold text-gray-900 truncate max-w-[150px]" title={u.full_name || "Unregistered"}>{u.full_name || "Unregistered"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap">
                          {u.phone_number}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {u.roles.map((r: string) => {
                              const isAdmin = r.toLowerCase() === "admin";
                              const isWorker = r.toLowerCase() === "worker" || r.toLowerCase() !== "customer";
                              return (
                                <span
                                  key={r}
                                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    isAdmin
                                      ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/15"
                                      : r === "customer"
                                      ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15"
                                      : "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/15"
                                  }`}
                                >
                                  {r}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {u.is_verified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 ring-1 ring-inset ring-green-600/15">
                              <span className="h-1 w-1 rounded-full bg-green-500" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-500 ring-1 ring-inset ring-gray-200">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={u.is_active ? "active" : "suspended"}
                            onChange={(e) => handleStatusSelect(e, u)}
                            onClick={(e) => e.stopPropagation()}
                            className={`px-2 py-1.5 text-xs font-semibold rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors cursor-pointer ${
                              u.is_active
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 focus:ring-emerald-500"
                                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30 focus:ring-red-500"
                            }`}
                          >
                            <option value="active" className="font-semibold text-emerald-700 dark:text-emerald-400 dark:bg-gray-800">Active</option>
                            <option value="suspended" className="font-semibold text-red-700 dark:text-red-400 dark:bg-gray-800">Suspended</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/users/${u.id}`);
                              }}
                              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, u)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
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

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete User"
        description={`Are you sure you want to soft delete the user "${itemToDelete?.full_name || 'Unregistered'}"? All related data (wallet, worker profile, contractor profile) will also be soft-deleted.`}
      />

      <StatusConfirmationModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={confirmStatusChange}
        isProcessing={isChangingStatus}
        actionType={pendingStatus}
        title={pendingStatus === "suspend" ? "Suspend Account" : "Activate Account"}
        description={
          pendingStatus === "suspend" 
            ? "Are you sure you want to suspend this customer's account? They will lose access to the platform until reactivated."
            : "Are you sure you want to reactivate this customer's account? They will regain access to the platform."
        }
      />
    </div>
  );
}

