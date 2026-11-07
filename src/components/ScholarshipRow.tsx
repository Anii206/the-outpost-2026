import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkSimple } from '@phosphor-icons/react/dist/csr/BookmarkSimple';
import { ArrowsLeftRight } from '@phosphor-icons/react/dist/csr/ArrowsLeftRight';
import { Kanban } from '@phosphor-icons/react/dist/csr/Kanban';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import type { Scholarship, TrackerStatus } from '../types';
import { useApp } from '../context/AppContext';
import { formatDeadlineBadge, formatReadableDate } from '../utils/dateUtils';

interface ScholarshipRowProps {
  scholarship: Scholarship;
}

export const ScholarshipRow: React.FC<ScholarshipRowProps> = ({ scholarship }) => {
  const {
    profile,
    isSaved,
    toggleSave,
    calculateMatch,
    getTrackerStatus,
    setTrackerStatus,
    isCompared,
    toggleCompare,
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
    <article
      className={`group relative flex items-center justify-between p-4 sm:p-5 bg-surface hover:bg-surface-2/80 transition-all duration-200 border-b border-border border-l-[3px] border-l-transparent hover:border-l-accent ${
        compared ? 'bg-primary/5 border-l-primary' : ''
      }`}
      aria-labelledby={`row-title-${scholarship.id}`}
    >
      {/* Left Column: Match & Details */}
      <div className="flex items-start gap-4 flex-1 min-w-0 pr-6">
        {/* Match Score Badge */}
        {profile.isOnboarded ? (
          <div className="shrink-0 flex flex-col items-center justify-center w-14 py-2 px-1 rounded-[2px] border border-border bg-surface-2 text-center">
            <span className="font-mono text-sm font-bold text-primary">{matchResult.score}%</span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-muted font-sans">Match</span>
          </div>
        ) : (
          <Link
            to="/profile"
            className="shrink-0 flex flex-col items-center justify-center w-14 py-2 px-1 rounded-[2px] border border-border bg-surface-2 text-center hover:border-primary/50 transition-colors"
            title="Create your profile to see matches"
          >
            <span className="font-mono text-xs font-bold text-muted">--</span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-muted font-sans">Match</span>
          </Link>
        )}

        {/* Scheme Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-muted truncate">
              {scholarship.provider}
            </span>
            {scholarship.featured && (
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.2 bg-primary text-primary-contrast rounded-[2px]">
                Notice
              </span>
            )}
            {currentTrackerStatus && (
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-surface-2 text-text border border-border rounded-[2px]">
                Docket: {currentTrackerStatus}
              </span>
            )}
          </div>

          <h3 id={`row-title-${scholarship.id}`} className="font-serif text-lg font-bold text-text leading-snug group-hover:text-primary transition-colors">
            <Link to={`/scholarship/${scholarship.id}`} className="focus:outline-none focus:underline">
              {scholarship.name}
            </Link>
          </h3>

          <p className="text-xs text-muted font-sans line-clamp-1 mt-1 leading-relaxed">
            {scholarship.description}
          </p>

          {/* Meta Tags */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted font-sans">
            <span className="inline-flex items-center gap-1">
              <GraduationCap size={13} className="text-muted" />
              {scholarship.level}
            </span>
            <span>•</span>
            <span>{scholarship.category}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} className="text-muted" />
              {scholarship.eligibilityRules.targetStates?.[0] || scholarship.country}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Column: Amount & Stamp */}
      <div className="shrink-0 flex flex-col items-end gap-2 pr-6 text-right group-hover:-translate-x-1.5 transition-transform duration-200">
        <div>
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-muted block">
            Award Grant
          </span>
          <span className="font-mono text-base sm:text-lg font-bold text-primary">
            {scholarship.amountFormatted}
          </span>
        </div>

        {/* Small rotated stamp-style label */}
        <div
          className="deadline-stamp"
          title={`Due on ${formatReadableDate(scholarship.deadline)}`}
        >
          <Clock size={11} weight="bold" />
          <span>{deadlineInfo.text}</span>
        </div>
      </div>

      {/* Right Column: Actions */}
      <div className="shrink-0 flex items-center gap-2">
        {/* Compare Checkbox */}
        <button
          type="button"
          onClick={handleCompareClick}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[2px] text-xs font-medium border transition-colors min-h-[38px] ${
            compared
              ? 'bg-primary text-primary-contrast border-primary'
              : 'bg-surface border-border hover:bg-surface-2 text-text'
          }`}
          aria-label={compared ? `Remove ${scholarship.name} from compare` : `Compare ${scholarship.name}`}
          title="Compare with other schemes (max 3)"
        >
          <ArrowsLeftRight size={13} />
          <span className="hidden xl:inline">{compared ? 'Compared' : 'Compare'}</span>
        </button>

        {/* Bookmark Docket */}
        <button
          type="button"
          onClick={() => toggleSave(scholarship.id)}
          className={`p-2 rounded-[2px] border transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
            saved
              ? 'bg-accent/10 border-accent/40 text-accent'
              : 'border-border bg-surface hover:bg-surface-2 text-muted hover:text-text'
          }`}
          aria-label={saved ? `Remove ${scholarship.name} from docket` : `Save ${scholarship.name} to docket`}
          title={saved ? 'Remove from docket' : 'Save to docket'}
        >
          <BookmarkSimple size={16} weight={saved ? 'fill' : 'regular'} />
        </button>

        {/* Tracker Status Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="p-2 rounded-[2px] border border-border bg-surface hover:bg-surface-2 text-muted hover:text-text transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="Manage application docket stage"
            title="Set docket stage"
          >
            <Kanban size={16} />
          </button>

          {showStatusMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowStatusMenu(false)} />
              <div className="absolute right-0 bottom-full mb-1 z-30 w-44 bg-surface rounded-[4px] shadow-lg border border-border py-1 text-xs font-sans">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-muted border-b border-border">
                  Set Docket Stage
                </div>
                {trackerStatusOptions.map((opt) => (
                  <button
                    key={opt.status}
                    type="button"
                    onClick={() => {
                      setTrackerStatus(scholarship.id, opt.status);
                      setShowStatusMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-surface-2 text-text transition-colors"
                  >
                    <span>{opt.label}</span>
                    {currentTrackerStatus === opt.status && (
                      <CheckCircle size={14} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View Details Link */}
        <Link
          to={`/scholarship/${scholarship.id}`}
          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity min-h-[38px]"
          aria-label={`View details for ${scholarship.name}`}
        >
          <span>Examine</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
};
