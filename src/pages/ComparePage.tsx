import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  X, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  Columns, 
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS } from '../data/scholarships';
import { formatReadableDate, formatDeadlineBadge } from '../utils/dateUtils';

export const ComparePage: React.FC = () => {
  const { compareIds, toggleCompare, clearCompare, calculateMatch, setTrackerStatus, getTrackerStatus } = useApp();

  const comparedScholarships = compareIds
    .map(id => SCHOLARSHIPS.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  if (comparedScholarships.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#133E2B] flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <Columns className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
          No Scholarships Selected for Comparison
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto mb-8">
          You can select up to 3 scholarships from the Discover catalog by clicking the <strong>Compare</strong> button on their cards.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#133E2B] hover:bg-[#1B533A] text-white font-bold text-sm shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Discover & Select</span>
        </Link>
      </div>
    );
  }

  const comparisonAttributes = [
    {
      label: 'Award Amount',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-lg font-extrabold text-[#133E2B]">{s.amountFormatted}</span>
      ),
    },
    {
      label: 'Eligibility Match',
      render: (s: typeof comparedScholarships[0]) => {
        const match = calculateMatch(s);
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#133E2B] border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{match.score}% Match</span>
          </div>
        );
      },
    },
    {
      label: 'Application Deadline',
      render: (s: typeof comparedScholarships[0]) => {
        const info = formatDeadlineBadge(s.deadline);
        return (
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-900 block">{formatReadableDate(s.deadline)}</span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
              info.isCritical ? 'bg-rose-100 text-rose-800' : info.isUrgent ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-700'
            }`}>
              <Clock className="w-3 h-3" />
              {info.text}
            </span>
          </div>
        );
      },
    },
    {
      label: 'Course / Education Level',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-semibold text-stone-800">{s.level}</span>
      ),
    },
    {
      label: 'Scheme Category',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-medium text-stone-700 bg-stone-100 px-2 py-1 rounded-md">{s.category}</span>
      ),
    },
    {
      label: 'Maximum Family Income',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-bold text-stone-800">
          {s.eligibilityRules.maxFamilyIncome ? `₹${s.eligibilityRules.maxFamilyIncome.toLocaleString('en-IN')}` : 'No Income Cap'}
        </span>
      ),
    },
    {
      label: 'Minimum Percentage',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-bold text-stone-800">
          {s.eligibilityRules.minPercentage ? `${s.eligibilityRules.minPercentage}% marks` : 'Not specified'}
        </span>
      ),
    },
    {
      label: 'State / Domicile',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-medium text-stone-800">
          {s.eligibilityRules.targetStates?.join(', ') || s.country}
        </span>
      ),
    },
    {
      label: 'Documents Required',
      render: (s: typeof comparedScholarships[0]) => (
        <div className="text-xs text-stone-600">
          <p className="font-bold text-stone-800 mb-1">{s.documentsRequired.length} Documents:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-500">
            {s.documentsRequired.slice(0, 3).map((d, i) => (
              <li key={i} className="truncate max-w-[200px]">{d}</li>
            ))}
            {s.documentsRequired.length > 3 && (
              <li className="italic">+ {s.documentsRequired.length - 3} more</li>
            )}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/" className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">
              Scholarship Comparison ({comparedScholarships.length}/3)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Evaluate eligibility criteria, award amounts, and deadline windows side-by-side.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs font-bold text-stone-500 hover:text-rose-600 transition-colors px-3 py-2"
            >
              Clear Comparison
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#133E2B] hover:bg-[#1B533A] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More</span>
            </Link>
          </div>
        </div>

        {/* COMPARISON TABLE (Horizontally scrollable on mobile) */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left" role="table">
              
              {/* Header Row: Scheme Names and quick actions */}
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF8F5]">
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-stone-400 w-52 shrink-0">
                    Criteria
                  </th>
                  {comparedScholarships.map((sch) => (
                    <th key={sch.id} className="p-5 min-w-[280px] max-w-[320px] align-top">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider truncate">
                          {sch.provider}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCompare(sch.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100"
                          title="Remove from compare"
                          aria-label={`Remove ${sch.name} from comparison`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <Link 
                        to={`/scholarship/${sch.id}`}
                        className="text-base font-extrabold text-stone-900 hover:text-[#133E2B] transition-colors leading-snug block mb-3"
                      >
                        {sch.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/scholarship/${sch.id}`}
                          className="px-3 py-1.5 rounded-lg bg-[#133E2B] text-white text-xs font-bold hover:bg-[#1B533A] transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => setTrackerStatus(sch.id, 'applying')}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                        >
                          {getTrackerStatus(sch.id) ? `Tracked (${getTrackerStatus(sch.id)})` : 'Track'}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody className="divide-y divide-stone-100">
                {comparisonAttributes.map((attr, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]/50'}>
                    <td className="p-5 font-bold text-xs text-stone-700 bg-stone-50/60 w-52">
                      {attr.label}
                    </td>
                    {comparedScholarships.map((sch) => (
                      <td key={sch.id} className="p-5 align-top">
                        {attr.render(sch)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Footer Action Row */}
                <tr className="bg-stone-50/80 border-t border-stone-200">
                  <td className="p-5 font-bold text-xs text-stone-700">Official Portal</td>
                  {comparedScholarships.map((sch) => (
                    <td key={sch.id} className="p-5 align-middle">
                      <a
                        href={sch.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#133E2B] hover:underline"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
