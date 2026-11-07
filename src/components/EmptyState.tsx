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
    <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed mb-6">
        {description}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#133E2B] text-white text-sm font-semibold hover:bg-[#1B533A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#133E2B] focus:ring-offset-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
