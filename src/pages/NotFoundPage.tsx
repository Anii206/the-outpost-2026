import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, GraduationCap } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

export const NotFoundPage: React.FC = () => {
  usePageTitle('Page Not Found');

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-text">
      <div className="max-w-md w-full bg-surface rounded-3xl border border-border p-8 text-center shadow-xs space-y-6">
        
        <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto border border-accent/20">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Error 404
          </span>
          <h1 className="text-2xl font-extrabold text-text">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            The scholarship scheme or page you requested does not exist or may have been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs font-bold shadow-xs hover:opacity-95 transition-opacity min-h-[44px]"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Scholarships</span>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text text-xs font-bold hover:bg-surface-2 transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

      </div>
    </div>
  );
};
