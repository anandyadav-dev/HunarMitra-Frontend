"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RefreshCcw, X } from "lucide-react";

interface RestoreConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRestoring: boolean;
  title?: string;
  description?: string;
}

export default function RestoreConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isRestoring,
  title = "Restore Item",
  description = "Are you sure you want to restore this item? It will be active again."
}: RestoreConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100">
              <RefreshCcw className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isRestoring}
              className="flex-shrink-0 text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50/80 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isRestoring}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRestoring}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70"
          >
            {isRestoring ? (
              <>
                <RefreshCcw className="h-4 w-4 animate-spin" />
                <span>Restoring...</span>
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                <span>Restore</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
