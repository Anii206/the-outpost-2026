import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { Faders } from '@phosphor-icons/react/dist/csr/Faders';
import { ArrowsDownUp } from '@phosphor-icons/react/dist/csr/ArrowsDownUp';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import { getScholarships } from '../services/api';
import type { FilterState, Scholarship, ScholarshipCategory } from '../types';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { ScholarshipRow } from '../components/ScholarshipRow';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { CompareFloatingBar } from '../components/CompareFloatingBar';
import { EligibilityFinderModal } from '../components/EligibilityFinderModal';
import { CountUpNumber } from '../components/CountUpNumber';
import { getDaysRemaining, formatDeadlineBadge } from '../utils/dateUtils';

export const DiscoverPage: React.FC = () => {
  const { isSaved, calculateMatch, profile } = useApp();
  const searchInputRef = useRef<HTMLInputElement>(null);

  usePageTitle('The Grantly Gazette — Discover Indian Scholarships');

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
    setFilters((prev) => ({ ...prev, ...updated }));
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
    return scholarshipsList
      .filter((item) => {
        if (onlySaved && !isSaved(item.id)) {
          return false;
        }
        if (onlyHighMatch) {
          const match = calculateMatch(item);
          if (match.score < 75) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'match-desc') {
          const matchA = calculateMatch(a).score;
          const matchB = calculateMatch(b).score;
          return matchB - matchA;
        }
        return 0;
      });
  }, [scholarshipsList, onlySaved, onlyHighMatch, isSaved, calculateMatch, filters.sortBy]);

  // Identify schemes closing this week (<= 7 days or <= 14 days)
  const closingSoonSchemes = useMemo(() => {
    return scholarshipsList.filter((s) => {
      const days = getDaysRemaining(s.deadline);
      return days >= 0 && days <= 14;
    });
  }, [scholarshipsList]);

  // Total potential funding calculation
  const totalFundingAmount = useMemo(() => {
    return scholarshipsList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [scholarshipsList]);

  // One large featured scholarship (pick the first marked featured, or highest match)
  const featuredScholarship = useMemo(() => {
    return filteredScholarships.find((s) => s.featured) || filteredScholarships[0];
  }, [filteredScholarships]);

  // Remaining scholarships to show after featured
  const remainingScholarships = useMemo(() => {
    if (!featuredScholarship) return filteredScholarships;
    return filteredScholarships.filter((s) => s.id !== featuredScholarship.id);
  }, [filteredScholarships, featuredScholarship]);

  const popularTags: { label: string; category: ScholarshipCategory }[] = [
    { label: 'All Schemes', category: 'All Categories' },
    { label: 'Girls in STEM', category: 'Girls in STEM' },
    { label: 'Corporate CSR', category: 'Corporate CSR' },
    { label: 'SC/ST Welfare', category: 'SC/ST/OBC Welfare' },
    { label: 'State Grants', category: 'State Government Scheme' },
    { label: 'Merit-Based', category: 'Merit-Based' },
  ];

  return (
    <div className="min-h-screen pb-20 bg-bg text-text transition-colors">
      {/* PROMPT BANNER: If profile is not yet onboarded */}
      {!profile.isOnboarded && (
        <aside
          aria-label="Student dossier notification"
          className="border-b border-border bg-surface px-4 py-2.5 text-xs text-text"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Sparkle size={16} className="text-accent shrink-0" />
              <span className="font-sans">
                <strong>Notice:</strong> Create your profile to see matches across state DBT portals, category reservations, and income ceilings.
              </span>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-primary text-primary-contrast font-semibold text-xs shrink-0 hover:opacity-90 transition-opacity min-h-[36px]"
            >
              <span>Create profile</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </aside>
      )}

      {/* HERO SECTION: Editorial Newspaper Front Page Lead */}
      <section className="border-b border-border bg-surface/40 py-10 sm:py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            
            {/* Section kicker */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] border border-border bg-surface text-muted text-[11px] font-mono uppercase tracking-widest font-semibold">
              <Sparkle size={13} className="text-accent" />
              <span>
                {profile.isOnboarded
                  ? `Active Dossier: ${profile.name.split(' ')[0]} • ${profile.category} • ${profile.state}`
                  : 'An independent scholarship gazette'}
              </span>
            </div>

            {/* Oversized count-up headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-text tracking-tight leading-[1.08]">
              <CountUpNumber
                end={totalFundingAmount > 0 ? totalFundingAmount : 48250000}
                prefix="₹"
                suffix="+"
                className="font-serif lining-nums text-primary font-black"
              />{' '}
              in scholarships open now
            </h1>

            {/* Editorial subtext */}
            <p className="font-sans text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
              An independent scholarship gazette tracking government, corporate CSR, and foundation fellowships across India. Match scores are calculated against your academic profile and reservation criteria.
            </p>

            {/* Hero CTA & Search Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsFinderOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[2px] bg-primary text-primary-contrast font-semibold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 transition-all min-h-[44px]"
              >
                <span>Find my scholarships in 60 seconds</span>
                <ArrowRight size={14} />
              </button>

              <div className="w-full sm:w-96 relative flex items-center bg-surface border border-border rounded-[2px] focus-within:border-primary">
                <MagnifyingGlass size={16} className="text-muted ml-3 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  placeholder="Search scheme name, portal, or course (press /)..."
                  className="w-full py-2.5 px-2.5 text-xs text-text placeholder:text-muted bg-transparent focus:outline-none"
                  aria-label="Search gazette"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ search: '' })}
                    className="p-1 mr-1 text-muted hover:text-text"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <div className="pr-2.5 hidden sm:block pointer-events-none">
                  <kbd className="font-mono text-[10px] px-1 py-0.5 rounded-[2px] bg-surface-2 border border-border text-muted">
                    /
                  </kbd>
                </div>
              </div>
            </div>

            {/* Category Quick Tags */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs font-sans">
              <span className="font-mono text-[11px] text-muted uppercase tracking-wider mr-1">Section:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleFilterChange({ category: tag.category })}
                  className={`px-2.5 py-1 rounded-[2px] text-xs font-medium border transition-colors min-h-[36px] ${
                    filters.category === tag.category
                      ? 'bg-primary text-primary-contrast border-primary font-semibold'
                      : 'bg-surface border-border text-text hover:bg-surface-2'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* HORIZONTAL "CLOSING THIS WEEK" STRIP */}
      {closingSoonSchemes.length > 0 && (
        <section
          aria-label="Schemes closing soon"
          className="border-b border-border bg-surface py-3 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Clock size={16} className="text-accent" />
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-text">
                {closingSoonSchemes.length} schemes closing within 14 days — file required documents before deadline
              </h2>
            </div>

            {/* Horizontal scrollable items strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
              {closingSoonSchemes.slice(0, 4).map((s) => {
                const deadlineInfo = formatDeadlineBadge(s.deadline);
                return (
                  <Link
                    key={s.id}
                    to={`/scholarship/${s.id}`}
                    className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-border bg-surface-2 hover:border-primary/40 text-xs text-text transition-colors"
                  >
                    <span className="font-medium truncate max-w-[160px] sm:max-w-[200px]">{s.name}</span>
                    <span className="font-mono text-primary font-bold">{s.amountFormatted}</span>
                    <span className="deadline-stamp text-[9px] py-0 px-1.5">
                      {deadlineInfo.text}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* MAIN GAZETTE CONTENT AREA */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text flex items-center gap-2">
              <span>All Gazette Opportunities</span>
              <span
                className="font-mono text-xs font-bold px-2 py-0.5 rounded-[2px] bg-surface-2 text-text border border-border"
                aria-live="polite"
              >
                {filteredScholarships.length} Available
              </span>
            </h2>
            <p className="font-sans text-xs text-muted mt-0.5">
              Ranked according to eligibility match for your academic profile.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-[2px] border border-border bg-surface text-text text-xs font-semibold min-h-[44px]"
            >
              <Faders size={15} />
              <span>Filters</span>
              {(filters.level !== 'All Levels' ||
                filters.category !== 'All Categories' ||
                filters.minAmount > 0 ||
                filters.state !== 'All India' ||
                onlySaved ||
                onlyHighMatch) && <span className="w-2 h-2 rounded-full bg-accent" />}
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-surface border border-border rounded-[2px] px-3 py-1.5 min-h-[44px]">
              <ArrowsDownUp size={14} className="text-muted shrink-0" />
              <label htmlFor="sort-select" className="font-sans text-xs font-medium text-muted shrink-0">
                Sort:
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="text-xs font-semibold text-text bg-transparent focus:outline-none cursor-pointer font-sans"
              >
                <option value="match-desc" className="bg-surface text-text">Highest Match (%)</option>
                <option value="deadline-asc" className="bg-surface text-text">Deadline (Soonest)</option>
                <option value="amount-desc" className="bg-surface text-text">Award Amount (High to Low)</option>
                <option value="amount-asc" className="bg-surface text-text">Award Amount (Low to High)</option>
                <option value="name-asc" className="bg-surface text-text">Alphabetical (A-Z)</option>
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
          <div className="flex flex-wrap items-center gap-1.5 pt-3 pb-1" aria-label="Active filters">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Applied Filters:</span>

            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs bg-surface border border-border text-text">
                "{filters.search}"
                <button type="button" onClick={() => handleFilterChange({ search: '' })} aria-label="Clear search">
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.level !== 'All Levels' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs bg-surface border border-border text-text">
                {filters.level}
                <button type="button" onClick={() => handleFilterChange({ level: 'All Levels' })} aria-label="Remove level">
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.category !== 'All Categories' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs bg-surface border border-border text-text">
                {filters.category}
                <button type="button" onClick={() => handleFilterChange({ category: 'All Categories' })} aria-label="Remove category">
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.state !== 'All India' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs bg-surface border border-border text-text">
                {filters.state}
                <button type="button" onClick={() => handleFilterChange({ state: 'All India' })} aria-label="Remove state">
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.minAmount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs bg-surface border border-border text-text font-mono">
                Min: ₹{(filters.minAmount / 1000).toLocaleString('en-IN')}k
                <button type="button" onClick={() => handleFilterChange({ minAmount: 0 })} aria-label="Remove min amount">
                  <X size={12} />
                </button>
              </span>
            )}

            {onlyHighMatch && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs bg-primary text-primary-contrast font-bold font-mono">
                Match &gt; 75%
                <button type="button" onClick={() => setOnlyHighMatch(false)} aria-label="Remove high match filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {onlySaved && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs bg-accent/20 text-accent font-semibold">
                Saved Only
                <button type="button" onClick={() => setOnlySaved(false)} aria-label="Remove saved filter">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-accent hover:underline ml-2 min-h-[36px]"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Content Layout: Filter Sidebar + Ruled List (Desktop) / Cards (Mobile) */}
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

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end" role="dialog" aria-modal="true">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative w-full max-w-xs h-full bg-surface text-text overflow-y-auto p-5 shadow-2xl z-10 border-l border-border">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                  <h3 className="font-serif font-bold text-base text-text">Dossier Filters</h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-[2px] text-muted hover:bg-surface-2"
                  >
                    <X size={18} />
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
                  className="w-full mt-4 py-2.5 rounded-[2px] bg-primary text-primary-contrast font-semibold text-xs uppercase tracking-wider min-h-[44px]"
                >
                  Apply & Close ({filteredScholarships.length} found)
                </button>
              </div>
            </div>
          )}

          {/* Main Opportunities Area */}
          <div className="flex-1 w-full space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            ) : filteredScholarships.length > 0 ? (
              <>
                {/* ONE LARGE FEATURED SCHOLARSHIP (Broadsheet Lead Story) */}
                {featuredScholarship && (
                  <section aria-label="Featured scheme notice" className="bg-surface rounded-[4px] border-2 border-primary/40 p-6 sm:p-8 space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-primary text-primary-contrast rounded-[2px]">
                          Lead Gazette Notice
                        </span>
                        <span className="font-mono text-xs font-bold text-primary">
                          {profile.isOnboarded ? `${calculateMatch(featuredScholarship).score}% ELIGIBILITY MATCH` : 'CREATE PROFILE TO SEE MATCH'}
                        </span>
                      </div>
                      <div className="deadline-stamp">
                        <Clock size={12} weight="bold" />
                        <span>{formatDeadlineBadge(featuredScholarship.deadline).text}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted">
                        {featuredScholarship.provider}
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl font-black text-text leading-tight hover:text-primary transition-colors">
                        <Link to={`/scholarship/${featuredScholarship.id}`}>
                          {featuredScholarship.name}
                        </Link>
                      </h3>
                      <p className="font-sans text-sm text-muted leading-relaxed line-clamp-3">
                        {featuredScholarship.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border">
                      <div>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-muted block">
                          Total Grant Amount
                        </span>
                        <span className="font-mono text-2xl font-bold text-primary">
                          {featuredScholarship.amountFormatted}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Link
                          to={`/scholarship/${featuredScholarship.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
                        >
                          <span>Examine Full Dossier</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </section>
                )}

                {/* DESKTOP: RULED LIST ROWS (Signature Newspaper Broadsheet Grid) */}
                <div className="hidden lg:block bg-surface rounded-[4px] border border-border divide-y divide-border overflow-hidden">
                  <div className="bg-surface-2/60 px-5 py-2.5 text-[11px] font-mono uppercase tracking-wider text-muted flex items-center justify-between">
                    <span>Scheme & Institutional Ledger</span>
                    <span>Grant Value & Deadline</span>
                  </div>
                  {remainingScholarships.map((scholarship) => (
                    <ScholarshipRow key={scholarship.id} scholarship={scholarship} />
                  ))}
                </div>

                {/* MOBILE / TABLET: RESPONSIVE CARDS */}
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                  {remainingScholarships.map((scholarship) => (
                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                  ))}
                </div>
              </>
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
