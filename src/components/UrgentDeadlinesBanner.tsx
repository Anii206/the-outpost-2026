import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, X } from 'lucide-react';
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
      className="bg-danger/10 border-b border-danger/30 py-2.5 px-4 text-xs font-semibold text-danger transition-colors"
      aria-label="Urgent deadline notification"
      role="alert"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-danger animate-ping shrink-0" />
          <Clock className="w-4 h-4 text-danger shrink-0" />
          <p className="truncate">
            <span className="font-extrabold uppercase tracking-wider text-danger">
              Urgent Deadline ({daysLeft === 0 ? 'Today' : `${daysLeft} days left`}):
            </span>{' '}
            <span className="font-bold">{urgentItem.name}</span> in your tracker is closing soon!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={`/scholarship/${urgentItem.id}`}
            className="flex items-center gap-1 text-xs font-bold text-danger hover:underline min-h-[36px]"
          >
            <span>Review Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md text-danger hover:bg-danger/20 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Dismiss deadline alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
