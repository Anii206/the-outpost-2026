import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { BookmarkSimple } from '@phosphor-icons/react/dist/csr/BookmarkSimple';
import { Kanban } from '@phosphor-icons/react/dist/csr/Kanban';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { XCircle } from '@phosphor-icons/react/dist/csr/XCircle';
import { Question } from '@phosphor-icons/react/dist/csr/Question';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import { ArrowSquareOut } from '@phosphor-icons/react/dist/csr/ArrowSquareOut';
import { FileText } from '@phosphor-icons/react/dist/csr/FileText';
import { CheckSquare } from '@phosphor-icons/react/dist/csr/CheckSquare';
import { Square } from '@phosphor-icons/react/dist/csr/Square';
import { Buildings } from '@phosphor-icons/react/dist/csr/Buildings';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin';
import { WarningCircle } from '@phosphor-icons/react/dist/csr/WarningCircle';
import { CalendarPlus } from '@phosphor-icons/react/dist/csr/CalendarPlus';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { getScholarshipById, getSimilarScholarships } from '../services/api';
import type { Scholarship } from '../types';
import { formatReadableDate, formatDeadlineBadge } from '../utils/dateUtils';
import { downloadCalendarEvent } from '../utils/calendarUtils';
import { ScholarshipCard } from '../components/ScholarshipCard';

export const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    isSaved,
    toggleSave,
    calculateMatch,
    getTrackerStatus,
    setTrackerStatus,
    toggleDocumentCheck,
    isDocumentChecked,
  } = useApp();

  const { showToast } = useToast();

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [similarScholarships, setSimilarScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  usePageTitle(scholarship ? `${scholarship.name} — Grantly Gazette` : 'Scholarship Details');

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(async () => {
      if (!isMounted) return;

      if (!id) {
        setIsLoading(false);
        setHasError(true);
        return;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const [sch, similar] = await Promise.all([
          getScholarshipById(id),
          getSimilarScholarships(id, 3),
        ]);
        if (!isMounted) return;
        if (!sch) {
          setHasError(true);
        } else {
          setScholarship(sch);
          setSimilarScholarships(similar);
        }
      } catch {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-surface-2 rounded-[2px]" />
        <div className="bg-surface rounded-[4px] border border-border p-8 space-y-4">
          <div className="h-4 w-40 bg-surface-2 rounded-[2px]" />
          <div className="h-8 w-2/3 bg-surface-2 rounded-[2px]" />
          <div className="h-4 w-full bg-surface-2 rounded-[2px]" />
          <div className="h-12 w-1/4 bg-surface-2 rounded-[2px]" />
        </div>
      </div>
    );
  }

  // Friendly Invalid ID Not-Found State
  if (hasError || !scholarship) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-text">
        <div className="w-12 h-12 rounded-[2px] bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4 border border-accent/30">
          <WarningCircle size={24} />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text mb-2">
          Gazette Record Not Found
        </h1>
        <p className="font-sans text-xs sm:text-sm text-muted max-w-md mx-auto mb-6 leading-relaxed">
          The requested scholarship identifier does not correspond to an active notice in the official ledger. It may have concluded its application window.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-contrast font-semibold text-xs rounded-[2px] transition-opacity hover:opacity-90 min-h-[44px]"
        >
          <ArrowLeft size={14} />
          <span>Return to Gazette Index</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(scholarship.id);
  const matchResult = calculateMatch(scholarship);
  const deadlineInfo = formatDeadlineBadge(scholarship.deadline);
  const currentTracker = getTrackerStatus(scholarship.id);

  const totalDocs = scholarship.documentsRequired.length;
  const checkedCount = scholarship.documentsRequired.filter((doc) =>
    isDocumentChecked(scholarship.id, doc)
  ).length;
  const docProgressPercent = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  const handleSaveToggle = () => {
    toggleSave(scholarship.id);
    if (!saved) {
      showToast(`Filed "${scholarship.name}" into your application docket`, 'success');
    } else {
      showToast(`Removed "${scholarship.name}" from docket`, 'info');
    }
  };

  const handleStartTracking = () => {
    setTrackerStatus(scholarship.id, 'applying');
    showToast(`Docket status moved to "Applying"`, 'success');
  };

  const handleAddToCalendar = () => {
    downloadCalendarEvent(scholarship);
    showToast('Deadline reminder (.ics file) generated for calendar', 'success');
  };

  return (
    <div className="min-h-screen pb-32 bg-bg text-text transition-colors">
      {/* Top Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text transition-colors bg-surface px-3 py-1.5 rounded-[2px] border border-border min-h-[38px]"
        >
          <ArrowLeft size={13} />
          <span>Return to Gazette Index</span>
        </Link>
      </div>

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* HEADER HERO CARD */}
        <div className="bg-surface rounded-[4px] border border-border p-6 sm:p-8 relative overflow-hidden transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            
            {/* Title & Metadata */}
            <div className="space-y-3.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-xs font-bold uppercase tracking-wider bg-surface-2 text-text border border-border">
                  <Buildings size={13} className="text-muted" />
                  {scholarship.provider}
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs font-medium bg-primary/10 text-primary border border-primary/25">
                  <GraduationCap size={13} />
                  {scholarship.level}
                </span>

                <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-xs font-medium bg-surface-2 text-text border border-border">
                  {scholarship.category}
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs font-medium bg-surface-2 text-text border border-border">
                  <MapPin size={13} className="text-muted" />
                  {scholarship.eligibilityRules.targetStates?.[0] || scholarship.country}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-black text-text tracking-tight leading-tight">
                {scholarship.name}
              </h1>

              <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                {scholarship.description}
              </p>

              {/* Amount and Deadline Row */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <div>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-muted block">
                    Award Grant
                  </span>
                  <p className="font-mono text-2xl sm:text-3xl font-bold text-primary">
                    {scholarship.amountFormatted}
                  </p>
                </div>

                <div className="h-10 w-px bg-border hidden sm:block" />

                <div>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-muted block">
                    Gazette Deadline
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="font-mono text-xs sm:text-sm font-semibold text-text">
                      {formatReadableDate(scholarship.deadline)}
                    </p>

                    <div className="deadline-stamp">
                      <Clock size={11} weight="bold" />
                      <span>{deadlineInfo.text}</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Add Button */}
                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-border bg-surface hover:bg-surface-2 text-text text-xs font-semibold transition-colors ml-auto sm:ml-0 min-h-[44px]"
                  title="Download .ics reminder file for calendar"
                  aria-label="Add deadline to calendar"
                >
                  <CalendarPlus size={14} className="text-primary" />
                  <span>Add to Calendar</span>
                </button>
              </div>
            </div>

            {/* Match Score Ring Component */}
            <div className="shrink-0 flex flex-col items-center justify-center p-5 rounded-[4px] bg-surface-2 border border-border w-full sm:w-52 text-center">
              <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="var(--border)"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={
                      matchResult.score >= 80
                        ? 'var(--primary)'
                        : matchResult.score >= 60
                        ? 'var(--accent)'
                        : 'var(--text-muted)'
                    }
                    strokeWidth="7"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * matchResult.score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-xl font-bold text-text leading-none">
                    {matchResult.score}%
                  </span>
                  <span className="font-sans text-[9px] font-bold text-muted uppercase tracking-wider mt-0.5">
                    Match
                  </span>
                </div>
              </div>

              <div className="font-sans text-xs font-bold text-text">
                <span>{matchResult.score >= 75 ? 'Strong Eligibility Fit' : 'Moderate Compatibility'}</span>
              </div>
              <p className="font-sans text-[11px] text-muted mt-0.5">
                Evaluated against student dossier
              </p>
            </div>

          </div>
        </div>

        {/* 2-COLUMN SECTION: Eligibility Breakdown & Documents Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ELIGIBILITY BREAKDOWN (2 Cols) */}
          <section className="lg:col-span-2 bg-surface rounded-[4px] border border-border p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-serif text-lg font-bold text-text">Eligibility Verification Breakdown</h2>
                <p className="font-sans text-xs text-muted">
                  Official criteria audit based on scheme notification rules.
                </p>
              </div>

              <Link to="/profile" className="text-xs font-semibold text-primary hover:underline min-h-[36px] flex items-center">
                Update Dossier
              </Link>
            </div>

            {/* Rules Cards */}
            <div className="space-y-2.5">
              {matchResult.rules.map((rule) => {
                const isMet = rule.status === 'met';
                const isNotMet = rule.status === 'not-met';

                return (
                  <div
                    key={rule.id}
                    className={`p-3.5 rounded-[2px] border transition-colors ${
                      isMet
                        ? 'bg-primary/5 border-primary/20 text-text'
                        : isNotMet
                        ? 'bg-danger/5 border-danger/20 text-text'
                        : 'bg-accent/5 border-accent/20 text-text'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {isMet ? (
                            <CheckCircle size={15} className="text-primary shrink-0" />
                          ) : isNotMet ? (
                            <XCircle size={15} className="text-danger shrink-0" />
                          ) : (
                            <Question size={15} className="text-accent shrink-0" />
                          )}
                          <span className="font-serif text-sm font-bold text-text">
                            {rule.label}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-text pl-5">
                          <span className="font-semibold text-muted">Scheme Requirement: </span>
                          {rule.requirement}
                        </p>
                        <p className="font-sans text-xs text-text pl-5">
                          <span className="font-semibold text-muted">Your Profile: </span>
                          <span className={isMet ? 'text-primary font-bold' : 'text-danger font-bold'}>
                            {rule.actual}
                          </span>
                          {' — '}
                          <span className="italic text-muted">{rule.reason}</span>
                        </p>
                      </div>

                      <span
                        className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px] shrink-0 ${
                          isMet
                            ? 'bg-primary/10 text-primary border border-primary/25'
                            : isNotMet
                            ? 'bg-danger/10 text-danger border border-danger/25'
                            : 'bg-accent/15 text-accent border border-accent/25'
                        }`}
                      >
                        {isMet ? 'Verified Met' : isNotMet ? 'Unmet' : 'Review'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Scheme Descriptions */}
            <div className="pt-3 border-t border-border">
              <h3 className="font-sans text-[11px] font-bold uppercase tracking-widest text-muted mb-2">
                Official Regulatory Clauses
              </h3>
              <ul className="space-y-1.5 font-sans text-xs text-text">
                {scholarship.eligibilityRules.descriptions.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* DOCUMENTS CHECKLIST (1 Col) */}
          <section className="bg-surface rounded-[4px] border border-border p-6 flex flex-col justify-between transition-colors">
            <div className="space-y-3">
              <div className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-base font-bold text-text flex items-center gap-1.5">
                    <FileText size={16} className="text-primary" />
                    <span>Required Dossier Documents</span>
                  </h2>
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-[2px] border border-primary/20">
                    {checkedCount}/{totalDocs}
                  </span>
                </div>
                <p className="font-sans text-xs text-muted mt-1">
                  Cross off documents as you prepare your application package.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-surface-2 border border-border h-1.5 rounded-[2px] mt-2.5 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${docProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2 pt-1">
                {scholarship.documentsRequired.map((doc, idx) => {
                  const isChecked = isDocumentChecked(scholarship.id, doc);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDocumentCheck(scholarship.id, doc)}
                      className={`w-full text-left p-2.5 rounded-[2px] border text-xs flex items-start gap-2 transition-colors min-h-[44px] ${
                        isChecked
                          ? 'bg-primary/5 border-primary/25 text-text'
                          : 'bg-surface border-border text-text hover:bg-surface-2'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare size={16} className="text-primary shrink-0 mt-0.5" />
                      ) : (
                        <Square size={16} className="text-muted shrink-0 mt-0.5" />
                      )}
                      <span className={isChecked ? 'line-through text-muted' : 'font-medium'}>
                        {doc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="font-mono text-[10px] text-muted mt-6 pt-3 border-t border-border text-center">
              Checklist persisted in local encrypted storage.
            </p>
          </section>

        </div>

        {/* STEP-BY-STEP APPLICATION TIMELINE */}
        <section className="bg-surface rounded-[4px] border border-border p-6 space-y-4 transition-colors">
          <div className="pb-3 border-b border-border">
            <h2 className="font-serif text-lg font-bold text-text">Official Filing Procedure</h2>
            <p className="font-sans text-xs text-muted">Statutory stages from verification to DBT disbursement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scholarship.applicationSteps.map((step) => (
              <div
                key={step.step}
                className="bg-surface-2 p-4 rounded-[2px] border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="w-6 h-6 rounded-[2px] bg-primary text-primary-contrast flex items-center justify-center font-mono text-xs font-bold mb-2.5">
                    {step.step}
                  </div>
                  <h3 className="font-serif text-sm font-bold text-text mb-1">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SIMILAR SCHOLARSHIPS ROW */}
        {similarScholarships.length > 0 && (
          <section className="pt-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h2 className="font-serif text-lg font-bold text-text">Related Gazette Schemes</h2>
                <p className="font-sans text-xs text-muted">Alternative schemes matching your academic level.</p>
              </div>
              <Link to="/" className="text-xs font-semibold text-primary hover:underline min-h-[36px] flex items-center">
                All Schemes &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarScholarships.map((s) => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-[2px] border-t border-border py-3 px-4 sm:px-8 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="font-sans text-[10px] text-muted font-bold uppercase tracking-wider">{scholarship.provider}</p>
            <p className="font-mono text-base font-bold text-primary leading-none mt-0.5">{scholarship.amountFormatted}</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Bookmark button */}
            <button
              type="button"
              onClick={handleSaveToggle}
              className={`p-2.5 rounded-[2px] border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                saved
                  ? 'bg-accent/15 text-accent border-accent/40'
                  : 'bg-surface text-text border-border hover:bg-surface-2'
              }`}
              title={saved ? 'Remove from docket' : 'Save to application docket'}
              aria-label={saved ? 'Remove from docket' : 'Save scholarship'}
            >
              <BookmarkSimple size={18} weight={saved ? 'fill' : 'regular'} />
            </button>

            {/* Start Tracking button */}
            <button
              type="button"
              onClick={handleStartTracking}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[2px] text-xs font-semibold border transition-colors min-h-[44px] ${
                currentTracker === 'applying'
                  ? 'bg-accent/15 text-accent border-accent/30'
                  : 'bg-surface hover:bg-surface-2 text-text border-border'
              }`}
            >
              <Kanban size={15} className="text-primary" />
              <span>{currentTracker ? `Docket: ${currentTracker}` : 'Start Tracking'}</span>
            </button>

            {/* Official Apply Link Button */}
            <a
              href={scholarship.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
            >
              <span>Apply on Official Portal</span>
              <ArrowSquareOut size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
