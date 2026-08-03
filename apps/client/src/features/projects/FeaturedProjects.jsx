import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../../api/project.api.js';
import { ProjectCard } from './ProjectCard.jsx';
import { SkeletonCard, ErrorMessage, EmptyState } from '../../components/States.jsx';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar } from 'react-icons/fi';

export function FeaturedProjects() {
  const { data: projects, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects', { featured: true }],
    queryFn: () => fetchProjects({ featured: true, limit: 6 }),
  });

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
              <FiStar className="w-3.5 h-3.5" />
              Handcrafted Work
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Featured Engineering Projects
            </h2>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            View All Projects
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
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
            title="Failed to load featured projects"
            message={error?.message}
            onRetry={refetch}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!projects || projects.length === 0) && (
          <EmptyState
            title="No featured projects available"
            message="Check back soon as new engineering portfolio projects are published."
          />
        )}

        {/* Success Grid */}
        {!isLoading && !isError && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProjects;
