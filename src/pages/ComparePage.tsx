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
import { usePageTitle } from '../hooks/usePageTitle';
import { SCHOLARSHIPS } from '../data/scholarships';
import { formatReadableDate, formatDeadlineBadge } from '../utils/dateUtils';

export const ComparePage: React.FC = () => {
  usePageTitle('Compare Scholarships');
  const { compareIds, toggleCompare, clearCompare, calculateMatch, setTrackerStatus, getTrackerStatus } = useApp();

  const comparedScholarships = compareIds
    .map(id => SCHOLARSHIPS.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  if (comparedScholarships.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-text">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Columns className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">
          No Scholarships Selected for Comparison
        </h1>
        <p className="text-sm text-muted max-w-md mx-auto mb-8">
          You can select up to 3 scholarships from the Discover catalog by clicking the <strong>Compare</strong> button on their cards.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-contrast font-bold text-sm shadow-xs transition-opacity hover:opacity-95 min-h-[44px]"
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
        <span className="text-lg font-extrabold text-primary">{s.amountFormatted}</span>
      ),
    },
    {
      label: 'Eligibility Match',
      render: (s: typeof comparedScholarships[0]) => {
        const match = calculateMatch(s);
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
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
            <span className="text-xs font-bold text-text block">{formatReadableDate(s.deadline)}</span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
              info.isCritical ? 'bg-danger/10 text-danger border border-danger/30' : info.isUrgent ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-surface-2 text-muted border border-border'
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
        <span className="text-xs font-semibold text-text">{s.level}</span>
      ),
    },
    {
      label: 'Scheme Category',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-medium text-text bg-surface-2 border border-border/50 px-2 py-1 rounded-md">{s.category}</span>
      ),
    },
    {
      label: 'Maximum Family Income',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-bold text-text">
          {s.eligibilityRules.maxFamilyIncome ? `₹${s.eligibilityRules.maxFamilyIncome.toLocaleString('en-IN')}` : 'No Income Cap'}
        </span>
      ),
    },
    {
      label: 'Minimum Percentage',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-bold text-text">
          {s.eligibilityRules.minPercentage ? `${s.eligibilityRules.minPercentage}% marks` : 'Not specified'}
        </span>
      ),
    },
    {
      label: 'State / Domicile',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="text-xs font-medium text-text">
          {s.eligibilityRules.targetStates?.join(', ') || s.country}
        </span>
      ),
    },
    {
      label: 'Documents Required',
      render: (s: typeof comparedScholarships[0]) => (
        <div className="text-xs text-text">
          <p className="font-bold text-text mb-1">{s.documentsRequired.length} Documents:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted">
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
    <div id="main-content" className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/" className="text-xs font-bold text-muted hover:text-text flex items-center gap-1 min-h-[36px]">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
              Scholarship Comparison ({comparedScholarships.length}/3)
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Evaluate eligibility criteria, award amounts, and deadline windows side-by-side.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs font-bold text-muted hover:text-danger transition-colors px-3 py-2 min-h-[44px]"
            >
              Clear Comparison
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-contrast text-xs font-bold shadow-xs hover:opacity-95 transition-opacity min-h-[44px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More</span>
            </Link>
          </div>
        </div>

        {/* COMPARISON TABLE (Horizontally scrollable on mobile) */}
        <div className="bg-surface rounded-3xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left" role="table">
              
              {/* Header Row: Scheme Names and quick actions */}
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted w-52 shrink-0">
                    Criteria
                  </th>
                  {comparedScholarships.map((sch) => (
                    <th key={sch.id} className="p-5 min-w-[280px] max-w-[320px] align-top">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider truncate">
                          {sch.provider}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCompare(sch.id)}
                          className="p-1 rounded-lg text-muted hover:text-danger hover:bg-surface min-h-[32px] min-w-[32px] flex items-center justify-center"
                          title="Remove from compare"
                          aria-label={`Remove ${sch.name} from comparison`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <Link 
                        to={`/scholarship/${sch.id}`}
                        className="text-base font-extrabold text-text hover:text-primary transition-colors leading-snug block mb-3"
                      >
                        {sch.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/scholarship/${sch.id}`}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-contrast text-xs font-bold hover:opacity-95 transition-opacity min-h-[36px] flex items-center"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => setTrackerStatus(sch.id, 'applying')}
                          className="px-3 py-1.5 rounded-lg border border-border text-text text-xs font-bold hover:bg-surface-2 transition-colors min-h-[36px]"
                        >
                          {getTrackerStatus(sch.id) ? `Tracked (${getTrackerStatus(sch.id)})` : 'Track'}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody className="divide-y divide-border">
                {comparisonAttributes.map((attr, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-2/40'}>
                    <td className="p-5 font-bold text-xs text-text bg-surface-2/70 w-52">
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
                <tr className="bg-surface-2/90 border-t border-border">
                  <td className="p-5 font-bold text-xs text-text">Official Portal</td>
                  {comparedScholarships.map((sch) => (
                    <td key={sch.id} className="p-5 align-middle">
                      <a
                        href={sch.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline min-h-[36px]"
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
