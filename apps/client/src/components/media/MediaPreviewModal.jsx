import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiTrash2,
  FiCalendar,
  FiHardDrive,
  FiMaximize2,
  FiFolder,
} from 'react-icons/fi';
import { formatFileSize } from './MediaCard.jsx';

export function MediaPreviewModal({ media, onClose, onDelete }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!media) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [media, onClose]);

  if (!media) return null;

  const handleCopyUrl = () => {
    if (media.secureUrl || media.url) {
      navigator.clipboard.writeText(media.secureUrl || media.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const width = media.dimensions?.width;
  const height = media.dimensions?.height;
  const dimensionStr = width && height ? `${width} × ${height} px` : 'Unknown';
  const createdDate = media.createdAt
    ? new Date(media.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative">
        {/* Close Trigger Mobile/Desktop */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition-colors border border-slate-700/80"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Viewport Preview Area */}
        <div className="flex-1 bg-[#0f172a] p-6 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-slate-800 relative overflow-hidden">
          <img
            src={media.secureUrl || media.url}
            alt={media.originalName || media.filename}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Sidebar Metadata Panel */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between space-y-6 overflow-y-auto shrink-0 bg-[#1e293b]">
          <div className="space-y-4">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-600/20 text-purple-300 border border-purple-500/30 uppercase font-semibold">
                {media.folder}
              </span>
              <h3 id="preview-modal-title" className="text-base font-bold text-white mt-2 truncate" title={media.originalName || media.filename}>
                {media.originalName || media.filename}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 truncate">{media.publicId}</p>
            </div>

            {/* Metadata Table */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <FiMaximize2 className="w-3.5 h-3.5 text-purple-400" />
                  Dimensions
                </span>
                <span>{dimensionStr}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <FiHardDrive className="w-3.5 h-3.5 text-purple-400" />
                  File Size
                </span>
                <span>{formatFileSize(media.size)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <FiFolder className="w-3.5 h-3.5 text-purple-400" />
                  MIME Type
                </span>
                <span className="text-[10px]">{media.mimeType}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <FiCalendar className="w-3.5 h-3.5 text-purple-400" />
                  Uploaded
                </span>
                <span className="text-[10px] text-right">{createdDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition-colors"
            >
              {copied ? (
                <>
                  <FiCheck className="w-4 h-4 text-emerald-400" />
                  <span>URL Copied!</span>
                </>
              ) : (
                <>
                  <FiCopy className="w-4 h-4" />
                  <span>Copy CDN URL</span>
                </>
              )}
            </button>

            <a
              href={media.secureUrl || media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <FiExternalLink className="w-4 h-4" />
              <span>Open Original</span>
            </a>

            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(media);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete Asset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaPreviewModal;

