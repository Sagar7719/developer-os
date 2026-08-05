import React from 'react';
import { MediaListItem } from './MediaListItem.jsx';

export function MediaList({
  items = [],
  onPreview,
  onDelete,
  onSelect,
  selectedId,
  isPickerMode = false,
}) {
  return (
    <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Asset &amp; File</th>
              <th className="py-3.5 px-4">Folder</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4">Dimensions</th>
              <th className="py-3.5 px-4">Created Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((media) => (
              <MediaListItem
                key={media.id}
                media={media}
                onPreview={onPreview}
                onDelete={onDelete}
                onSelect={onSelect}
                isSelected={selectedId === media.id}
                isPickerMode={isPickerMode}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MediaList;
