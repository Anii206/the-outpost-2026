import React from 'react';
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
  AlertCircle
} from 'lucide-react';
import { SCHOLARSHIPS } from '../data/scholarships';
import { useApp } from '../context/AppContext';
import { formatReadableDate, formatDeadlineBadge } from '../utils/dateUtils';
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

  const scholarship = SCHOLARSHIPS.find((s) => s.id === id);

  // Friendly Invalid ID Not-Found State
  if (!scholarship) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3">
          Scholarship Not Found
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
          The scholarship scheme you are looking for may have expired, changed its ID, or does not exist in our Indian national database.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#133E2B] hover:bg-[#1B533A] text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Available Scholarships</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(scholarship.id);
  const matchResult = calculateMatch(scholarship);
  const deadlineInfo = formatDeadlineBadge(scholarship.deadline);
  const currentTracker = getTrackerStatus(scholarship.id);

  // Document progress calculation
  const totalDocs = scholarship.documentsRequired.length;
  const checkedCount = scholarship.documentsRequired.filter(doc => 
    isDocumentChecked(scholarship.id, doc)
  ).length;
  const docProgressPercent = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  // Similar scholarships (same category or level, excluding current)
  const similarScholarships = SCHOLARSHIPS
    .filter(s => s.id !== scholarship.id && (s.category === scholarship.category || s.level === scholarship.level))
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-28">
      
      {/* Top Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#133E2B] transition-colors bg-white/70 px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Scholarships</span>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER HERO CARD */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            
            {/* Title & Metadata */}
            <div className="space-y-4 max-w-3xl">
              
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                  <Building className="w-3.5 h-3.5 text-stone-500" />
                  {scholarship.provider}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#133E2B]/10 text-[#133E2B]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {scholarship.level}
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                  {scholarship.category}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  {scholarship.country}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {scholarship.name}
              </h1>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {scholarship.description}
              </p>

              {/* Amount and Deadline Row */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                    Scholarship Award
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">
                    {scholarship.amountFormatted}
                  </p>
                </div>

                <div className="h-10 w-px bg-stone-200 hidden sm:block" />

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                    Application Deadline
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-base sm:text-lg font-bold text-stone-900">
                      {formatReadableDate(scholarship.deadline)}
                    </p>
                    
                    {/* Countdown badge: Red when under 7, amber when under 14 */}
                    <span 
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                        deadlineInfo.isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                          : deadlineInfo.isUrgent
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {deadlineInfo.text}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Match Score Ring Component */}
            <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 w-full sm:w-56 text-center">
              
              <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E7DFD5"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={matchResult.score >= 80 ? '#133E2B' : matchResult.score >= 60 ? '#D97706' : '#78716C'}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * matchResult.score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-stone-900 leading-none">
                    {matchResult.score}%
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">
                    Match
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span>{matchResult.score >= 75 ? 'Strong Fit' : 'Moderate Fit'}</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Matched against your current profile
              </p>
            </div>

          </div>

        </div>

        {/* 2-COLUMN SECTION: Eligibility Breakdown & Documents Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ELIGIBILITY BREAKDOWN (2 Cols) */}
          <section className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <span>Eligibility Breakdown</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Detailed evaluation of your credentials against official scheme guidelines.
                </p>
              </div>

              <Link to="/profile" className="text-xs font-bold text-[#133E2B] hover:underline">
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
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : isNotMet
                        ? 'bg-rose-50/40 border-rose-200/80'
                        : 'bg-amber-50/40 border-amber-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {isMet ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : isNotMet ? (
                            <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                          ) : (
                            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                          )}
                          <span className="text-sm font-bold text-stone-900">
                            {rule.label}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 pl-6">
                          <span className="font-semibold text-stone-700">Scheme Requirement: </span>
                          {rule.requirement}
                        </p>
                        <p className="text-xs text-stone-600 pl-6">
                          <span className="font-semibold text-stone-700">Your Profile: </span>
                          <span className={isMet ? 'text-emerald-900 font-bold' : 'text-rose-900 font-bold'}>
                            {rule.actual}
                          </span>
                          {' — '}
                          <span className="italic text-stone-500">{rule.reason}</span>
                        </p>
                      </div>

                      <span
                        className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                          isMet
                            ? 'bg-emerald-100 text-emerald-900'
                            : isNotMet
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {isMet ? 'Met' : isNotMet ? 'Not Met' : 'Review'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Eligibility Summary Text */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Official Scheme Notifications
              </h3>
              <ul className="space-y-2">
                {scholarship.eligibilityRules.descriptions.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#133E2B] mt-1.5 shrink-0" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </section>

          {/* DOCUMENTS CHECKLIST (1 Col) */}
          <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="pb-3 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#133E2B]" />
                    <span>Documents Checklist</span>
                  </h2>
                  <span className="text-xs font-extrabold text-[#133E2B] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {checkedCount} / {totalDocs} Done
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Keep track of documents you have gathered. Persisted automatically.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-[#133E2B] h-full transition-all duration-300 rounded-full"
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
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                        isChecked
                          ? 'bg-emerald-50/60 border-emerald-200 text-stone-800'
                          : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-stone-100/70'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#133E2B] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <span className={isChecked ? 'line-through text-stone-500 font-medium' : 'font-medium'}>
                        {doc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-stone-400 mt-6 pt-4 border-t border-stone-100 text-center">
              Checklist state is saved locally in your browser.
            </p>

          </section>

        </div>

        {/* APPLICATION TIMELINE / STEPS */}
        <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900">Step-by-Step Application Timeline</h2>
            <p className="text-xs text-stone-500">Official procedure to apply and verify this scholarship scheme.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {scholarship.applicationSteps.map((step) => (
              <div 
                key={step.step}
                className="relative bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-[#133E2B] text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
                    {step.step}
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
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
                <h2 className="text-xl font-bold text-stone-900">Similar Scholarships You May Qualify For</h2>
                <p className="text-xs text-stone-500">Based on your educational stream and category.</p>
              </div>
              <Link to="/" className="text-xs font-bold text-[#133E2B] hover:underline">
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
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          <div className="hidden sm:block">
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">{scholarship.provider}</p>
            <p className="text-base font-extrabold text-[#133E2B] leading-none mt-0.5">{scholarship.amountFormatted}</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* Bookmark button */}
            <button
              type="button"
              onClick={() => toggleSave(scholarship.id)}
              className={`p-3 rounded-xl border transition-colors ${
                saved
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
              title={saved ? 'Remove from saved' : 'Save scholarship'}
              aria-label="Save scholarship"
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
            </button>

            {/* Start Tracking / Move to Applying button */}
            <button
              type="button"
              onClick={() => setTrackerStatus(scholarship.id, 'applying')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                currentTracker === 'applying'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : currentTracker
                  ? 'bg-stone-100 text-stone-800 border-stone-300'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
              }`}
            >
              <KanbanSquare className="w-4 h-4 text-[#133E2B]" />
              <span>{currentTracker ? `Tracker: ${currentTracker}` : 'Start Tracking'}</span>
            </button>

            {/* Official Apply Link Button */}
            <a
              href={scholarship.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#133E2B] hover:bg-[#1B533A] text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#133E2B] focus:ring-offset-2"
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
