import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { AIAssistantDrawer } from './AIAssistantDrawer.jsx';
import {
  FiGrid,
  FiFolder,
  FiCpu,
  FiBriefcase,
  FiMail,
  FiSettings,
  FiLogOut,
  FiExternalLink,
  FiShield,
  FiZap,
  FiActivity,
} from 'react-icons/fi';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: FiGrid, end: true },
    { label: 'Projects CMS', path: '/admin/projects', icon: FiFolder },
    { label: 'Skills CMS', path: '/admin/skills', icon: FiCpu },
    { label: 'Experience CMS', path: '/admin/experience', icon: FiBriefcase },
    { label: 'Messages Inbox', path: '/admin/messages', icon: FiMail },
    { label: 'AI Telemetry & Logs', path: '/admin/ai-logs', icon: FiActivity },
    { label: 'Platform Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1e293b]/60 border-b md:border-b-0 md:border-r border-slate-800/80 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Admin Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-mono font-bold">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">Admin CMS</div>
              <div className="text-[10px] font-mono text-purple-400">Developer OS v1.2.0</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-mono text-cyan-400 hover:text-cyan-300 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <span>View Public Site</span>
            <FiExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-[#0f172a]/80 backdrop-blur-md">
          <div className="text-xs font-mono text-slate-400">
            Authenticated as <span className="text-purple-400 font-semibold">{user?.email}</span> (
            <span className="text-cyan-400">{user?.role}</span>)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 transition-all shadow-sm"
            >
              <FiZap className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant Slide-out Drawer */}
      <AIAssistantDrawer isOpen={isAiDrawerOpen} onClose={() => setIsAiDrawerOpen(false)} />
    </div>
  );
}

export default AdminLayout;
