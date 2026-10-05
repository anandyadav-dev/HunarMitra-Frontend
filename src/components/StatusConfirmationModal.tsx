"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Ban, CheckCircle } from "lucide-react";

interface StatusConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  title: string;
  description: string;
  actionType: "suspend" | "activate";
}

export default function StatusConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  title,
  description,
  actionType
}: StatusConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const isSuspend = actionType === "suspend";
  const iconBg = isSuspend ? "bg-red-100" : "bg-emerald-100";
  const iconColor = isSuspend ? "text-red-600" : "text-emerald-600";
  const btnBg = isSuspend ? "bg-red-600 hover:bg-red-700 shadow-red-600/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20";
  const Icon = isSuspend ? Ban : CheckCircle;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconBg}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500">
                {description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md ${btnBg}`}
          >
            {isProcessing ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
            {isProcessing ? "Processing..." : (isSuspend ? "Suspend Account" : "Activate Account")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
