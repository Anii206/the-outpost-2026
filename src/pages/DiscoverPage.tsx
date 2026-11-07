import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { getScholarships } from '../services/api';
import type { FilterState, Scholarship, ScholarshipCategory } from '../types';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { CompareFloatingBar } from '../components/CompareFloatingBar';
import { EligibilityFinderModal } from '../components/EligibilityFinderModal';

export const DiscoverPage: React.FC = () => {
  const { isSaved, calculateMatch, profile } = useApp();
  const searchInputRef = useRef<HTMLInputElement>(null);

  usePageTitle('Discover Scholarships');

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

  const [scholarshipsList, setScholarshipsList] = useState<Scholarship[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);
  const [onlyHighMatch, setOnlyHighMatch] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch scholarships through promise-based API with loading skeleton
  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) setIsLoading(true);
    });

    getScholarships(filters)
      .then((data) => {
        if (isMounted) {
          setScholarshipsList(data);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

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

  // Filter & Sort computation on client for saved and match status
  const filteredScholarships = useMemo(() => {
    return scholarshipsList.filter((item) => {
      if (onlySaved && !isSaved(item.id)) {
        return false;
      }
      if (onlyHighMatch) {
        const match = calculateMatch(item);
        if (match.score < 75) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'match-desc') {
        const matchA = calculateMatch(a).score;
        const matchB = calculateMatch(b).score;
        return matchB - matchA;
      }
      return 0;
    });
  }, [scholarshipsList, onlySaved, onlyHighMatch, isSaved, calculateMatch, filters.sortBy]);

  const popularTags: { label: string; category: ScholarshipCategory }[] = [
    { label: 'All', category: 'All Categories' },
    { label: 'Girls in STEM', category: 'Girls in STEM' },
    { label: 'Corporate CSR', category: 'Corporate CSR' },
    { label: 'SC/ST Welfare', category: 'SC/ST/OBC Welfare' },
    { label: 'State Schemes', category: 'State Government Scheme' },
    { label: 'Merit-Based', category: 'Merit-Based' },
  ];

  return (
    <div className="min-h-screen pb-20">
      
      {/* PROMPT BANNER: If profile is not fully onboarded */}
      {!profile.isOnboarded && (
        <aside aria-label="Profile setup alert" className="bg-accent/10 border-b border-accent/25 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-text">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent shrink-0" />
              <span>
                <strong>Set up your student profile in 60 seconds</strong> to calculate precise eligibility for state schemes, reservation benefits, and income ceilings.
              </span>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white font-bold text-xs shrink-0 transition-opacity hover:opacity-90 shadow-2xs min-h-[36px]"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pb-20 border-b border-border bg-gradient-to-b from-surface-2/60 via-bg to-bg transition-colors">
        
        {/* Decorative blur rings */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-5">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {profile.isOnboarded 
                  ? `Eligibility Active for ${profile.name.split(' ')[0]} (${profile.category} • ${profile.state})`
                  : 'India’s Unified Scholarship Discovery Engine'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              Find Scholarships Built for Indian Students
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-muted leading-relaxed font-normal max-w-2xl mx-auto">
              Explore verified government and corporate schemes offering over ₹4.8 Crores in educational aid. Instant eligibility check for General, OBC, SC, ST & EWS categories.
            </p>

            {/* HERO CTA BUTTON: 60-Second Eligibility Finder */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsFinderOpen(true)}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-primary text-primary-contrast font-extrabold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
                aria-haspopup="dialog"
              >
                <Zap className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
                <span>Find my scholarships in 60 seconds</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Main Search Bar */}
            <div className="pt-3 max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-xs rounded-2xl bg-surface border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-5 h-5 text-muted ml-4 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  placeholder="Search NSP, AICTE, Reliance, Tata, State schemes, course..."
                  className="w-full py-4 px-3 text-text placeholder:text-muted bg-transparent text-sm sm:text-base focus:outline-none"
                  aria-label="Search scholarships"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ search: '' })}
                    className="p-1.5 mr-2 rounded-lg text-muted hover:text-text hover:bg-surface-2 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    aria-label="Clear search text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="hidden sm:flex items-center pr-3 pointer-events-none">
                  <kbd className="px-2 py-1 rounded bg-surface-2 border border-border text-muted text-xs font-mono">
                    /
                  </kbd>
                </div>
              </div>
            </div>

            {/* Category Quick Pills */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-muted mr-1">Popular:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleFilterChange({ category: tag.category })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[36px] ${
                    filters.category === tag.category
                      ? 'bg-primary text-primary-contrast shadow-xs'
                      : 'bg-surface border border-border text-text hover:bg-surface-2'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

          </div>

          {/* Metrics Summary Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-surface rounded-2xl border border-border p-4 text-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">24</span>
              <p className="text-xs font-medium text-muted mt-0.5">Verified Indian Schemes</p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-4 text-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">₹4.8 Cr+</span>
              <p className="text-xs font-medium text-muted mt-0.5">Total Available Aid</p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-4 text-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-accent">8</span>
              <p className="text-xs font-medium text-muted mt-0.5">Closing In 14 Days</p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-4 text-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-success">100%</span>
              <p className="text-xs font-medium text-muted mt-0.5">Free & Verified Portals</p>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span>All Opportunities</span>
              <span 
                className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-2 text-text border border-border"
                aria-live="polite"
              >
                {filteredScholarships.length}
              </span>
            </h2>
            <p className="text-xs text-muted">
              Sorted by best eligibility match for your current academic profile.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            
            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface text-text text-xs font-semibold shadow-xs min-h-[44px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Filters</span>
              {(filters.level !== 'All Levels' || filters.category !== 'All Categories' || filters.minAmount > 0 || filters.state !== 'All India' || onlySaved || onlyHighMatch) && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 shadow-xs min-h-[44px]">
              <ArrowUpDown className="w-4 h-4 text-muted shrink-0" />
              <label htmlFor="sort-select" className="text-xs font-medium text-muted shrink-0">
                Sort:
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
                className="text-xs font-semibold text-text bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="match-desc" className="bg-surface text-text">Highest Match (%)</option>
                <option value="deadline-asc" className="bg-surface text-text">Deadline (Soonest)</option>
                <option value="amount-desc" className="bg-surface text-text">Amount (Highest)</option>
                <option value="amount-asc" className="bg-surface text-text">Amount (Lowest)</option>
                <option value="name-asc" className="bg-surface text-text">Name (A-Z)</option>
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
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2" aria-label="Active filters">
            <span className="text-xs text-muted font-medium">Active filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-surface-2 text-text border border-border">
                "{filters.search}"
                <button type="button" onClick={() => handleFilterChange({ search: '' })} aria-label="Remove search filter">
                  <X className="w-3 h-3 hover:text-primary" />
                </button>
              </span>
            )}

            {filters.level !== 'All Levels' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-surface-2 text-text border border-border">
                Level: {filters.level}
                <button type="button" onClick={() => handleFilterChange({ level: 'All Levels' })} aria-label="Remove level filter">
                  <X className="w-3 h-3 hover:text-primary" />
                </button>
              </span>
            )}

            {filters.category !== 'All Categories' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-surface-2 text-text border border-border">
                Type: {filters.category}
                <button type="button" onClick={() => handleFilterChange({ category: 'All Categories' })} aria-label="Remove category filter">
                  <X className="w-3 h-3 hover:text-primary" />
                </button>
              </span>
            )}

            {filters.state !== 'All India' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-surface-2 text-text border border-border">
                State: {filters.state}
                <button type="button" onClick={() => handleFilterChange({ state: 'All India' })} aria-label="Remove state filter">
                  <X className="w-3 h-3 hover:text-primary" />
                </button>
              </span>
            )}

            {filters.minAmount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-surface-2 text-text border border-border">
                Min: ₹{(filters.minAmount / 1000).toLocaleString('en-IN')}k
                <button type="button" onClick={() => handleFilterChange({ minAmount: 0 })} aria-label="Remove min amount filter">
                  <X className="w-3 h-3 hover:text-primary" />
                </button>
              </span>
            )}

            {onlyHighMatch && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-primary/15 text-primary border border-primary/20 font-semibold">
                Match &gt; 75%
                <button type="button" onClick={() => setOnlyHighMatch(false)} aria-label="Remove high match filter">
                  <X className="w-3 h-3 hover:opacity-75" />
                </button>
              </span>
            )}

            {onlySaved && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-accent/15 text-accent border border-accent/20 font-semibold">
                Saved Only
                <button type="button" onClick={() => setOnlySaved(false)} aria-label="Remove saved only filter">
                  <X className="w-3 h-3 hover:opacity-75" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-danger hover:underline ml-1 min-h-[36px] flex items-center"
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
              totalCount={scholarshipsList.length}
              filteredCount={filteredScholarships.length}
              onlySaved={onlySaved}
              onToggleOnlySaved={() => setOnlySaved(!onlySaved)}
              onlyHighMatch={onlyHighMatch}
              onToggleOnlyHighMatch={() => setOnlyHighMatch(!onlyHighMatch)}
            />
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end" role="dialog" aria-modal="true">
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
                onClick={() => setMobileFilterOpen(false)} 
              />
              <div className="relative w-full max-w-xs h-full bg-surface text-text overflow-y-auto p-5 shadow-2xl z-10 border-l border-border">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                  <h3 className="font-bold text-text">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-muted hover:bg-surface-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                  totalCount={scholarshipsList.length}
                  filteredCount={filteredScholarships.length}
                  onlySaved={onlySaved}
                  onToggleOnlySaved={() => setOnlySaved(!onlySaved)}
                  onlyHighMatch={onlyHighMatch}
                  onToggleOnlyHighMatch={() => setOnlyHighMatch(!onlyHighMatch)}
                />
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-contrast font-semibold text-sm min-h-[44px]"
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

      {/* Floating Compare Action Bar */}
      <CompareFloatingBar />

      {/* 60-Second Eligibility Finder Modal */}
      <EligibilityFinderModal
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        onApplyResults={() => {
          handleFilterChange({ sortBy: 'match-desc' });
        }}
      />

    </div>
  );
};
