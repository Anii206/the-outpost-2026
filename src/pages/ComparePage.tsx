import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import { ArrowSquareOut } from '@phosphor-icons/react/dist/csr/ArrowSquareOut';
import { ArrowsLeftRight } from '@phosphor-icons/react/dist/csr/ArrowsLeftRight';
import { Plus } from '@phosphor-icons/react/dist/csr/Plus';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { SCHOLARSHIPS } from '../data/scholarships';
import { formatReadableDate, formatDeadlineBadge } from '../utils/dateUtils';

export const ComparePage: React.FC = () => {
  usePageTitle('Side-by-Side Scheme Comparison — Grantly Gazette');
  const {
    compareIds,
    toggleCompare,
    clearCompare,
    calculateMatch,
    setTrackerStatus,
    getTrackerStatus,
  } = useApp();

  const comparedScholarships = compareIds
    .map((id) => SCHOLARSHIPS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  if (comparedScholarships.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-text">
        <div className="w-12 h-12 rounded-[2px] bg-primary text-primary-contrast flex items-center justify-center mx-auto mb-4">
          <ArrowsLeftRight size={22} />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text mb-2">
          No Schemes Staged for Comparison
        </h1>
        <p className="font-sans text-xs sm:text-sm text-muted max-w-md mx-auto mb-6 leading-relaxed">
          Select up to 3 scholarship notices from the Gazette index by activating the <strong>Compare</strong> button on any scheme.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] bg-primary text-primary-contrast font-semibold text-xs transition-opacity hover:opacity-90 min-h-[44px]"
        >
          <ArrowLeft size={14} />
          <span>Return to Gazette Index</span>
        </Link>
      </div>
    );
  }

  const comparisonAttributes = [
    {
      label: 'Award Grant Value',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="font-mono text-base font-bold text-primary">{s.amountFormatted}</span>
      ),
    },
    {
      label: 'Dossier Match %',
      render: (s: typeof comparedScholarships[0]) => {
        const match = calculateMatch(s);
        return (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono text-xs font-bold bg-primary/10 text-primary border border-primary/25">
            <span>{match.score}% MATCH</span>
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
            <span className="font-mono text-xs font-semibold text-text block">
              {formatReadableDate(s.deadline)}
            </span>
            <div className="deadline-stamp text-[9px] py-0 px-1.5">
              <Clock size={10} weight="bold" />
              <span>{info.text}</span>
            </div>
          </div>
        );
      },
    },
    {
      label: 'Academic Degree Tier',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="font-sans text-xs font-medium text-text">{s.level}</span>
      ),
    },
    {
      label: 'Scheme Classification',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="font-sans text-xs font-medium text-text bg-surface-2 border border-border px-2 py-0.5 rounded-[2px]">
          {s.category}
        </span>
      ),
    },
    {
      label: 'Annual Income Ceiling',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="font-mono text-xs font-bold text-text">
          {s.eligibilityRules.maxFamilyIncome
            ? `₹${s.eligibilityRules.maxFamilyIncome.toLocaleString('en-IN')}`
            : 'No Income Cap'}
        </span>
      ),
    },
    {
      label: 'Minimum Academic Marks',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="font-mono text-xs font-bold text-text">
          {s.eligibilityRules.minPercentage
            ? `${s.eligibilityRules.minPercentage}% marks`
            : 'Not specified'}
        </span>
      ),
    },
    {
      label: 'State / Domicile Rule',
      render: (s: typeof comparedScholarships[0]) => (
        <span className="font-sans text-xs font-medium text-text">
          {s.eligibilityRules.targetStates?.join(', ') || s.country}
        </span>
      ),
    },
    {
      label: 'Documents Required',
      render: (s: typeof comparedScholarships[0]) => (
        <div className="font-sans text-xs text-text">
          <p className="font-bold text-text mb-1 font-mono">{s.documentsRequired.length} Certificates Required:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted">
            {s.documentsRequired.slice(0, 3).map((d, i) => (
              <li key={i} className="truncate max-w-[200px]">{d}</li>
            ))}
            {s.documentsRequired.length > 3 && (
              <li className="italic">+ {s.documentsRequired.length - 3} additional clauses</li>
            )}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div id="main-content" className="min-h-screen py-8 bg-bg text-text transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/" className="text-xs font-semibold text-muted hover:text-text flex items-center gap-1 min-h-[36px]">
                <ArrowLeft size={13} /> Return to Discover
              </Link>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-text">
              Side-by-Side Scheme Comparison ({comparedScholarships.length}/3)
            </h1>
            <p className="font-sans text-xs sm:text-sm text-muted">
              Side-by-side comparative ledger inspecting grant sums, eligibility thresholds, and document requirements.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs font-semibold text-muted hover:text-accent transition-colors px-3 py-1.5 min-h-[44px]"
            >
              Clear Comparison
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
            >
              <Plus size={13} />
              <span>Add Scheme</span>
            </Link>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="bg-surface rounded-[4px] border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left" role="table">
              {/* Header Row */}
              <thead>
                <tr className="border-b-2 border-border bg-surface-2">
                  <th className="p-4 font-sans text-[11px] font-bold uppercase tracking-wider text-muted w-48 shrink-0">
                    Evaluation Criteria
                  </th>
                  {comparedScholarships.map((sch) => (
                    <th key={sch.id} className="p-4 min-w-[260px] max-w-[320px] align-top border-l border-border">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-sans text-[10px] font-bold text-muted uppercase tracking-wider truncate">
                          {sch.provider}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCompare(sch.id)}
                          className="p-1 rounded-[2px] text-muted hover:text-accent min-h-[32px] min-w-[32px] flex items-center justify-center"
                          title="Remove from comparison"
                          aria-label={`Remove ${sch.name} from comparison`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <Link
                        to={`/scholarship/${sch.id}`}
                        className="font-serif text-base font-bold text-text hover:text-primary transition-colors leading-snug block mb-2"
                      >
                        {sch.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/scholarship/${sch.id}`}
                          className="px-2.5 py-1 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity min-h-[36px] flex items-center"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => setTrackerStatus(sch.id, 'applying')}
                          className="px-2.5 py-1 rounded-[2px] border border-border text-text text-xs font-semibold hover:bg-surface-2 transition-colors min-h-[36px]"
                        >
                          {getTrackerStatus(sch.id) ? `Docket: ${getTrackerStatus(sch.id)}` : 'Add to Docket'}
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
                    <td className="p-4 font-sans text-xs font-bold text-text bg-surface-2/70 w-48">
                      {attr.label}
                    </td>
                    {comparedScholarships.map((sch) => (
                      <td key={sch.id} className="p-4 align-top border-l border-border">
                        {attr.render(sch)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Footer Action Row */}
                <tr className="bg-surface-2 border-t-2 border-border">
                  <td className="p-4 font-sans text-xs font-bold text-text">Official Filing Link</td>
                  {comparedScholarships.map((sch) => (
                    <td key={sch.id} className="p-4 align-middle border-l border-border">
                      <a
                        href={sch.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline min-h-[36px]"
                      >
                        <span>Official Portal</span>
                        <ArrowSquareOut size={13} />
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
