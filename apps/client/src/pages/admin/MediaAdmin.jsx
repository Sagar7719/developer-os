import React from 'react';
import { FiImage } from 'react-icons/fi';
import { MediaLibrary } from '../../components/media/index.js';

export function MediaAdmin() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800/80 pb-5">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
          <FiImage className="w-3.5 h-3.5" />
          Media Management
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Media Library Console
        </h1>
      </div>

      <MediaLibrary />
    </div>
  );
}

export default MediaAdmin;
