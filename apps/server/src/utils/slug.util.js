/**
 * Slug Utility Function for Developer OS.
 * Converts input text into a clean, URL-friendly slug.
 *
 * @param {string} text - Input text to slugify
 * @returns {string} URL-safe slug string
 */
export const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD') // Separate accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent diacritics
    .replace(/[^a-z0-9 -]/g, '') // Remove non-alphanumeric characters except spaces/hyphens
    .replace(/\s+/g, '-') // Replace spaces with a single hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
};

export default slugify;
