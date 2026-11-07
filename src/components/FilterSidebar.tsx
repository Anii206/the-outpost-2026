import React, { useId, useState } from 'react';
import { Faders } from '@phosphor-icons/react/dist/csr/Faders';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { Tag } from '@phosphor-icons/react/dist/csr/Tag';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { BookmarkSimple } from '@phosphor-icons/react/dist/csr/BookmarkSimple';
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin';
import { CalendarBlank } from '@phosphor-icons/react/dist/csr/CalendarBlank';
import { CurrencyInr } from '@phosphor-icons/react/dist/csr/CurrencyInr';
import { CaretDown } from '@phosphor-icons/react/dist/csr/CaretDown';
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

const MIN_AMOUNT_CHIPS = [
  { label: 'Any', value: 0 },
  { label: '₹10,000+', value: 10000 },
  { label: '₹50,000+', value: 50000 },
  { label: '₹1,00,000+', value: 100000 },
  { label: '₹2,00,000+', value: 200000 },
];

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
  const idPrefix = useId();
  const stateId = `${idPrefix}-filter-state`;

  // Collapsible sections state: Open by default ONLY for Level; rest collapsed
  const [openSections, setOpenSections] = useState<{
    level: boolean;
    category: boolean;
    state: boolean;
    deadline: boolean;
  }>({
    level: true,
    category: false,
    state: false,
    deadline: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    <aside
      data-lenis-prevent
      className="w-full lg:w-72 shrink-0 max-h-[calc(100vh-32px)] overflow-y-auto bg-surface rounded-[4px] border border-border p-4 shadow-xs"
      aria-label="Filters"
    >
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Faders size={16} className="text-primary" />
          <div>
            <h2 className="font-serif text-sm font-bold text-text">Dossier Filters</h2>
            <span className="font-mono text-[10px] text-muted">{filteredCount} of {totalCount} indexed</span>
          </div>
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 transition-colors min-h-[32px] cursor-pointer"
          >
            <ArrowCounterClockwise size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Quick Toggles: High Match & Saved Only */}
      <div className="pt-3 space-y-1.5">
        <label className="flex items-center justify-between p-2 rounded-[2px] border border-border hover:bg-surface-2 cursor-pointer transition-colors">
          <span className="text-xs font-medium text-text">Match Score &gt; 75%</span>
          <input
            type="checkbox"
            checked={onlyHighMatch}
            onChange={onToggleOnlyHighMatch}
            className="w-4 h-4 rounded-[2px] text-primary focus:ring-primary accent-primary cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded-[2px] border border-border hover:bg-surface-2 cursor-pointer transition-colors">
          <div className="flex items-center gap-1.5">
            <BookmarkSimple size={14} className="text-accent" />
            <span className="text-xs font-medium text-text">Saved Schemes</span>
          </div>
          <input
            type="checkbox"
            checked={onlySaved}
            onChange={onToggleOnlySaved}
            className="w-4 h-4 rounded-[2px] text-primary focus:ring-primary accent-primary cursor-pointer"
          />
        </label>
      </div>

      {/* 1. Minimum Amount Chips (At the TOP, right under Match/Saved toggles) */}
      <div className="pt-3 border-t border-border mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-muted">
            <CurrencyInr size={13} className="text-muted" />
            <span>Minimum Amount</span>
          </span>
          {filters.minAmount > 0 && (
            <span className="font-mono text-[11px] font-bold text-primary lining-nums">
              ₹{filters.minAmount.toLocaleString('en-IN')}+
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {MIN_AMOUNT_CHIPS.map((chip) => {
            const isSelected = filters.minAmount === chip.value;
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => onChange({ minAmount: chip.value })}
                className={`px-2 py-1.5 rounded-[2px] text-xs font-medium border text-center transition-colors min-h-[34px] cursor-pointer ${
                  chip.value === 0 ? 'col-span-2' : ''
                } ${
                  isSelected
                    ? 'bg-primary text-primary-contrast border-primary font-semibold'
                    : 'bg-surface border-border text-text hover:bg-surface-2'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Academic Level (Collapsible, OPEN by default) */}
      <div className="pt-3 border-t border-border mt-3">
        <button
          type="button"
          onClick={() => toggleSection('level')}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
          aria-expanded={openSections.level}
        >
          <div className="flex items-center gap-1.5 truncate pr-1">
            <GraduationCap size={13} className="text-muted shrink-0" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-muted group-hover:text-text transition-colors">
              Academic Level
            </span>
            {!openSections.level && filters.level !== 'All Levels' && (
              <span className="text-[10px] font-medium text-primary px-1.5 py-0.5 rounded-[2px] bg-primary/10 border border-primary/25 truncate max-w-[110px]">
                {filters.level}
              </span>
            )}
          </div>
          <CaretDown
            size={13}
            className={`text-muted shrink-0 transition-transform duration-150 ${openSections.level ? 'rotate-180' : ''}`}
          />
        </button>

        {openSections.level && (
          <div className="space-y-1 pt-2">
            {ALL_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ level })}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[2px] text-xs font-medium transition-colors cursor-pointer ${
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
        )}
      </div>

      {/* 3. Scheme Type (Collapsible, COLLAPSED by default, natural height) */}
      <div className="pt-3 border-t border-border mt-3">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
          aria-expanded={openSections.category}
        >
          <div className="flex items-center gap-1.5 truncate pr-1">
            <Tag size={13} className="text-muted shrink-0" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-muted group-hover:text-text transition-colors">
              Scheme Type
            </span>
            {!openSections.category && filters.category !== 'All Categories' && (
              <span className="text-[10px] font-medium text-primary px-1.5 py-0.5 rounded-[2px] bg-primary/10 border border-primary/25 truncate max-w-[110px]">
                {filters.category}
              </span>
            )}
          </div>
          <CaretDown
            size={13}
            className={`text-muted shrink-0 transition-transform duration-150 ${openSections.category ? 'rotate-180' : ''}`}
          />
        </button>

        {openSections.category && (
          <div className="space-y-1 pt-2">
            {ALL_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onChange({ category })}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[2px] text-xs font-medium transition-colors cursor-pointer ${
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
        )}
      </div>

      {/* 4. State / Domicile (Collapsible, COLLAPSED by default) */}
      <div className="pt-3 border-t border-border mt-3">
        <button
          type="button"
          onClick={() => toggleSection('state')}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
          aria-expanded={openSections.state}
        >
          <div className="flex items-center gap-1.5 truncate pr-1">
            <MapPin size={13} className="text-muted shrink-0" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-muted group-hover:text-text transition-colors">
              State / Domicile
            </span>
            {!openSections.state && filters.state !== 'All India' && (
              <span className="text-[10px] font-medium text-primary px-1.5 py-0.5 rounded-[2px] bg-primary/10 border border-primary/25 truncate max-w-[110px]">
                {filters.state}
              </span>
            )}
          </div>
          <CaretDown
            size={13}
            className={`text-muted shrink-0 transition-transform duration-150 ${openSections.state ? 'rotate-180' : ''}`}
          />
        </button>

        {openSections.state && (
          <div className="pt-2">
            <select
              id={stateId}
              value={filters.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full px-2.5 py-2 rounded-[2px] border border-border text-xs font-medium text-text bg-surface focus:outline-none focus:ring-1 focus:ring-primary min-h-[38px] cursor-pointer"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st} className="bg-surface text-text">{st}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 5. Deadline Window (Collapsible, COLLAPSED by default) */}
      <div className="pt-3 border-t border-border mt-3">
        <button
          type="button"
          onClick={() => toggleSection('deadline')}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
          aria-expanded={openSections.deadline}
        >
          <div className="flex items-center gap-1.5 truncate pr-1">
            <CalendarBlank size={13} className="text-muted shrink-0" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-muted group-hover:text-text transition-colors">
              Deadline Window
            </span>
            {!openSections.deadline && filters.deadlineRange !== 'all' && (
              <span className="text-[10px] font-medium text-primary px-1.5 py-0.5 rounded-[2px] bg-primary/10 border border-primary/25">
                Active
              </span>
            )}
          </div>
          <CaretDown
            size={13}
            className={`text-muted shrink-0 transition-transform duration-150 ${openSections.deadline ? 'rotate-180' : ''}`}
          />
        </button>

        {openSections.deadline && (
          <div className="grid grid-cols-2 gap-1.5 pt-2">
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
                className={`px-2 py-1.5 rounded-[2px] text-xs font-medium border text-center transition-colors min-h-[36px] cursor-pointer ${
                  filters.deadlineRange === option.id
                    ? 'bg-primary text-primary-contrast border-primary font-semibold'
                    : 'bg-surface border-border text-text hover:bg-surface-2'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
