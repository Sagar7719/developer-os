import React from 'react';
import { FiAlertCircle, FiInbox, FiRefreshCw } from 'react-icons/fi';

export function LoadingSpinner({ text = 'Loading data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-mono animate-pulse">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[#1e293b]/60 border border-slate-800/80 rounded-xl p-5 space-y-4 animate-pulse">
      <div className="h-48 bg-slate-800/60 rounded-lg" />
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-slate-800/80 rounded" />
        <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
      </div>
      <div className="h-12 bg-slate-800/40 rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-800/60 rounded-full" />
        <div className="h-6 w-16 bg-slate-800/60 rounded-full" />
      </div>
    </div>
  );
}

export function ErrorMessage({ title = 'Failed to load data', message, onRetry }) {
  return (
    <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 text-center max-w-md mx-auto my-6 space-y-3">
      <FiAlertCircle className="w-10 h-10 text-red-400 mx-auto" />
      <h3 className="text-base font-semibold text-red-200">{title}</h3>
      {message && <p className="text-xs text-red-300/80">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-red-800/60 hover:bg-red-700/80 rounded-lg transition-colors"
        >
          <FiRefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'No items found', message = 'Check back later for updates.' }) {
  return (
    <div className="border border-dashed border-slate-800/80 rounded-xl p-12 text-center max-w-md mx-auto my-6 space-y-3 bg-[#0f172a]/40">
      <FiInbox className="w-12 h-12 text-slate-500 mx-auto" />
      <h3 className="text-base font-medium text-slate-300">{title}</h3>
      <p className="text-xs text-slate-500">{message}</p>
    </div>
  );
}
