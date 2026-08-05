import React from 'react';
import { FiSearch, FiGrid, FiList, FiRefreshCw } from 'react-icons/fi';
import { PAGE_SIZE_OPTIONS, VIEW_MODES } from '../../constants/media.constants.js';

export function MediaToolbar({
  searchTerm = '',
  onSearchChange,
  limit,
  onLimitChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isFetching = false,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1e293b]/40 p-3 rounded-2xl border border-slate-800/80">
      {/* Search Input */}
      <div className="relative flex-1">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by filename or title..."
          className="w-full bg-[#0f172a]/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-2 justify-end shrink-0">
        {/* Page Size Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hidden md:inline font-mono">Show:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-[#0f172a]/80 border border-slate-700/80 text-slate-200 rounded-xl px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-purple-500 transition-colors"
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#0f172a]/80 border border-slate-700/80 p-1 rounded-xl">
          <button
            onClick={() => onViewModeChange(VIEW_MODES.GRID)}
            title="Grid View"
            aria-label="Grid View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === VIEW_MODES.GRID
                ? 'bg-purple-600/30 text-purple-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange(VIEW_MODES.LIST)}
            title="List View"
            aria-label="List View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === VIEW_MODES.LIST
                ? 'bg-purple-600/30 text-purple-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiList className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isFetching}
            title="Refresh Library"
            aria-label="Refresh Library"
            className="p-2 rounded-xl bg-[#0f172a]/80 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-purple-400' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
}

export default MediaToolbar;
