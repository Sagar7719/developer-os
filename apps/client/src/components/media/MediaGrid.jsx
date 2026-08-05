import React from 'react';
import { MediaCard } from './MediaCard.jsx';

export function MediaGrid({
  items = [],
  onPreview,
  onDelete,
  onSelect,
  selectedId,
  isPickerMode = false,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((media) => (
        <MediaCard
          key={media.id}
          media={media}
          onPreview={onPreview}
          onDelete={onDelete}
          onSelect={onSelect}
          isSelected={selectedId === media.id}
          isPickerMode={isPickerMode}
        />
      ))}
    </div>
  );
}

export default MediaGrid;
