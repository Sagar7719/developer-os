/**
 * Centralized Media Folder Enum / Constants for Developer OS.
 * Shared across client, server, and platform components.
 */
export const MediaFolder = {
  AVATARS: 'avatars',
  PROJECTS: 'projects',
  BLOG: 'blog',
  GENERAL: 'general',
  TEMPORARY: 'temp',
} as const;

export type MediaFolderType = (typeof MediaFolder)[keyof typeof MediaFolder];

export const ALLOWED_MEDIA_FOLDERS: MediaFolderType[] = Object.values(MediaFolder);

export default MediaFolder;
