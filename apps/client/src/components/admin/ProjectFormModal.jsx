import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const CATEGORIES = ['web', 'mobile', 'backend', 'fullstack', 'open-source'];

export function ProjectFormModal({ isOpen, initialData, onSubmit, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'web',
    subtitle: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    coverImage: '',
    featured: false,
    isPublished: true,
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        category: initialData.category || 'web',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        techStack: Array.isArray(initialData.techStack) ? initialData.techStack.join(', ') : '',
        githubUrl: initialData.githubUrl || '',
        liveUrl: initialData.liveUrl || '',
        coverImage: initialData.coverImage || '',
        featured: Boolean(initialData.featured),
        isPublished: initialData.isPublished !== undefined ? Boolean(initialData.isPublished) : true,
        order: initialData.order || 0,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'web',
        subtitle: '',
        description: '',
        techStack: '',
        githubUrl: '',
        liveUrl: '',
        coverImage: '',
        featured: false,
        isPublished: true,
        order: 0,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      techStack: formData.techStack
        ? formData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 max-w-xl w-full my-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h3 className="text-lg font-bold text-white">
            {initialData ? 'Edit Project' : 'Create New Project'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-slate-300">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-300">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Short one-line summary"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-300">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-300">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="React 19, Express, MongoDB"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-slate-300">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-300">Live URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-300">Cover Image URL</label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-800 text-purple-600 focus:ring-0"
              />
              <span className="font-mono text-slate-300">Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-slate-800 text-purple-600 focus:ring-0"
              />
              <span className="font-mono text-slate-300">Published</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-white bg-purple-600 hover:bg-purple-500 font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectFormModal;
