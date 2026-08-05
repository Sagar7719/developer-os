import React, { useState } from 'react';
import { FiEye, FiCopy, FiCheck, FiTrash2, FiCheckCircle } from 'react-icons/fi';

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaCard({
  media,
  onPreview,
  onDelete,
  onSelect,
  isSelected = false,
  isPickerMode = false,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = (e) => {
    e.stopPropagation();
    if (media?.secureUrl || media?.url) {
      navigator.clipboard.writeText(media.secureUrl || media.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClick = () => {
    if (isPickerMode && onSelect) {
      onSelect(media);
    } else if (onPreview) {
      onPreview(media);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const width = media.dimensions?.width;
  const height = media.dimensions?.height;
  const dimensionStr = width && height ? `${width}×${height}` : null;

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Media asset ${media.originalName || media.filename}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative bg-[#1e293b]/40 border rounded-2xl p-2.5 transition-all outline-none focus:ring-2 focus:ring-purple-500 flex flex-col justify-between overflow-hidden cursor-pointer ${
        isSelected
          ? 'border-purple-500 bg-purple-950/20 shadow-lg shadow-purple-500/10'
          : 'border-slate-800/80 hover:border-slate-700 hover:bg-[#1e293b]/70'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0f172a] border border-slate-800/60 mb-2">
        <img
          src={media.secureUrl || media.url}
          alt={media.originalName || media.filename}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
            <FiCheckCircle className="w-4 h-4" />
          </div>
        )}

        {/* Folder Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 backdrop-blur-xs text-purple-300 border border-purple-500/30 uppercase">
          {media.folder}
        </div>

        {/* Hover Action Bar */}
        {!isPickerMode && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {onPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(media);
                }}
                aria-label="Preview image"
                title="Preview"
                className="p-2 rounded-xl bg-slate-800/90 text-slate-200 hover:text-white hover:bg-purple-600 transition-colors shadow-md"
              >
                <FiEye className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyUrl}
              aria-label="Copy image URL"
              title="Copy URL"
              className="p-2 rounded-xl bg-slate-800/90 text-slate-200 hover:text-white hover:bg-cyan-600 transition-colors shadow-md"
            >
              {copied ? <FiCheck className="w-4 h-4 text-emerald-400" /> : <FiCopy className="w-4 h-4" />}
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(media);
                }}
                aria-label="Delete media asset"
                title="Delete Asset"
                className="p-2 rounded-xl bg-slate-800/90 text-slate-200 hover:text-red-400 hover:bg-red-950/80 transition-colors shadow-md"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Meta Info */}
      <div className="space-y-1 px-1">
        <h4 className="text-xs font-medium text-slate-200 truncate" title={media.originalName || media.filename}>
          {media.originalName || media.filename}
        </h4>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>{formatFileSize(media.size)}</span>
          {dimensionStr && <span className="text-slate-500">{dimensionStr}</span>}
        </div>
      </div>
    </div>
  );
}

export default MediaCard;
