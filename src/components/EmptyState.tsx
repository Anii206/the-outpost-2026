import React from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No gazette notices match your criteria',
  description = 'Try loosening your academic filters, widening income limits, or clearing search keywords.',
  onReset,
}) => {
  return (
    <div className="bg-surface rounded-[4px] border border-border p-8 sm:p-12 text-center max-w-xl mx-auto my-8 text-text">
      <div className="w-12 h-12 rounded-[2px] bg-surface-2 text-muted flex items-center justify-center mx-auto mb-4 border border-border">
        <MagnifyingGlass size={22} className="text-muted" />
      </div>
      <h3 className="font-serif text-xl font-bold text-text mb-2">{title}</h3>
      <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed mb-6">
        {description}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
        >
          <ArrowCounterClockwise size={14} />
          <span>Reset Gazette Filters</span>
        </button>
      )}
    </div>
  );
};
