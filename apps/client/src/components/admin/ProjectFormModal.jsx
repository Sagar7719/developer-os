import React, { useState, useEffect } from 'react';
import { FiX, FiImage, FiGlobe, FiInfo, FiSliders, FiGithub, FiExternalLink, FiFigma, FiStar } from 'react-icons/fi';
import { MediaPickerModal } from '../media/MediaPickerModal.jsx';
import { ProjectSEOForm } from './ProjectSEOForm.jsx';

const CATEGORIES = ['web', 'mobile', 'backend', 'fullstack', 'open-source', 'ai-ml'];

export function ProjectFormModal({ isOpen, initialData, onSubmit, onClose, isSubmitting }) {
  const [activeTab, setActiveTab] = useState('general');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'web',
    subtitle: '',
    description: '',
    longDescription: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    figmaUrl: '',
    coverImage: '',
    coverImageMediaId: null,
    status: 'published',
    isFeatured: false,
    featured: false,
    isPublished: true,
    order: 0,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      canonicalUrl: '',
      ogImage: '',
      noIndex: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        category: initialData.category || 'web',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        longDescription: initialData.longDescription || '',
        techStack: Array.isArray(initialData.techStack) ? initialData.techStack.join(', ') : '',
        githubUrl: initialData.githubUrl || '',
        liveUrl: initialData.liveUrl || '',
        figmaUrl: initialData.figmaUrl || '',
        coverImage: initialData.coverImage || '',
        coverImageMediaId: initialData.coverImageMediaId || null,
        status: initialData.status || (initialData.isPublished ? 'published' : 'draft'),
        isFeatured: initialData.isFeatured !== undefined ? Boolean(initialData.isFeatured) : Boolean(initialData.featured),
        featured: initialData.isFeatured !== undefined ? Boolean(initialData.isFeatured) : Boolean(initialData.featured),
        isPublished: initialData.isPublished !== undefined ? Boolean(initialData.isPublished) : true,
        order: initialData.order || 0,
        seo: initialData.seo || {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          canonicalUrl: '',
          ogImage: '',
          noIndex: false,
        },
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'web',
        subtitle: '',
        description: '',
        longDescription: '',
        techStack: '',
        githubUrl: '',
        liveUrl: '',
        figmaUrl: '',
        coverImage: '',
        coverImageMediaId: null,
        status: 'published',
        isFeatured: false,
        featured: false,
        isPublished: true,
        order: 0,
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          canonicalUrl: '',
          ogImage: '',
          noIndex: false,
        },
      });
    }
    setActiveTab('general');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSelectCoverMedia = (media) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: media.secureUrl || media.url,
      coverImageMediaId: media._id || media.id,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      techStack: formData.techStack
        ? formData.techStack
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      featured: formData.isFeatured,
      isPublished: formData.status === 'published',
    };

    if (!payload.slug || !payload.slug.trim()) {
      delete payload.slug;
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-[#1e293b] p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {initialData ? `Edit "${initialData.title}"` : 'Create New Project Record'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xs font-mono shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'general'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FiInfo className="w-3.5 h-3.5" />
            General
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'media'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FiImage className="w-3.5 h-3.5" />
            Media &amp; Cover
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'seo'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FiGlobe className="w-3.5 h-3.5" />
            SEO &amp; Metadata
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('publishing')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'publishing'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FiSliders className="w-3.5 h-3.5" />
            Publishing Options
          </button>
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'general' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-slate-300">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Developer OS Portfolio"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-300">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-slate-300">Custom Slug (Optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Auto-generated if left blank"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-300">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Short summary tagline"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-300">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Primary project overview content..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-300">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="React, Node, MongoDB, Docker, AWS"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="font-mono text-slate-300 flex items-center gap-1.5">
                    <FiGithub className="w-3.5 h-3.5 text-purple-400" /> GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-300 flex items-center gap-1.5">
                    <FiExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-300 flex items-center gap-1.5">
                    <FiFigma className="w-3.5 h-3.5 text-pink-400" /> Figma Spec URL
                  </label>
                  <input
                    type="url"
                    value={formData.figmaUrl}
                    onChange={(e) => setFormData({ ...formData, figmaUrl: e.target.value })}
                    placeholder="https://figma.com/file/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-mono text-slate-300">Project Cover Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs flex items-center gap-2 shrink-0 transition-colors shadow-lg shadow-purple-600/20"
                  >
                    <FiImage className="w-4 h-4" />
                    Open Media Library
                  </button>
                </div>
              </div>

              {formData.coverImage && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    Cover Preview
                  </span>
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-44 object-cover rounded-lg border border-slate-800"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <ProjectSEOForm
              seoData={formData.seo}
              onChange={(newSeo) => setFormData({ ...formData, seo: newSeo })}
            />
          )}

          {activeTab === 'publishing' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-mono text-slate-300">Publishing Status</label>
                <div className="grid grid-cols-3 gap-3">
                  {['draft', 'published', 'archived'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st, isPublished: st === 'published' })}
                      className={`p-3 rounded-xl border text-center font-mono uppercase text-xs transition-all ${
                        formData.status === st
                          ? 'border-purple-500 bg-purple-600/20 text-purple-300 font-bold'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked, featured: e.target.checked })}
                    className="rounded border-slate-800 text-purple-600 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <div className="font-mono text-slate-200 font-bold flex items-center gap-1.5">
                      <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                      Featured Project (Priority Placement)
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">
                      Featured projects always appear first on the public portfolio grid.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/80 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-white bg-purple-600 hover:bg-purple-500 font-medium text-xs disabled:opacity-50 transition-all shadow-lg shadow-purple-600/20"
            >
              {isSubmitting ? 'Saving Record...' : initialData ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>

        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelectMedia={handleSelectCoverMedia}
          initialFolder="projects"
          title="Select Cover Image from Media Library"
        />
      </div>
    </div>
  );
}

export default ProjectFormModal;

