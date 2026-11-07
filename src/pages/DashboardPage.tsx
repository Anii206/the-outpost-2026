import React from 'react';
import { DollarSign, Clock, CheckCircle2, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS } from '../data/scholarships';
import { formatCurrency, formatReadableDate, getDaysRemaining } from '../utils/dateUtils';

export const DashboardPage: React.FC = () => {
  const { trackerItems, savedIds, profile } = useApp();

  // Metrics
  const trackedScholarships = Object.values(trackerItems)
    .map(item => ({
      item,
      scholarship: SCHOLARSHIPS.find(s => s.id === item.scholarshipId)
    }))
    .filter(pair => pair.scholarship !== undefined);

  const totalPotentialFunding = trackedScholarships.reduce(
    (acc, pair) => acc + (pair.scholarship?.amount || 0), 
    0
  );

  const awardedTotal = trackedScholarships
    .filter(pair => pair.item.status === 'awarded')
    .reduce((acc, pair) => acc + (pair.scholarship?.amount || 0), 0);

  // Upcoming deadlines from tracked or saved
  const upcomingDeadlines = SCHOLARSHIPS
    .filter(s => {
      const days = getDaysRemaining(s.deadline);
      return days >= 0 && (trackerItems[s.id] || savedIds.includes(s.id));
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">Scholarship Dashboard</h1>
        <p className="text-xs sm:text-sm text-stone-600">Track deadlines, target funding metrics, and milestones for {profile.name}.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Potential Funding</span>
            <DollarSign className="w-4 h-4 text-emerald-800" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">{formatCurrency(totalPotentialFunding)}</p>
          <p className="text-[11px] text-stone-500 mt-1">Across all tracked applications</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Awarded Funds</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{formatCurrency(awardedTotal)}</p>
          <p className="text-[11px] text-stone-500 mt-1">Secured funding</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active In Tracker</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900">{trackedScholarships.length}</p>
          <p className="text-[11px] text-stone-500 mt-1">{savedIds.length} bookmarked items</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Profile Match</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">{profile.level}</p>
          <p className="text-[11px] text-stone-500 mt-1">GPA {profile.gpa} • {profile.state}</p>
        </div>
      </div>

      {/* Upcoming Deadlines Widget */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Upcoming Target Deadlines</span>
          </h2>
          <Link to="/" className="text-xs font-bold text-[#133E2B] hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center">No active tracked deadlines yet. Start saving scholarships on Discover page!</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {upcomingDeadlines.map(sch => {
              const days = getDaysRemaining(sch.deadline);
              return (
                <div key={sch.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <Link to={`/scholarship/${sch.id}`} className="text-sm font-bold text-stone-900 hover:text-[#133E2B]">
                      {sch.name}
                    </Link>
                    <p className="text-xs text-stone-500">{sch.provider} • {sch.amountFormatted}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {days === 0 ? 'Today' : `${days} days left`}
                    </span>
                    <p className="text-[10px] text-stone-400 mt-0.5">{formatReadableDate(sch.deadline)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
