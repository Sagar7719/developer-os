import React, { useState } from 'react';
import { useMediaLibrary } from './useMediaLibrary.js';
import { MediaFolderFilter } from './MediaFolderFilter.jsx';
import { MediaToolbar } from './MediaToolbar.jsx';
import { MediaGrid } from './MediaGrid.jsx';
import { MediaList } from './MediaList.jsx';
import { MediaPagination } from './MediaPagination.jsx';
import { MediaEmptyState } from './MediaEmptyState.jsx';
import { MediaSkeletonGrid, MediaSkeletonList } from './MediaSkeleton.jsx';
import { MediaUploadModal } from './MediaUploadModal.jsx';
import { MediaPreviewModal } from './MediaPreviewModal.jsx';
import { MediaToast } from './MediaToast.jsx';
import { ConfirmDeleteModal } from '../admin/ConfirmDeleteModal.jsx';
import { ErrorMessage } from '../States.jsx';
import { VIEW_MODES } from '../../constants/media.constants.js';

export function MediaLibrary({
  onSelectMedia,
  selectedMediaId,
  isPickerMode = false,
  initialFolder = 'all',
}) {
  const {
    activeFolder,
    setActiveFolder,
    page,
    setPage,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    uploadProgress,
    toastMessage,
    setToastMessage,
    items,
    total,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    uploadMedia,
    isUploading,
    deleteMedia,
    isDeleting,
  } = useMediaLibrary({ initialFolder });

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await deleteMedia(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <MediaFolderFilter activeFolder={activeFolder} onSelectFolder={setActiveFolder} />

      <MediaToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        limit={limit}
        onLimitChange={setLimit}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      {isLoading && (
        viewMode === VIEW_MODES.GRID ? <MediaSkeletonGrid count={limit > 12 ? 12 : limit} /> : <MediaSkeletonList count={6} />
      )}

      {isError && (
        <ErrorMessage title="Failed to load media library" message={error?.message} onRetry={refetch} />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <MediaEmptyState
          isSearchActive={Boolean(searchTerm || activeFolder !== 'all')}
          onUploadClick={() => setIsUploadOpen(true)}
          onClearSearch={() => {
            setSearchTerm('');
            setActiveFolder('all');
          }}
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <>
          {viewMode === VIEW_MODES.GRID ? (
            <MediaGrid
              items={items}
              onPreview={(m) => setPreviewMedia(m)}
              onDelete={(m) => setDeleteTarget(m)}
              onSelect={onSelectMedia}
              selectedId={selectedMediaId}
              isPickerMode={isPickerMode}
            />
          ) : (
            <MediaList
              items={items}
              onPreview={(m) => setPreviewMedia(m)}
              onDelete={(m) => setDeleteTarget(m)}
              onSelect={onSelectMedia}
              selectedId={selectedMediaId}
              isPickerMode={isPickerMode}
            />
          )}

          <MediaPagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            limit={limit}
            onPageChange={setPage}
          />
        </>
      )}

      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={uploadMedia}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        defaultFolder={activeFolder !== 'all' ? activeFolder : undefined}
      />

      <MediaPreviewModal
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
        onDelete={(m) => setDeleteTarget(m)}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.originalName || deleteTarget?.filename}"?`}
        message="This will destroy the file from Cloudinary storage and soft-delete its database metadata record."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <MediaToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default MediaLibrary;
