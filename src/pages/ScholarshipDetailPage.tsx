import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  KanbanSquare, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Clock, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  CheckSquare, 
  Square,
  Building,
  GraduationCap,
  MapPin,
  AlertCircle,
  CalendarPlus
} from 'lucide-react';
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
    isDocumentChecked
  } = useApp();

  const { showToast } = useToast();

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [similarScholarships, setSimilarScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  usePageTitle(scholarship ? scholarship.name : 'Scholarship Details');

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
          getSimilarScholarships(id, 3)
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-6 w-36 bg-surface-2 rounded-lg" />
        <div className="bg-surface rounded-3xl border border-border p-8 space-y-6">
          <div className="h-4 w-44 bg-surface-2 rounded" />
          <div className="h-10 w-3/4 bg-surface-2 rounded-xl" />
          <div className="h-4 w-full bg-surface-2 rounded" />
          <div className="h-16 w-1/3 bg-surface-2 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface rounded-3xl p-8 h-96 border border-border" />
          <div className="bg-surface rounded-3xl p-8 h-96 border border-border" />
        </div>
      </div>
    );
  }

  // Friendly Invalid ID Not-Found State
  if (hasError || !scholarship) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-text">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4 border border-accent/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-3">
          Scholarship Scheme Not Found
        </h1>
        <p className="text-sm text-muted max-w-md mx-auto mb-8 leading-relaxed">
          The scholarship scheme you are looking for may have expired, changed its ID, or does not exist in our national database.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-contrast font-bold text-sm rounded-xl shadow-xs transition-opacity hover:opacity-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Verified Scholarships</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(scholarship.id);
  const matchResult = calculateMatch(scholarship);
  const deadlineInfo = formatDeadlineBadge(scholarship.deadline);
  const currentTracker = getTrackerStatus(scholarship.id);

  const totalDocs = scholarship.documentsRequired.length;
  const checkedCount = scholarship.documentsRequired.filter(doc => 
    isDocumentChecked(scholarship.id, doc)
  ).length;
  const docProgressPercent = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  const handleSaveToggle = () => {
    toggleSave(scholarship.id);
    if (!saved) {
      showToast(`Saved "${scholarship.name}" to your bookmarks`, 'success');
    } else {
      showToast(`Removed "${scholarship.name}" from bookmarks`, 'info');
    }
  };

  const handleStartTracking = () => {
    setTrackerStatus(scholarship.id, 'applying');
    showToast(`Added to Application Tracker under "Applying"`, 'success');
  };

  const handleAddToCalendar = () => {
    downloadCalendarEvent(scholarship);
    showToast('Deadline reminder (.ics) downloaded for your calendar', 'success');
  };

  return (
    <div className="min-h-screen pb-32">
      
      {/* Top Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-text transition-colors bg-surface px-3.5 py-2 rounded-xl border border-border shadow-2xs min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Scholarships</span>
        </Link>
      </div>

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER HERO CARD */}
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xs relative overflow-hidden transition-colors">
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            
            {/* Title & Metadata */}
            <div className="space-y-4 max-w-3xl">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-surface-2 text-text border border-border">
                  <Building className="w-3.5 h-3.5 text-muted" />
                  {scholarship.provider}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {scholarship.level}
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 text-text border border-border">
                  {scholarship.category}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 text-text border border-border">
                  <MapPin className="w-3.5 h-3.5 text-muted" />
                  {scholarship.eligibilityRules.targetStates?.[0] || scholarship.country}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-text tracking-tight leading-tight">
                {scholarship.name}
              </h1>

              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {scholarship.description}
              </p>

              {/* Amount and Deadline Row */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                    Scholarship Award
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-primary">
                    {scholarship.amountFormatted}
                  </p>
                </div>

                <div className="h-10 w-px bg-border hidden sm:block" />

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                    Application Deadline
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-base sm:text-lg font-bold text-text">
                      {formatReadableDate(scholarship.deadline)}
                    </p>
                    
                    <span 
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                        deadlineInfo.isCritical
                          ? 'bg-danger/10 text-danger border border-danger/30 animate-pulse'
                          : deadlineInfo.isUrgent
                          ? 'bg-accent/15 text-accent border border-accent/30'
                          : 'bg-surface-2 text-muted border border-border'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {deadlineInfo.text}
                    </span>
                  </div>
                </div>

                {/* Calendar Add Button */}
                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text text-xs font-bold transition-colors ml-auto sm:ml-0 min-h-[44px]"
                  title="Download .ics reminder file for Google Calendar, Apple, or Outlook"
                  aria-label="Add deadline to calendar"
                >
                  <CalendarPlus className="w-4 h-4 text-primary" />
                  <span>Add to Calendar</span>
                </button>
              </div>

            </div>

            {/* Match Score Ring Component */}
            <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-surface-2 border border-border w-full sm:w-56 text-center">
              
              <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="var(--border)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={matchResult.score >= 80 ? 'var(--primary)' : matchResult.score >= 60 ? 'var(--accent)' : 'var(--text-muted)'}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * matchResult.score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-text leading-none">
                    {matchResult.score}%
                  </span>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider mt-0.5">
                    Match
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>{matchResult.score >= 75 ? 'Strong Fit' : 'Moderate Fit'}</span>
              </div>
              <p className="text-[11px] text-muted mt-1">
                Matched against your student profile
              </p>
            </div>

          </div>

        </div>

        {/* 2-COLUMN SECTION: Eligibility Breakdown & Documents Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ELIGIBILITY BREAKDOWN (2 Cols) */}
          <section className="lg:col-span-2 bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
            
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-text flex items-center gap-2">
                  <span>Eligibility Breakdown</span>
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Detailed evaluation of your credentials against official scheme guidelines.
                </p>
              </div>

              <Link to="/profile" className="text-xs font-bold text-primary hover:underline min-h-[36px] flex items-center">
                Edit Profile
              </Link>
            </div>

            {/* Rules Cards with Met / Not Met / Unknown status */}
            <div className="space-y-3.5">
              {matchResult.rules.map((rule) => {
                const isMet = rule.status === 'met';
                const isNotMet = rule.status === 'not-met';

                return (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isMet
                        ? 'bg-success/10 border-success/30 text-text'
                        : isNotMet
                        ? 'bg-danger/10 border-danger/30 text-text'
                        : 'bg-accent/10 border-accent/30 text-text'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {isMet ? (
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                          ) : isNotMet ? (
                            <XCircle className="w-4 h-4 text-danger shrink-0" />
                          ) : (
                            <HelpCircle className="w-4 h-4 text-accent shrink-0" />
                          )}
                          <span className="text-sm font-bold text-text">
                            {rule.label}
                          </span>
                        </div>
                        <p className="text-xs text-text pl-6">
                          <span className="font-semibold text-muted">Scheme Requirement: </span>
                          {rule.requirement}
                        </p>
                        <p className="text-xs text-text pl-6">
                          <span className="font-semibold text-muted">Your Profile: </span>
                          <span className={isMet ? 'text-success font-bold' : 'text-danger font-bold'}>
                            {rule.actual}
                          </span>
                          {' — '}
                          <span className="italic text-muted">{rule.reason}</span>
                        </p>
                      </div>

                      <span
                        className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                          isMet
                            ? 'bg-success/20 text-success border border-success/30'
                            : isNotMet
                            ? 'bg-danger/20 text-danger border border-danger/30'
                            : 'bg-accent/20 text-accent border border-accent/30'
                        }`}
                      >
                        {isMet ? 'Met' : isNotMet ? 'Not Met' : 'Review'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Scheme Notifications */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Official Scheme Notifications
              </h3>
              <ul className="space-y-2">
                {scholarship.eligibilityRules.descriptions.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </section>

          {/* DOCUMENTS CHECKLIST (1 Col) */}
          <section className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-colors">
            
            <div className="space-y-4">
              <div className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Documents Checklist</span>
                  </h2>
                  <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    {checkedCount} / {totalDocs} Done
                  </span>
                </div>
                <p className="text-xs text-muted mt-1">
                  Check off documents as you assemble them. Saved locally.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-surface-2 border border-border h-2 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${docProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5 pt-2">
                {scholarship.documentsRequired.map((doc, idx) => {
                  const isChecked = isDocumentChecked(scholarship.id, doc);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDocumentCheck(scholarship.id, doc)}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all min-h-[44px] ${
                        isChecked
                          ? 'bg-primary/10 border-primary/30 text-text'
                          : 'bg-surface-2 border-border text-text hover:border-primary/50'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                      )}
                      <span className={isChecked ? 'line-through text-muted font-medium' : 'font-medium'}>
                        {doc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-muted mt-6 pt-4 border-t border-border text-center">
              Checklist state is saved locally in your browser.
            </p>

          </section>

        </div>

        {/* APPLICATION TIMELINE / STEPS */}
        <section className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          <div className="pb-3 border-b border-border">
            <h2 className="text-xl font-bold text-text">Step-by-Step Application Timeline</h2>
            <p className="text-xs text-muted">Official procedure to apply and verify this scholarship scheme.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {scholarship.applicationSteps.map((step) => (
              <div 
                key={step.step}
                className="relative bg-surface-2 p-5 rounded-2xl border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-primary text-primary-contrast flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
                    {step.step}
                  </div>
                  <h3 className="text-sm font-bold text-text mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SIMILAR SCHOLARSHIPS ROW */}
        {similarScholarships.length > 0 && (
          <section className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text">Similar Schemes You May Qualify For</h2>
                <p className="text-xs text-muted">Based on your educational stream and category.</p>
              </div>
              <Link to="/" className="text-xs font-bold text-primary hover:underline min-h-[36px] flex items-center">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarScholarships.map(s => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border shadow-xl py-3.5 px-4 sm:px-8 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          <div className="hidden sm:block">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">{scholarship.provider}</p>
            <p className="text-base font-extrabold text-primary leading-none mt-0.5">{scholarship.amountFormatted}</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* Bookmark button */}
            <button
              type="button"
              onClick={handleSaveToggle}
              className={`p-3 rounded-xl border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                saved
                  ? 'bg-accent/15 text-accent border-accent/30'
                  : 'bg-surface text-text border-border hover:bg-surface-2'
              }`}
              title={saved ? 'Remove from saved' : 'Save scholarship'}
              aria-label={saved ? 'Remove from saved' : 'Save scholarship'}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-accent text-accent' : ''}`} />
            </button>

            {/* Start Tracking button */}
            <button
              type="button"
              onClick={handleStartTracking}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-colors min-h-[44px] ${
                currentTracker === 'applying'
                  ? 'bg-accent/15 text-accent border-accent/30'
                  : currentTracker
                  ? 'bg-surface-2 text-text border-border'
                  : 'bg-surface hover:bg-surface-2 text-text border-border'
              }`}
            >
              <KanbanSquare className="w-4 h-4 text-primary" />
              <span>{currentTracker ? `Stage: ${currentTracker}` : 'Start Tracking'}</span>
            </button>

            {/* Official Apply Link Button */}
            <a
              href={scholarship.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-contrast text-xs sm:text-sm font-bold shadow-xs hover:opacity-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            >
              <span>Apply on Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>

          </div>

        </div>
      </div>

    </div>
  );
};
