import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { Trophy } from '@phosphor-icons/react/dist/csr/Trophy';
import { CaretRight } from '@phosphor-icons/react/dist/csr/CaretRight';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS, ALL_LEVELS, SOCIAL_CATEGORIES, INDIAN_STATES } from '../data/scholarships';
import type { AcademicLevel, SocialCategory, IncomeBracket } from '../types';
import { formatINR } from '../utils/dateUtils';
import { fireAwardedConfetti } from '../utils/confetti';

interface EligibilityFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResults?: () => void;
}

export const EligibilityFinderModal: React.FC<EligibilityFinderModalProps> = ({
  isOpen,
  onClose,
  onApplyResults,
}) => {
  const { updateProfile, calculateMatch } = useApp();

  const [step, setStep] = useState<number>(1);
  const [level, setLevel] = useState<AcademicLevel>('Undergraduate');
  const [category, setCategory] = useState<SocialCategory>('OBC');
  const [incomeBracket, setIncomeBracket] = useState<IncomeBracket>('₹2,50,000 - ₹6,00,000');
  const [state, setState] = useState<string>('Maharashtra');

  // Compute matched scholarships and total potential funding based on quiz inputs
  const tempProfile = {
    name: 'Student',
    email: '',
    course: 'General / Engineering',
    level,
    percentage: 80,
    incomeBracket,
    category,
    state,
    gender: 'Female' as const,
    isFirstGraduate: true,
    hasDisability: false,
    isOnboarded: true,
  };

  const matchedScholarships = SCHOLARSHIPS.map((sch) => ({
    scholarship: sch,
    match: calculateMatch(sch, tempProfile),
  }))
    .filter((item) => item.match.score >= 65)
    .sort((a, b) => b.match.score - a.match.score);

  const totalCalculatedFunding = matchedScholarships.reduce(
    (acc, curr) => acc + curr.scholarship.amount,
    0
  );

  const goToStep5 = (chosenState: string) => {
    setState(chosenState);
    setStep(5);
    fireAwardedConfetti();
  };

  const handleFinish = () => {
    updateProfile({
      level,
      category,
      incomeBracket,
      state,
      isOnboarded: true,
    });
    onClose();
    if (onApplyResults) onApplyResults();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eligibility-finder-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl bg-surface rounded-[4px] border border-border shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-text"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[2px] bg-primary text-primary-contrast flex items-center justify-center">
              <Sparkle size={15} />
            </div>
            <div>
              <h2 id="eligibility-finder-title" className="font-serif text-lg font-bold text-text">
                60-Second Eligibility Gazette Finder
              </h2>
              <p className="font-sans text-[11px] uppercase tracking-wider text-muted font-semibold">
                {step <= 4 ? `Question ${step} of 4` : 'Ranked Eligibility Ledger'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[2px] text-muted hover:text-text hover:bg-surface-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close eligibility finder"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Academic Level */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="font-sans text-[11px] font-bold text-primary uppercase tracking-widest block mb-1">
                Step 1 of 4
              </span>
              <h3 className="font-serif text-xl font-bold text-text">
                What is your active or upcoming education level?
              </h3>
              <p className="font-sans text-xs text-muted mt-1">
                Select your academic degree tier to inspect relevant central and state schemes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {ALL_LEVELS.filter((l) => l !== 'All Levels').map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setLevel(lvl);
                    setStep(2);
                  }}
                  className={`p-3 rounded-[2px] border text-left flex items-center justify-between transition-colors min-h-[44px] ${
                    level === lvl
                      ? 'border-primary bg-primary text-primary-contrast font-bold'
                      : 'border-border bg-surface hover:bg-surface-2 text-text'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} />
                    <span className="text-xs font-semibold">{lvl}</span>
                  </div>
                  <CaretRight size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Social Category */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="font-sans text-[11px] font-bold text-primary uppercase tracking-widest block mb-1">
                Step 2 of 4
              </span>
              <h3 className="font-serif text-xl font-bold text-text">
                Which reservation or social category applies?
              </h3>
              <p className="font-sans text-xs text-muted mt-1">
                Used to evaluate Central Ministry, State DBT, and affirmative schemes.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {SOCIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setStep(3);
                  }}
                  className={`p-3.5 rounded-[2px] border text-center transition-colors min-h-[44px] ${
                    category === cat
                      ? 'border-primary bg-primary text-primary-contrast font-bold'
                      : 'border-border bg-surface hover:bg-surface-2 text-text font-semibold'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">{cat}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-muted hover:text-text font-sans font-semibold pt-2 min-h-[44px] flex items-center gap-1"
            >
              &larr; Back to Level
            </button>
          </div>
        )}

        {/* STEP 3: Income Bracket */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="font-sans text-[11px] font-bold text-primary uppercase tracking-widest block mb-1">
                Step 3 of 4
              </span>
              <h3 className="font-serif text-xl font-bold text-text">
                What is your total annual family income?
              </h3>
              <p className="font-sans text-xs text-muted mt-1">
                Calculates eligibility for full fee waivers, EWS ceilings, and maintenance allowances.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { id: '< ₹2,50,000', label: 'Under ₹2.5 Lakhs', desc: 'Full fee waiver eligible' },
                { id: '₹2,50,000 - ₹6,00,000', label: '₹2.5L to ₹6.0 Lakhs', desc: 'CSSS, Tata, Reliance' },
                { id: '₹6,00,000 - ₹8,00,000', label: '₹6.0L to ₹8.0 Lakhs', desc: 'AICTE Pragati, EWS' },
                { id: '> ₹8,00,000', label: 'Above ₹8.0 Lakhs', desc: 'Merit & Global fellowships' },
              ].map((inc) => (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => {
                    setIncomeBracket(inc.id as IncomeBracket);
                    setStep(4);
                  }}
                  className={`p-3 rounded-[2px] border text-left transition-colors min-h-[44px] ${
                    incomeBracket === inc.id
                      ? 'border-primary bg-surface-2 text-text ring-1 ring-primary'
                      : 'border-border bg-surface hover:bg-surface-2 text-text'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono">{inc.label}</span>
                    <CaretRight size={14} className="text-muted" />
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">{inc.desc}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-muted hover:text-text font-sans font-semibold pt-2 min-h-[44px] flex items-center gap-1"
            >
              &larr; Back to Category
            </button>
          </div>
        )}

        {/* STEP 4: State of Domicile */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="font-sans text-[11px] font-bold text-primary uppercase tracking-widest block mb-1">
                Step 4 of 4
              </span>
              <h3 className="font-serif text-xl font-bold text-text">
                What is your permanent State of Domicile?
              </h3>
              <p className="font-sans text-xs text-muted mt-1">
                To check eligibility for state DBT portals (MahaDBT, UP Scholarship, Karnataka ePASS).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
              {INDIAN_STATES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => goToStep5(st)}
                  className={`p-2.5 rounded-[2px] border text-xs font-medium text-center transition-colors min-h-[44px] ${
                    state === st
                      ? 'border-primary bg-primary text-primary-contrast font-bold'
                      : 'border-border bg-surface hover:bg-surface-2 text-text'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs text-muted hover:text-text font-sans font-semibold pt-2 min-h-[44px] flex items-center gap-1"
            >
              &larr; Back to Income
            </button>
          </div>
        )}

        {/* STEP 5: Celebratory Ranked Results */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-[2px] bg-primary text-primary-contrast flex items-center justify-center mx-auto mb-2">
                <Trophy size={24} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-text">
                Dossier Matched & Verified
              </h3>
              <p className="font-sans text-xs text-muted">
                Showing schemes matching {category} category • {level} in {state}
              </p>
            </div>

            {/* Celebratory Total Funding Counter */}
            <div className="bg-primary text-primary-contrast p-5 rounded-[4px] text-center space-y-1">
              <span className="font-sans text-[11px] font-bold uppercase tracking-widest opacity-90 block">
                Total Potential Funding Eligible
              </span>
              <p className="font-mono text-3xl font-bold tracking-tight">
                {formatINR(totalCalculatedFunding)}
              </p>
              <p className="text-xs opacity-90 font-sans">
                Across {matchedScholarships.length} qualifying government and corporate schemes
              </p>
            </div>

            {/* Top 3 Previews */}
            <div className="space-y-2">
              <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-muted block">
                Top Matched Gazette Notices:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {matchedScholarships.slice(0, 3).map(({ scholarship, match }) => (
                  <div
                    key={scholarship.id}
                    className="p-2.5 rounded-[2px] border border-border bg-surface flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-serif font-bold text-text truncate">{scholarship.name}</p>
                      <p className="font-mono text-[11px] text-primary font-bold">{scholarship.amountFormatted}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-[2px] font-mono font-bold bg-surface-2 text-primary border border-border text-[11px] shrink-0">
                      {match.score}% MATCH
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-[2px] border border-border text-xs font-semibold text-text hover:bg-surface-2 flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <ArrowCounterClockwise size={14} />
                <span>Retake Quiz</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full sm:flex-1 px-5 py-2.5 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity min-h-[44px]"
              >
                <span>Save to Dossier & View {matchedScholarships.length} Schemes</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
