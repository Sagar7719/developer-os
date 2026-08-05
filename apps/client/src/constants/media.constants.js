/**
 * Media UI Constants.
 * Contains UI-specific limits, MIME types, and pagination defaults.
 * MediaFolder enum is imported directly from '@developer-os/shared'.
 */

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_MIME_TYPES = Object.freeze([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

export const DEFAULT_PAGE_SIZE = 24;
export const PAGE_SIZE_OPTIONS = Object.freeze([12, 24, 48, 96]);

export const VIEW_MODES = Object.freeze({
  GRID: 'grid',
  LIST: 'list',
});
