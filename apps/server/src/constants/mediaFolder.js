/**
 * Centralized Media Folder Enum / Constants for Developer OS.
 * Prevents raw folder strings from being hardcoded across the server application.
 */
export const MediaFolder = Object.freeze({
  AVATARS: 'avatars',
  PROJECTS: 'projects',
  BLOG: 'blog',
  GENERAL: 'general',
  TEMPORARY: 'temp',
});

export const ALLOWED_MEDIA_FOLDERS = Object.freeze(Object.values(MediaFolder));

export default MediaFolder;
