import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS } from '../data/scholarships';
import type { TrackerStatus } from '../types';

export const TrackerPage: React.FC = () => {
  const { trackerItems, setTrackerStatus, removeFromTracker } = useApp();

  const columns: { id: TrackerStatus; label: string; countColor: string }[] = [
    { id: 'saved', label: 'Saved', countColor: 'bg-stone-200 text-stone-800' },
    { id: 'applying', label: 'Applying', countColor: 'bg-amber-100 text-amber-900' },
    { id: 'submitted', label: 'Submitted', countColor: 'bg-blue-100 text-blue-900' },
    { id: 'awarded', label: 'Awarded', countColor: 'bg-emerald-100 text-emerald-900' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">Application Tracker</h1>
          <p className="text-xs sm:text-sm text-stone-600">Track and manage every stage of your scholarship applications.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#133E2B] text-white text-xs font-bold hover:bg-[#1B533A]"
        >
          <Plus className="w-4 h-4" /> Discover More
        </Link>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map((col) => {
          const itemsInCol = Object.values(trackerItems).filter(item => item.status === col.id);

          return (
            <div key={col.id} className="bg-white/60 rounded-3xl border border-stone-200 p-4 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                <span className="font-bold text-sm text-stone-900">{col.label}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${col.countColor}`}>
                  {itemsInCol.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {itemsInCol.length === 0 ? (
                  <div className="text-center py-8 text-xs text-stone-400">
                    No scholarships in this stage.
                  </div>
                ) : (
                  itemsInCol.map((item) => {
                    const sch = SCHOLARSHIPS.find(s => s.id === item.scholarshipId);
                    if (!sch) return null;

                    return (
                      <div key={item.scholarshipId} className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block truncate">
                          {sch.provider}
                        </span>
                        <Link to={`/scholarship/${sch.id}`} className="text-sm font-bold text-stone-900 hover:text-[#133E2B] block leading-snug">
                          {sch.name}
                        </Link>
                        <div className="text-xs font-extrabold text-[#133E2B]">
                          {sch.amountFormatted}
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-stone-500 italic bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                            {item.notes}
                          </p>
                        )}
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                          <select
                            value={item.status}
                            onChange={(e) => setTrackerStatus(item.scholarshipId, e.target.value as TrackerStatus)}
                            className="text-[11px] font-semibold text-stone-700 bg-stone-100 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="saved">Saved</option>
                            <option value="applying">Applying</option>
                            <option value="submitted">Submitted</option>
                            <option value="awarded">Awarded</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeFromTracker(item.scholarshipId)}
                            className="text-stone-400 hover:text-rose-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
