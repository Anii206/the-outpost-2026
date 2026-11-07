import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Columns, X, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS } from '../data/scholarships';

export const CompareFloatingBar: React.FC = () => {
  const navigate = useNavigate();
  const { compareIds, toggleCompare, clearCompare } = useApp();

  if (compareIds.length === 0) return null;

  const selectedScholarships = compareIds
    .map(id => SCHOLARSHIPS.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#133E2B] text-white rounded-2xl shadow-2xl p-3 sm:p-4 border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left items chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center shrink-0">
            <Columns className="w-4 h-4 text-emerald-200" />
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {selectedScholarships.map(sch => sch && (
              <span 
                key={sch.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900/80 border border-emerald-700 text-xs text-emerald-100 max-w-[150px] truncate"
              >
                <span className="truncate">{sch.name}</span>
                <button
                  type="button"
                  onClick={() => toggleCompare(sch.id)}
                  className="hover:text-white"
                  aria-label={`Remove ${sch.name} from comparison`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {compareIds.length < 3 && (
              <span className="text-[11px] text-emerald-300 italic hidden md:inline">
                + Add {3 - compareIds.length} more
              </span>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs text-emerald-300 hover:text-white font-semibold px-2 py-1"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => navigate('/compare')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#133E2B] hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs"
          >
            <span>Compare ({compareIds.length}/3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
