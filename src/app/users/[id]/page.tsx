"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useDialog } from "../../../hooks/useDialog";
import { 
  ArrowLeft, User, PhoneCall, AlertCircle, Mail, MapPin, 
  Calendar, CreditCard, Activity, CheckCircle, Shield, History
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { alert } = useDialog();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [params.id]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const res = await api.admin.getUser(params.id);
      setUser(res);
    } catch (err: any) {
      setError(err.message || "Failed to load customer details.");
    } finally {
      setIsLoading(false);
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
        <button onClick={() => router.push("/users")} className="px-4 py-2 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors">Go Back</button>
      </div>
    );
  }

  if (!user) return <div className="p-8 text-center text-gray-500">Customer not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/users")}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Customer Profile
              {user.is_verified && <CheckCircle className="h-4 w-4 text-emerald-500" />}
            </h1>
            <p className="text-sm text-gray-500">Overview of customer details and call history</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Profile */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden mb-4 relative">
              <span className="text-3xl font-bold text-blue-600">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : "C"}
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900">{user.full_name || "Unknown Customer"}</h2>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 mt-2">
              Registered Customer
            </div>

            <div className="w-full border-t border-gray-100 mt-6 pt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><PhoneCall className="h-4 w-4"/> Phone</span>
                <span className="font-medium text-gray-900">{user.phone_number || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><Mail className="h-4 w-4"/> Email</span>
                <span className="font-medium text-gray-900 truncate max-w-[120px]">{user.email || "Not Provided"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="h-4 w-4"/> Joined</span>
                <span className="font-medium text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-900">Account Status</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Verification</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                  user.is_verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {user.is_verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Account Access</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                  !user.is_deleted ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                }`}>
                  {!user.is_deleted ? "Active" : "Deleted / Suspended"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Call History */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-600" /> Worker Call History
                </h3>
                <p className="text-xs text-gray-500 mt-1">Record of all workers contacted by this customer.</p>
              </div>
            </div>

            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-gray-50/30">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <PhoneCall className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-base font-bold text-gray-700">No Calls Found</h4>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                This customer has not made any calls to workers through the app yet. Call history will appear here automatically.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
