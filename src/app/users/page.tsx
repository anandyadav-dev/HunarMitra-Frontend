"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useDialog } from "../../hooks/useDialog";
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
  Shield,
  HardHat,
  Building2,
} from "lucide-react";

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
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const { alert, confirm } = useDialog();

  // Role Assignment State
  const [newRoleName, setNewRoleName] = useState("");
  const [parentRoleName, setParentRoleName] = useState("");
  const [customRoleName, setCustomRoleName] = useState("");
  const [isRoleSubmitting, setIsRoleSubmitting] = useState(false);

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

  const handleViewUser = async (id: number) => {
    setSelectedUserId(id);
    setIsDetailLoading(true);
    try {
      const data = await api.admin.getUser(id);
      setSelectedUser(data);
    } catch (err: any) {
      alert("Error Loading Profile", err.message || "Failed to load user details.");
      setSelectedUserId(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const deleteAction = async () => {
      try {
        await api.admin.deleteUser(id);
        if (selectedUserId === id) {
          setSelectedUser(null);
          setSelectedUserId(null);
        }
        fetchUsers();
      } catch (err: any) {
        alert("Operation Failed", err.message || "Failed to delete user.");
      }
    };
    
    confirm(
      "Confirm Deletion",
      "Are you sure you want to delete this user? This will also remove any associated profiles and wallets. This action is permanent!",
      deleteAction
    );
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedUser) return;
    
    const roleToAssign = newRoleName === "custom" ? customRoleName.trim() : newRoleName;
    if (!roleToAssign) {
      alert("Input Required", "Please specify a role name.");
      return;
    }
    
    setIsRoleSubmitting(true);
    try {
      await api.admin.assignUserRole(
        selectedUserId,
        roleToAssign,
        parentRoleName ? parentRoleName : undefined
      );
      
      const updated = await api.admin.getUser(selectedUserId);
      setSelectedUser(updated);
      fetchUsers();
      
      setNewRoleName("");
      setCustomRoleName("");
      setParentRoleName("");
    } catch (err: any) {
      alert("Operation Failed", err.message || "Failed to assign role.");
    } finally {
      setIsRoleSubmitting(false);
    }
  };

  const handleRemoveRole = async (roleName: string) => {
    if (!selectedUserId || !selectedUser) return;
    if (selectedUser.roles.length <= 1) {
      alert("Validation Error", "A user must have at least one role assigned.");
      return;
    }
    
    const removeAction = async () => {
      try {
        await api.admin.removeUserRole(selectedUserId, roleName);
        
        const updated = await api.admin.getUser(selectedUserId);
        setSelectedUser(updated);
        fetchUsers();
      } catch (err: any) {
        alert("Operation Failed", err.message || "Failed to remove role.");
      }
    };

    confirm(
      "Confirm Role Removal",
      `Are you sure you want to remove the role '${roleName}' from this user?`,
      removeAction
    );
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Users Registry</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Oversee platform accounts, view booking history, and adjust wallet balances.
        </p>
      </div>

      {/* Main Container Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Table & Controls Area (2/3 width on xl screens) */}
        <div className="xl:col-span-2 space-y-4">
          
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

          {/* Users Table */}
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
                  <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Contact</th>
                      <th className="px-6 py-3.5">Roles</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Wallet</th>
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
                        onClick={() => handleViewUser(u.id)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 truncate max-w-[150px]" title={u.full_name || "Unregistered"}>{u.full_name || "Unregistered"}</p>
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
                        <td className="px-6 py-4 font-bold text-gray-900">
                          Rs. {u.wallet_balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewUser(u.id)}
                              className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete Account"
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

        {/* User Profile Detail Panel (1/3 width on xl screens) */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm min-h-[400px]">
          {!selectedUserId ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="rounded-full bg-gray-50 p-3 text-gray-400">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xs font-bold text-gray-900 uppercase tracking-wider">No User Selected</h3>
              <p className="mt-1 text-xs text-gray-400 max-w-[200px] leading-relaxed">
                Click a user row in the table to display complete profile bookings and wallets ledger.
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
              <div className="h-20 bg-gray-100 rounded" />
              <div className="h-40 bg-gray-100 rounded" />
            </div>
          ) : selectedUser ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedUser.full_name || "Unregistered"}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    Phone: {selectedUser.phone_number} 
                    {selectedUser.city && ` | City: ${selectedUser.city}`}
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedUser(null); setSelectedUserId(null); }}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Roles Section */}
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700 uppercase tracking-wider text-[10px]">
                  <span>Roles assigned</span>
                  <span className="text-gray-400 font-medium lowercase">joined: {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                </div>
                
                {/* Active roles list */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.roles.map((r: string) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-700"
                    >
                      {r}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(r)}
                        className="ml-0.5 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-red-650 transition-colors"
                        title={`Remove ${r} role`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Role Inline Form */}
                <form onSubmit={handleAddRole} className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-2.5 space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Assign New Role</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {/* Role Select */}
                    <div>
                      <select
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="w-full rounded border border-gray-200 py-1.5 px-2 bg-white focus:outline-none text-gray-900"
                      >
                        <option value="">-- select role --</option>
                        <option value="customer">customer</option>
                        <option value="worker">worker</option>
                        <option value="contractor">contractor</option>
                        <option value="admin">admin</option>
                        <option value="plumber">plumber</option>
                        <option value="electrician">electrician</option>
                        <option value="carpenter">carpenter</option>
                        <option value="mason">mason</option>
                        <option value="custom">Custom Role...</option>
                      </select>
                    </div>

                    {/* Parent Role Select */}
                    <div>
                      <select
                        value={parentRoleName}
                        onChange={(e) => setParentRoleName(e.target.value)}
                        className="w-full rounded border border-gray-200 py-1.5 px-2 bg-white focus:outline-none text-gray-900"
                      >
                        <option value="">No Parent</option>
                        <option value="worker">Parent: worker</option>
                        <option value="contractor">Parent: contractor</option>
                        <option value="customer">Parent: customer</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Role Input (if selected) */}
                  {newRoleName === "custom" && (
                    <div className="text-[10px]">
                      <input
                        type="text"
                        placeholder="Type custom role name..."
                        value={customRoleName}
                        onChange={(e) => setCustomRoleName(e.target.value)}
                        className="w-full rounded border border-gray-200 py-1.5 px-2 bg-white focus:outline-none text-gray-900"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isRoleSubmitting || !newRoleName}
                      className="rounded bg-gray-900 px-3 py-1.5 text-[9px] font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isRoleSubmitting ? "Assigning..." : "Assign Role"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Wallet Segment */}
              <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-gray-500" />
                    Wallet Balance
                  </span>
                  <span className="text-gray-900 text-sm">
                    Rs. {selectedUser.wallet.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-[9px] text-gray-400 text-right">
                  Last updated: {selectedUser.wallet.last_updated ? new Date(selectedUser.wallet.last_updated).toLocaleString() : "Never"}
                </div>
              </div>

              {/* Worker Profile Detail if Available */}
              {selectedUser.worker_profile && (
                <div className="border border-gray-100 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                    <HardHat className="h-4 w-4 text-orange-600" />
                    Artisan Profile Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="font-semibold text-gray-700">{selectedUser.worker_profile.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Hourly Rate</p>
                      <p className="font-semibold text-gray-700">Rs. {selectedUser.worker_profile.pricing_per_hour}/hr</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Experience</p>
                      <p className="font-semibold text-gray-700">{selectedUser.worker_profile.experience_years} Years</p>
                    </div>
                    <div>
                      <p className="text-gray-400">KYC Status</p>
                      <p className={`font-bold uppercase tracking-wider text-[10px] ${
                        selectedUser.worker_profile.kyc_status === "approved" ? "text-green-600" : "text-yellow-600"
                      }`}>{selectedUser.worker_profile.kyc_status}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Availability</p>
                      <p className="font-semibold text-gray-700 capitalize">
                        {selectedUser.worker_profile.availability_status?.replace('_', ' ') || 'Offline'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">City Location</p>
                      <p className="font-semibold text-gray-700">{selectedUser.worker_profile.city || 'N/A'}</p>
                    </div>
                  </div>
                  {selectedUser.worker_profile.bio && (
                    <div className="text-xs border-t border-gray-50 pt-2 text-gray-500 italic">
                      &quot;{selectedUser.worker_profile.bio}&quot;
                    </div>
                  )}
                </div>
              )}

              {/* Contractor Profile Detail if Available */}
              {selectedUser.contractor_profile && (
                <div className="border border-gray-100 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Contractor Profile Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400">Company</p>
                      <p className="font-semibold text-gray-700">{selectedUser.contractor_profile.company_name || "Not Specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">GSTIN</p>
                      <p className="font-semibold text-gray-700">{selectedUser.contractor_profile.gst_number || "None"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">PAN Card</p>
                      <p className="font-semibold text-gray-700">{selectedUser.contractor_profile.pan_number || "None"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">KYC Status</p>
                      <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">{selectedUser.contractor_profile.kyc_status}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">City</p>
                      <p className="font-semibold text-gray-700">{selectedUser.contractor_profile.city || "Not Set"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Experience</p>
                      <p className="font-semibold text-gray-700">{selectedUser.contractor_profile.experience_years ? `${selectedUser.contractor_profile.experience_years} Years` : "None"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking logs list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Booking History Logs ({selectedUser.bookings_history.length})
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-3">
                  {selectedUser.bookings_history.map((b: any) => (
                    <div key={b.id} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-gray-800">#{b.id} - {b.service}</p>
                        <span className="text-[10px] text-gray-400">{b.booking_date}</span>
                      </div>
                      <div className="text-right">
                        {b.total_amount !== null && (
                          <p className="font-bold text-gray-900">Rs. {b.total_amount}</p>
                        )}
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          b.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : b.status === "cancelled"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-800"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedUser.bookings_history.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-400 font-medium">
                      No bookings logs found for this customer.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
