import React from 'react';

export function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-sm animate-pulse">
          D
        </div>
        <div className="text-xs font-mono text-slate-400">Loading module...</div>
      </div>
    </div>
  );
}

export default PageFallback;
