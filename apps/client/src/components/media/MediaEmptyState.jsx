import React from 'react';
import { FiImage, FiSearch, FiUpload, FiXCircle } from 'react-icons/fi';

export function MediaEmptyState({
  isSearchActive = false,
  onUploadClick,
  onClearSearch,
  title,
  message,
}) {
  if (isSearchActive) {
    return (
      <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-8 space-y-4 bg-[#0f172a]/40">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
          <FiSearch className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-200">
            {title || 'No matching media assets'}
          </h3>
          <p className="text-xs text-slate-400">
            {message || 'No assets match your search term or folder filter.'}
          </p>
        </div>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <FiXCircle className="w-3.5 h-3.5" />
            Clear Search &amp; Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-8 space-y-4 bg-[#0f172a]/40">
      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
        <FiImage className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-200">
          {title || 'Your Media Library is Empty'}
        </h3>
        <p className="text-xs text-slate-400">
          {message || 'Upload your first media asset to get started.'}
        </p>
      </div>
      {onUploadClick && (
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-lg shadow-purple-600/20"
        >
          <FiUpload className="w-3.5 h-3.5" />
          Upload First Asset
        </button>
      )}
    </div>
  );
}

export default MediaEmptyState;
