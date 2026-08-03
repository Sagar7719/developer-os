import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../../api/project.api.js';
import { fetchSkills } from '../../api/skill.api.js';
import { fetchExperiences } from '../../api/experience.api.js';
import { Link } from 'react-router-dom';
import { FiFolder, FiCpu, FiBriefcase, FiArrowRight, FiShield } from 'react-icons/fi';

export function AdminDashboard() {
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: () => fetchProjects() });
  const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: () => fetchSkills() });
  const { data: experiences } = useQuery({ queryKey: ['experience'], queryFn: () => fetchExperiences() });

  const stats = [
    {
      title: 'Total Projects',
      count: projects ? projects.length : 0,
      path: '/admin/projects',
      icon: FiFolder,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Skills Registered',
      count: skills ? skills.length : 0,
      path: '/admin/skills',
      icon: FiCpu,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Career Milestones',
      count: experiences ? experiences.length : 0,
      path: '/admin/experience',
      icon: FiBriefcase,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-[#1e293b] to-cyan-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
            <FiShield className="w-3.5 h-3.5" />
            <span>Developer OS CMS Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Admin Overview
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Manage portfolio showcases, technical skill matrices, and career experience timeline entries.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.path}
              className="bg-[#1e293b]/40 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-6 space-y-4 transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>

              <div>
                <div className="text-3xl font-extrabold text-white">{stat.count}</div>
                <div className="text-xs font-mono text-slate-400 mt-1">{stat.title}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default AdminDashboard;
