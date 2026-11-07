import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  AlertCircle,
  KanbanSquare,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { SCHOLARSHIPS } from '../data/scholarships';
import { formatINR, formatReadableDate, getDaysRemaining } from '../utils/dateUtils';
import { ScholarshipCard } from '../components/ScholarshipCard';

export const DashboardPage: React.FC = () => {
  usePageTitle('Scholarship Dashboard');
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
    SCHOLARSHIPS.forEach(sch => {
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
    Object.values(trackerItems).forEach(item => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });
    const totalTracked = Object.keys(trackerItems).length;
    return { ...counts, totalTracked };
  }, [trackerItems]);

  // 4. Document Readiness Percentage across all tracked scholarships
  const documentReadiness = useMemo(() => {
    const trackedIds = Object.keys(trackerItems);
    if (trackedIds.length === 0) return { totalRequired: 0, totalGathered: 0, percent: 0 };

    let totalRequired = 0;
    let totalGathered = 0;

    trackedIds.forEach(id => {
      const sch = SCHOLARSHIPS.find(s => s.id === id);
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
    return SCHOLARSHIPS
      .filter(s => getDaysRemaining(s.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, []);

  // 7. Grouped by Month Timeline / Calendar data
  const groupedCalendar = useMemo(() => {
    const targetList = calendarFilter === 'tracked'
      ? SCHOLARSHIPS.filter(s => trackerItems[s.id] || savedIds.includes(s.id))
      : SCHOLARSHIPS;

    const groups: Record<string, typeof SCHOLARSHIPS> = {};

    targetList
      .filter(s => getDaysRemaining(s.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .forEach(sch => {
        const parts = sch.deadline.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const monthName = new Date(year, month, 1).toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric'
          });
          if (!groups[monthName]) groups[monthName] = [];
          groups[monthName].push(sch);
        }
      });

    return groups;
  }, [calendarFilter, trackerItems, savedIds]);

  return (
    <div id="main-content" className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Onboarding Prompt Banner if profile is incomplete */}
        {!profile.isOnboarded && (
          <div className="bg-accent/10 border border-accent/25 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-text">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-text">Complete Your Eligibility Profile</h3>
                <p className="text-xs text-muted">
                  Fill in your course, marks %, caste reservation category, and state to unlock verified scheme eligibility.
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-xs shrink-0 transition-opacity hover:opacity-90 shadow-xs min-h-[44px]"
            >
              <span>Setup Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* GREETING & PROFILE COMPLETION BAR */}
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Welcome back, {profile.name?.trim() ? profile.name.split(' ')[0] : 'Student'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Here is your funding pipeline, verified scheme matches, and upcoming application deadlines.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-surface-2 p-3.5 rounded-2xl border border-border w-full sm:w-auto">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm border border-primary/20">
              {profileCompletionPercent}%
            </div>
            <div>
              <p className="text-xs font-bold text-text">Profile Readiness</p>
              <p className="text-[11px] text-muted">
                {profile.isOnboarded ? `${profile.category} • ${profile.state}` : 'Needs onboarding'}
              </p>
            </div>
            <Link
              to="/profile"
              className="ml-auto text-xs font-bold text-primary hover:underline min-h-[36px] flex items-center"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* METRICS ROW (Eligible Total Aid, Documents Readiness, Pipeline, Active Tracker) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Potential Funding Eligible For (Match >= 70%) */}
          <div className="bg-primary text-primary-contrast p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between opacity-90">
              <span className="text-xs font-bold uppercase tracking-wider">Eligible Funding</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {formatINR(eligibleTotalAmount)}
              </p>
              <p className="text-xs opacity-85 mt-1">
                Across {eligibleCount} scholarships with &ge;70% match
              </p>
            </div>
          </div>

          {/* 2. Documents Readiness */}
          <div className="bg-surface p-6 rounded-3xl border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Documents Ready</span>
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl sm:text-3xl font-extrabold text-text">
                  {documentReadiness.percent}%
                </p>
                <span className="text-xs font-bold text-muted">
                  {documentReadiness.totalGathered}/{documentReadiness.totalRequired} Docs
                </span>
              </div>
              <div className="w-full bg-surface-2 border border-border/50 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${documentReadiness.percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3. Total in Tracker Pipeline */}
          <div className="bg-surface p-6 rounded-3xl border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Tracker Pipeline</span>
              <KanbanSquare className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-text">
                {pipelineCounts.totalTracked}
              </p>
              <p className="text-xs text-muted mt-1">
                {pipelineCounts.applying} applying • {pipelineCounts.submitted} submitted
              </p>
            </div>
          </div>

          {/* 4. Total Secured / Awarded */}
          <div className="bg-surface p-6 rounded-3xl border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Awarded Grants</span>
              <Award className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-success">
                {pipelineCounts.awarded}
              </p>
              <p className="text-xs text-muted mt-1">
                Successfully secured schemes
              </p>
            </div>
          </div>

        </div>

        {/* PIPELINE SUMMARY VISUAL BAR */}
        <section className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">Application Pipeline Summary</h2>
              <p className="text-xs text-muted">Active status distribution of your tracked scholarships.</p>
            </div>
            <Link to="/tracker" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 min-h-[36px]">
              <span>Open Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Multi-segment Stacked Progress Bar */}
          <div className="w-full bg-surface-2 border border-border/50 h-3 rounded-full overflow-hidden flex">
            {pipelineCounts.totalTracked > 0 ? (
              <>
                <div style={{ width: `${(pipelineCounts.saved / pipelineCounts.totalTracked) * 100}%` }} className="bg-muted" title={`Saved: ${pipelineCounts.saved}`} />
                <div style={{ width: `${(pipelineCounts.applying / pipelineCounts.totalTracked) * 100}%` }} className="bg-accent" title={`Applying: ${pipelineCounts.applying}`} />
                <div style={{ width: `${(pipelineCounts.submitted / pipelineCounts.totalTracked) * 100}%` }} className="bg-primary" title={`Submitted: ${pipelineCounts.submitted}`} />
                <div style={{ width: `${(pipelineCounts.awarded / pipelineCounts.totalTracked) * 100}%` }} className="bg-success" title={`Awarded: ${pipelineCounts.awarded}`} />
                <div style={{ width: `${(pipelineCounts.rejected / pipelineCounts.totalTracked) * 100}%` }} className="bg-danger" title={`Rejected: ${pipelineCounts.rejected}`} />
              </>
            ) : (
              <div className="w-full bg-surface-2" />
            )}
          </div>

          {/* Status Counts Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {[
              { label: 'Saved', count: pipelineCounts.saved, color: 'bg-muted' },
              { label: 'Applying', count: pipelineCounts.applying, color: 'bg-accent' },
              { label: 'Submitted', count: pipelineCounts.submitted, color: 'bg-primary' },
              { label: 'Awarded', count: pipelineCounts.awarded, color: 'bg-success' },
              { label: 'Rejected', count: pipelineCounts.rejected, color: 'bg-danger' },
            ].map(stage => (
              <div key={stage.label} className="p-3 rounded-xl bg-surface-2 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                  <span className="text-xs font-semibold text-text">{stage.label}</span>
                </div>
                <span className="text-xs font-extrabold text-text">{stage.count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2-COLUMN SECTION: Upcoming Deadlines + Deadline Calendar/Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* UPCOMING DEADLINES (1 Col) */}
          <section className="bg-surface rounded-3xl border border-border p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>Closing Soon (Next 5)</span>
              </h2>
              <Link to="/" className="text-xs font-bold text-primary hover:underline min-h-[36px] flex items-center">
                View All
              </Link>
            </div>

            <div className="divide-y divide-border">
              {upcomingDeadlines.map(sch => {
                const days = getDaysRemaining(sch.deadline);
                const isCritical = days <= 7;
                const isUrgent = days <= 14;

                return (
                  <div key={sch.id} className="py-3.5 space-y-1">
                    <Link 
                      to={`/scholarship/${sch.id}`}
                      className="text-xs sm:text-sm font-bold text-text hover:text-primary transition-colors leading-snug line-clamp-1 block"
                    >
                      {sch.name}
                    </Link>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted font-medium truncate max-w-[150px]">
                        {sch.amountFormatted}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        isCritical 
                          ? 'bg-danger/10 text-danger border border-danger/30' 
                          : isUrgent 
                          ? 'bg-accent/15 text-accent border border-accent/30' 
                          : 'bg-surface-2 text-muted border border-border'
                      }`}>
                        {days === 0 ? 'Today' : `${days} days left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* DEADLINE CALENDAR / MONTHLY TIMELINE WIDGET (2 Cols) */}
          <section className="lg:col-span-2 bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-text flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span>Deadline Calendar & Timeline</span>
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Monthly roadmap of official closing dates across verified Indian schemes.
                </p>
              </div>

              {/* Filter tabs: All vs Tracked Only */}
              <div className="flex items-center gap-1.5 p-1 bg-surface-2 border border-border rounded-xl">
                <button
                  type="button"
                  onClick={() => setCalendarFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    calendarFilter === 'all'
                      ? 'bg-surface text-text shadow-2xs border border-border'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  All (24)
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarFilter('tracked')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    calendarFilter === 'tracked'
                      ? 'bg-surface text-text shadow-2xs border border-border'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  Tracked ({Object.keys(trackerItems).length})
                </button>
              </div>
            </div>

            {/* Monthly grouped timeline */}
            <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1">
              {Object.keys(groupedCalendar).length === 0 ? (
                <div className="text-center py-10 text-xs text-muted">
                  No upcoming deadlines found for this view.
                </div>
              ) : (
                Object.entries(groupedCalendar).map(([monthName, list]) => (
                  <div key={monthName} className="space-y-3">
                    <div className="sticky top-0 bg-surface/95 backdrop-blur-xs py-1 z-10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                        {monthName} ({list.length} deadlines)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-border">
                      {list.map(sch => {
                        const days = getDaysRemaining(sch.deadline);
                        const isCritical = days <= 7;
                        const isUrgent = days <= 14;

                        return (
                          <Link
                            key={sch.id}
                            to={`/scholarship/${sch.id}`}
                            className="p-3.5 rounded-2xl border border-border bg-surface-2 hover:border-primary/50 transition-all group shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-text">
                                {formatReadableDate(sch.deadline)}
                              </span>
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                isCritical ? 'bg-danger/10 text-danger border border-danger/30' : isUrgent ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-surface text-muted border border-border'
                              }`}>
                                {days} days left
                              </span>
                            </div>
                            <p className="text-xs font-bold text-text group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                              {sch.name}
                            </p>
                            <p className="text-[11px] font-semibold text-primary">
                              {sch.amountFormatted}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

          </section>

        </div>

        {/* RECOMMENDED FOR YOU (Top 3 by Match) */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Recommended For You</span>
              </h2>
              <p className="text-xs text-muted">
                Top opportunities based on your education level ({profile.level}), category ({profile.category}), and state ({profile.state}).
              </p>
            </div>
            <Link to="/" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 min-h-[36px]">
              <span>View All 24 Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedScholarships.map(sch => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
