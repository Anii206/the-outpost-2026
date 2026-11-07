import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookmarkSimple } from '@phosphor-icons/react/dist/csr/BookmarkSimple';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { CaretRight } from '@phosphor-icons/react/dist/csr/CaretRight';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin';
import { Kanban } from '@phosphor-icons/react/dist/csr/Kanban';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import { ArrowsLeftRight } from '@phosphor-icons/react/dist/csr/ArrowsLeftRight';
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
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col justify-between bg-surface rounded-[4px] border transition-colors ${
        compared
          ? 'border-primary ring-1 ring-primary'
          : scholarship.featured
          ? 'border-primary/50'
          : 'border-border hover:border-primary/40'
      } p-5`}
      aria-labelledby={`card-title-${scholarship.id}`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center flex-wrap gap-2">
            {/* Match Badge */}
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs font-mono font-bold ${
                matchResult.score >= 80
                  ? 'bg-primary/10 text-primary border border-primary/25'
                  : matchResult.score >= 60
                  ? 'bg-accent/15 text-accent border border-accent/25'
                  : 'bg-surface-2 text-muted border border-border'
              }`}
              title={matchResult.reasons.join('\n')}
            >
              <span>{matchResult.score}% MATCH</span>
            </div>

            {/* Featured Notice */}
            {scholarship.featured && (
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-primary text-primary-contrast rounded-[2px]">
                Notice
              </span>
            )}

            {/* Tracker status */}
            {currentTrackerStatus && (
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-surface-2 text-text border border-border rounded-[2px]">
                {currentTrackerStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Compare */}
            <button
              type="button"
              onClick={handleCompareClick}
              className={`p-2 rounded-[2px] border text-xs font-semibold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                compared
                  ? 'bg-primary text-primary-contrast border-primary'
                  : 'bg-surface-2 text-text border-border hover:border-primary/40'
              }`}
              title={compared ? 'Remove from compare' : 'Compare scholarship (up to 3)'}
              aria-label={compared ? `Remove ${scholarship.name} from comparison` : `Add ${scholarship.name} to comparison`}
            >
              <ArrowsLeftRight size={15} />
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleSave(scholarship.id);
              }}
              className={`p-2 rounded-[2px] border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                saved
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'border-border bg-surface hover:bg-surface-2 text-muted hover:text-text'
              }`}
              aria-label={saved ? `Remove ${scholarship.name} from docket` : `Save ${scholarship.name}`}
              title={saved ? 'Remove from docket' : 'Save to docket'}
            >
              <BookmarkSimple size={16} weight={saved ? 'fill' : 'regular'} />
            </button>
          </div>
        </div>

        {/* Provider Kicker */}
        <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-muted line-clamp-1 mb-1">
          {scholarship.provider}
        </p>

        {/* Title */}
        <h3
          id={`card-title-${scholarship.id}`}
          className="font-serif text-lg font-bold text-text leading-snug hover:text-primary transition-colors mb-2"
        >
          <Link to={`/scholarship/${scholarship.id}`} className="focus:outline-none focus:underline">
            {scholarship.name}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-muted font-sans line-clamp-2 leading-relaxed mb-4">
          {scholarship.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 text-[11px] font-sans text-muted">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-surface-2 text-text border border-border">
            <GraduationCap size={13} className="text-muted" />
            {scholarship.level}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] bg-surface-2 text-text border border-border">
            {scholarship.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-surface-2 text-text border border-border">
            <MapPin size={13} className="text-muted" />
            {scholarship.eligibilityRules.targetStates?.[0] || scholarship.country}
          </span>
        </div>
      </div>

      <div>
        {/* Award Amount & Deadline Stamp */}
        <div className="pt-3 border-t border-border flex items-end justify-between gap-3 mb-4">
          <div>
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-muted block">
              Award Grant
            </span>
            <div className="font-mono text-base font-bold text-primary">
              {scholarship.amountFormatted}
            </div>
          </div>

          <div className="text-right">
            {/* Rotated deadline stamp */}
            <div
              className="deadline-stamp"
              title={`Due on ${formatReadableDate(scholarship.deadline)}`}
            >
              <Clock size={11} weight="bold" />
              <span>{deadlineInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/scholarship/${scholarship.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <span>Examine Scheme</span>
            <CaretRight size={14} />
          </Link>

          {/* Quick tracker menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="p-2.5 rounded-[2px] border border-border bg-surface hover:bg-surface-2 text-text transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Manage docket status"
              title="Set application stage"
            >
              <Kanban size={16} />
            </button>

            {showStatusMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowStatusMenu(false)} />
                <div className="absolute right-0 bottom-full mb-1 z-30 w-44 bg-surface rounded-[4px] shadow-lg border border-border py-1 text-xs font-sans">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-muted border-b border-border">
                    Set Application Stage
                  </div>
                  {trackerStatusOptions.map((opt) => (
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
                        <CheckCircle size={14} className="text-primary" />
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
