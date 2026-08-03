import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCode, FiLayers, FiShield, FiTerminal } from 'react-icons/fi';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Developer OS v0.3.0</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Identity Platform Release</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Production-Grade <br />
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Developer Platform
            </span>
          </h1>

          {/* Value Proposition */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Built to demonstrate modern software engineering practices through a scalable portfolio platform, personal CMS, and 5-tier backend architecture.
          </p>

          <div className="pt-2 text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
            Designed & Engineered by Sagar.dev
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/25 hover:scale-105"
            >
              Explore Projects
              <FiArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://github.com/sagardev/developer-os"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e293b]/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm transition-all hover:scale-105"
            >
              <FiCode className="w-4 h-4 text-cyan-400" />
              Source Code
            </a>
          </div>

          {/* Architecture Highlights Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-[#1e293b]/40 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
              <FiLayers className="w-4 h-4 text-purple-400" />
              <div className="text-xs font-semibold text-slate-200">5-Tier Server Pattern</div>
              <div className="text-[11px] text-slate-400 font-mono">Route → DB Layer</div>
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
              <FiShield className="w-4 h-4 text-cyan-400" />
              <div className="text-xs font-semibold text-slate-200">Identity Platform</div>
              <div className="text-[11px] text-slate-400 font-mono">Dual JWT & SHA-256</div>
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
              <FiTerminal className="w-4 h-4 text-purple-400" />
              <div className="text-xs font-semibold text-slate-200">pnpm Monorepo</div>
              <div className="text-[11px] text-slate-400 font-mono">React 19 + Express</div>
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
              <FiCode className="w-4 h-4 text-cyan-400" />
              <div className="text-xs font-semibold text-slate-200">Enterprise Specs</div>
              <div className="text-[11px] text-slate-400 font-mono">DOC-000 Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
