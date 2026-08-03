import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSkills, createSkillApi, updateSkillApi, deleteSkillApi } from '../../api/skill.api.js';
import { SkillFormModal } from '../../components/admin/SkillFormModal.jsx';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal.jsx';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/States.jsx';
import { FiPlus, FiEdit2, FiTrash2, FiCpu } from 'react-icons/fi';

export function SkillAdmin() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: skills, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['skills'],
    queryFn: () => fetchSkills(),
  });

  const createMutation = useMutation({
    mutationFn: createSkillApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSkillApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsFormOpen(false);
      setSelectedSkill(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkillApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setDeleteTarget(null);
    },
  });

  const handleCreate = () => {
    setSelectedSkill(null);
    setIsFormOpen(true);
  };

  const handleEdit = (skill) => {
    setSelectedSkill(skill);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (selectedSkill) {
      updateMutation.mutate({ id: selectedSkill.id, data: formData });
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
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            <FiCpu className="w-3.5 h-3.5" />
            Skill Matrix Records
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Skill CMS Management</h1>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-lg shadow-cyan-600/20"
        >
          <FiPlus className="w-4 h-4" />
          Add New Skill
        </button>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner text="Loading skill records..." />}

      {/* Error State */}
      {isError && (
        <ErrorMessage
          title="Failed to load skill records"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!skills || skills.length === 0) && (
        <EmptyState
          title="No skills found"
          message="Click 'Add New Skill' to register technical competencies."
        />
      )}

      {/* Skills Table */}
      {!isLoading && !isError && skills && skills.length > 0 && (
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Skill Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Proficiency</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{skill.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {skill.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'yr' : 'yrs'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {skill.featured ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-600 font-mono text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(skill)}
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
      <SkillFormModal
        isOpen={isFormOpen}
        initialData={selectedSkill}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This action will soft-delete the skill record from the CMS."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default SkillAdmin;
