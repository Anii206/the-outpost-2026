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
      className={`relative flex flex-col justify-between bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
        compared 
          ? 'border-emerald-600 ring-2 ring-emerald-600/20' 
          : scholarship.featured 
          ? 'border-emerald-700/30 ring-1 ring-emerald-700/10' 
          : 'border-stone-200/90 hover:border-stone-300'
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
                  ? 'bg-emerald-50 text-[#133E2B] border border-emerald-200/70'
                  : matchResult.score >= 60
                  ? 'bg-amber-50 text-amber-900 border border-amber-200/70'
                  : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}
              title={matchResult.reasons.join('\n')}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchResult.score}% Match</span>
            </div>

            {/* Featured Badge */}
            {scholarship.featured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#133E2B] text-white">
                Featured
              </span>
            )}

            {/* Active Tracker Stage Pill */}
            {currentTrackerStatus && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-800 capitalize border border-stone-200">
                <KanbanSquare className="w-3 h-3 text-[#133E2B]" />
                {currentTrackerStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Compare Checkbox Button */}
            <button
              type="button"
              onClick={handleCompareClick}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
                compared 
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
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
              className={`p-2 rounded-xl transition-colors ${
                saved
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
              }`}
              aria-label={saved ? `Remove ${scholarship.name} from saved` : `Save ${scholarship.name}`}
              title={saved ? 'Remove from saved' : 'Save scholarship'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Provider */}
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1 line-clamp-1">
          {scholarship.provider}
        </p>

        {/* Title */}
        <h3 
          id={`scholarship-title-${scholarship.id}`}
          className="text-base sm:text-lg font-bold text-stone-900 leading-snug group hover:text-[#133E2B] transition-colors mb-2"
        >
          <Link to={`/scholarship/${scholarship.id}`} className="focus:outline-none focus:underline">
            {scholarship.name}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
          {scholarship.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs text-stone-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 font-medium">
            <GraduationCap className="w-3 h-3 text-stone-500" />
            {scholarship.level}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-stone-100 font-medium">
            {scholarship.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 font-medium">
            <MapPin className="w-3 h-3 text-stone-500" />
            {scholarship.eligibilityRules.targetStates?.[0] || scholarship.country}
          </span>
        </div>
      </div>

      <div>
        {/* Award Amount & Deadline */}
        <div className="pt-4 border-t border-stone-100 flex items-end justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Award Amount</span>
            <div className="text-lg sm:text-xl font-extrabold text-[#133E2B] flex items-center">
              <span>{scholarship.amountFormatted}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Deadline</span>
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                deadlineInfo.isCritical
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : deadlineInfo.isUrgent
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-100 text-stone-700'
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
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#133E2B] hover:bg-[#1B533A] text-white text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#133E2B] focus:ring-offset-2"
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          {/* Quick tracker status toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#133E2B]"
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
                <div className="absolute right-0 bottom-full mb-2 z-30 w-44 bg-white rounded-xl shadow-lg border border-stone-200 py-1 text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100">
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
                      className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 text-stone-700 transition-colors"
                    >
                      <span>{opt.label}</span>
                      {currentTrackerStatus === opt.status && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#133E2B]" />
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
