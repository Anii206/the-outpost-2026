import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-24 bg-surface-2 rounded-full"></div>
          <div className="h-8 w-8 bg-surface-2 rounded-xl"></div>
        </div>
        <div className="h-3 w-28 bg-surface-2 rounded mb-2"></div>
        <div className="h-6 w-3/4 bg-surface-2 rounded mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3.5 w-full bg-surface-2 rounded"></div>
          <div className="h-3.5 w-5/6 bg-surface-2 rounded"></div>
        </div>
        <div className="flex gap-2 mb-6">
          <div className="h-6 w-20 bg-surface-2 rounded-lg"></div>
          <div className="h-6 w-24 bg-surface-2 rounded-lg"></div>
        </div>
      </div>
      <div>
        <div className="pt-4 border-t border-border flex justify-between items-center mb-4">
          <div className="h-6 w-24 bg-surface-2 rounded"></div>
          <div className="h-6 w-24 bg-surface-2 rounded"></div>
        </div>
        <div className="h-10 w-full bg-surface-2 rounded-xl"></div>
      </div>
    </div>
  );
};
