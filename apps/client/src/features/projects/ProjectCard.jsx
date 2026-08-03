import React from 'react';
import { FiGithub, FiExternalLink, FiFolder } from 'react-icons/fi';

const categoryColors = {
  web: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  mobile: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  backend: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  fullstack: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  'open-source': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
};

export function ProjectCard({ project }) {
  const {
    title,
    subtitle,
    description,
    category,
    techStack,
    githubUrl,
    liveUrl,
    coverImage,
    featured,
  } = project;

  return (
    <div className="group bg-[#1e293b]/60 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-purple-500/5 flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Cover Image or Fallback Header */}
        {coverImage ? (
          <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src={coverImage}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-28 rounded-xl bg-gradient-to-br from-slate-900 via-[#1e293b] to-slate-900 border border-slate-800 p-4 flex items-center justify-between">
            <FiFolder className="w-8 h-8 text-purple-400/80" />
            <span className="text-xs font-mono text-slate-500">v0.3.0 Module</span>
          </div>
        )}

        {/* Category & Featured Badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono border uppercase tracking-wider ${
              categoryColors[category] || categoryColors.web
            }`}
          >
            {category}
          </span>
          {featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          {subtitle && <p className="text-xs font-medium text-purple-400/90">{subtitle}</p>}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{description}</p>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        {/* Tech Stack Pills */}
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Web Action Links */}
        <div className="flex items-center gap-3 pt-1">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <FiGithub className="w-3.5 h-3.5" />
              Code
            </a>
          )}

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors ml-auto"
            >
              Live Demo
              <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
