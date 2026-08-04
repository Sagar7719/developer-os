import { useQuery } from '@tanstack/react-query';
import { fetchPublicSettings } from '../api/settings.api.js';

/**
 * Custom hook to fetch and cache public site settings.
 * Uses queryKey ['site-settings'] which is shared and invalidated by SettingsAdmin.
 */
export function usePublicSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: fetchPublicSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });
}

export default usePublicSettings;
