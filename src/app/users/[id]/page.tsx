"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useDialog } from "../../../hooks/useDialog";
import {
  UserCheck,
  UserMinus,
  Trash2,
  X,
  Calendar,
  Wallet,
  AlertCircle,
  Shield,
  HardHat,
  Building2,
  ArrowLeft,
  User as UserIcon,
  Phone
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { alert, confirm } = useDialog();

  // Role Assignment State
  const [newRoleName, setNewRoleName] = useState("");
  const [parentRoleName, setParentRoleName] = useState("");
  const [customRoleName, setCustomRoleName] = useState("");
  const [isRoleSubmitting, setIsRoleSubmitting] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [params.id]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getUser(params.id);
      setSelectedUser(data);
    } catch (err: any) {
      setError(err.message || "Failed to load user details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    const deleteAction = async () => {
      try {
        await api.admin.deleteUser(params.id);
        alert("Success", "User deleted successfully.");
        router.push("/users");
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
    if (!selectedUser) return;
    
    const roleToAssign = newRoleName === "custom" ? customRoleName.trim() : newRoleName;
    if (!roleToAssign) {
      alert("Input Required", "Please specify a role name.");
      return;
    }
    
    setIsRoleSubmitting(true);
    try {
      await api.admin.assignUserRole(
        params.id,
        roleToAssign,
        parentRoleName ? parentRoleName : undefined
      );
      
      await fetchUserDetails();
      
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
    if (!selectedUser) return;
    
    const removeAction = async () => {
      try {
        await api.admin.removeUserRole(params.id, roleName);
        await fetchUserDetails();
      } catch (err: any) {
        alert("Operation Failed", err.message || "Failed to remove role.");
      }
    };

    confirm("Remove Role", `Are you sure you want to remove the '${roleName}' role?`, removeAction);
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
        <button onClick={() => router.push("/users")} className="text-indigo-500 hover:underline">Go Back</button>
      </div>
    );
  }

  if (!selectedUser) return <div className="p-8 text-center text-gray-500 mt-20">User not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 mt-4">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="-mt-12 sm:-mt-16 h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg shrink-0 mx-auto sm:mx-0">
              <UserIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
            </div>
            
            {/* Name & Title */}
            <div className="flex-1 text-center sm:text-left pt-2 sm:pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {selectedUser.full_name || "Unknown User"}
                </h2>
                {selectedUser.is_verified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit mx-auto sm:mx-0">
                    <UserCheck className="h-4 w-4" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200 w-fit mx-auto sm:mx-0">
                    <UserMinus className="h-4 w-4" /> Unverified
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span className="font-mono">{selectedUser.phone_number}</span>
                </div>
              </div>
            </div>

            {/* Back Button & Actions */}
            <div className="absolute top-4 right-4 sm:static sm:mt-4 flex items-center gap-3 self-start">
              <button 
                onClick={() => router.push("/users")} 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all shadow-sm sm:shadow-none backdrop-blur-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Back to Users</span>
              </button>
              
              <button 
                onClick={handleDeleteUser}
                className="flex items-center justify-center p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                title="Delete User"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details & Accounts */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Wallet className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Wallet Balance</p>
              <p className="text-lg font-bold text-gray-900 mt-1">₹{selectedUser.wallet_balance || 0}</p>
            </div>
            
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {new Date(selectedUser.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Connected Profiles */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-5 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-indigo-500" />
                Connected Profiles
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Worker Profile */}
              {selectedUser.worker_profile ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <HardHat className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Worker Profile</p>
                      <p className="text-sm text-gray-500">{selectedUser.worker_profile.category || "Uncategorized"}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/workers/${selectedUser.worker_profile.id}`)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 opacity-70">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <HardHat className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">No Worker Profile</p>
                    <p className="text-xs text-gray-500">User is not registered as a worker</p>
                  </div>
                </div>
              )}

              {/* Contractor Profile */}
              {selectedUser.contractor_profile ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Contractor Profile</p>
                      <p className="text-sm text-gray-500">{selectedUser.contractor_profile.company_name || "Company details pending"}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/contractors/${selectedUser.contractor_profile.id}`)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 opacity-70">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">No Contractor Profile</p>
                    <p className="text-xs text-gray-500">User is not registered as a contractor</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Roles Management */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="border-b border-gray-200 p-5 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                Access Management
              </h3>
            </div>

            <div className="p-6 flex-1 flex flex-col space-y-8">
              
              {/* Active Roles */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Assigned Roles</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles && selectedUser.roles.length > 0 ? (
                    selectedUser.roles.map((r: any, idx: number) => {
                      const roleName = typeof r === 'string' ? r : (r?.name || '');
                      if (!roleName) return null;
                      return (
                      <div 
                        key={idx} 
                        className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 shadow-sm"
                      >
                        {roleName}
                        {roleName.toLowerCase() !== "customer" && (
                          <button
                            onClick={() => handleRemoveRole(roleName)}
                            className="p-1 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors ml-1"
                            title={`Remove ${roleName} role`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )})
                  ) : (
                    <p className="text-sm italic text-gray-400">No roles assigned.</p>
                  )}
                </div>
              </div>

              {/* Add Role Form */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Grant New Access Role</p>
                
                <form onSubmit={handleAddRole} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Role Type</label>
                    <select
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 outline-none transition-all"
                    >
                      <option value="">-- Select a predefined role --</option>
                      <option value="worker">Worker</option>
                      <option value="contractor">Contractor</option>
                      <option value="admin">Admin</option>
                      <option value="support">Support</option>
                      <option value="finance">Finance</option>
                      <option value="custom">-- Custom Role --</option>
                    </select>
                  </div>

                  {newRoleName === "custom" && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <label className="text-sm font-medium text-gray-700">Custom Role Name</label>
                      <input
                        type="text"
                        value={customRoleName}
                        onChange={(e) => setCustomRoleName(e.target.value)}
                        placeholder="e.g. super_admin"
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 outline-none transition-all"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex justify-between">
                      <span>Parent Role</span>
                      <span className="text-xs font-normal text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={parentRoleName}
                      onChange={(e) => setParentRoleName(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newRoleName || isRoleSubmitting}
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Assign Role
                  </button>
                </form>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
