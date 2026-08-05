import React, { useState } from 'react';
import { FiEye, FiCopy, FiCheck, FiTrash2 } from 'react-icons/fi';
import { formatFileSize } from './MediaCard.jsx';

export function MediaListItem({
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

  const width = media.dimensions?.width;
  const height = media.dimensions?.height;
  const dimensionStr = width && height ? `${width}×${height} px` : '—';
  const createdDate = media.createdAt
    ? new Date(media.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return (
    <tr
      onClick={handleClick}
      tabIndex={0}
      role="row"
      className={`hover:bg-slate-800/40 transition-colors cursor-pointer text-xs ${
        isSelected ? 'bg-purple-950/20 text-purple-300' : ''
      }`}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
            <img
              src={media.secureUrl || media.url}
              alt={media.originalName || media.filename}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-slate-200 truncate max-w-xs" title={media.originalName || media.filename}>
              {media.originalName || media.filename}
            </div>
            <div className="text-[10px] font-mono text-slate-500 truncate max-w-xs">{media.mimeType}</div>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-purple-300 border border-slate-700 uppercase">
          {media.folder}
        </span>
      </td>

      <td className="py-3 px-4 font-mono text-slate-400">{formatFileSize(media.size)}</td>

      <td className="py-3 px-4 font-mono text-slate-400">{dimensionStr}</td>

      <td className="py-3 px-4 font-mono text-slate-400">{createdDate}</td>

      <td className="py-3 px-4 text-right">
        {isPickerMode ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(media);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isSelected
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-purple-600 hover:text-white'
            }`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        ) : (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            {onPreview && (
              <button
                type="button"
                onClick={() => onPreview(media)}
                title="Preview"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <FiEye className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyUrl}
              title="Copy URL"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            >
              {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(media)}
                title="Delete"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

export default MediaListItem;
