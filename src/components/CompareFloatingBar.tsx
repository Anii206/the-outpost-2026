import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowsLeftRight } from '@phosphor-icons/react/dist/csr/ArrowsLeftRight';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS } from '../data/scholarships';

export const CompareFloatingBar: React.FC = () => {
  const navigate = useNavigate();
  const { compareIds, toggleCompare, clearCompare } = useApp();

  if (compareIds.length === 0) return null;

  const selectedScholarships = compareIds
    .map((id) => SCHOLARSHIPS.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom duration-200">
      <div className="bg-surface text-text rounded-[4px] shadow-xl p-3 sm:p-3.5 border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left items chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <div className="w-7 h-7 rounded-[2px] bg-primary text-primary-contrast flex items-center justify-center shrink-0">
            <ArrowsLeftRight size={14} />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {selectedScholarships.map(
              (sch) =>
                sch && (
                  <span
                    key={sch.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[2px] bg-surface-2 border border-border text-xs text-text max-w-[150px] truncate"
                  >
                    <span className="truncate">{sch.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleCompare(sch.id)}
                      className="text-muted hover:text-text p-0.5"
                      aria-label={`Remove ${sch.name} from comparison`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                )
            )}

            {compareIds.length < 3 && (
              <span className="text-[11px] font-mono text-muted italic hidden md:inline">
                ({3 - compareIds.length} slot left)
              </span>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs text-muted hover:text-text font-semibold px-2 py-1 min-h-[38px]"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => navigate('/compare')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-primary text-primary-contrast hover:opacity-90 text-xs font-semibold transition-opacity min-h-[38px]"
          >
            <span>Compare ({compareIds.length}/3)</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
