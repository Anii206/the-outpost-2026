import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS } from '../data/scholarships';
import { getDaysRemaining } from '../utils/dateUtils';

export const UrgentDeadlinesBanner: React.FC = () => {
  const { trackerItems, savedIds } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // Find tracked or saved scholarships closing within 7 days
  const criticalSchemes = SCHOLARSHIPS.filter((s) => {
    const isTrackedOrSaved = trackerItems[s.id] || savedIds.includes(s.id);
    if (!isTrackedOrSaved) return false;
    const days = getDaysRemaining(s.deadline);
    return days >= 0 && days <= 7;
  });

  if (criticalSchemes.length === 0) return null;

  const urgentItem = criticalSchemes[0];
  const daysLeft = getDaysRemaining(urgentItem.deadline);

  return (
    <aside 
      className="bg-accent/10 border-b border-accent/25 py-2 px-4 text-xs font-medium text-accent transition-colors"
      aria-label="Urgent deadline notification"
      role="alert"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <Clock size={15} className="text-accent shrink-0" />
          <p className="truncate font-sans text-xs">
            <span className="font-bold uppercase tracking-wider text-accent">
              Urgent Docket Alert ({daysLeft === 0 ? 'Closes Today' : `${daysLeft} days remaining`}):
            </span>{' '}
            <span className="font-semibold text-text">{urgentItem.name}</span> in your docket requires immediate submission.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={`/scholarship/${urgentItem.id}`}
            className="flex items-center gap-1 text-xs font-bold text-accent hover:underline min-h-[36px]"
          >
            <span>Review Checklist</span>
            <ArrowRight size={13} />
          </Link>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-[2px] text-accent hover:bg-accent/20 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Dismiss deadline alert"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
