import React from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { MagnifierDocketIllustration } from './illustrations/EditorialIllustrations';

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
    <div className="bg-surface rounded-[4px] border border-border p-8 sm:p-12 text-center max-w-xl mx-auto my-8 text-text shadow-hard relative overflow-hidden">
      <div className="flex justify-center mb-4">
        <MagnifierDocketIllustration size={130} />
      </div>
      <h3 className="font-serif text-xl font-bold text-text mb-2">{title}</h3>
      <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed mb-6 max-w-md mx-auto">
        {description}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all min-h-[44px]"
        >
          <ArrowCounterClockwise size={14} />
          <span>Reset Gazette Filters</span>
        </button>
      )}
    </div>
  );
};
