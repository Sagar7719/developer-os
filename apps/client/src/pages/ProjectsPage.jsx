import React from 'react';
import { PageMetadata } from '../components/PageMetadata.jsx';
import { ProjectGrid } from '../features/projects/ProjectGrid.jsx';
import { FiFolder } from 'react-icons/fi';

export function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-20">
      <PageMetadata
        title="Projects Portfolio & Case Studies"
        description="Explore complete production software projects built with modern web frameworks, clean architecture, and scalable design patterns."
      />
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
          <FiFolder className="w-3.5 h-3.5" />
          Engineering Showcase
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Portfolio Projects & Case Studies
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Explore complete production software projects built with modern web frameworks, clean architecture, and scalable design patterns.
        </p>
      </div>

      {/* Project Grid Feature */}
      <ProjectGrid />
    </div>
  );
}

export default ProjectsPage;

