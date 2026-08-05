import React from 'react';
import { MediaFolder } from '@developer-os/shared';
import { FiFolder, FiGrid, FiUser, FiBriefcase, FiFileText, FiClock } from 'react-icons/fi';

const FOLDER_TAB_CONFIG = [
  { key: 'all', label: 'All Media', icon: FiGrid },
  { key: MediaFolder.PROJECTS, label: 'Projects', icon: FiBriefcase },
  { key: MediaFolder.AVATARS, label: 'Avatars', icon: FiUser },
  { key: MediaFolder.BLOG, label: 'Blog', icon: FiFileText },
  { key: MediaFolder.GENERAL, label: 'General', icon: FiFolder },
  { key: MediaFolder.TEMPORARY, label: 'Temporary', icon: FiClock },
];

export function MediaFolderFilter({ activeFolder = 'all', onSelectFolder }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
      {FOLDER_TAB_CONFIG.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFolder === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onSelectFolder(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default MediaFolderFilter;
