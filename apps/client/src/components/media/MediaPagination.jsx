import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export function MediaPagination({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 24,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const startItem = Math.min((page - 1) * limit + 1, totalItems);
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
      <div>
        Showing <span className="text-slate-200 font-semibold">{startItem}</span> to{' '}
        <span className="text-slate-200 font-semibold">{endItem}</span> of{' '}
        <span className="text-purple-400 font-semibold">{totalItems}</span> assets
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous Page"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1e293b]/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FiChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next Page"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1e293b]/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default MediaPagination;
