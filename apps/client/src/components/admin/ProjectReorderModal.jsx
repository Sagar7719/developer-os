import React, { useState, useEffect } from 'react';
import { FiX, FiArrowUp, FiArrowDown, FiList, FiSave } from 'react-icons/fi';

export function ProjectReorderModal({ isOpen, projects = [], onSave, onClose, isSaving }) {
  const [orderedItems, setOrderedItems] = useState([]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setOrderedItems([...projects]);
    }
  }, [projects, isOpen]);

  if (!isOpen) return null;

  const moveUp = (index) => {
    if (index === 0) return;
    const newItems = [...orderedItems];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setOrderedItems(newItems);
  };

  const moveDown = (index) => {
    if (index === orderedItems.length - 1) return;
    const newItems = [...orderedItems];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setOrderedItems(newItems);
  };

  const handleSave = () => {
    const payload = orderedItems.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative mx-auto w-full max-w-xl rounded-2xl border border-slate-800 bg-[#1e293b] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-sm">
            <FiList className="w-4 h-4" />
            Reorder Portfolio Projects
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          Adjust project presentation sequence using the controls below. Featured projects will maintain priority.
        </p>

        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {orderedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-purple-400 font-mono text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <div>
                  <div className="font-semibold text-slate-200">{item.title}</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    /{item.slug} • <span className="uppercase text-purple-400">{item.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                  title="Move Up"
                >
                  <FiArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === orderedItems.length - 1}
                  onClick={() => moveDown(index)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                  title="Move Down"
                >
                  <FiArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/80 text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-white bg-purple-600 hover:bg-purple-500 font-medium text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            {isSaving ? 'Saving Sequence...' : 'Save New Sequence'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectReorderModal;
