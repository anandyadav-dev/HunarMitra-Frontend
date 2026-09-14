"use client";

import React, { createContext, useContext, useState } from "react";
import { AlertCircle, HelpCircle, X } from "lucide-react";

interface DialogContextType {
  alert: (title: string, message: string) => void;
  confirm: (title: string, message: string, onConfirm: () => void) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"alert" | "confirm">("alert");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const alert = (alertTitle: string, alertMessage: string) => {
    setType("alert");
    setTitle(alertTitle);
    setMessage(alertMessage);
    setOnConfirmCallback(null);
    setIsOpen(true);
  };

  const confirm = (confirmTitle: string, confirmMessage: string, onConfirm: () => void) => {
    setType("confirm");
    setTitle(confirmTitle);
    setMessage(confirmMessage);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirmAction = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}

      {/* Global Dialog Modal Component */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-xl space-y-4">
            
            {/* Header Icon + Close */}
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${
                type === "confirm" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
              }`}>
                {type === "confirm" ? (
                  <HelpCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content Text */}
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-500 leading-normal">{message}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              {type === "confirm" ? (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
