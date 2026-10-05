"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useDialog } from "../../hooks/useDialog";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import RestoreConfirmationModal from "../../components/RestoreConfirmationModal";
import { Trash2, AlertCircle, Eye, Users, HardHat, Building2, Search, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState<"users" | "workers" | "contractors">("users");
  
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Restore Modal State
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [itemToRestore, setItemToRestore] = useState<any>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const { alert } = useDialog();
  const router = useRouter();

  useEffect(() => {
    fetchDeletedItems();
  }, [activeTab, page]);

  const fetchDeletedItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "users") {
        const res = await api.admin.getUsers({ skip: (page - 1) * limit, limit, is_deleted: true });
        setItems(res.items);
        setTotal(res.total);
      } else if (activeTab === "workers") {
        const res = await api.admin.getWorkers({ skip: (page - 1) * limit, limit, is_deleted: true });
        setItems(res.items || []);
        setTotal(res.total || 0);
      } else if (activeTab === "contractors") {
        const res = await api.admin.getContractors({ skip: (page - 1) * limit, limit, is_deleted: true });
        setItems(res.items || []);
        setTotal(res.total || 0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load deleted items.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmPermanentDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (activeTab === "users") {
        await api.admin.deleteUserPermanent(itemToDelete.id);
      } else if (activeTab === "workers") {
        await api.admin.deleteWorkerPermanent(itemToDelete.id);
      } else if (activeTab === "contractors") {
        await api.admin.deleteContractorPermanent(itemToDelete.id);
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchDeletedItems();
    } catch (err: any) {
      alert("Error", err.message || "Failed to permanently delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setItemToRestore(item);
    setRestoreModalOpen(true);
  };

  const confirmRestore = async () => {
    if (!itemToRestore) return;
    setIsRestoring(true);
    try {
      if (activeTab === "users") {
        await api.admin.restoreUser(itemToRestore.id);
      } else if (activeTab === "workers") {
        await api.admin.restoreWorker(itemToRestore.id);
      } else if (activeTab === "contractors") {
        await api.admin.restoreContractor(itemToRestore.id);
      }
      setRestoreModalOpen(false);
      setItemToRestore(null);
      fetchDeletedItems();
    } catch (err: any) {
      alert("Error", err.message || "Failed to restore item");
    } finally {
      setIsRestoring(false);
    }
  };

  const getName = (item: any) => {
    if (activeTab === "users") return item.full_name || "Unregistered";
    if (activeTab === "workers") return item.user?.full_name || "Unregistered Worker";
    if (activeTab === "contractors") return item.company_name || item.user?.full_name || "Unregistered Contractor";
    return "Unknown";
  };
  
  const getAvatarLetter = (item: any) => {
    return (getName(item)[0] || "U").toUpperCase();
  };

  const tabs = [
    { id: "users", label: "Customers", icon: Users },
    { id: "workers", label: "Workers", icon: HardHat },
    { id: "contractors", label: "Contractors", icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Trash2 className="h-6 w-6 text-red-500" />
          Recycle Bin
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          View all soft-deleted records across the platform. These items are hidden from the main system.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                isActive
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
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
        ) : items.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No deleted {activeTab} found in the recycle bin.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500">
              <thead className="bg-gray-50 dark:bg-[#1a2536] text-[10px] text-gray-500 dark:text-[#94A3B8] uppercase font-bold border-b border-gray-100 dark:border-[#ffffff]/5">
                <tr>
                  <th className="px-6 py-3.5">Name / Details</th>
                  <th className="px-6 py-3.5">Deleted Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                          {getAvatarLetter(item)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 truncate max-w-[200px]" title={getName(item)}>
                            {getName(item)}
                          </p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap block mt-0.5">
                            ID: {item.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 ring-1 ring-inset ring-red-600/15">
                        Soft Deleted
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/${activeTab}/${item.id}`)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleRestoreClick(e, item)}
                          disabled={isRestoring}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                          title="Restore Record"
                        >
                          <RefreshCcw className={`h-4 w-4 ${isRestoring ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, item)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Permanently Delete"
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
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmPermanentDelete}
        isDeleting={isDeleting}
        title="Permanently Delete Record"
        description={`Are you completely sure you want to permanently delete "${itemToDelete ? getName(itemToDelete) : ''}"? This action CANNOT be undone and the record will be erased from the database forever.`}
      />

      <RestoreConfirmationModal
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        onConfirm={confirmRestore}
        isRestoring={isRestoring}
        title="Restore Record"
        description={`Are you sure you want to restore "${itemToRestore ? getName(itemToRestore) : ''}"? This will make the record active and visible in the main system again.`}
      />
    </div>
  );
}
