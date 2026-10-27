import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start justify-between gap-3 animate-slideIn ${
              isSuccess
                ? 'bg-navy-900 text-cream-50 border-orange-500/40'
                : isError
                ? 'bg-red-950 text-white border-red-500/40'
                : 'bg-white text-navy-900 border-navy-900/10'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider">{toast.title}</h4>
                {toast.message && <p className="text-xs text-cream-200 mt-0.5">{toast.message}</p>}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Close Toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
