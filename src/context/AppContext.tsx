import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, TrackerItem, TrackerStatus, Scholarship } from '../types';

interface MatchResult {
  score: number;
  reasons: string[];
  isEligible: boolean;
}

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  savedIds: string[];
  toggleSave: (scholarshipId: string) => void;
  isSaved: (scholarshipId: string) => boolean;
  trackerItems: Record<string, TrackerItem>;
  setTrackerStatus: (scholarshipId: string, status: TrackerStatus, notes?: string) => void;
  removeFromTracker: (scholarshipId: string) => void;
  getTrackerStatus: (scholarshipId: string) => TrackerStatus | undefined;
  calculateMatch: (scholarship: Scholarship, customProfile?: UserProfile) => MatchResult;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@university.edu',
  course: 'Computer Science & Data',
  level: 'Undergraduate',
  gpa: 3.75,
  incomeBracket: '$30,000 - $60,000',
  category: ['STEM', 'Women in Tech', 'First-Generation'],
  state: 'California',
  country: 'United States',
  isOnboarded: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('grantly_profile');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // 2. Saved IDs state
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('grantly_saved');
      return stored ? JSON.parse(stored) : ['sch-01', 'sch-05', 'sch-08'];
    } catch {
      return ['sch-01', 'sch-05', 'sch-08'];
    }
  });

  // 3. Tracker items state
  const [trackerItems, setTrackerItems] = useState<Record<string, TrackerItem>>(() => {
    try {
      const stored = localStorage.getItem('grantly_tracker');
      return stored ? JSON.parse(stored) : {
        'sch-01': { scholarshipId: 'sch-01', status: 'applying', updatedAt: new Date().toISOString(), notes: 'Drafting 500-word essay' },
        'sch-05': { scholarshipId: 'sch-05', status: 'saved', updatedAt: new Date().toISOString() },
        'sch-08': { scholarshipId: 'sch-08', status: 'submitted', updatedAt: new Date().toISOString(), notes: 'Awaiting technical challenge results' },
      };
    } catch {
      return {};
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('grantly_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to persist profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('grantly_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to persist saved scholarships', e);
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('grantly_tracker', JSON.stringify(trackerItems));
    } catch (e) {
      console.error('Failed to persist tracker items', e);
    }
  }, [trackerItems]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated, isOnboarded: true }));
  };

  const toggleSave = (scholarshipId: string) => {
    setSavedIds(prev => {
      if (prev.includes(scholarshipId)) {
        return prev.filter(id => id !== scholarshipId);
      } else {
        return [...prev, scholarshipId];
      }
    });
  };

  const isSaved = (scholarshipId: string) => savedIds.includes(scholarshipId);

  const setTrackerStatus = (scholarshipId: string, status: TrackerStatus, notes?: string) => {
    setTrackerItems(prev => ({
      ...prev,
      [scholarshipId]: {
        scholarshipId,
        status,
        updatedAt: new Date().toISOString(),
        notes: notes !== undefined ? notes : prev[scholarshipId]?.notes,
      }
    }));
  };

  const removeFromTracker = (scholarshipId: string) => {
    setTrackerItems(prev => {
      const next = { ...prev };
      delete next[scholarshipId];
      return next;
    });
  };

  const getTrackerStatus = (scholarshipId: string): TrackerStatus | undefined => {
    return trackerItems[scholarshipId]?.status;
  };

  // Eligibility matching logic
  const calculateMatch = (scholarship: Scholarship, customProfile?: UserProfile): MatchResult => {
    const p = customProfile || profile;
    const reasons: string[] = [];
    let score = 50; // base score

    // 1. Level check
    const allowedLevels = scholarship.eligibilityRules.allowedLevels;
    const isLevelMatch = allowedLevels.includes('All Levels') || 
      allowedLevels.includes(p.level) || 
      scholarship.level === 'All Levels' || 
      scholarship.level === p.level;

    if (isLevelMatch) {
      score += 20;
      reasons.push(`Matches your education level (${p.level})`);
    } else {
      score -= 30;
      reasons.push(`Requires ${allowedLevels.join(', ')} (you are ${p.level})`);
    }

    // 2. Category match
    const matchesCategory = p.category.includes(scholarship.category) ||
      (scholarship.eligibilityRules.eligibleCategories && scholarship.eligibilityRules.eligibleCategories.some(c => p.category.includes(c)));

    if (matchesCategory) {
      score += 20;
      reasons.push(`Aligns with your profile category (${scholarship.category})`);
    } else {
      score += 5; // not a hard blocker, but lower alignment
    }

    // 3. GPA check
    if (scholarship.eligibilityRules.minGpa) {
      if (p.gpa >= scholarship.eligibilityRules.minGpa) {
        score += 15;
        reasons.push(`Your GPA (${p.gpa}) exceeds the minimum requirement of ${scholarship.eligibilityRules.minGpa}`);
      } else {
        score -= 25;
        reasons.push(`Requires minimum GPA of ${scholarship.eligibilityRules.minGpa} (yours is ${p.gpa})`);
      }
    } else {
      score += 10;
    }

    // 4. State targeted
    if (scholarship.eligibilityRules.targetStates && !scholarship.eligibilityRules.targetStates.includes('All')) {
      if (scholarship.eligibilityRules.targetStates.includes(p.state)) {
        score += 10;
        reasons.push(`Open to students residing in ${p.state}`);
      } else {
        score -= 15;
        reasons.push(`Priority given to students in ${scholarship.eligibilityRules.targetStates.join(', ')}`);
      }
    }

    // 5. Income check
    if (scholarship.eligibilityRules.maxFamilyIncome) {
      if (p.incomeBracket === '< $30,000' || p.incomeBracket === '$30,000 - $60,000') {
        score += 10;
        reasons.push('Meets financial need thresholds');
      }
    }

    // Clamp score
    const clampedScore = Math.max(15, Math.min(99, score));
    const isEligible = clampedScore >= 65;

    return {
      score: clampedScore,
      reasons,
      isEligible,
    };
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        savedIds,
        toggleSave,
        isSaved,
        trackerItems,
        setTrackerStatus,
        removeFromTracker,
        getTrackerStatus,
        calculateMatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
