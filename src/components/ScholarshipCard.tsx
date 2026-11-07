import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bookmark, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  MapPin, 
  Sparkles,
  KanbanSquare,
  Clock,
  Columns
} from 'lucide-react';
import type { Scholarship, TrackerStatus } from '../types';
import { useApp } from '../context/AppContext';
import { formatDeadlineBadge, formatReadableDate } from '../utils/dateUtils';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  showMatchReasons?: boolean;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const { 
    isSaved, 
    toggleSave, 
    calculateMatch, 
    getTrackerStatus, 
    setTrackerStatus,
    isCompared,
    toggleCompare
  } = useApp();

  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const saved = isSaved(scholarship.id);
  const compared = isCompared(scholarship.id);
  const currentTrackerStatus = getTrackerStatus(scholarship.id);
  const matchResult = calculateMatch(scholarship);
  const deadlineInfo = formatDeadlineBadge(scholarship.deadline);

  const trackerStatusOptions: { status: TrackerStatus; label: string }[] = [
    { status: 'saved', label: 'Saved' },
    { status: 'applying', label: 'Applying' },
    { status: 'submitted', label: 'Submitted' },
    { status: 'awarded', label: 'Awarded' },
    { status: 'rejected', label: 'Rejected' },
  ];

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = toggleCompare(scholarship.id);
    if (!success && !compared) {
      alert('You can compare a maximum of 3 scholarships simultaneously.');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
      className={`relative flex flex-col justify-between bg-surface rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
        compared 
          ? 'border-primary ring-2 ring-primary/20' 
          : scholarship.featured 
          ? 'border-primary/40 ring-1 ring-primary/20' 
          : 'border-border hover:border-primary/40'
      } p-5 sm:p-6`}
      aria-labelledby={`scholarship-title-${scholarship.id}`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Match Percentage Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                matchResult.score >= 80
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : matchResult.score >= 60
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'bg-surface-2 text-muted border border-border'
              }`}
              title={matchResult.reasons.join('\n')}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchResult.score}% Match</span>
            </div>

            {/* Featured Badge */}
            {scholarship.featured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary text-primary-contrast">
                Featured
              </span>
            )}

            {/* Active Tracker Stage Pill */}
            {currentTrackerStatus && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-2 text-text capitalize border border-border">
                <KanbanSquare className="w-3 h-3 text-primary" />
                {currentTrackerStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Compare Checkbox Button */}
            <button
              type="button"
              onClick={handleCompareClick}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all min-h-[36px] ${
                compared 
                  ? 'bg-primary/15 text-primary border-primary'
                  : 'bg-surface-2 hover:border-primary/40 text-text border-border'
              }`}
              title={compared ? 'Remove from compare' : 'Compare scholarship (up to 3)'}
              aria-label={compared ? `Remove ${scholarship.name} from comparison` : `Add ${scholarship.name} to comparison`}
            >
              <Columns className="w-3 h-3" />
              <span className="hidden sm:inline">{compared ? 'Compared' : 'Compare'}</span>
            </button>

            {/* Bookmark Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleSave(scholarship.id);
              }}
              className={`p-2 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                saved
                  ? 'bg-accent/15 text-accent hover:bg-accent/25'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
              aria-label={saved ? `Remove ${scholarship.name} from saved` : `Save ${scholarship.name}`}
              title={saved ? 'Remove from saved' : 'Save scholarship'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-accent text-accent' : ''}`} />
            </button>
          </div>
        </div>

        {/* Provider */}
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 line-clamp-1">
          {scholarship.provider}
        </p>

        {/* Title */}
        <h3 
          id={`scholarship-title-${scholarship.id}`}
          className="text-base sm:text-lg font-bold text-text leading-snug group hover:text-primary transition-colors mb-2"
        >
          <Link to={`/scholarship/${scholarship.id}`} className="focus:outline-none focus:underline">
            {scholarship.name}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed mb-4">
          {scholarship.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs text-muted">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-2 text-text border border-border/50 font-medium">
            <GraduationCap className="w-3 h-3 text-muted" />
            {scholarship.level}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-2 text-text border border-border/50 font-medium">
            {scholarship.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-2 text-text border border-border/50 font-medium">
            <MapPin className="w-3 h-3 text-muted" />
            {scholarship.eligibilityRules.targetStates?.[0] || scholarship.country}
          </span>
        </div>
      </div>

      <div>
        {/* Award Amount & Deadline */}
        <div className="pt-4 border-t border-border flex items-end justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">Award Amount</span>
            <div className="text-lg sm:text-xl font-extrabold text-primary flex items-center">
              <span>{scholarship.amountFormatted}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">Deadline</span>
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                deadlineInfo.isCritical
                  ? 'bg-danger/10 text-danger border border-danger/30'
                  : deadlineInfo.isUrgent
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'bg-surface-2 text-muted border border-border'
              }`}
              title={`Due on ${formatReadableDate(scholarship.deadline)}`}
            >
              <Clock className="w-3 h-3" />
              <span>{deadlineInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: View Details & Track stage dropdown */}
        <div className="flex items-center gap-2 pt-1 relative">
          <Link
            to={`/scholarship/${scholarship.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs sm:text-sm font-semibold transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          {/* Quick tracker status toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Manage tracker status"
              title="Set application stage"
            >
              <KanbanSquare className="w-4 h-4" />
            </button>

            {showStatusMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowStatusMenu(false)} 
                />
                <div className="absolute right-0 bottom-full mb-2 z-30 w-44 bg-surface rounded-xl shadow-lg border border-border py-1 text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-muted border-b border-border">
                    Set Application Stage
                  </div>
                  {trackerStatusOptions.map(opt => (
                    <button
                      key={opt.status}
                      type="button"
                      onClick={() => {
                        setTrackerStatus(scholarship.id, opt.status);
                        setShowStatusMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-surface-2 text-text transition-colors"
                    >
                      <span>{opt.label}</span>
                      {currentTrackerStatus === opt.status && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};
