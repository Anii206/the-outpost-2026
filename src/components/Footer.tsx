import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from '@phosphor-icons/react/dist/csr/ShieldCheck';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t-2 border-double border-border-strong bg-surface text-text transition-colors" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap size={22} className="text-primary" />
              <span className="font-serif font-black text-xl tracking-tight text-text">
                THE GRANTLY GAZETTE
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed font-sans">
              A public-service scholarship ledger empowering Indian students to discover, track, and win government, trust, and CSR scholarships without intermediaries.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-muted mb-3">Gazette Index</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><Link to="/" className="text-text hover:text-primary transition-colors">Discover Schemes</Link></li>
              <li><Link to="/dashboard" className="text-text hover:text-primary transition-colors">Executive Briefing</Link></li>
              <li><Link to="/tracker" className="text-text hover:text-primary transition-colors">Application Docket</Link></li>
              <li><Link to="/compare" className="text-text hover:text-primary transition-colors">Scheme Comparison</Link></li>
              <li><Link to="/profile" className="text-text hover:text-primary transition-colors">Student Dossier</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-muted mb-3">Verified Portals</h4>
            <ul className="space-y-2 text-xs text-muted font-sans">
              <li>National Scholarship Portal (NSP 2.0)</li>
              <li>AICTE Technical Education Bureau</li>
              <li>Tata Trusts & Reliance Foundation CSR</li>
              <li>State DBT Portals (MahaDBT, SSP, ePASS)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-muted mb-3">Dossier Integrity</h4>
            <div className="flex items-center gap-2 text-xs text-muted font-sans">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span>100% Client-Side Storage. Zero telemetry.</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted font-sans">
              <Sparkle size={16} className="text-accent shrink-0" />
              <span>Updated bi-weekly with official gazette notices.</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted font-mono gap-4">
          <p>© 2026 The Grantly Gazette. Printed digitally for scholars across India.</p>
          <p className="flex items-center gap-1">
            Indian Higher Education Financial Mobility Initiative
          </p>
        </div>
      </div>
    </footer>
  );
};
