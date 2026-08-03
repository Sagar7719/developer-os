import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, createProjectApi, updateProjectApi, deleteProjectApi } from '../../api/project.api.js';
import { ProjectFormModal } from '../../components/admin/ProjectFormModal.jsx';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal.jsx';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/States.jsx';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiExternalLink, FiGithub } from 'react-icons/fi';

export function ProjectAdmin() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: projects, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects', { isPublished: undefined }],
    queryFn: () => fetchProjects({ isPublished: undefined }),
  });

  const createMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
      setSelectedProject(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteTarget(null);
    },
  });

  const handleCreate = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (selectedProject) {
      updateMutation.mutate({ id: selectedProject.id, data: formData });
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
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
            <FiFolder className="w-3.5 h-3.5" />
            Project Records
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Project CMS Management</h1>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-lg shadow-purple-600/20"
        >
          <FiPlus className="w-4 h-4" />
          Add New Project
        </button>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner text="Loading projects..." />}

      {/* Error State */}
      {isError && (
        <ErrorMessage
          title="Failed to load project records"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!projects || projects.length === 0) && (
        <EmptyState
          title="No projects found"
          message="Click 'Add New Project' to create your first portfolio entry."
        />
      )}

      {/* Projects Table */}
      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title & Slug</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{project.title}</div>
                      <div className="text-[10px] font-mono text-purple-400">/{project.slug}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.techStack?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {project.featured ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-600 font-mono text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {project.isPublished ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
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
      <ProjectFormModal
        isOpen={isFormOpen}
        initialData={selectedProject}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.title}"?`}
        message="This action will soft-delete the project record from the CMS."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default ProjectAdmin;
