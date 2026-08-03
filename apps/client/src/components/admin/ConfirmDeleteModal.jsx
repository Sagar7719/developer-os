import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export function ConfirmDeleteModal({ isOpen, title, message, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
        <div className="flex items-center gap-3 text-amber-400">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title || 'Confirm Deletion'}</h3>
            <p className="text-xs text-slate-400 font-mono">Soft Delete Protocol</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {message || 'Are you sure you want to delete this item? It will be marked as deleted.'}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
