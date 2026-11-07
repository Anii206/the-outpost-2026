import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface rounded-[4px] border border-border p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-surface-2 rounded-[2px]" />
        <div className="h-5 w-16 bg-surface-2 rounded-[2px]" />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-32 bg-surface-2 rounded-[2px]" />
        <div className="h-6 w-3/4 bg-surface-2 rounded-[2px]" />
      </div>

      <div className="space-y-1.5">
        <div className="h-3 w-full bg-surface-2 rounded-[2px]" />
        <div className="h-3 w-5/6 bg-surface-2 rounded-[2px]" />
      </div>

      <div className="flex gap-2">
        <div className="h-5 w-16 bg-surface-2 rounded-[2px]" />
        <div className="h-5 w-20 bg-surface-2 rounded-[2px]" />
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between">
        <div className="h-6 w-24 bg-surface-2 rounded-[2px]" />
        <div className="h-8 w-24 bg-surface-2 rounded-[2px]" />
      </div>
    </div>
  );
};
