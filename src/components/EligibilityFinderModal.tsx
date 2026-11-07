import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS, ALL_LEVELS, SOCIAL_CATEGORIES, INDIAN_STATES } from '../data/scholarships';
import type { AcademicLevel, SocialCategory, IncomeBracket } from '../types';
import { formatINR } from '../utils/dateUtils';

interface EligibilityFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResults?: () => void;
}

export const EligibilityFinderModal: React.FC<EligibilityFinderModalProps> = ({
  isOpen,
  onClose,
  onApplyResults
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

  const matchedScholarships = SCHOLARSHIPS.map(sch => ({
    scholarship: sch,
    match: calculateMatch(sch, tempProfile)
  }))
  .filter(item => item.match.score >= 65)
  .sort((a, b) => b.match.score - a.match.score);

  const totalCalculatedFunding = matchedScholarships.reduce(
    (acc, curr) => acc + curr.scholarship.amount, 
    0
  );

  const handleFinish = () => {
    updateProfile({
      level,
      category,
      incomeBracket,
      state,
      isOnboarded: true
    });
    onClose();
    if (onApplyResults) onApplyResults();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eligibility-finder-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-text"
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="eligibility-finder-title" className="text-base sm:text-lg font-extrabold text-text">
                60-Second Eligibility Finder
              </h2>
              <p className="text-[11px] text-muted">
                {step <= 4 ? `Question ${step} of 4` : 'Your Ranked Opportunities'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-text hover:bg-surface-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close eligibility finder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Academic Level */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                Step 1
              </span>
              <h3 className="text-lg font-bold text-text">
                What is your current education level?
              </h3>
              <p className="text-xs text-muted">
                Select your upcoming or active enrollment status.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {ALL_LEVELS.filter(l => l !== 'All Levels').map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setLevel(lvl);
                    setStep(2);
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all min-h-[44px] ${
                    level === lvl
                      ? 'border-primary bg-surface-2 text-text font-bold ring-2 ring-primary/40'
                      : 'border-border bg-surface-2 text-text hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold">{lvl}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Social Category */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                Step 2
              </span>
              <h3 className="text-lg font-bold text-text">
                Which social category do you belong to?
              </h3>
              <p className="text-xs text-muted">
                Used to evaluate Central & State affirmative reservation schemes.
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
                  className={`p-4 rounded-2xl border text-center transition-all min-h-[44px] ${
                    category === cat
                      ? 'border-primary bg-primary text-primary-contrast font-bold shadow-xs'
                      : 'border-border bg-surface-2 text-text hover:border-primary/50 font-semibold'
                  }`}
                >
                  <span className="text-sm">{cat}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-muted hover:text-text font-semibold pt-2 min-h-[44px] flex items-center"
            >
              &larr; Back to Level
            </button>
          </div>
        )}

        {/* STEP 3: Income Bracket */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                Step 3
              </span>
              <h3 className="text-lg font-bold text-text">
                What is your annual family income?
              </h3>
              <p className="text-xs text-muted">
                Helps determine need-based scholarships, full fee waivers, and maintenance stipends.
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
                  className={`p-3.5 rounded-2xl border text-left transition-all min-h-[44px] ${
                    incomeBracket === inc.id
                      ? 'border-primary bg-surface-2 text-text font-bold ring-2 ring-primary/40'
                      : 'border-border bg-surface-2 text-text hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{inc.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </div>
                  <p className="text-[10px] text-muted mt-0.5">{inc.desc}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-muted hover:text-text font-semibold pt-2 min-h-[44px] flex items-center"
            >
              &larr; Back to Category
            </button>
          </div>
        )}

        {/* STEP 4: State of Domicile */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                Step 4
              </span>
              <h3 className="text-lg font-bold text-text">
                What is your permanent State of Domicile?
              </h3>
              <p className="text-xs text-muted">
                To check eligibility for state DBT portals (MahaDBT, UP Scholarship, Karnataka ePASS, WB SVMCM).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
              {INDIAN_STATES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setState(st);
                    setStep(5);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all min-h-[44px] ${
                    state === st
                      ? 'border-primary bg-primary text-primary-contrast font-bold'
                      : 'border-border bg-surface-2 text-text hover:border-primary/50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs text-muted hover:text-text font-semibold pt-2 min-h-[44px] flex items-center"
            >
              &larr; Back to Income
            </button>
          </div>
        )}

        {/* STEP 5: Celebratory Ranked Results Screen */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs border border-primary/20">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-text">
                Congratulations! We Found Your Match
              </h3>
              <p className="text-xs text-muted">
                Based on your {category} category, {level} level in {state}:
              </p>
            </div>

            {/* Celebratory Total Funding Counter */}
            <div className="bg-primary text-primary-contrast p-5 rounded-2xl text-center shadow-md space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                Total Potential Aid Available
              </span>
              <p className="text-3xl font-extrabold tracking-tight">
                {formatINR(totalCalculatedFunding)}
              </p>
              <p className="text-xs opacity-90">
                Across {matchedScholarships.length} qualifying government and corporate schemes
              </p>
            </div>

            {/* Top 3 Previews */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                Top Matches For You:
              </span>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {matchedScholarships.slice(0, 3).map(({ scholarship, match }) => (
                  <div 
                    key={scholarship.id}
                    className="p-3 rounded-xl border border-border bg-surface-2 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-text line-clamp-1">{scholarship.name}</p>
                      <p className="text-[11px] text-primary font-extrabold">{scholarship.amountFormatted}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/20 text-[10px] shrink-0">
                      {match.score}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-text hover:bg-surface-2 flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full sm:flex-1 px-6 py-3 rounded-xl bg-primary text-primary-contrast text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all min-h-[44px]"
              >
                <span>Save to Profile & View All ({matchedScholarships.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </motion.div>
    </div>
  );
};
