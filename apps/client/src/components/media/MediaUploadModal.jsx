import React, { useState, useEffect, useRef } from 'react';
import { MediaFolder } from '@developer-os/shared';
import { FiUploadCloud, FiX, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../../constants/media.constants.js';

export function MediaUploadModal({
  isOpen,
  onClose,
  onUpload,
  isUploading = false,
  uploadProgress = 0,
  defaultFolder = MediaFolder.GENERAL,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetFolder, setTargetFolder] = useState(defaultFolder);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    setTargetFolder(defaultFolder);
  }, [defaultFolder, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setErrorMsg('');
      setDragActive(false);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isUploading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isUploading, onClose]);

  if (!isOpen) return null;

  const validateFile = (file) => {
    if (!file) return false;
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMsg(`Unsupported file type (${file.type}). Allowed: JPG, PNG, WEBP, GIF, SVG.`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(`File size exceeds max limit of ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || isUploading) return;
    try {
      await onUpload({ file: selectedFile, folder: targetFolder });
      setSelectedFile(null);
      onClose();
    } catch {
      // Error handled via hook toast
    }
  };

  const folderOptions = [
    { value: MediaFolder.GENERAL, label: 'General' },
    { value: MediaFolder.PROJECTS, label: 'Projects' },
    { value: MediaFolder.AVATARS, label: 'Avatars' },
    { value: MediaFolder.BLOG, label: 'Blog' },
    { value: MediaFolder.TEMPORARY, label: 'Temporary' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
    >
      <div
        ref={modalRef}
        className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <FiUploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 id="upload-modal-title" className="text-base font-bold text-white">
                Upload Media Asset
              </h3>
              <p className="text-xs text-slate-400 font-mono">Max size {MAX_FILE_SIZE_MB}MB • Images only</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center space-y-3 ${
              dragActive
                ? 'border-purple-500 bg-purple-950/20'
                : selectedFile
                ? 'border-emerald-500/50 bg-emerald-950/10'
                : 'border-slate-800 hover:border-slate-700 bg-[#0f172a]/40'
            }`}
          >
            <FiUploadCloud className={`w-10 h-10 ${selectedFile ? 'text-emerald-400' : 'text-purple-400'}`} />

            {selectedFile ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-300">
                  <FiFile className="w-4 h-4" />
                  <span className="truncate max-w-xs">{selectedFile.name}</span>
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">
                  Drag and drop your image here, or{' '}
                  <label className="text-purple-400 font-semibold cursor-pointer hover:underline">
                    browse
                    <input
                      type="file"
                      accept={ALLOWED_MIME_TYPES.join(',')}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Supports PNG, JPG, WEBP, GIF, SVG</p>
              </div>
            )}
          </div>

          {/* Validation Error */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-xl">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Folder Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Target Storage Folder</label>
            <select
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              disabled={isUploading}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition-colors uppercase font-mono"
            >
              {folderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </option>
              ))}
            </select>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono text-purple-300">
                <span>Uploading to Cloudinary...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Start Upload</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MediaUploadModal;
