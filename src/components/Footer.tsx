import React from 'react';
import { GraduationCap, Heart, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-border bg-surface-2 text-text transition-colors" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-contrast">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-primary">
                GRANTLY
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Empowering students across India to discover, track, and win government & corporate scholarships with zero friction.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-muted mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-primary transition-colors">Discover Schemes</Link></li>
              <li><Link to="/tracker" className="hover:text-primary transition-colors">Application Tracker</Link></li>
              <li><Link to="/compare" className="hover:text-primary transition-colors">Scheme Comparison</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Deadline Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Eligibility Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-muted mb-3">Scheme Portals</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>National Scholarship Portal (NSP)</li>
              <li>AICTE Pragati Technical Grants</li>
              <li>Reliance & Tata Trusts Fellowships</li>
              <li>State Portals (MahaDBT, UP, ePASS)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-muted mb-3">Privacy & Trust</h4>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <span>100% Client-side privacy. Stored locally.</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <span>Free and open for students in India.</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© 2026 GRANTLY. Designed for scholars across India.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-danger fill-danger inline" /> for college education financing.
          </p>
        </div>
      </div>
    </footer>
  );
};
