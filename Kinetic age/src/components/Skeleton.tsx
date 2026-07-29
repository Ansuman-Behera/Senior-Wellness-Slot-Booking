import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 bg-slate-100 rounded-xl" />
      <div className="w-16 h-6 bg-slate-100 rounded-full" />
    </div>
    <div className="h-6 bg-slate-100 rounded w-3/4" />
    <div className="h-4 bg-slate-100 rounded w-full" />
    <div className="h-4 bg-slate-100 rounded w-2/3" />
    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
      <div className="h-6 bg-slate-100 rounded w-1/4" />
      <div className="h-9 bg-slate-100 rounded-xl w-28" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
    <div className="h-12 bg-slate-50 border-b border-slate-100" />
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="h-4 bg-slate-100 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-1/6" />
          <div className="h-4 bg-slate-100 rounded w-1/6" />
          <div className="h-8 bg-slate-100 rounded-lg w-20" />
        </div>
      ))}
    </div>
  </div>
);
