import React from 'react';

export function MediaSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#1e293b]/40 border border-slate-800/80 rounded-2xl p-3 space-y-3 animate-pulse"
        >
          <div className="aspect-square bg-slate-800/60 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-slate-800/80 rounded" />
            <div className="h-3 w-1/2 bg-slate-800/60 rounded" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 w-12 bg-slate-800/60 rounded-full" />
            <div className="h-4 w-16 bg-slate-800/60 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MediaSkeletonList({ count = 6 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#1e293b]/40 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800/80 rounded-lg" />
            <div className="space-y-1">
              <div className="h-4 w-40 bg-slate-800/80 rounded" />
              <div className="h-3 w-24 bg-slate-800/60 rounded" />
            </div>
          </div>
          <div className="h-4 w-20 bg-slate-800/60 rounded" />
        </div>
      ))}
    </div>
  );
}

export default MediaSkeletonGrid;
