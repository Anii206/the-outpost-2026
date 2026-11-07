import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, KanbanSquare, CheckCircle } from 'lucide-react';
import { SCHOLARSHIPS } from '../data/scholarships';
import { useApp } from '../context/AppContext';
import { formatReadableDate, formatDeadlineBadge } from '../utils/dateUtils';

export const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isSaved, toggleSave, calculateMatch, getTrackerStatus, setTrackerStatus } = useApp();

  const scholarship = SCHOLARSHIPS.find((s) => s.id === id);

  if (!scholarship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Scholarship not found</h2>
        <p className="text-stone-600 mb-6">The scholarship you requested does not exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#133E2B] text-white rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </Link>
      </div>
    );
  }

  const saved = isSaved(scholarship.id);
  const matchResult = calculateMatch(scholarship);
  const deadlineInfo = formatDeadlineBadge(scholarship.deadline);
  const currentTracker = getTrackerStatus(scholarship.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-[#133E2B] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all scholarships
      </Link>

      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-stone-500 tracking-wider block">
              {scholarship.provider}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {scholarship.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#133E2B] font-bold border border-emerald-200">
                {matchResult.score}% Match with your profile
              </span>
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-medium">
                {scholarship.level}
              </span>
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-medium">
                {scholarship.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-medium">
                {scholarship.country}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => toggleSave(scholarship.id)}
              className={`p-3 rounded-2xl border transition-all ${
                saved
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title={saved ? 'Remove from saved' : 'Save'}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setTrackerStatus(scholarship.id, currentTracker ? 'saved' : 'applying')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#133E2B] hover:bg-[#1B533A] text-white text-sm font-bold shadow-sm transition-colors"
            >
              <KanbanSquare className="w-4 h-4" />
              <span>{currentTracker ? `Status: ${currentTracker}` : 'Start Tracking'}</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
            <span className="text-xs text-stone-500 font-medium">Award Amount</span>
            <p className="text-2xl font-extrabold text-[#133E2B] mt-1">{scholarship.amountFormatted}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
            <span className="text-xs text-stone-500 font-medium">Application Deadline</span>
            <p className="text-lg font-bold text-stone-900 mt-1">{formatReadableDate(scholarship.deadline)}</p>
            <span className="text-xs font-semibold text-amber-700">{deadlineInfo.text}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
            <span className="text-xs text-stone-500 font-medium">Location & Scope</span>
            <p className="text-lg font-bold text-stone-900 mt-1">{scholarship.country}</p>
            <span className="text-xs text-stone-500">{scholarship.level}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-stone-900">About this Scholarship</h2>
          <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
            {scholarship.description}
          </p>
        </div>

        {/* Eligibility Breakdown */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-stone-900">Eligibility Criteria</h2>
          <ul className="space-y-2">
            {scholarship.eligibilityRules.descriptions.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700">
                <CheckCircle className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documents Checklist */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-stone-900">Documents Required</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scholarship.documentsRequired.map((doc, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Steps */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-stone-900">Application Steps</h2>
          <div className="space-y-3">
            {scholarship.applicationSteps.map((step) => (
              <div key={step.step} className="p-4 rounded-xl border border-stone-200/90 bg-[#FAF8F5]">
                <p className="text-xs font-bold text-[#133E2B] mb-1">Step {step.step}: {step.title}</p>
                <p className="text-xs text-stone-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
