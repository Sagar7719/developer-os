import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

export function MediaToast({ message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  const isSuccess = message.type === 'success';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all animate-fade-in bg-[#1e293b] border-slate-700 text-slate-100"
    >
      {isSuccess ? (
        <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <FiAlertCircle className="w-5 h-5 text-red-400 shrink-0" />
      )}
      <span className="text-xs font-medium">{message.text}</span>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="p-1 text-slate-400 hover:text-slate-200 transition-colors rounded-lg"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}

export default MediaToast;
