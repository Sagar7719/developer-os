import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExperiences, createExperienceApi, updateExperienceApi, deleteExperienceApi } from '../../api/experience.api.js';
import { ExperienceFormModal } from '../../components/admin/ExperienceFormModal.jsx';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal.jsx';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/States.jsx';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export function ExperienceAdmin() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: experiences, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['experience'],
    queryFn: () => fetchExperiences(),
  });

  const createMutation = useMutation({
    mutationFn: createExperienceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateExperienceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsFormOpen(false);
      setSelectedExperience(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperienceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setDeleteTarget(null);
    },
  });

  const handleCreate = () => {
    setSelectedExperience(null);
    setIsFormOpen(true);
  };

  const handleEdit = (experience) => {
    setSelectedExperience(experience);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (selectedExperience) {
      updateMutation.mutate({ id: selectedExperience.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            <FiBriefcase className="w-3.5 h-3.5" />
            Experience Records
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Experience CMS Management</h1>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-lg shadow-purple-600/20"
        >
          <FiPlus className="w-4 h-4" />
          Add Experience Entry
        </button>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner text="Loading experience records..." />}

      {/* Error State */}
      {isError && (
        <ErrorMessage
          title="Failed to load experience records"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!experiences || experiences.length === 0) && (
        <EmptyState
          title="No experience records found"
          message="Click 'Add Experience Entry' to create career timeline items."
        />
      )}

      {/* Experience Table */}
      {!isLoading && !isError && experiences && experiences.length > 0 && (
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Date Range</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{exp.role}</div>
                      <div className="text-[11px] text-cyan-400">{exp.company}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {formatDate(exp.startDate)} –{' '}
                      {exp.isCurrent ? (
                        <span className="text-cyan-400 font-semibold">Present</span>
                      ) : (
                        formatDate(exp.endDate)
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{exp.location || '—'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {exp.techStack?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <ExperienceFormModal
        isOpen={isFormOpen}
        initialData={selectedExperience}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.role} at ${deleteTarget?.company}"?`}
        message="This action will soft-delete the experience record from the CMS."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default ExperienceAdmin;
