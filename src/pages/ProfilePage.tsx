import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { ArrowLeft } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { Certificate } from '@phosphor-icons/react/dist/csr/Certificate';
import { useApp, DEMO_PROFILE } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import type { AcademicLevel, SocialCategory, IncomeBracket, UserProfile } from '../types';
import { ALL_LEVELS, INDIAN_STATES, SOCIAL_CATEGORIES } from '../data/scholarships';
import { fireAwardedConfetti } from '../utils/confetti';

const GENDER_OPTIONS: UserProfile['gender'][] = ['Female', 'Male', 'Non-Binary', 'Prefer not to say'];

export const ProfilePage: React.FC = () => {
  usePageTitle('Student Dossier & Eligibility Profile — Grantly Gazette');
  const navigate = useNavigate();
  const { profile, updateProfile, resetProfile } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    course: string;
    level: AcademicLevel;
    percentage: string;
    incomeBracket: IncomeBracket;
    category: SocialCategory;
    state: string;
    gender: UserProfile['gender'];
    isFirstGraduate: boolean;
    hasDisability: boolean;
  }>({
    name: profile.name || '',
    email: profile.email || '',
    course: profile.course || '',
    level: profile.level || 'Undergraduate',
    percentage: profile.percentage ? profile.percentage.toString() : '80',
    incomeBracket: profile.incomeBracket || '₹2,50,000 - ₹6,00,000',
    category: profile.category || 'General',
    state: profile.state || 'Maharashtra',
    gender: profile.gender || 'Female',
    isFirstGraduate: profile.isFirstGraduate || false,
    hasDisability: profile.hasDisability || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  // Validation per step
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) errs.name = 'Please enter your full legal name';
      if (!formData.course.trim()) errs.course = 'Please enter your enrolled degree or diploma course';
      const pct = parseFloat(formData.percentage);
      if (isNaN(pct) || pct < 35 || pct > 100) {
        errs.percentage = 'Enter a valid aggregate percentage between 35% and 100%';
      }
    }

    if (currentStep === 2) {
      if (!formData.category) errs.category = 'Please specify your reservation category';
      if (!formData.incomeBracket) errs.incomeBracket = 'Please select your annual household income ceiling';
    }

    if (currentStep === 3) {
      if (!formData.state) errs.state = 'Please choose your state of domicile';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(3, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    updateProfile({
      name: formData.name,
      email: formData.email,
      course: formData.course,
      level: formData.level,
      percentage: parseFloat(formData.percentage) || 75,
      incomeBracket: formData.incomeBracket,
      category: formData.category,
      state: formData.state,
      gender: formData.gender,
      isFirstGraduate: formData.isFirstGraduate,
      hasDisability: formData.hasDisability,
      isOnboarded: true,
    });

    setIsSaved(true);
    fireAwardedConfetti();
  };

  const handleClearProfile = () => {
    if (window.confirm('Reset all student dossier records? This will clear saved match criteria.')) {
      resetProfile();
      setFormData({
        name: '',
        email: '',
        course: '',
        level: 'Undergraduate',
        percentage: '75',
        incomeBracket: '₹2,50,000 - ₹6,00,000',
        category: 'General',
        state: 'All India',
        gender: 'Female',
        isFirstGraduate: false,
        hasDisability: false,
      });
      setStep(1);
      setIsSaved(false);
    }
  };

  const handleLoadDemoProfile = () => {
    setFormData({
      name: DEMO_PROFILE.name,
      email: DEMO_PROFILE.email,
      course: DEMO_PROFILE.course,
      level: DEMO_PROFILE.level,
      percentage: DEMO_PROFILE.percentage.toString(),
      incomeBracket: DEMO_PROFILE.incomeBracket,
      category: DEMO_PROFILE.category,
      state: DEMO_PROFILE.state,
      gender: DEMO_PROFILE.gender,
      isFirstGraduate: DEMO_PROFILE.isFirstGraduate,
      hasDisability: DEMO_PROFILE.hasDisability,
    });
    updateProfile(DEMO_PROFILE);
    setErrors({});
    setIsSaved(false);
  };

  const progressPercentage = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 min-h-[80vh] bg-bg text-text transition-colors">
      
      {/* Onboarding Container Card */}
      <div className="bg-surface rounded-[4px] border border-border p-6 sm:p-10 shadow-xs">
        
        {/* Header with Title and Reset */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-[2px] bg-primary text-primary-contrast flex items-center justify-center font-mono font-bold text-xs">
                {step}/3
              </span>
              <h1 className="font-serif text-2xl font-bold text-text">
                {profile.isOnboarded ? 'Student Eligibility Dossier' : 'Candidate Onboarding Ledger'}
              </h1>
            </div>
            <p className="font-sans text-xs text-muted mt-1">
              Data is retained strictly in your browser. Used to recalculate all central and state scheme match percentages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadDemoProfile}
              className="flex items-center gap-1.5 text-xs font-semibold text-text hover:text-primary transition-colors px-2.5 py-1.5 rounded-[2px] bg-surface-2 border border-border min-h-[36px]"
              title="Load demo candidate dossier (Ananya Sharma) for testing"
            >
              <Sparkle size={13} className="text-accent" />
              <span>Load demo profile</span>
            </button>

            <button
              type="button"
              onClick={handleClearProfile}
              className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-accent transition-colors p-1.5 rounded-[2px] hover:bg-surface-2 min-h-[36px]"
              title="Reset profile data"
            >
              <ArrowCounterClockwise size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Multi-step Visual Progress Bar */}
        <div className="py-5">
          <div className="flex items-center justify-between font-sans text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className={step >= 1 ? 'text-primary' : 'text-muted'}>1. Academic Record</span>
            <span className={step >= 2 ? 'text-primary' : 'text-muted'}>2. Reservation & Income</span>
            <span className={step >= 3 ? 'text-primary' : 'text-muted'}>3. Domicile & Demographics</span>
          </div>
          <div className="w-full bg-surface-2 border border-border h-1.5 rounded-[2px] overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Success Banner when saved */}
        {isSaved ? (
          <div className="py-8 text-center space-y-5 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-[2px] bg-primary text-primary-contrast flex items-center justify-center mx-auto shadow-xs">
              <Certificate size={24} />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-serif text-2xl font-bold text-text">
                Dossier Successfully Recorded
              </h2>
              <p className="font-sans text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                Eligibility algorithms and reservation scores have been synchronized across all indexed scholarship entries.
              </p>
            </div>

            <div className="p-4 rounded-[2px] bg-surface-2 border border-border text-left font-sans text-xs space-y-1.5 max-w-md mx-auto">
              <p><span className="font-bold text-text">Scholar Name:</span> <span className="text-muted">{formData.name}</span></p>
              <p><span className="font-bold text-text">Level & Course:</span> <span className="text-muted">{formData.level} • {formData.course}</span></p>
              <p><span className="font-bold text-text">Academic Aggregate:</span> <span className="font-mono text-primary font-bold">{formData.percentage}%</span></p>
              <p><span className="font-bold text-text">Category & Ceiling:</span> <span className="text-muted">{formData.category} • {formData.incomeBracket}</span></p>
              <p><span className="font-bold text-text">Permanent State:</span> <span className="text-muted">{formData.state}</span></p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsSaved(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-[2px] border border-border text-text font-semibold text-xs hover:bg-surface-2 transition-colors min-h-[44px]"
              >
                Amend Information
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-5 py-2 rounded-[2px] bg-primary text-primary-contrast font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 transition-opacity min-h-[44px]"
              >
                <span>Examine Matching Schemes</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-1">
            {/* STEP 1: Academic Background */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label htmlFor="student-name" className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider mb-1">
                    Candidate Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3 py-2.5 rounded-[2px] border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary text-sm min-h-[44px]"
                    required
                  />
                  {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="student-course" className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider mb-1">
                    Current Degree / Program Course <span className="text-danger">*</span>
                  </label>
                  <input
                    id="student-course"
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science, MBBS, B.Com Honors"
                    className="w-full px-3 py-2.5 rounded-[2px] border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary text-sm min-h-[44px]"
                    required
                  />
                  {errors.course && <p className="text-xs text-danger mt-1">{errors.course}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="education-level" className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider mb-1">
                      Academic Degree Level <span className="text-danger">*</span>
                    </label>
                    <select
                      id="education-level"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as AcademicLevel })}
                      className="w-full px-3 py-2.5 rounded-[2px] border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm min-h-[44px]"
                    >
                      {ALL_LEVELS.filter((l) => l !== 'All Levels').map((l) => (
                        <option key={l} value={l} className="bg-surface text-text">{l}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="student-percentage" className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider mb-1">
                      Previous Exam Aggregate (%) <span className="text-danger">*</span>
                    </label>
                    <input
                      id="student-percentage"
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      value={formData.percentage}
                      onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                      placeholder="e.g. 84.5"
                      className="w-full px-3 py-2.5 rounded-[2px] border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary text-sm min-h-[44px]"
                      required
                    />
                    {errors.percentage && <p className="text-xs text-danger mt-1">{errors.percentage}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Reservation & Income */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Social Category */}
                <div>
                  <label className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider mb-2">
                    Social Reservation Category <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {SOCIAL_CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`p-2.5 rounded-[2px] border text-xs font-mono font-bold transition-colors text-center min-h-[44px] ${
                          formData.category === cat
                            ? 'bg-primary text-primary-contrast border-primary'
                            : 'bg-surface border-border text-text hover:bg-surface-2'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <p className="font-sans text-[11px] text-muted mt-1">
                    Matches affirmative Central and State Government schemes.
                  </p>
                </div>

                {/* Annual Household Income */}
                <div>
                  <label className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider mb-2">
                    Annual Gross Family Income (From all sources) <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: '< ₹2,50,000', label: 'Under ₹2.5 Lakhs', desc: 'Post-Matric & full fee waivers' },
                      { id: '₹2,50,000 - ₹6,00,000', label: '₹2.5L to ₹6.0 Lakhs', desc: 'CSSS, Tata Trusts, Reliance' },
                      { id: '₹6,00,000 - ₹8,00,000', label: '₹6.0L to ₹8.0 Lakhs', desc: 'AICTE Pragati, EWS ceiling' },
                      { id: '> ₹8,00,000', label: 'Above ₹8.0 Lakhs', desc: 'Merit and International fellowships' },
                    ].map((inc) => (
                      <button
                        type="button"
                        key={inc.id}
                        onClick={() => setFormData({ ...formData, incomeBracket: inc.id as IncomeBracket })}
                        className={`p-3 rounded-[2px] border text-left transition-colors min-h-[44px] ${
                          formData.incomeBracket === inc.id
                            ? 'bg-surface-2 border-primary ring-1 ring-primary'
                            : 'bg-surface border-border hover:bg-surface-2'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-text">{inc.label}</span>
                          {formData.incomeBracket === inc.id && <Check size={14} className="text-primary shrink-0" />}
                        </div>
                        <p className="font-sans text-[11px] text-muted mt-0.5">{inc.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider mb-2">
                    Gender Identity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GENDER_OPTIONS.map((gen) => (
                      <button
                        type="button"
                        key={gen}
                        onClick={() => setFormData({ ...formData, gender: gen })}
                        className={`p-2 rounded-[2px] border text-xs font-medium text-center transition-colors min-h-[44px] ${
                          formData.gender === gen
                            ? 'bg-primary text-primary-contrast border-primary font-bold'
                            : 'bg-surface border-border text-text hover:bg-surface-2'
                        }`}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                  <p className="font-sans text-[11px] text-muted mt-1">
                    Specialized affirmative grants (e.g. AICTE Pragati, Kotak Kanya) are reserved for female scholars.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Domicile & Special Factors */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <label htmlFor="state-select" className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider mb-1">
                    Permanent State of Domicile <span className="text-danger">*</span>
                  </label>
                  <select
                    id="state-select"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-[2px] border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm min-h-[44px]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-surface text-text">{st}</option>
                    ))}
                  </select>
                  <p className="font-sans text-[11px] text-muted mt-1">
                    Matches state DBT portals including MahaDBT, UP Scholarship, SSP Karnataka, and WB SVMCM.
                  </p>
                </div>

                {/* Additional criteria checkboxes */}
                <div className="pt-2 space-y-2.5">
                  <span className="block font-sans text-[11px] font-bold text-text uppercase tracking-wider">
                    Affirmative Factors
                  </span>

                  <label className="flex items-start gap-3 p-3 rounded-[2px] border border-border bg-surface hover:bg-surface-2 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isFirstGraduate}
                      onChange={(e) => setFormData({ ...formData, isFirstGraduate: e.target.checked })}
                      className="w-4 h-4 rounded-[2px] text-primary focus:ring-primary accent-primary mt-0.5"
                    />
                    <div>
                      <p className="font-sans text-xs font-bold text-text">First-Generation College Scholar</p>
                      <p className="font-sans text-[11px] text-muted">Neither parent holds a four-year higher education degree.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-[2px] border border-border bg-surface hover:bg-surface-2 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.hasDisability}
                      onChange={(e) => setFormData({ ...formData, hasDisability: e.target.checked })}
                      className="w-4 h-4 rounded-[2px] text-primary focus:ring-primary accent-primary mt-0.5"
                    />
                    <div>
                      <p className="font-sans text-xs font-bold text-text">Person with Benchmark Disability (PwD)</p>
                      <p className="font-sans text-[11px] text-muted">Qualifies for statutory Divyangjan education maintenance funds.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-5 border-t border-border flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[2px] border border-border text-text font-semibold text-xs hover:bg-surface-2 transition-colors min-h-[44px]"
                >
                  <ArrowLeft size={13} />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-[2px] bg-primary text-primary-contrast font-semibold text-xs hover:opacity-90 transition-opacity min-h-[44px]"
                >
                  <span>Continue</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-[2px] bg-primary text-primary-contrast font-semibold text-xs hover:opacity-90 transition-opacity min-h-[44px]"
                >
                  <Sparkle size={14} />
                  <span>Save Dossier & Calculate Matches</span>
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
