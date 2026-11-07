import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import { CalendarBlank } from '@phosphor-icons/react/dist/csr/CalendarBlank';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';
import { FileText } from '@phosphor-icons/react/dist/csr/FileText';
import { ChartBar } from '@phosphor-icons/react/dist/csr/ChartBar';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { SCHOLARSHIPS } from '../data/scholarships';
import { formatReadableDate, getDaysRemaining, formatDeadlineBadge } from '../utils/dateUtils';
import { CountUpNumber } from '../components/CountUpNumber';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { RupeeCoinStackIllustration } from '../components/illustrations/EditorialIllustrations';

const DashboardPipelineChart = React.lazy(() => import('../components/DashboardPipelineChart'));
const DashboardMonthlyChart = React.lazy(() => import('../components/DashboardMonthlyChart'));

export const DashboardPage: React.FC = () => {
  usePageTitle('Executive Briefing (Dashboard) — Grantly Gazette');
  const { trackerItems, savedIds, profile, calculateMatch, checkedDocs } = useApp();
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'tracked'>('all');

  // 1. Profile Completion Percentage
  const profileCompletionPercent = useMemo(() => {
    let filled = 0;
    const totalFields = 7;
    if (profile.name?.trim()) filled++;
    if (profile.course?.trim()) filled++;
    if (profile.level) filled++;
    if (profile.percentage) filled++;
    if (profile.incomeBracket) filled++;
    if (profile.category) filled++;
    if (profile.state && profile.state !== 'All India') filled++;
    return Math.round((filled / totalFields) * 100);
  }, [profile]);

  // 2. Total Potential Funding Eligible For (where match >= 70%)
  const { eligibleTotalAmount, eligibleCount } = useMemo(() => {
    let total = 0;
    let count = 0;
    SCHOLARSHIPS.forEach((sch) => {
      const match = calculateMatch(sch);
      if (match.score >= 70) {
        total += sch.amount;
        count++;
      }
    });
    return { eligibleTotalAmount: total, eligibleCount: count };
  }, [calculateMatch]);

  // 3. Pipeline counts
  const pipelineCounts = useMemo(() => {
    const counts = { saved: 0, applying: 0, submitted: 0, awarded: 0, rejected: 0 };
    Object.values(trackerItems).forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });
    const totalTracked = Object.keys(trackerItems).length;
    return { ...counts, totalTracked };
  }, [trackerItems]);

  // Pipeline data for Recharts
  const pipelineChartData = useMemo(() => {
    return [
      { name: 'Saved', count: pipelineCounts.saved, fill: '#6B655A' },
      { name: 'Applying', count: pipelineCounts.applying, fill: '#D9401F' },
      { name: 'Submitted', count: pipelineCounts.submitted, fill: '#1F4D3A' },
      { name: 'Awarded', count: pipelineCounts.awarded, fill: '#7FBF9E' },
    ];
  }, [pipelineCounts]);

  // 4. Document Readiness Percentage across all tracked scholarships
  const documentReadiness = useMemo(() => {
    const trackedIds = Object.keys(trackerItems);
    if (trackedIds.length === 0) return { totalRequired: 0, totalGathered: 0, percent: 0 };

    let totalRequired = 0;
    let totalGathered = 0;

    trackedIds.forEach((id) => {
      const sch = SCHOLARSHIPS.find((s) => s.id === id);
      if (sch) {
        totalRequired += sch.documentsRequired.length;
        const gatheredForThis = (checkedDocs[id] || []).length;
        totalGathered += Math.min(gatheredForThis, sch.documentsRequired.length);
      }
    });

    const percent = totalRequired > 0 ? Math.round((totalGathered / totalRequired) * 100) : 0;
    return { totalRequired, totalGathered, percent };
  }, [trackerItems, checkedDocs]);

  // 5. Recommended Top 3 by Match Score
  const recommendedScholarships = useMemo(() => {
    return [...SCHOLARSHIPS]
      .sort((a, b) => calculateMatch(b).score - calculateMatch(a).score)
      .slice(0, 3);
  }, [calculateMatch]);

  // 6. Upcoming Deadlines (Next 5 by date)
  const upcomingDeadlines = useMemo(() => {
    return SCHOLARSHIPS.filter((s) => getDaysRemaining(s.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, []);

  // 7. Monthly Volume Data & Groups
  const { monthlyChartData, groupedCalendar } = useMemo(() => {
    const targetList =
      calendarFilter === 'tracked'
        ? SCHOLARSHIPS.filter((s) => trackerItems[s.id] || savedIds.includes(s.id))
        : SCHOLARSHIPS;

    const groups: Record<string, typeof SCHOLARSHIPS> = {};
    const monthlyStats: Record<string, { month: string; count: number; volume: number }> = {};

    targetList
      .filter((s) => getDaysRemaining(s.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .forEach((sch) => {
        const parts = sch.deadline.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const monthName = new Date(year, month, 1).toLocaleDateString('en-IN', {
            month: 'short',
            year: '2-digit',
          });
          const fullMonthName = new Date(year, month, 1).toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
          });

          if (!groups[fullMonthName]) groups[fullMonthName] = [];
          groups[fullMonthName].push(sch);

          if (!monthlyStats[monthName]) {
            monthlyStats[monthName] = { month: monthName, count: 0, volume: 0 };
          }
          monthlyStats[monthName].count += 1;
          monthlyStats[monthName].volume += sch.amount;
        }
      });

    return {
      monthlyChartData: Object.values(monthlyStats),
      groupedCalendar: groups,
    };
  }, [calendarFilter, trackerItems, savedIds]);

  return (
    <div id="main-content" className="min-h-screen py-8 bg-bg text-text transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Onboarding Prompt Banner if profile is incomplete */}
        {!profile.isOnboarded && (
          <aside
            aria-label="Student profile incomplete notification"
            className="border border-border bg-surface rounded-[4px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-text"
          >
            <div className="flex items-center gap-2.5">
              <Sparkle size={20} className="text-accent shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-sm text-text">Create your profile to see matches</h3>
                <p className="font-sans text-xs text-muted">
                  Specify academic scores, social category, and state of domicile to calibrate matching accuracy.
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[2px] bg-primary text-primary-contrast font-semibold text-xs shrink-0 hover:opacity-90 transition-opacity min-h-[38px]"
            >
              <span>Create profile</span>
              <ArrowRight size={13} />
            </Link>
          </aside>
        )}

        {/* GREETING & LEAD NUMBER HERO BANNER (Deep Green Art-Directed Block) */}
        <div className="bg-[#1F4D3A] text-[#FBF8F1] dark:bg-[#12241C] dark:text-[#F2ECDD] rounded-[4px] border-2 border-[#1F4D3A] dark:border-[#1F4D3A]/70 p-6 sm:p-10 space-y-6 shadow-hard-lg relative crop-mark-container overflow-hidden transition-colors">
          {/* Newspaper printing corner crop marks */}
          <span className="crop-mark-tl text-[#FBF8F1] dark:text-[#7FBF9E]" />
          <span className="crop-mark-tr text-[#FBF8F1] dark:text-[#7FBF9E]" />
          <span className="crop-mark-bl text-[#FBF8F1] dark:text-[#7FBF9E]" />
          <span className="crop-mark-br text-[#FBF8F1] dark:text-[#7FBF9E]" />

          {/* Background engraved coin illustration watermark */}
          <div className="absolute -right-6 -bottom-6 pointer-events-none opacity-20 dark:opacity-10 text-[#FBF8F1]">
            <RupeeCoinStackIllustration size={240} />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#FBF8F1]/20 dark:border-white/10 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-[#FBF8F1]/70 dark:text-[#A39C8C] text-[11px] font-mono uppercase tracking-widest font-semibold mb-1">
                <span className="font-serif font-black text-accent mr-1">01</span>
                <span>•</span>
                <span>Executive Student Briefing</span>
                <span>•</span>
                <span>Candidate Docket <span className="font-instrument italic font-normal text-[#7FBF9E]">Ledger</span></span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-[#FBF8F1] tracking-tight leading-tight">
                {profile.isOnboarded && profile.name?.trim() ? (
                  <>Welcome back, <span className="font-instrument italic font-normal text-[#7FBF9E]">{profile.name.split(' ')[0]}</span></>
                ) : (
                  <>Executive Student <span className="font-instrument italic font-normal text-[#7FBF9E]">Briefing</span></>
                )}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#FBF8F1]/80 dark:text-[#A39C8C] mt-1 max-w-xl">
                Financial dispatch summarizing qualified schemes, upcoming closing notices, and document verification.
              </p>
            </div>

            {/* Profile Readiness Pill */}
            <div className="flex items-center gap-3 bg-[#FBF8F1]/10 dark:bg-black/30 p-3 rounded-[2px] border border-[#FBF8F1]/20 w-full sm:w-auto shrink-0 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-[2px] bg-[#7FBF9E] text-[#14120F] flex items-center justify-center font-mono font-bold text-xs">
                {profileCompletionPercent}%
              </div>
              <div>
                <p className="font-sans text-xs font-bold text-[#FBF8F1]">Dossier Readiness</p>
                <p className="font-sans text-[11px] text-[#FBF8F1]/75 dark:text-[#A39C8C]">
                  {profile.isOnboarded ? `${profile.category} • ${profile.state}` : 'Create your profile to see matches'}
                </p>
              </div>
              <Link
                to="/profile"
                className="ml-auto text-xs font-bold text-[#7FBF9E] hover:underline min-h-[36px] flex items-center px-1"
              >
                {profile.isOnboarded ? 'Edit →' : 'Set up →'}
              </Link>
            </div>
          </div>

          {/* OVERSIZED LEAD NUMBER: Total Potential Eligible Funding */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 pt-2 relative z-10">
            <div className="space-y-1.5">
              <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#FBF8F1]/70 dark:text-[#A39C8C] block">
                Total Potential Funding Eligible For (Match &ge; 70%)
              </span>
              <div className="font-serif lining-nums text-4xl sm:text-6xl md:text-7xl font-black text-[#7FBF9E] tracking-tight leading-none">
                <CountUpNumber end={eligibleTotalAmount} prefix="₹" className="font-serif lining-nums text-[#7FBF9E] font-black" />
              </div>
              <p className="font-sans text-xs text-[#FBF8F1]/75 dark:text-[#A39C8C]">
                Across {eligibleCount} qualifying government, trust, and corporate fellowship schemes
              </p>
            </div>

            <div className="flex items-center gap-8 font-sans text-xs text-[#FBF8F1]/80 border-t sm:border-t-0 sm:border-l border-[#FBF8F1]/20 pt-4 sm:pt-0 sm:pl-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-[#FBF8F1]/70 dark:text-[#A39C8C]">Dockets In Pipeline</span>
                <span className="font-serif lining-nums text-2xl sm:text-3xl font-black text-[#FBF8F1]">{pipelineCounts.totalTracked}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-[#FBF8F1]/70 dark:text-[#A39C8C]">Document Readiness</span>
                <span className="font-serif lining-nums text-2xl sm:text-3xl font-black text-[#7FBF9E]">{documentReadiness.percent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-COLUMN "BRIEFING" GRID SEPARATED BY THIN VERTICAL RULES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border border border-border bg-surface rounded-[4px] overflow-hidden">
          {/* COLUMN 1: Upcoming Critical Deadlines */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-accent" />
                <h2 className="font-serif text-base font-bold text-text">Critical Deadlines</h2>
              </div>
              <span className="font-mono text-[11px] text-muted font-bold">Next 5 Notices</span>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map((sch) => {
                const info = formatDeadlineBadge(sch.deadline);
                return (
                  <Link
                    key={sch.id}
                    to={`/scholarship/${sch.id}`}
                    className="group block p-3 rounded-[2px] bg-surface-2 border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted truncate">
                        {sch.provider}
                      </span>
                      <div className="deadline-stamp text-[9px] py-0 px-1.5 shrink-0">
                        {info.text}
                      </div>
                    </div>
                    <p className="font-serif text-xs font-bold text-text group-hover:text-primary transition-colors line-clamp-1">
                      {sch.name}
                    </p>
                    <div className="flex items-center justify-between pt-1.5 text-[11px] font-mono">
                      <span className="font-bold text-primary">{sch.amountFormatted}</span>
                      <span className="text-muted">{formatReadableDate(sch.deadline)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: Application Pipeline & Documents Readiness */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-1.5">
                <ChartBar size={16} className="text-primary" />
                <h2 className="font-serif text-base font-bold text-text">Pipeline Distribution</h2>
              </div>
              <Link to="/tracker" className="text-xs font-semibold text-primary hover:underline">
                Docket &rarr;
              </Link>
            </div>

            {/* Lazy-Loaded Pipeline Bar Chart */}
            <React.Suspense
              fallback={
                <div className="h-44 w-full bg-surface-2 rounded-[2px] animate-pulse flex items-center justify-center text-xs text-muted">
                  Loading pipeline...
                </div>
              }
            >
              <DashboardPipelineChart data={pipelineChartData} />
            </React.Suspense>

            {/* Documents Readiness Summary */}
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center justify-between font-sans text-xs">
                <span className="text-muted font-medium flex items-center gap-1">
                  <FileText size={14} className="text-primary" /> Required Documents Readiness
                </span>
                <span className="font-mono font-bold text-text">{documentReadiness.percent}%</span>
              </div>
              <div className="w-full bg-surface-2 border border-border h-1.5 rounded-[2px] overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${documentReadiness.percent}%` }}
                />
              </div>
              <p className="font-sans text-[11px] text-muted text-right">
                {documentReadiness.totalGathered} of {documentReadiness.totalRequired} documents verified
              </p>
            </div>
          </div>

          {/* COLUMN 3: Monthly Gazette Deadline Volume & Calendar */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-1.5">
                <CalendarBlank size={16} className="text-primary" />
                <h2 className="font-serif text-base font-bold text-text">Deadline Calendar</h2>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-sans">
                <button
                  type="button"
                  onClick={() => setCalendarFilter('all')}
                  className={`px-2 py-0.5 rounded-[2px] border ${
                    calendarFilter === 'all'
                      ? 'bg-primary text-primary-contrast font-bold border-primary'
                      : 'bg-surface text-muted border-border'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarFilter('tracked')}
                  className={`px-2 py-0.5 rounded-[2px] border ${
                    calendarFilter === 'tracked'
                      ? 'bg-primary text-primary-contrast font-bold border-primary'
                      : 'bg-surface text-muted border-border'
                  }`}
                >
                  Tracked
                </button>
              </div>
            </div>

            {/* Lazy-Loaded Monthly Volume Distribution */}
            {monthlyChartData.length > 0 && (
              <React.Suspense
                fallback={
                  <div className="h-32 w-full bg-surface-2 rounded-[2px] animate-pulse flex items-center justify-center text-xs text-muted">
                    Loading calendar volume...
                  </div>
                }
              >
                <DashboardMonthlyChart data={monthlyChartData} />
              </React.Suspense>
            )}

            {/* Monthly Accordion / Timeline list */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {Object.keys(groupedCalendar).map((monthName) => (
                <div key={monthName} className="space-y-1.5">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-muted block">
                    {monthName} ({groupedCalendar[monthName].length})
                  </span>
                  <div className="space-y-1">
                    {groupedCalendar[monthName].slice(0, 2).map((sch) => (
                      <Link
                        key={sch.id}
                        to={`/scholarship/${sch.id}`}
                        className="flex items-center justify-between p-2 rounded-[2px] bg-surface-2 border border-border text-xs hover:border-primary/40 transition-colors"
                      >
                        <span className="truncate pr-2 font-medium">{sch.name}</span>
                        <span className="font-mono text-[10px] text-muted shrink-0">
                          {sch.deadline.split('-').slice(1).join('/')}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECOMMENDED FOR YOU (Top 3 by Match) */}
        <section className="pt-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h2 className="font-serif text-xl font-bold text-text flex items-center gap-2">
                <Sparkle size={18} className="text-primary" />
                <span>Recommended For Your Dossier</span>
              </h2>
              <p className="font-sans text-xs text-muted">
                Top 3 opportunities ranked by institutional compatibility score.
              </p>
            </div>
            <Link to="/" className="text-xs font-semibold text-primary hover:underline min-h-[36px] flex items-center">
              Explore All Gazette Schemes &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedScholarships.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
