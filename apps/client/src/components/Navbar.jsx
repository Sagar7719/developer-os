import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCode, FiFolder, FiMail, FiBookOpen } from 'react-icons/fi';
import { usePublicSettings } from '../hooks/usePublicSettings.js';

const isExternalUrl = (url) => /^https?:\/\//i.test(url);

export function Navbar() {
  const location = useLocation();
  const { data: settings } = usePublicSettings();

  const siteName = settings?.general?.siteName?.trim() || 'Developer OS';
  const logoUrl = settings?.general?.logoUrl?.trim() || '';
  const rawAuthorName = settings?.hero?.name?.trim() || 'Sagar.dev';
  const brandSub = rawAuthorName.includes('.') ? rawAuthorName : `${rawAuthorName}.dev`;
  const docsUrl = settings?.socialLinks?.github?.trim() || 'https://github.com/Sagar7719/developer-os';
  const brandInitial = siteName.charAt(0).toUpperCase() || 'D';

  const navItems = [
    { label: 'Home', path: '/', icon: FiCode },
    { label: 'Projects', path: '/projects', icon: FiFolder },
    { label: 'Contact', path: '/contact', icon: FiMail },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" aria-label={`${siteName} Homepage`} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold font-mono text-base shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="w-full h-full object-cover" />
            ) : (
              brandInitial
            )}
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">{siteName}</span>
            <span className="block text-[10px] font-mono text-purple-400 font-medium">{brandSub}</span>
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
                aria-label={item.label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}

          {isExternalUrl(docsUrl) ? (
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Source Documentation on GitHub"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <FiBookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Docs</span>
            </a>
          ) : (
            <Link
              to={docsUrl}
              aria-label="View Source Documentation"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <FiBookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

