import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import { usePublicSettings } from '../hooks/usePublicSettings.js';

const isExternalUrl = (url) => /^https?:\/\//i.test(url);

export function Footer() {
  const { data: settings } = usePublicSettings();

  const siteName = settings?.general?.siteName?.trim() || 'Developer OS';
  const footerText =
    settings?.footer?.footerText?.trim() ||
    'Engineered with discipline, semantic versioning, and 5-tier architecture.';
  const githubUrl = settings?.socialLinks?.github?.trim() || 'https://github.com/sagardev/developer-os';
  const copyrightText = settings?.footer?.copyrightText?.trim() || '© 2026 Sagar.dev';

  return (
    <footer className="border-t border-slate-800/80 bg-[#0f172a]/60 text-slate-400 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-200">{siteName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              v0.3.0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {footerText}
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          {isExternalUrl(githubUrl) ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${siteName} GitHub Repository`}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <FiGithub className="w-4 h-4" />
              GitHub Repository
            </a>
          ) : (
            <Link
              to={githubUrl}
              aria-label={`Visit ${siteName} Repository`}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <FiGithub className="w-4 h-4" />
              GitHub Repository
            </Link>
          )}
          <span className="text-slate-700">•</span>
          <span>{copyrightText}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

