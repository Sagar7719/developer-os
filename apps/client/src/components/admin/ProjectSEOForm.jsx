import React from 'react';
import { MediaPickerModal } from '../media/MediaPickerModal.jsx';
import { FiGlobe, FiImage } from 'react-icons/fi';

export function ProjectSEOForm({ seoData, onChange }) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  const handleChange = (field, value) => {
    onChange({
      ...seoData,
      [field]: value,
    });
  };

  const handleSelectOgImage = (media) => {
    handleChange('ogImage', media.secureUrl || media.url);
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="bg-purple-950/20 border border-purple-800/30 rounded-xl p-3 text-purple-300 space-y-1">
        <div className="flex items-center gap-2 font-mono font-bold text-xs text-purple-400">
          <FiGlobe className="w-4 h-4" />
          SEO &amp; Metadata Engine
        </div>
        <p className="text-[11px] text-slate-400">
          Configure search engine title, meta description, OpenGraph image, and index controls.
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="font-mono text-slate-300">Meta Title</label>
          <span className="font-mono text-[10px] text-slate-500">
            {(seoData?.metaTitle || '').length}/70 chars
          </span>
        </div>
        <input
          type="text"
          maxLength={70}
          value={seoData?.metaTitle || ''}
          onChange={(e) => handleChange('metaTitle', e.target.value)}
          placeholder="Custom page title for search engines"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="font-mono text-slate-300">Meta Description</label>
          <span className="font-mono text-[10px] text-slate-500">
            {(seoData?.metaDescription || '').length}/160 chars
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={160}
          value={seoData?.metaDescription || ''}
          onChange={(e) => handleChange('metaDescription', e.target.value)}
          placeholder="Brief summary for Google search result snippets..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
        />
      </div>

      <div className="space-y-1">
        <label className="font-mono text-slate-300">Keywords (comma separated)</label>
        <input
          type="text"
          value={Array.isArray(seoData?.keywords) ? seoData.keywords.join(', ') : seoData?.keywords || ''}
          onChange={(e) =>
            handleChange(
              'keywords',
              e.target.value
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean)
            )
          }
          placeholder="react, express, web development"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
        />
      </div>

      <div className="space-y-1">
        <label className="font-mono text-slate-300">Canonical URL</label>
        <input
          type="url"
          value={seoData?.canonicalUrl || ''}
          onChange={(e) => handleChange('canonicalUrl', e.target.value)}
          placeholder="https://sagar.dev/projects/example"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
        />
      </div>

      <div className="space-y-1">
        <label className="font-mono text-slate-300">OpenGraph Preview Image URL</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={seoData?.ogImage || ''}
            onChange={(e) => handleChange('ogImage', e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
          />
          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 shrink-0 transition-colors border border-slate-700"
          >
            <FiImage className="w-4 h-4 text-purple-400" />
            Pick Asset
          </button>
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(seoData?.noIndex)}
            onChange={(e) => handleChange('noIndex', e.target.checked)}
            className="rounded border-slate-800 text-purple-600 focus:ring-0"
          />
          <span className="font-mono text-slate-300">Discourage Search Engines from Indexing (noindex)</span>
        </label>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectMedia={handleSelectOgImage}
        initialFolder="projects"
        title="Select OpenGraph Share Image"
      />
    </div>
  );
}

export default ProjectSEOForm;
