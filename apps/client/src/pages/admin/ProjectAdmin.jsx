import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminProjects,
  createProjectApi,
  updateProjectApi,
  updateProjectFeaturedApi,
  updateProjectStatusApi,
  reorderProjectsApi,
  deleteProjectApi,
  restoreProjectApi,
} from '../../api/project.api.js';
import { ProjectFormModal } from '../../components/admin/ProjectFormModal.jsx';
import { ProjectReorderModal } from '../../components/admin/ProjectReorderModal.jsx';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal.jsx';
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from '../../components/States.jsx';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiStar,
  FiList,
  FiSearch,
  FiRefreshCw,
  FiGithub,
  FiExternalLink,
  FiFigma,
} from 'react-icons/fi';

import { MediaToast } from '../../components/media/MediaToast.jsx';

export function ProjectAdmin() {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, text) => {
    setToastMessage({ type, text, id: Date.now() });
  };

  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['projects', 'admin', { statusFilter, searchQuery }],
    queryFn: () =>
      fetchAdminProjects({
        status: statusFilter,
        search: searchQuery,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsFormOpen(false);
      showToast('success', 'Project created successfully.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsFormOpen(false);
      setSelectedProject(null);
      showToast('success', 'Project updated successfully.');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: updateProjectFeaturedApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: updateProjectStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderProjectsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsReorderOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setDeleteTarget(null);
      showToast('success', 'Project moved to Trash.');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      showToast('success', 'Project restored successfully.');
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
      updateMutation.mutate({
        id: selectedProject.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  const filteredProjects = projects?.filter((p) => {
    if (statusFilter === 'deleted') return p.isDeleted;
    if (p.isDeleted) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'published') return p.isPublished || p.status === 'published';
    if (statusFilter === 'draft') return p.status === 'draft' || (!p.isPublished && p.status !== 'archived');
    if (statusFilter === 'archived') return p.status === 'archived';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
            <FiFolder className="w-3.5 h-3.5" />
            Project Records Engine
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Projects CMS Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReorderOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all"
          >
            <FiList className="w-4 h-4 text-purple-400" />
            Reorder Sequence
          </button>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-lg shadow-purple-600/20"
          >
            <FiPlus className="w-4 h-4" />
            Add New Project
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#1e293b]/40 border border-slate-800 rounded-xl p-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {[
            { id: 'all', label: 'All Active' },
            { id: 'published', label: 'Published' },
            { id: 'draft', label: 'Drafts' },
            { id: 'archived', label: 'Archived' },
            { id: 'deleted', label: 'Trash (Soft Deleted)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && <LoadingSpinner text="Loading project records..." />}

      {/* Error */}
      {isError && (
        <ErrorMessage
          title="Failed to load project records"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && (!filteredProjects || filteredProjects.length === 0) && (
        <EmptyState
          title={statusFilter === 'deleted' ? 'No soft-deleted projects in trash' : 'No matching projects found'}
          message={
            statusFilter === 'deleted'
              ? 'Soft-deleted projects will appear here for admin restoration.'
              : 'Click "Add New Project" to create your first portfolio entry.'
          }
        />
      )}

      {/* Table */}
      {!isLoading && !isError && filteredProjects && filteredProjects.length > 0 && (
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title &amp; Slug</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4">Links</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      project.isDeleted ? 'opacity-60 bg-red-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        {project.title}
                        {project.isFeatured && (
                          <span title="Featured Project Priority Placement">
                            <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-purple-400">/{project.slug}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {project.category}
                      </span>
                    </td>

                    {/* Tech Stack */}
                    <td className="py-3.5 px-4">
                      {project.techStack && project.techStack.length > 0 ? (


                        <div className="flex flex-wrap items-center gap-1 max-w-xs">
                          {project.techStack.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              {tech}
                            </span>
                          ))}

                          {project.techStack.length > 3 && (
                            <span
                              title={`+${project.techStack.length - 3} more: ${project.techStack.slice(3).join(', ')}`}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-600/10 text-purple-300 border border-purple-500/20 font-semibold cursor-help"
                            >
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600 font-mono text-[10px]">—</span>
                      )}
                    </td>


                    {/* Tri-Links */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-slate-800 text-purple-400 hover:text-white transition-colors"
                            title="GitHub Repository"
                          >
                            <FiGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-slate-800 text-cyan-400 hover:text-white transition-colors"
                            title="Live Demo"
                          >
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.figmaUrl && (
                          <a
                            href={project.figmaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-slate-800 text-pink-400 hover:text-white transition-colors"
                            title="Figma Specification"
                          >
                            <FiFigma className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {!project.githubUrl && !project.liveUrl && !project.figmaUrl && (
                          <span className="text-slate-600 font-mono text-[10px]">—</span>
                        )}
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        disabled={project.isDeleted}
                        onClick={() =>
                          toggleFeaturedMutation.mutate({
                            id: project.id,
                            isFeatured: !project.isFeatured,
                          })
                        }
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all font-semibold ${
                          project.isFeatured
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {project.isFeatured ? '★ Featured' : 'Normal'}
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <select
                        disabled={project.isDeleted}
                        value={project.status || (project.isPublished ? 'published' : 'draft')}
                        onChange={(e) =>
                          toggleStatusMutation.mutate({
                            id: project.id,
                            status: e.target.value,
                          })
                        }
                        className={`px-2 py-1 rounded text-[10px] font-mono bg-slate-900 border font-semibold text-center focus:outline-none ${
                          project.status === 'published' || (project.isPublished && !project.status)
                            ? 'text-emerald-300 border-emerald-500/30'
                            : project.status === 'archived'
                            ? 'text-slate-400 border-slate-700'
                            : 'text-amber-300 border-amber-500/30'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {project.isDeleted ? (
                          <button
                            onClick={() => restoreMutation.mutate(project.id)}
                            disabled={restoreMutation.isPending}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 hover:bg-emerald-900/40 text-[10px] font-mono transition-colors"
                            title="Restore Soft Deleted Project"
                          >
                            <FiRefreshCw className="w-3 h-3" />
                            Restore
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(project)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              title="Edit Project"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteTarget(project)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                              title="Soft Delete Project"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isFormOpen}
        initialData={selectedProject}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProject(null);
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Project Reorder Modal */}
      <ProjectReorderModal
        isOpen={isReorderOpen}
        projects={projects?.filter((p) => !p.isDeleted) || []}
        onSave={(items) => reorderMutation.mutate(items)}
        onClose={() => setIsReorderOpen(false)}
        isSaving={reorderMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title={`Soft Delete "${deleteTarget?.title}"?`}
        message="This action will mark the project as deleted (isDeleted = true). Admins can restore it anytime from the Trash tab."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleteMutation.isPending}
      />

      {/* Success Notification Toast */}
      <MediaToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}


export default ProjectAdmin;