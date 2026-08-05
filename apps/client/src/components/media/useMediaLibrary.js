import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMediaApi, uploadMediaApi, deleteMediaApi } from '../../api/media.api.js';
import { DEFAULT_PAGE_SIZE, VIEW_MODES } from '../../constants/media.constants.js';

export function useMediaLibrary({ initialFolder = 'all', initialLimit = DEFAULT_PAGE_SIZE } = {}) {
  const queryClient = useQueryClient();

  const [activeFolder, setActiveFolder] = useState(initialFolder);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const queryKey = ['media', { folder: activeFolder, page, limit }];

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: () => fetchMediaApi({ folder: activeFolder, page, limit }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const showToast = (type, text) => {
    setToastMessage({ type, text, id: Date.now() });
  };

  const uploadMutation = useMutation({
    mutationFn: ({ file, folder }) =>
      uploadMediaApi({
        file,
        folder,
        onUploadProgress: (percent) => setUploadProgress(percent),
      }),
    onMutate: () => {
      setUploadProgress(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setUploadProgress(100);
      showToast('success', 'Media asset uploaded successfully.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || err?.message || 'Upload failed.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMediaApi(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['media'] });
      const previousData = queryClient.getQueryData(queryKey);

      if (previousData) {
        queryClient.setQueryData(queryKey, (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.filter((item) => item.id !== deletedId),
            total: Math.max(0, old.total - 1),
          };
        });
      }

      return { previousData };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      showToast('error', err?.response?.data?.message || err?.message || 'Delete failed.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      showToast('success', 'Media asset deleted successfully.');
    },
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.originalName?.toLowerCase().includes(lower) ||
        item.filename?.toLowerCase().includes(lower) ||
        item.publicId?.toLowerCase().includes(lower)
    );
  }, [items, searchTerm]);

  const handleFolderChange = (newFolder) => {
    setActiveFolder(newFolder);
    setPage(1);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  return {
    activeFolder,
    setActiveFolder: handleFolderChange,
    page,
    setPage,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm: handleSearchChange,
    viewMode,
    setViewMode,
    uploadProgress,
    toastMessage,
    setToastMessage,
    rawItems: items,
    items: filteredItems,
    total,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    uploadMedia: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteMedia: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default useMediaLibrary;
