import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSkills } from '../../api/skill.api.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/States.jsx';
import { FiCpu, FiCheckCircle } from 'react-icons/fi';

const CATEGORIES = [
  { key: 'all', label: 'All Domains' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'devops', label: 'DevOps' },
  { key: 'tools', label: 'Tools' },
];

export function SkillMatrix() {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: skills, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['skills'],
    queryFn: () => fetchSkills(),
  });

  const filteredSkills = React.useMemo(() => {
    if (!skills) return [];
    if (activeCategory === 'all') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              <FiCpu className="w-3.5 h-3.5" />
              Technical Competencies
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Skills & Engineering Matrix
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner text="Loading skills matrix..." />}

        {/* Error State */}
        {isError && (
          <ErrorMessage
            title="Failed to load skills matrix"
            message={error?.message}
            onRetry={refetch}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredSkills.length === 0 && (
          <EmptyState
            title="No skills found in this domain"
            message="Select another category or check back later."
          />
        )}

        {/* Skills Grid */}
        {!isLoading && !isError && filteredSkills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-[#1e293b]/40 border border-slate-800/80 rounded-xl p-4 space-y-3 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-slate-200">{skill.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                    {skill.category}
                  </span>
                </div>

                {/* Proficiency Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Proficiency</span>
                    <span className="text-cyan-400 font-semibold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>

                {/* Experience Years */}
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1">
                  <span>Experience</span>
                  <span className="text-purple-300 font-medium">
                    {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'yr' : 'yrs'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SkillMatrix;
