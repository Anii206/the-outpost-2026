import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No scholarships match your filters',
  description = 'Try loosening your filter criteria, broadening your search term, or clearing your amount limits.',
  onReset
}) => {
  return (
    <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 text-center max-w-xl mx-auto my-8 text-text shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4 border border-accent/20">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed mb-6">
        {description}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-contrast text-sm font-semibold hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
