import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePublicSettings } from '../hooks/usePublicSettings.js';
import { isMaintenanceBypassRoute } from '../config/maintenance.config.js';
import { FiAlertOctagon, FiClock, FiShield, FiLock, FiMail } from 'react-icons/fi';

/**
 * MaintenanceGuard — Protects public portfolio routes when system maintenance mode is active.
 * Extensible design via centralized `isMaintenanceBypassRoute()` matcher.
 */
export function MaintenanceGuard({ children }) {
  const location = useLocation();
  const { data: settings } = usePublicSettings();

  const isBypassed = isMaintenanceBypassRoute(location.pathname);
  const isMaintenanceActive = !isBypassed && Boolean(settings?.maintenance?.enabled);

  useEffect(() => {
    if (isMaintenanceActive) {
      // 1. Set Maintenance Document Title
      const originalTitle = document.title;
      document.title = 'Maintenance | Developer OS';

      // 2. Set Robots Meta Tag (noindex, nofollow)
      let robotsMeta = document.querySelector('meta[name="robots"]');
      const originalRobots = robotsMeta ? robotsMeta.getAttribute('content') : null;

      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');

      // Cleanup upon unmount or when maintenance turns off
      return () => {
        document.title = originalTitle;
        if (originalRobots !== null) {
          robotsMeta.setAttribute('content', originalRobots);
        } else {
          robotsMeta.setAttribute('content', 'index, follow');
        }
      };
    }
  }, [isMaintenanceActive]);

  if (isMaintenanceActive) {
    const maintenanceMsg =
      settings?.maintenance?.message?.trim() ||
      'System undergoing scheduled maintenance and architecture upgrades. Please check back shortly.';
    const estimatedBack = settings?.maintenance?.estimatedBack?.trim();
    const contactEmail = settings?.contactInfo?.publicEmail?.trim() || 'sagar@developer-os.dev';

    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-purple-500/30 selection:text-purple-200">
        {/* Top Header Badge */}
        <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
              <FiShield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              Developer OS <span className="text-purple-400 font-mono text-xs font-normal">v0.1.0</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Maintenance Mode Active</span>
          </div>
        </header>

        {/* Central Maintenance Notice Card */}
        <main className="w-full max-w-xl my-auto py-12">
          <div className="bg-[#1e293b]/60 border border-slate-800/80 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Lock Octagon Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <FiAlertOctagon className="w-8 h-8 animate-pulse" />
            </div>

            {/* Title & Message */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Scheduled System Maintenance
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                {maintenanceMsg}
              </p>
            </div>

            {/* Estimated Return Time Badge */}
            {estimatedBack && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
                <FiClock className="w-4 h-4 text-cyan-400" />
                <span>Estimated Completion: <strong className="text-white">{estimatedBack}</strong></span>
              </div>
            )}

            {/* Support/Contact Footer */}
            <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 font-mono">
                <FiLock className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin CMS remains operational</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
              >
                <FiMail className="w-3.5 h-3.5" />
                <span>{contactEmail}</span>
              </a>
            </div>
          </div>
        </main>

        {/* Page Footer */}
        <footer className="w-full max-w-4xl text-center py-4 border-t border-slate-800/80 text-xs text-slate-500 font-mono">
          © 2026 Sagar.dev — Developer OS Platform Engineering.
        </footer>
      </div>
    );
  }

  return children;
}

export default MaintenanceGuard;
