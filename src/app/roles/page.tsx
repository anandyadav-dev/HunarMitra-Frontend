"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useDialog } from "../../hooks/useDialog";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Tag,
  FileText,
  GitMerge,
  X,
} from "lucide-react";

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { alert, confirm } = useDialog();

  // Modal Control States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.admin.getRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err.message || "Failed to load roles directory.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setName("");
    setDescription("");
    setParentId("");
    setFormError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (role: any) => {
    setSelectedRole(role);
    setName(role.name);
    setDescription(role.description || "");
    setParentId(role.parent_id ? role.parent_id.toString() : "");
    setFormError(null);
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setFormError("Role name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.admin.createRole({
        name: cleanName,
        description: description.trim() || undefined,
        parent_id: parentId ? parseInt(parentId) : undefined,
      });
      setShowAddModal(false);
      fetchRoles();
    } catch (err: any) {
      setFormError(err.message || "Failed to create role.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setFormError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setFormError("Role name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.admin.updateRole(selectedRole.id, {
        name: cleanName,
        description: description.trim() || undefined,
        parent_id: parentId ? parseInt(parentId) : 0, // 0 in backend sets it to null
      });
      setShowEditModal(false);
      fetchRoles();
    } catch (err: any) {
      setFormError(err.message || "Failed to update role.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (id: number, roleName: string) => {
    if (["admin", "customer", "worker", "contractor"].includes(roleName.toLowerCase())) {
      alert("Validation Error", "Core system roles (admin, customer, worker, contractor) cannot be deleted.");
      return;
    }
    
    const deleteAction = async () => {
      try {
        await api.admin.deleteRole(id);
        fetchRoles();
      } catch (err: any) {
        alert("Operation Failed", err.message || "Failed to delete role.");
      }
    };

    confirm(
      "Confirm Deletion",
      `Are you sure you want to delete the role '${roleName}'? This cannot be undone.`,
      deleteAction
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">System Roles Directory</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure system access roles, define descriptions, and set up parent hierarchy policies.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none transition-colors"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Role
        </button>
      </div>

      {/* Main Table Grid */}
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2 border border-red-100">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>{error}</span>
        </div>
      ) : roles.length === 0 ? (
        <div className="text-center py-20 text-xs text-gray-400 font-semibold border border-dashed border-gray-200 rounded-xl bg-white">
          No roles registered. Click Create Role to create one.
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500">
              <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Role Name</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Parent Role Hierarchy</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles.map((r) => {
                  const isCore = ["admin", "customer", "worker", "contractor"].includes(r.name.toLowerCase());
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-400">#{r.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          r.name.toLowerCase() === "admin"
                            ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/15"
                            : r.name.toLowerCase() === "customer"
                            ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15"
                            : "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/15"
                        }`}>
                          {r.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium max-w-xs truncate" title={r.description}>
                        {r.description || <span className="text-gray-300 italic">No description</span>}
                      </td>
                      <td className="px-6 py-4">
                        {r.parent_name ? (
                          <div className="flex items-center gap-1 text-gray-500 font-semibold text-[10px]">
                            <GitMerge className="h-3 w-3 text-gray-450" />
                            <span>Parent:</span>
                            <span className="font-bold text-gray-800 uppercase text-[9px] bg-gray-100 px-1 py-0.5 rounded">{r.parent_name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-350 italic text-[10px]">Root Role</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1 text-gray-400 hover:text-gray-900 rounded hover:bg-gray-50 transition-colors"
                            title="Edit Role Details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(r.id, r.name)}
                            disabled={isCore}
                            className="p-1 text-gray-400 hover:text-red-650 rounded hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            title={isCore ? "System Core Role" : "Delete Role"}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddSubmit}
            className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900">Create System Role</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-150 rounded-lg text-gray-400 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="rounded-lg bg-red-50 p-2.5 text-[11px] font-semibold text-red-700 border border-red-100 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              {/* Role Name */}
              <div className="space-y-1.5">
                <label htmlFor="role-name" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Role Unique Key (Name)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="role-name"
                    type="text"
                    required
                    placeholder="e.g. plumber, electrician"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="role-desc" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Role Description
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="role-desc"
                    type="text"
                    placeholder="e.g. Standard plumbing technician permissions"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Parent Select */}
              <div className="space-y-1.5">
                <label htmlFor="role-parent" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Hierarchical Parent Role (Optional)
                </label>
                <select
                  id="role-parent"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 py-2.5 px-3 bg-white focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors text-gray-900"
                >
                  <option value="">No Parent (Root Role)</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-450 leading-relaxed mt-1">
                  Setting a parent role configures automatic RBAC attribute inheritances.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Role"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900">Edit System Role</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-150 rounded-lg text-gray-400 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="rounded-lg bg-red-50 p-2.5 text-[11px] font-semibold text-red-700 border border-red-100 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              {/* Role Name */}
              <div className="space-y-1.5">
                <label htmlFor="role-name-edit" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Role Unique Key (Name)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="role-name-edit"
                    type="text"
                    required
                    placeholder="e.g. plumber, electrician"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="role-desc-edit" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Role Description
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="role-desc-edit"
                    type="text"
                    placeholder="e.g. Standard plumbing technician permissions"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Parent Select */}
              <div className="space-y-1.5">
                <label htmlFor="role-parent-edit" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Hierarchical Parent Role (Optional)
                </label>
                <select
                  id="role-parent-edit"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 py-2.5 px-3 bg-white focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors text-gray-900"
                >
                  <option value="">No Parent (Root Role)</option>
                  {roles
                    .filter((r) => r.id !== selectedRole.id) // Prevent setting self as parent
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
