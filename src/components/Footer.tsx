import React from 'react';
import { GraduationCap, Heart, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-stone-200/90 bg-[#F4F0E8] text-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#133E2B] flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#133E2B]">
                GRANTLY
              </span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Empowering students to discover, track, and win higher education scholarships with zero friction.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#133E2B] transition-colors">Discover Scholarships</Link></li>
              <li><Link to="/tracker" className="hover:text-[#133E2B] transition-colors">Application Tracker</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#133E2B] transition-colors">Deadline Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-[#133E2B] transition-colors">Eligibility Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>STEM & Engineering</li>
              <li>Women in Technology</li>
              <li>First-Generation Students</li>
              <li>Need & Merit-Based Grants</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-3">Privacy & Ethics</h4>
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Shield className="w-4 h-4 text-emerald-800" />
              <span>100% Client-side. No data sold.</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Free for all students worldwide.</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-300/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 GRANTLY. Designed for scholars everywhere.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for students navigating college financing.
          </p>
        </div>
      </div>
    </footer>
  );
};
