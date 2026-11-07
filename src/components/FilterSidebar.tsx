import React from 'react';
import { Faders } from '@phosphor-icons/react/dist/csr/Faders';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { Tag } from '@phosphor-icons/react/dist/csr/Tag';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { BookmarkSimple } from '@phosphor-icons/react/dist/csr/BookmarkSimple';
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin';
import { CalendarBlank } from '@phosphor-icons/react/dist/csr/CalendarBlank';
import { CurrencyInr } from '@phosphor-icons/react/dist/csr/CurrencyInr';
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
    <aside className="w-full lg:w-72 shrink-0 space-y-4" aria-label="Filters">
      <div className="bg-surface rounded-[4px] border border-border p-5 shadow-xs">
        
        {/* Header & Reset */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Faders size={16} className="text-primary" />
            <div>
              <h2 className="font-serif text-base font-bold text-text">Dossier Filters</h2>
              <span className="font-mono text-[10px] text-muted">{filteredCount} of {totalCount} indexed</span>
            </div>
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 transition-colors min-h-[36px]"
            >
              <ArrowCounterClockwise size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick Toggles: High Match & Saved Only */}
        <div className="pt-4 space-y-2">
          <label className="flex items-center justify-between p-2.5 rounded-[2px] border border-border hover:bg-surface-2 cursor-pointer transition-colors">
            <span className="text-xs font-medium text-text">Match Score &gt; 75%</span>
            <input
              type="checkbox"
              checked={onlyHighMatch}
              onChange={onToggleOnlyHighMatch}
              className="w-4 h-4 rounded-[2px] text-primary focus:ring-primary accent-primary"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-[2px] border border-border hover:bg-surface-2 cursor-pointer transition-colors">
            <div className="flex items-center gap-1.5">
              <BookmarkSimple size={14} className="text-accent" />
              <span className="text-xs font-medium text-text">Saved Schemes</span>
            </div>
            <input
              type="checkbox"
              checked={onlySaved}
              onChange={onToggleOnlySaved}
              className="w-4 h-4 rounded-[2px] text-primary focus:ring-primary accent-primary"
            />
          </label>
        </div>

        {/* Education Level Filter */}
        <div className="pt-4 border-t border-border mt-4">
          <label className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
            <GraduationCap size={13} className="text-muted" />
            <span>Academic Level</span>
          </label>
          <div className="space-y-1">
            {ALL_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ level })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] text-xs font-medium transition-colors ${
                  filters.level === level
                    ? 'bg-primary text-primary-contrast font-semibold'
                    : 'text-text hover:bg-surface-2'
                }`}
              >
                <span>{level}</span>
                {filters.level === level && <Check size={13} />}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme Category Filter */}
        <div className="pt-4 border-t border-border mt-4">
          <label className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
            <Tag size={13} className="text-muted" />
            <span>Scheme Type</span>
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {ALL_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onChange({ category })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] text-xs font-medium transition-colors ${
                  filters.category === category
                    ? 'bg-primary text-primary-contrast font-semibold'
                    : 'text-text hover:bg-surface-2'
                }`}
              >
                <span className="truncate">{category}</span>
                {filters.category === category && <Check size={13} className="shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* State / Domicile Filter */}
        <div className="pt-4 border-t border-border mt-4">
          <label htmlFor="filter-state" className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
            <MapPin size={13} className="text-muted" />
            <span>State / Domicile</span>
          </label>
          <select
            id="filter-state"
            value={filters.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className="w-full px-3 py-2 rounded-[2px] border border-border text-xs font-medium text-text bg-surface focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st} className="bg-surface text-text">{st}</option>
            ))}
          </select>
        </div>

        {/* Minimum Award in INR */}
        <div className="pt-4 border-t border-border mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-muted">
              <CurrencyInr size={13} className="text-muted" />
              <span>Min Amount</span>
            </label>
            <span className="font-mono text-xs font-bold text-primary">
              {filters.minAmount > 0 ? `₹${(filters.minAmount / 1000).toLocaleString('en-IN')}k+` : 'Any'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={10000}
            value={filters.minAmount}
            onChange={(e) => onChange({ minAmount: Number(e.target.value) })}
            className="w-full h-1.5 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label="Filter by minimum scholarship amount"
          />
        </div>

        {/* Deadline Range Filter */}
        <div className="pt-4 border-t border-border mt-4">
          <label className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
            <CalendarBlank size={13} className="text-muted" />
            <span>Deadline Window</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'week', label: 'Under 7 Days' },
              { id: 'month', label: 'Under 30 Days' },
              { id: 'quarter', label: '90+ Days' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ deadlineRange: option.id as FilterState['deadlineRange'] })}
                className={`px-2 py-1.5 rounded-[2px] text-xs font-medium border text-center transition-colors min-h-[38px] ${
                  filters.deadlineRange === option.id
                    ? 'bg-primary text-primary-contrast border-primary font-semibold'
                    : 'bg-surface border-border text-text hover:bg-surface-2'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
};
