"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useDialog } from "../../hooks/useDialog";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Tag,
  DollarSign,
  X,
  FileImage,
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { alert, confirm } = useDialog();

  // Modal Control States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.admin.getServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || "Failed to load services directory.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setName("");
    setBasePrice("");
    setIconUrl("");
    setFormError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (svc: any) => {
    setSelectedService(svc);
    setName(svc.name);
    setBasePrice(svc.base_price.toString());
    setIconUrl(svc.icon_url || "");
    setFormError(null);
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const price = parseFloat(basePrice);
    if (isNaN(price) || price < 0) {
      setFormError("Base price must be a valid positive number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.admin.createService({
        name: name.trim(),
        base_price: price,
        icon_url: iconUrl.trim() || undefined,
      });
      setShowAddModal(false);
      fetchServices();
    } catch (err: any) {
      setFormError(err.message || "Failed to create service category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setFormError(null);

    const price = parseFloat(basePrice);
    if (isNaN(price) || price < 0) {
      setFormError("Base price must be a valid positive number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.admin.updateService(selectedService.id, {
        name: name.trim(),
        base_price: price,
        icon_url: iconUrl.trim() || undefined,
      });
      setShowEditModal(false);
      fetchServices();
    } catch (err: any) {
      setFormError(err.message || "Failed to update service category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    const deleteAction = async () => {
      try {
        await api.admin.deleteService(id);
        fetchServices();
      } catch (err: any) {
        alert("Operation Failed", err.message || "Failed to delete service category.");
      }
    };

    confirm(
      "Confirm Deletion",
      "Are you sure you want to delete this service category? This cannot be undone if successful.",
      deleteAction
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Categories Directory</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure default service listings, set standard base prices, and update icons.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none transition-colors"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Main Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2 border border-red-100">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>{error}</span>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-xs text-gray-400 font-semibold border border-dashed border-gray-200 rounded-xl bg-white">
          No service categories registered. Click Add Category to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="group relative rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Icon display */}
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-bold text-gray-900">{svc.name}</h3>
                  <div className="mt-2 flex items-baseline gap-0.5 text-gray-900 font-bold">
                    <span className="text-xs text-gray-500 font-bold">Rs.</span>
                    <span className="text-base">{svc.base_price.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400 font-semibold ml-1">base price</span>
                  </div>
                </div>
              </div>

              {/* Actions panel */}
              <div className="mt-6 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[9px] font-medium text-gray-400 max-w-[130px] truncate" title={svc.icon_url}>
                  {svc.icon_url ? `Path: ...${svc.icon_url.slice(-15)}` : "No icon url"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="p-1.5 text-gray-400 hover:text-gray-900 rounded hover:bg-gray-50 transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(svc.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              <h3 className="text-sm font-bold text-gray-900">Add Service Category</h3>
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

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Category Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Mason, Welder"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="price" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Standard Base Price (INR)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="150.00"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="icon" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Icon Static Asset Path (Optional)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileImage className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="icon"
                    type="text"
                    placeholder="/static/icons/custom.png"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
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
                {isSubmitting ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900">Edit Service Category</h3>
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

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label htmlFor="name-edit" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Category Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="name-edit"
                    type="text"
                    required
                    placeholder="e.g. Mason, Welder"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="price-edit" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Standard Base Price (INR)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="price-edit"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="150.00"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="icon-edit" className="block font-semibold text-gray-700 uppercase tracking-wider">
                  Icon Static Asset Path (Optional)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileImage className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="icon-edit"
                    type="text"
                    placeholder="/static/icons/custom.png"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
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
