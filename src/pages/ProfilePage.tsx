import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  RotateCcw,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import type { AcademicLevel, SocialCategory, IncomeBracket, UserProfile } from '../types';
import { ALL_LEVELS, INDIAN_STATES, SOCIAL_CATEGORIES } from '../data/scholarships';

const GENDER_OPTIONS: UserProfile['gender'][] = ['Female', 'Male', 'Non-Binary', 'Prefer not to say'];

export const ProfilePage: React.FC = () => {
  usePageTitle('My Student Profile');
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
      if (!formData.name.trim()) errs.name = 'Please enter your full name';
      if (!formData.course.trim()) errs.course = 'Please enter your current degree or course';
      const pct = parseFloat(formData.percentage);
      if (isNaN(pct) || pct < 35 || pct > 100) {
        errs.percentage = 'Enter a valid percentage between 35% and 100%';
      }
    }

    if (currentStep === 2) {
      if (!formData.category) errs.category = 'Please select your category';
      if (!formData.incomeBracket) errs.incomeBracket = 'Please select your family income bracket';
    }

    if (currentStep === 3) {
      if (!formData.state) errs.state = 'Please select your state of domicile';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(3, prev + 1));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
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
  };

  const handleClearProfile = () => {
    if (window.confirm('Are you sure you want to reset your profile?')) {
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

  const progressPercentage = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 min-h-[80vh]">
      
      {/* Onboarding Container Card */}
      <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xs">
        
        {/* Header with Title and Reset */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-primary text-primary-contrast flex items-center justify-center font-extrabold text-xs">
                {step}/3
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text">
                {profile.isOnboarded ? 'Student Eligibility Profile' : 'Scholarship Onboarding'}
              </h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Your details are stored locally and used to compute instant scheme eligibility.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearProfile}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text transition-colors p-2 rounded-xl hover:bg-surface-2"
            title="Reset profile data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Multi-step Visual Progress Bar */}
        <div className="py-6">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={step >= 1 ? 'text-primary' : 'text-muted'}>1. Academics</span>
            <span className={step >= 2 ? 'text-primary' : 'text-muted'}>2. Reservation & Income</span>
            <span className={step >= 3 ? 'text-primary' : 'text-muted'}>3. Domicile & Criteria</span>
          </div>
          <div className="w-full bg-surface-2 border border-border h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Success Modal / Banner when saved */}
        {isSaved ? (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs border border-primary/20">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text">Profile Updated Successfully!</h2>
              <p className="text-sm text-muted max-w-md mx-auto">
                Match percentages, eligibility validations, and state reservation rules have been re-calculated across all scholarships.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-2 border border-border text-left text-xs space-y-1.5 max-w-md mx-auto">
              <p><span className="font-bold text-text">Name:</span> <span className="text-muted">{formData.name}</span></p>
              <p><span className="font-bold text-text">Level & Course:</span> <span className="text-muted">{formData.level} • {formData.course}</span></p>
              <p><span className="font-bold text-text">Percentage:</span> <span className="text-muted">{formData.percentage}%</span></p>
              <p><span className="font-bold text-text">Category & Income:</span> <span className="text-muted">{formData.category} • {formData.incomeBracket}</span></p>
              <p><span className="font-bold text-text">State:</span> <span className="text-muted">{formData.state}</span></p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsSaved(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border text-text font-bold text-xs hover:bg-surface-2 transition-colors min-h-[44px]"
              >
                Edit Information
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-contrast font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-opacity min-h-[44px]"
              >
                <span>View Matching Scholarships</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            
            {/* STEP 1: Academic Background */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                
                <div>
                  <label htmlFor="student-name" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
                    required
                  />
                  {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="student-course" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                    Current Degree / Course Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="student-course"
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="e.g. B.Tech in Computer Engineering, MBBS, B.Sc"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
                    required
                  />
                  {errors.course && <p className="text-xs text-danger mt-1">{errors.course}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="education-level" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                      Education Level <span className="text-danger">*</span>
                    </label>
                    <select
                      id="education-level"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as AcademicLevel })}
                      className="w-full px-3 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
                    >
                      {ALL_LEVELS.filter(l => l !== 'All Levels').map(l => (
                        <option key={l} value={l} className="bg-surface text-text">{l}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="student-percentage" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                      Class 12th / Previous Year Marks (%) <span className="text-danger">*</span>
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
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
                      required
                    />
                    {errors.percentage && <p className="text-xs text-danger mt-1">{errors.percentage}</p>}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: Reservation & Income */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Social Category */}
                <div>
                  <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
                    Social Category / Caste Reservation <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {SOCIAL_CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center min-h-[44px] ${
                          formData.category === cat
                            ? 'bg-primary text-primary-contrast border-primary shadow-xs'
                            : 'bg-surface-2 border-border text-text hover:border-primary/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted mt-1.5">
                    Helps match dedicated Central and State Govt affirmative welfare schemes.
                  </p>
                </div>

                {/* Annual Household Income */}
                <div>
                  <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
                    Annual Household Income (From all sources) <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: '< ₹2,50,000', label: 'Under ₹2.5 Lakhs', desc: 'Eligible for Post-Matric & full fee waivers' },
                      { id: '₹2,50,000 - ₹6,00,000', label: '₹2.5L to ₹6.0 Lakhs', desc: 'Eligible for CSSS, Tata, Reliance' },
                      { id: '₹6,00,000 - ₹8,00,000', label: '₹6.0L to ₹8.0 Lakhs', desc: 'Eligible for AICTE Pragati, EWS' },
                      { id: '> ₹8,00,000', label: 'Above ₹8.0 Lakhs', desc: 'Eligible for Merit and Global fellowships' },
                    ].map((inc) => (
                      <button
                        type="button"
                        key={inc.id}
                        onClick={() => setFormData({ ...formData, incomeBracket: inc.id as IncomeBracket })}
                        className={`p-3.5 rounded-2xl border text-left transition-all min-h-[44px] ${
                          formData.incomeBracket === inc.id
                            ? 'bg-surface-2 border-primary ring-2 ring-primary/40'
                            : 'bg-surface-2 border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text">{inc.label}</span>
                          {formData.incomeBracket === inc.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted mt-0.5">{inc.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
                    Gender Identity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GENDER_OPTIONS.map((gen) => (
                      <button
                        type="button"
                        key={gen}
                        onClick={() => setFormData({ ...formData, gender: gen })}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all min-h-[44px] ${
                          formData.gender === gen
                            ? 'bg-primary text-primary-contrast border-primary'
                            : 'bg-surface-2 border-border text-text hover:border-primary/50'
                        }`}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted mt-1">
                    Many corporate and government schemes (e.g. AICTE Pragati, Kotak Kanya) are girls-only.
                  </p>
                </div>

              </div>
            )}

            {/* STEP 3: Domicile & Special Factors */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* State of Domicile */}
                <div>
                  <label htmlFor="state-select" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                    State / UT of Permanent Domicile <span className="text-danger">*</span>
                  </label>
                  <select
                    id="state-select"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-surface text-text">{st}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted mt-1">
                    Enables matching state-specific DBT scholarship portals (e.g. MahaDBT, UP Scholarship, Karnataka ePASS).
                  </p>
                </div>

                {/* Additional criteria checkboxes */}
                <div className="pt-2 space-y-3">
                  <span className="block text-xs font-bold text-text uppercase tracking-wider">
                    Additional Considerations
                  </span>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-surface-2 hover:border-primary/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isFirstGraduate}
                      onChange={(e) => setFormData({ ...formData, isFirstGraduate: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-text">First-Generation College Student</p>
                      <p className="text-[11px] text-muted">Neither parent completed a four-year university degree.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-surface-2 hover:border-primary/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.hasDisability}
                      onChange={(e) => setFormData({ ...formData, hasDisability: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-text">Person with Benchmark Disability (PwD)</p>
                      <p className="text-[11px] text-muted">Qualifies for specialized central Divyangjan education grants.</p>
                    </div>
                  </label>
                </div>

              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text font-bold text-xs hover:bg-surface-2 transition-colors min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-contrast font-bold text-xs shadow-xs hover:opacity-95 transition-opacity min-h-[44px]"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-contrast font-bold text-xs shadow-sm hover:opacity-95 transition-all min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save Profile & Calculate Matches</span>
                </button>
              )}
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
