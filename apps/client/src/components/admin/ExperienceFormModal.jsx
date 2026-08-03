import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};

export function ExperienceFormModal({ isOpen, initialData, onSubmit, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: '',
    techStack: '',
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        role: initialData.role || '',
        location: initialData.location || '',
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
        isCurrent: Boolean(initialData.isCurrent),
        description: initialData.description || '',
        achievements: Array.isArray(initialData.achievements)
          ? initialData.achievements.join('\n')
          : '',
        techStack: Array.isArray(initialData.techStack) ? initialData.techStack.join(', ') : '',
        order: initialData.order || 0,
      });
    } else {
      setFormData({
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        achievements: '',
        techStack: '',
        order: 0,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      endDate: formData.isCurrent ? null : formData.endDate || null,
      achievements: formData.achievements
        ? formData.achievements.split('\n').map((a) => a.trim()).filter(Boolean)
        : [],
      techStack: formData.techStack
        ? formData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="relative mx-auto my-10 w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#1e293b] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h3 className="text-lg font-bold text-white">
            {initialData ? 'Edit Experience Entry' : 'Create New Experience Entry'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-slate-300">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-300">Role Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-300">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. San Francisco, CA (Remote)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-slate-300">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-300">End Date</label>
              <input
                type="date"
                disabled={formData.isCurrent}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 disabled:opacity-40"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
              className="rounded border-slate-800 text-purple-600 focus:ring-0"
            />
            <span className="font-mono text-slate-300">I currently work in this position</span>
          </label>

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
            <label className="font-mono text-slate-300">Achievements (one per line)</label>
            <textarea
              rows={3}
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              placeholder="Reduced API latency by 40%&#10;Architected microservices..."
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
              {isSubmitting ? 'Saving...' : initialData ? 'Update Experience' : 'Create Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExperienceFormModal;
