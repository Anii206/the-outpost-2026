import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { SCHOLARSHIPS } from '../data/scholarships';
import type { FilterState } from '../types';
import { useApp } from '../context/AppContext';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { getDaysRemaining } from '../utils/dateUtils';

export const DiscoverPage: React.FC = () => {
  const { isSaved, calculateMatch, profile } = useApp();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search states
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    level: 'All Levels',
    category: 'All Categories',
    minAmount: 0,
    maxAmount: 10000000,
    state: 'All India',
    deadlineRange: 'all',
    sortBy: 'match-desc',
  });

  const [onlySaved, setOnlySaved] = useState(false);
  const [onlyHighMatch, setOnlyHighMatch] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading] = useState(false);

  // Quick search shortcut: '/' focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      level: 'All Levels',
      category: 'All Categories',
      minAmount: 0,
      maxAmount: 10000000,
      state: 'All India',
      deadlineRange: 'all',
      sortBy: 'match-desc',
    });
    setOnlySaved(false);
    setOnlyHighMatch(false);
  };

  // Filter & Sort computation
  const filteredScholarships = useMemo(() => {
    return SCHOLARSHIPS.filter((item) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesProvider = item.provider.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(query));
        const matchesCategory = item.category.toLowerCase().includes(query);

        if (!matchesName && !matchesProvider && !matchesDesc && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      // 2. Academic Level
      if (filters.level !== 'All Levels') {
        const allowed = item.eligibilityRules.allowedLevels;
        const matchesLevel = item.level === 'All Levels' || 
          item.level === filters.level || 
          allowed.includes('All Levels') || 
          allowed.includes(filters.level);
        if (!matchesLevel) return false;
      }

      // 3. Category
      if (filters.category !== 'All Categories') {
        if (item.category !== filters.category) return false;
      }

      // 4. State / Domicile
      if (filters.state !== 'All India') {
        const targetStates = item.eligibilityRules.targetStates || ['All India'];
        if (!targetStates.includes('All India') && !targetStates.includes(filters.state)) {
          return false;
        }
      }

      // 5. Minimum Amount in INR
      if (filters.minAmount > 0 && item.amount < filters.minAmount) {
        return false;
      }

      // 6. Deadline Range
      if (filters.deadlineRange !== 'all') {
        const days = getDaysRemaining(item.deadline);
        if (days < 0) return false; // expired
        if (filters.deadlineRange === '30-days' && days > 30) return false;
        if (filters.deadlineRange === '60-days' && days > 60) return false;
        if (filters.deadlineRange === '90-days' && days > 90) return false;
      }

      // 7. Only Saved
      if (onlySaved && !isSaved(item.id)) {
        return false;
      }

      // 8. Only High Match
      if (onlyHighMatch) {
        const match = calculateMatch(item);
        if (match.score < 75) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (filters.sortBy === 'match-desc') {
        const matchA = calculateMatch(a).score;
        const matchB = calculateMatch(b).score;
        return matchB - matchA;
      }
      if (filters.sortBy === 'deadline-asc') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (filters.sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (filters.sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      if (filters.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [filters, onlySaved, onlyHighMatch, isSaved, calculateMatch]);

  // Quick category pills on Hero
  const popularTags = [
    { label: 'All', category: 'All Categories' },
    { label: 'Girls in STEM', category: 'Girls in STEM' },
    { label: 'Corporate CSR', category: 'Corporate CSR' },
    { label: 'SC/ST Welfare', category: 'SC/ST/OBC Welfare' },
    { label: 'State Schemes', category: 'State Government Scheme' },
    { label: 'Merit-Based', category: 'Merit-Based' },
  ];

  return (
    <div className="min-h-screen pb-16">
      
      {/* PROMPT BANNER: If profile is not fully onboarded */}
      {!profile.isOnboarded && (
        <aside aria-label="Profile setup alert" className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Set up your profile in 60 seconds</strong> to calculate precise eligibility for state schemes, reservation benefits, and income ceilings.
              </span>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors shadow-2xs"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pb-20 border-b border-stone-200/80 bg-gradient-to-b from-[#F3EEE5]/80 via-[#FAF8F5] to-[#FAF8F5]">
        
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#133E2B] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {profile.isOnboarded 
                  ? `Eligibility Active for ${profile.name.split(' ')[0]} (${profile.category} • ${profile.state})`
                  : 'India’s Unified Scholarship Discovery Engine'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#133E2B] tracking-tight leading-tight">
              Find Scholarships Built for Indian Students
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Explore 24 verified government and corporate schemes offering over ₹4.8 Crores in educational aid. Instant eligibility check for General, OBC, SC, ST & EWS categories.
            </p>

            {/* Main Search Input */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-md rounded-2xl bg-white border border-stone-300 focus-within:border-[#133E2B] focus-within:ring-2 focus-within:ring-[#133E2B]/20 transition-all">
                <Search className="w-5 h-5 text-stone-400 ml-4 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  placeholder="Search NSP, AICTE, Reliance, Tata, State schemes, course..."
                  className="w-full py-4 px-3 text-stone-900 placeholder:text-stone-400 bg-transparent text-sm sm:text-base focus:outline-none"
                  aria-label="Search scholarships"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ search: '' })}
                    className="p-1.5 mr-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                    aria-label="Clear search text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="hidden sm:flex items-center pr-3 pointer-events-none">
                  <kbd className="px-2 py-1 rounded bg-stone-100 border border-stone-200 text-stone-500 text-xs font-mono">
                    /
                  </kbd>
                </div>
              </div>
            </div>

            {/* Category Quick Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-stone-500 mr-1">Popular:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleFilterChange({ category: tag.category as any })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filters.category === tag.category
                      ? 'bg-[#133E2B] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

          </div>

          {/* Metrics Bar with INR formatting */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-stone-200/80 p-4 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">24</span>
              <p className="text-xs font-medium text-stone-600 mt-0.5">Verified Indian Schemes</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-stone-200/80 p-4 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">₹4.8 Cr+</span>
              <p className="text-xs font-medium text-stone-600 mt-0.5">Total Available Aid</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-stone-200/80 p-4 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">8</span>
              <p className="text-xs font-medium text-stone-600 mt-0.5">Closing In 14 Days</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-stone-200/80 p-4 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">100%</span>
              <p className="text-xs font-medium text-stone-600 mt-0.5">Free & Verified Portals</p>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/70">
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span>All Opportunities</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                {filteredScholarships.length}
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Sorted by best eligibility match for your current academic profile.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            
            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs font-semibold shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#133E2B]" />
              <span>Filters</span>
              {(filters.level !== 'All Levels' || filters.category !== 'All Categories' || filters.minAmount > 0 || filters.state !== 'All India' || onlySaved || onlyHighMatch) && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-stone-200/90 rounded-xl px-3 py-2 shadow-xs">
              <ArrowUpDown className="w-4 h-4 text-stone-500 shrink-0" />
              <label htmlFor="sort-select" className="text-xs font-medium text-stone-600 shrink-0">
                Sort:
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="match-desc">Highest Match (%)</option>
                <option value="deadline-asc">Deadline (Soonest)</option>
                <option value="amount-desc">Amount (Highest)</option>
                <option value="amount-asc">Amount (Lowest)</option>
                <option value="name-asc">Name (A-Z)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Active Filter Chips */}
        {(filters.level !== 'All Levels' || 
          filters.category !== 'All Categories' || 
          filters.state !== 'All India' ||
          filters.minAmount > 0 || 
          filters.deadlineRange !== 'all' || 
          onlySaved || 
          onlyHighMatch || 
          filters.search) && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
            <span className="text-xs text-stone-500 font-medium">Active filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-stone-200/80 text-stone-800">
                "{filters.search}"
                <button type="button" onClick={() => handleFilterChange({ search: '' })} aria-label="Remove search filter">
                  <X className="w-3 h-3 hover:text-stone-900" />
                </button>
              </span>
            )}

            {filters.level !== 'All Levels' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-stone-200/80 text-stone-800">
                Level: {filters.level}
                <button type="button" onClick={() => handleFilterChange({ level: 'All Levels' })} aria-label="Remove level filter">
                  <X className="w-3 h-3 hover:text-stone-900" />
                </button>
              </span>
            )}

            {filters.category !== 'All Categories' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-stone-200/80 text-stone-800">
                Type: {filters.category}
                <button type="button" onClick={() => handleFilterChange({ category: 'All Categories' })} aria-label="Remove category filter">
                  <X className="w-3 h-3 hover:text-stone-900" />
                </button>
              </span>
            )}

            {filters.state !== 'All India' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-stone-200/80 text-stone-800">
                State: {filters.state}
                <button type="button" onClick={() => handleFilterChange({ state: 'All India' })} aria-label="Remove state filter">
                  <X className="w-3 h-3 hover:text-stone-900" />
                </button>
              </span>
            )}

            {filters.minAmount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-stone-200/80 text-stone-800">
                Min: ₹{(filters.minAmount / 1000).toLocaleString('en-IN')}k
                <button type="button" onClick={() => handleFilterChange({ minAmount: 0 })} aria-label="Remove min amount filter">
                  <X className="w-3 h-3 hover:text-stone-900" />
                </button>
              </span>
            )}

            {onlyHighMatch && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-900 font-semibold">
                Match &gt; 75%
                <button type="button" onClick={() => setOnlyHighMatch(false)} aria-label="Remove high match filter">
                  <X className="w-3 h-3 hover:text-emerald-950" />
                </button>
              </span>
            )}

            {onlySaved && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-amber-100 text-amber-900 font-semibold">
                Saved Only
                <button type="button" onClick={() => setOnlySaved(false)} aria-label="Remove saved only filter">
                  <X className="w-3 h-3 hover:text-amber-950" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Content Layout: Filter Sidebar + Cards Grid */}
        <div className="pt-6 flex flex-col lg:flex-row items-start gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalCount={SCHOLARSHIPS.length}
              filteredCount={filteredScholarships.length}
              onlySaved={onlySaved}
              onToggleOnlySaved={() => setOnlySaved(!onlySaved)}
              onlyHighMatch={onlyHighMatch}
              onToggleOnlyHighMatch={() => setOnlyHighMatch(!onlyHighMatch)}
            />
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
              <div 
                className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs" 
                onClick={() => setMobileFilterOpen(false)} 
              />
              <div className="relative w-full max-w-xs h-full bg-[#FAF8F5] overflow-y-auto p-5 shadow-2xl z-10">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
                  <h3 className="font-bold text-stone-900">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-stone-500 hover:bg-stone-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                  totalCount={SCHOLARSHIPS.length}
                  filteredCount={filteredScholarships.length}
                  onlySaved={onlySaved}
                  onToggleOnlySaved={() => setOnlySaved(!onlySaved)}
                  onlyHighMatch={onlyHighMatch}
                  onToggleOnlyHighMatch={() => setOnlyHighMatch(!onlyHighMatch)}
                />
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-6 py-3 rounded-xl bg-[#133E2B] text-white font-semibold text-sm"
                >
                  Apply & Close ({filteredScholarships.length} found)
                </button>
              </div>
            </div>
          )}

          {/* Cards Grid / Empty State */}
          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            ) : filteredScholarships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredScholarships.map((scholarship) => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={handleResetFilters} />
            )}
          </div>

        </div>

      </main>

    </div>
  );
};
