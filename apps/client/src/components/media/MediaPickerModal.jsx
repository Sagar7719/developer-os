import React, { useEffect } from 'react';
import { FiX, FiImage } from 'react-icons/fi';
import { MediaLibrary } from './MediaLibrary.jsx';

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelectMedia,
  selectedMediaId,
  title = 'Select Media Asset',
  initialFolder = 'all',
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (media) => {
    if (onSelectMedia) {
      onSelectMedia(media);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="picker-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative p-6 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <FiImage className="w-5 h-5" />
            </div>
            <div>
              <h3 id="picker-modal-title" className="text-base font-bold text-white">
                {title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">Select an image from the Media Library</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Media Library View Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          <MediaLibrary
            isPickerMode={true}
            onSelectMedia={handleSelect}
            selectedMediaId={selectedMediaId}
            initialFolder={initialFolder}
          />
        </div>
      </div>
    </div>
  );
}

export default MediaPickerModal;
