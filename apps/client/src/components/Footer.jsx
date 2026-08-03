import React from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0f172a]/60 text-slate-400 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-200">Developer OS</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              v0.3.0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Engineered with discipline, semantic versioning, and 5-tier architecture.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a
            href="https://github.com/sagardev/developer-os"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <FiGithub className="w-4 h-4" />
            GitHub Repository
          </a>
          <span className="text-slate-700">•</span>
          <span>© 2026 Sagar.dev</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
