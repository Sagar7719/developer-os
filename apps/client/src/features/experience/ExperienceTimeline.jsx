import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchExperiences } from '../../api/experience.api.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/States.jsx';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export function ExperienceTimeline() {
  const { data: experiences, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['experience'],
    queryFn: () => fetchExperiences(),
  });

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800/80 pb-5">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
            <FiBriefcase className="w-3.5 h-3.5" />
            Career Journey
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Experience & Engineering Leadership
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner text="Loading career timeline..." />}

        {/* Error State */}
        {isError && (
          <ErrorMessage
            title="Failed to load experience history"
            message={error?.message}
            onRetry={refetch}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!experiences || experiences.length === 0) && (
          <EmptyState
            title="No career timeline records found"
            message="Check back soon as career experience records are populated."
          />
        )}

        {/* Vertical Timeline */}
        {!isLoading && !isError && experiences && experiences.length > 0 && (
          <div className="relative border-l-2 border-slate-800/80 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-purple-500 group-hover:border-cyan-400 group-hover:scale-125 transition-all shadow-md shadow-purple-500/20" />

                <div className="bg-[#1e293b]/40 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl p-6 space-y-4 transition-all">
                  {/* Role & Company Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="text-sm font-semibold text-cyan-400">{exp.company}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                        <FiCalendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>
                          {formatDate(exp.startDate)} –{' '}
                          {exp.isCurrent ? (
                            <span className="text-cyan-400 font-semibold">Present</span>
                          ) : (
                            formatDate(exp.endDate)
                          )}
                        </span>
                      </div>

                      {exp.location && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <FiMapPin className="w-3.5 h-3.5" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>

                  {/* Key Achievements Bullet Points */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-mono text-slate-400 font-medium">Key Accomplishments:</div>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                        {exp.achievements.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ExperienceTimeline;
