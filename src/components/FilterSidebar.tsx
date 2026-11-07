import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  IndianRupee, 
  Calendar, 
  GraduationCap, 
  Tag, 
  Check, 
  Sparkles, 
  Bookmark,
  MapPin
} from 'lucide-react';
import type { FilterState } from '../types';
import { ALL_CATEGORIES, ALL_LEVELS, INDIAN_STATES } from '../data/scholarships';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  onlySaved: boolean;
  onToggleOnlySaved: () => void;
  onlyHighMatch: boolean;
  onToggleOnlyHighMatch: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
  onlySaved,
  onToggleOnlySaved,
  onlyHighMatch,
  onToggleOnlyHighMatch,
}) => {
  const isFiltered = 
    filters.level !== 'All Levels' || 
    filters.category !== 'All Categories' || 
    filters.state !== 'All India' ||
    filters.minAmount > 0 || 
    filters.deadlineRange !== 'all' || 
    filters.search !== '' ||
    onlySaved ||
    onlyHighMatch;

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6" aria-label="Filters">
      
      {/* Header & Reset */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#133E2B]" />
            <h2 className="text-base font-bold text-stone-900">Filters</h2>
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick Toggles: High Match & Saved Only */}
        <div className="pt-4 space-y-2.5">
          <label className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200/70 hover:bg-stone-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-800" />
              <span className="text-xs font-semibold text-stone-800">High Match (&gt;75%)</span>
            </div>
            <input
              type="checkbox"
              checked={onlyHighMatch}
              onChange={onToggleOnlyHighMatch}
              className="w-4 h-4 rounded text-[#133E2B] focus:ring-[#133E2B] accent-[#133E2B]"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200/70 hover:bg-stone-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-stone-800">Saved Scholarships</span>
            </div>
            <input
              type="checkbox"
              checked={onlySaved}
              onChange={onToggleOnlySaved}
              className="w-4 h-4 rounded text-[#133E2B] focus:ring-[#133E2B] accent-[#133E2B]"
            />
          </label>
        </div>

        {/* Education Level Filter */}
        <div className="pt-5 border-t border-stone-100 mt-5">
          <label className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
            <GraduationCap className="w-3.5 h-3.5 text-stone-500" />
            <span>Course Level</span>
          </label>
          <div className="space-y-1">
            {ALL_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ level })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  filters.level === level
                    ? 'bg-[#133E2B] text-white font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{level}</span>
                {filters.level === level && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme Category Filter */}
        <div className="pt-5 border-t border-stone-100 mt-5">
          <label className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
            <Tag className="w-3.5 h-3.5 text-stone-500" />
            <span>Scheme Type</span>
          </label>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {ALL_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onChange({ category })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  filters.category === category
                    ? 'bg-[#133E2B] text-white font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="truncate">{category}</span>
                {filters.category === category && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* State / Domicile Filter */}
        <div className="pt-5 border-t border-stone-100 mt-5">
          <label htmlFor="filter-state" className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>State of Domicile</span>
          </label>
          <select
            id="filter-state"
            value={filters.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#133E2B]"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Minimum Award in INR */}
        <div className="pt-5 border-t border-stone-100 mt-5">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider">
              <IndianRupee className="w-3.5 h-3.5 text-stone-500" />
              <span>Min Amount</span>
            </label>
            <span className="text-xs font-extrabold text-[#133E2B]">
              {filters.minAmount > 0 ? `₹${(filters.minAmount / 1000).toLocaleString('en-IN')}k+` : 'Any'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="10000"
            value={filters.minAmount}
            onChange={(e) => onChange({ minAmount: parseInt(e.target.value, 10) })}
            className="w-full accent-[#133E2B] cursor-pointer"
            aria-label="Filter by minimum scholarship amount in INR"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-1">
            <span>₹0</span>
            <span>₹1.0 Lakh</span>
            <span>₹2.0 Lakh+</span>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            {[0, 25000, 50000, 100000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onChange({ minAmount: amt })}
                className={`py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                  filters.minAmount === amt
                    ? 'border-[#133E2B] bg-[#133E2B] text-white'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {amt === 0 ? 'All' : `₹${amt / 1000}k`}
              </button>
            ))}
          </div>
        </div>

        {/* Deadline Urgency */}
        <div className="pt-5 border-t border-stone-100 mt-5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>Deadline Window</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'all', label: 'All Dates' },
              { id: '30-days', label: 'Within 30 Days' },
              { id: '60-days', label: 'Within 60 Days' },
              { id: '90-days', label: 'Within 90 Days' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onChange({ deadlineRange: d.id as any })}
                className={`p-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                  filters.deadlineRange === d.id
                    ? 'border-[#133E2B] bg-[#133E2B] text-white font-semibold'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Side summary box */}
      <div className="bg-[#E2F1E9]/60 rounded-2xl p-4 border border-emerald-200 text-xs text-stone-700">
        <p className="font-bold text-[#133E2B] mb-1">Scholarships Found</p>
        <p>Showing <span className="font-bold text-stone-900">{filteredCount}</span> of <span className="font-bold text-stone-900">{totalCount}</span> active schemes matching your criteria.</p>
      </div>

    </aside>
  );
};
