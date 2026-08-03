import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../../api/project.api.js';
import { ProjectCard } from './ProjectCard.jsx';
import { SkeletonCard, ErrorMessage, EmptyState } from '../../components/States.jsx';
import { FiSearch, FiFilter } from 'react-icons/fi';

const CATEGORIES = [
  { key: 'all', label: 'All Projects' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'backend', label: 'Backend' },
  { key: 'fullstack', label: 'Fullstack' },
  { key: 'open-source', label: 'Open Source' },
];

export function ProjectGrid() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const queryParams = activeCategory !== 'all' ? { category: activeCategory } : {};

  const { data: projects, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects', queryParams],
    queryFn: () => fetchProjects(queryParams),
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery.trim()) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(query)))
    );
  }, [projects, searchQuery]);

  return (
    <section className="space-y-8">
      {/* Category Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#1e293b]/40 border border-slate-800/80 rounded-2xl p-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <FiFilter className="w-4 h-4 text-purple-400 mr-1 hidden sm:inline" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <FiSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/80 transition-colors"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorMessage
          title="Failed to load project portfolio"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredProjects.length === 0 && (
        <EmptyState
          title="No projects match your filter criteria"
          message="Try selecting a different category or clearing your search term."
        />
      )}

      {/* Project Grid */}
      {!isLoading && !isError && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectGrid;
