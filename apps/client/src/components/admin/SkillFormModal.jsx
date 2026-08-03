import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const CATEGORIES = ['frontend', 'backend', 'database', 'devops', 'tools'];

export function SkillFormModal({ isOpen, initialData, onSubmit, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    proficiency: 85,
    yearsOfExperience: 1,
    icon: '',
    featured: false,
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'frontend',
        proficiency: initialData.proficiency || 85,
        yearsOfExperience: initialData.yearsOfExperience || 1,
        icon: initialData.icon || '',
        featured: Boolean(initialData.featured),
        order: initialData.order || 0,
      });
    } else {
      setFormData({
        name: '',
        category: 'frontend',
        proficiency: 85,
        yearsOfExperience: 1,
        icon: '',
        featured: false,
        order: 0,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      proficiency: Number(formData.proficiency),
      yearsOfExperience: Number(formData.yearsOfExperience),
      order: Number(formData.order),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h3 className="text-lg font-bold text-white">
            {initialData ? 'Edit Skill' : 'Create New Skill'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-mono text-slate-300">Skill Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. TypeScript"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-300">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-slate-300">Proficiency (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-300">Years of Exp</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-300">Icon Key / Class</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g. FiCode"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-800 text-cyan-500 focus:ring-0"
              />
              <span className="font-mono text-slate-300">Featured Skill</span>
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
              className="px-5 py-2 rounded-xl text-white bg-cyan-600 hover:bg-cyan-500 font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Skill' : 'Create Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SkillFormModal;
