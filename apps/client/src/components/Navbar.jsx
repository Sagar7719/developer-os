import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCode, FiLayers, FiFolder, FiBookOpen } from 'react-icons/fi';

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: FiCode },
    { label: 'Projects', path: '/projects', icon: FiFolder },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold font-mono text-base shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            D
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">Developer OS</span>
            <span className="block text-[10px] font-mono text-purple-400 font-medium">Sagar.dev</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}

          <a
            href="https://github.com/Sagar7719/developer-os"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
          >
            <FiBookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Docs</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
