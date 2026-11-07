import React, { useState } from 'react';
import { User, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AcademicLevel } from '../types';
import { ALL_LEVELS } from '../data/scholarships';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [name, setName] = useState(profile.name);
  const [course, setCourse] = useState(profile.course);
  const [level, setLevel] = useState<AcademicLevel>(profile.level);
  const [gpa, setGpa] = useState(profile.gpa.toString());
  const [incomeBracket, setIncomeBracket] = useState(profile.incomeBracket);
  const [state, setState] = useState(profile.state);
  const [category, setCategory] = useState<string[]>(profile.category);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableCategories = [
    'STEM',
    'Women in Tech',
    'First-Generation',
    'Need-Based',
    'Merit-Based',
    'Underrepresented Minorities',
    'Arts & Humanities',
    'Business & Leadership'
  ];

  const handleToggleCategory = (cat: string) => {
    setCategory(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      course,
      level,
      gpa: parseFloat(gpa) || 3.5,
      incomeBracket: incomeBracket as any,
      state,
      category,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
        
        <div className="flex items-center gap-3 pb-6 border-b border-stone-100 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#133E2B] flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Student Profile & Eligibility</h1>
            <p className="text-xs text-stone-500">Your profile is used to calculate personal match scores for all scholarships.</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile saved successfully! Eligibility match scores updated.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#133E2B] text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Current Major / Course
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#133E2B] text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Academic Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#133E2B] text-sm bg-white"
              >
                {ALL_LEVELS.filter(l => l !== 'All Levels').map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Cumulative GPA (4.0 Scale)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.0"
                max="4.0"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#133E2B] text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Home State / Region
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. California"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#133E2B] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Household Income Bracket
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['< $30,000', '$30,000 - $60,000', '$60,000 - $100,000', '> $100,000'].map((bracket) => (
                <button
                  type="button"
                  key={bracket}
                  onClick={() => setIncomeBracket(bracket as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    incomeBracket === bracket
                      ? 'border-[#133E2B] bg-[#133E2B] text-white'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {bracket}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Identity & Eligibility Factors (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => {
                const isSelected = category.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#133E2B] text-white border-[#133E2B]'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#133E2B] hover:bg-[#1B533A] text-white text-sm font-bold shadow-sm transition-colors"
            >
              Save Profile & Update Matches
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
