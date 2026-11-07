import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from '@phosphor-icons/react/dist/csr/Compass';
import { ArrowLeft } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { WarningCircle } from '@phosphor-icons/react/dist/csr/WarningCircle';
import { usePageTitle } from '../hooks/usePageTitle';

export const NotFoundPage: React.FC = () => {
  usePageTitle('Page Not Found — Grantly Gazette');

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-text bg-bg transition-colors">
      <div className="max-w-md w-full bg-surface rounded-[4px] border border-border p-8 text-center shadow-xs space-y-5">
        <div className="w-12 h-12 rounded-[2px] bg-accent/15 text-accent flex items-center justify-center mx-auto border border-accent/25">
          <WarningCircle size={24} />
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary block">
            Dispatched Notice 404
          </span>
          <h1 className="font-serif text-2xl font-bold text-text">
            Gazette Entry Not Found
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
            The scholarship dossier or page you requested does not exist or has concluded its public notice window.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <Compass size={14} />
            <span>Discover Schemes</span>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[2px] border border-border text-text text-xs font-semibold hover:bg-surface-2 transition-colors min-h-[44px]"
          >
            <ArrowLeft size={14} />
            <span>Return Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
