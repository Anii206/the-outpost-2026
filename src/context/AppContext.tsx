/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserProfile, 
  TrackerItem, 
  TrackerStatus, 
  Scholarship, 
  MatchResult, 
  RuleEvaluation 
} from '../types';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  resetProfile: () => void;
  savedIds: string[];
  toggleSave: (scholarshipId: string) => void;
  isSaved: (scholarshipId: string) => boolean;
  trackerItems: Record<string, TrackerItem>;
  setTrackerStatus: (scholarshipId: string, status: TrackerStatus, notes?: string) => void;
  updateTrackerNote: (scholarshipId: string, notes: string) => void;
  removeFromTracker: (scholarshipId: string) => void;
  getTrackerStatus: (scholarshipId: string) => TrackerStatus | undefined;
  calculateMatch: (scholarship: Scholarship, customProfile?: UserProfile) => MatchResult;
  checkedDocs: Record<string, string[]>;
  toggleDocumentCheck: (scholarshipId: string, docName: string) => void;
  isDocumentChecked: (scholarshipId: string, docName: string) => boolean;
  // Compare state
  compareIds: string[];
  toggleCompare: (scholarshipId: string) => boolean;
  clearCompare: () => void;
  isCompared: (scholarshipId: string) => boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Ananya Sharma',
  email: 'ananya.sharma@college.ac.in',
  course: 'B.Tech in Computer Engineering',
  level: 'Undergraduate',
  percentage: 84,
  incomeBracket: '₹2,50,000 - ₹6,00,000',
  category: 'OBC',
  state: 'Maharashtra',
  gender: 'Female',
  isFirstGraduate: true,
  hasDisability: false,
  isOnboarded: true,
};

const EMPTY_PROFILE: UserProfile = {
  name: '',
  email: '',
  course: '',
  level: 'Undergraduate',
  percentage: 75,
  incomeBracket: '₹2,50,000 - ₹6,00,000',
  category: 'General',
  state: 'All India',
  gender: 'Female',
  isFirstGraduate: false,
  hasDisability: false,
  isOnboarded: false,
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
      return stored ? JSON.parse(stored) : ['sch-01', 'sch-02', 'sch-05'];
    } catch {
      return ['sch-01', 'sch-02', 'sch-05'];
    }
  });

  // 3. Tracker items state
  const [trackerItems, setTrackerItems] = useState<Record<string, TrackerItem>>(() => {
    try {
      const stored = localStorage.getItem('grantly_tracker');
      return stored ? JSON.parse(stored) : {
        'sch-01': { scholarshipId: 'sch-01', status: 'applying', updatedAt: new Date().toISOString(), notes: 'Income certificate submitted to college office' },
        'sch-02': { scholarshipId: 'sch-02', status: 'saved', updatedAt: new Date().toISOString() },
        'sch-05': { scholarshipId: 'sch-05', status: 'submitted', updatedAt: new Date().toISOString(), notes: 'Awaiting virtual interview notification' },
        'sch-03': { scholarshipId: 'sch-03', status: 'awarded', updatedAt: new Date().toISOString(), notes: 'First installment of ₹75,000 received via DBT' },
      };
    } catch {
      return {};
    }
  });

  // 4. Checklist documents persisted per scholarship
  const [checkedDocs, setCheckedDocs] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem('grantly_checked_docs');
      return stored ? JSON.parse(stored) : {
        'sch-01': ['Class 10 and 12 Board Marksheets', 'Aadhaar Card linked with Bank Account']
      };
    } catch {
      return {};
    }
  });

  // 5. Comparison IDs state (max 3)
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('grantly_compare');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
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

  useEffect(() => {
    try {
      localStorage.setItem('grantly_checked_docs', JSON.stringify(checkedDocs));
    } catch (e) {
      console.error('Failed to persist checked documents', e);
    }
  }, [checkedDocs]);

  useEffect(() => {
    try {
      localStorage.setItem('grantly_compare', JSON.stringify(compareIds));
    } catch (e) {
      console.error('Failed to persist compare items', e);
    }
  }, [compareIds]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated, isOnboarded: true }));
  };

  const resetProfile = () => {
    setProfile(EMPTY_PROFILE);
    localStorage.removeItem('grantly_profile');
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

  const updateTrackerNote = (scholarshipId: string, notes: string) => {
    setTrackerItems(prev => {
      if (!prev[scholarshipId]) return prev;
      return {
        ...prev,
        [scholarshipId]: {
          ...prev[scholarshipId],
          notes,
          updatedAt: new Date().toISOString(),
        }
      };
    });
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

  const toggleDocumentCheck = (scholarshipId: string, docName: string) => {
    setCheckedDocs(prev => {
      const currentList = prev[scholarshipId] || [];
      const updatedList = currentList.includes(docName)
        ? currentList.filter(d => d !== docName)
        : [...currentList, docName];

      return {
        ...prev,
        [scholarshipId]: updatedList
      };
    });
  };

  const isDocumentChecked = (scholarshipId: string, docName: string): boolean => {
    return (checkedDocs[scholarshipId] || []).includes(docName);
  };

  // Compare helpers
  const toggleCompare = (scholarshipId: string): boolean => {
    if (compareIds.includes(scholarshipId)) {
      setCompareIds(prev => prev.filter(id => id !== scholarshipId));
      return true;
    } else {
      if (compareIds.length >= 3) {
        return false; // Limit reached
      }
      setCompareIds(prev => [...prev, scholarshipId]);
      return true;
    }
  };

  const clearCompare = () => setCompareIds([]);
  const isCompared = (scholarshipId: string) => compareIds.includes(scholarshipId);

  // Indian Eligibility & Match Score Engine
  const calculateMatch = (scholarship: Scholarship, customProfile?: UserProfile): MatchResult => {
    const p = customProfile || profile;
    const rules: RuleEvaluation[] = [];
    const reasons: string[] = [];
    let score = 40; // Base score

    // 1. Education Level Rule
    const allowedLevels = scholarship.eligibilityRules.allowedLevels;
    const isLevelMatch = allowedLevels.includes('All Levels') || 
      allowedLevels.includes(p.level) || 
      scholarship.level === 'All Levels' || 
      scholarship.level === p.level;

    if (isLevelMatch) {
      score += 25;
      rules.push({
        id: 'level',
        label: 'Course / Education Level',
        requirement: allowedLevels.join(' or '),
        actual: p.level,
        status: 'met',
        reason: `Matches your current stage (${p.level})`,
      });
      reasons.push(`Course level matches (${p.level})`);
    } else {
      score -= 20;
      rules.push({
        id: 'level',
        label: 'Course / Education Level',
        requirement: allowedLevels.join(' or '),
        actual: p.level,
        status: 'not-met',
        reason: `Requires ${allowedLevels.join(' or ')} (you are in ${p.level})`,
      });
      reasons.push(`Level mismatch (Requires ${allowedLevels[0]})`);
    }

    // 2. Minimum Percentage Rule
    if (scholarship.eligibilityRules.minPercentage) {
      const minP = scholarship.eligibilityRules.minPercentage;
      if (p.percentage >= minP) {
        score += 20;
        rules.push({
          id: 'percentage',
          label: 'Academic Percentage',
          requirement: `Minimum ${minP}% aggregate`,
          actual: `${p.percentage}%`,
          status: 'met',
          reason: `Your score (${p.percentage}%) exceeds the ${minP}% requirement`,
        });
        reasons.push(`Academic score (${p.percentage}%) meets threshold`);
      } else {
        score -= 25;
        rules.push({
          id: 'percentage',
          label: 'Academic Percentage',
          requirement: `Minimum ${minP}% aggregate`,
          actual: `${p.percentage}%`,
          status: 'not-met',
          reason: `Your score (${p.percentage}%) is below the ${minP}% cutoff`,
        });
        reasons.push(`Requires ${minP}% marks (you have ${p.percentage}%)`);
      }
    } else {
      score += 10;
      rules.push({
        id: 'percentage',
        label: 'Academic Percentage',
        requirement: 'No strict percentage cutoff',
        actual: `${p.percentage}%`,
        status: 'met',
        reason: 'Open to all qualifying grade levels',
      });
    }

    // 3. Social Category / Reservation Check
    if (scholarship.eligibilityRules.eligibleCategories && scholarship.eligibilityRules.eligibleCategories.length > 0) {
      const allowedCategories = scholarship.eligibilityRules.eligibleCategories;
      if (allowedCategories.includes(p.category)) {
        score += 15;
        rules.push({
          id: 'category',
          label: 'Social Category',
          requirement: allowedCategories.join(', '),
          actual: p.category,
          status: 'met',
          reason: `Your category (${p.category}) is eligible`,
        });
        reasons.push(`Category (${p.category}) matches scheme`);
      } else {
        score -= 30;
        rules.push({
          id: 'category',
          label: 'Social Category',
          requirement: allowedCategories.join(', '),
          actual: p.category,
          status: 'not-met',
          reason: `Reserved for ${allowedCategories.join(', ')} applicants`,
        });
        reasons.push(`Reserved for ${allowedCategories.join('/')}`);
      }
    } else {
      score += 10;
      rules.push({
        id: 'category',
        label: 'Social Category',
        requirement: 'Open to All Categories (General/OBC/SC/ST/EWS)',
        actual: p.category,
        status: 'met',
        reason: 'Open to all student categories',
      });
    }

    // 4. Family Income Limit Check
    if (scholarship.eligibilityRules.maxFamilyIncome) {
      const maxInc = scholarship.eligibilityRules.maxFamilyIncome;
      let profileMaxInc: number;
      if (p.incomeBracket === '< ₹2,50,000') profileMaxInc = 250000;
      else if (p.incomeBracket === '₹2,50,000 - ₹6,00,000') profileMaxInc = 600000;
      else if (p.incomeBracket === '₹6,00,000 - ₹8,00,000') profileMaxInc = 800000;
      else profileMaxInc = 1500000;

      if (profileMaxInc <= maxInc) {
        score += 15;
        rules.push({
          id: 'income',
          label: 'Annual Family Income',
          requirement: `Under ₹${maxInc.toLocaleString('en-IN')}`,
          actual: p.incomeBracket,
          status: 'met',
          reason: `Your income bracket (${p.incomeBracket}) is within the ₹${maxInc.toLocaleString('en-IN')} ceiling`,
        });
        reasons.push('Meets annual income limit criteria');
      } else {
        score -= 20;
        rules.push({
          id: 'income',
          label: 'Annual Family Income',
          requirement: `Under ₹${maxInc.toLocaleString('en-IN')}`,
          actual: p.incomeBracket,
          status: 'not-met',
          reason: `Income bracket (${p.incomeBracket}) may exceed the scheme limit of ₹${maxInc.toLocaleString('en-IN')}`,
        });
        reasons.push(`Income limit is ₹${maxInc.toLocaleString('en-IN')}`);
      }
    } else {
      score += 10;
      rules.push({
        id: 'income',
        label: 'Annual Family Income',
        requirement: 'No maximum family income cap',
        actual: p.incomeBracket,
        status: 'met',
        reason: 'Merit-based with no household income restriction',
      });
    }

    // 5. Gender Specific
    if (scholarship.eligibilityRules.gender && scholarship.eligibilityRules.gender === 'Female') {
      if (p.gender === 'Female') {
        score += 15;
        rules.push({
          id: 'gender',
          label: 'Gender Eligibility',
          requirement: 'Female candidates only',
          actual: p.gender,
          status: 'met',
          reason: 'Meets female scholar requirement',
        });
      } else {
        score -= 40;
        rules.push({
          id: 'gender',
          label: 'Gender Eligibility',
          requirement: 'Female candidates only',
          actual: p.gender,
          status: 'not-met',
          reason: 'This scholarship is exclusively for female students',
        });
        reasons.push('Exclusively for girl students');
      }
    }

    // 6. State / Domicile Check
    if (scholarship.eligibilityRules.targetStates && !scholarship.eligibilityRules.targetStates.includes('All India')) {
      const allowedStates = scholarship.eligibilityRules.targetStates;
      if (allowedStates.includes(p.state) || p.state === 'All India') {
        score += 10;
        rules.push({
          id: 'domicile',
          label: 'State of Domicile',
          requirement: allowedStates.join(', '),
          actual: p.state,
          status: 'met',
          reason: `Your domicile state (${p.state}) matches this regional scheme`,
        });
      } else {
        score -= 25;
        rules.push({
          id: 'domicile',
          label: 'State of Domicile',
          requirement: allowedStates.join(', '),
          actual: p.state,
          status: 'not-met',
          reason: `Restricted to residents of ${allowedStates.join(', ')} (your state is ${p.state})`,
        });
        reasons.push(`Specific to ${allowedStates.join('/')}`);
      }
    } else {
      rules.push({
        id: 'domicile',
        label: 'State of Domicile',
        requirement: 'All India (Any State / UT)',
        actual: p.state,
        status: 'met',
        reason: 'Open to candidates from all Indian States & Union Territories',
      });
    }

    const clampedScore = Math.max(15, Math.min(99, score));
    const allMet = rules.every(r => r.status === 'met');
    const isEligible = clampedScore >= 65 && allMet;

    return {
      score: clampedScore,
      isEligible,
      rules,
      reasons,
    };
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        savedIds,
        toggleSave,
        isSaved,
        trackerItems,
        setTrackerStatus,
        updateTrackerNote,
        removeFromTracker,
        getTrackerStatus,
        calculateMatch,
        checkedDocs,
        toggleDocumentCheck,
        isDocumentChecked,
        compareIds,
        toggleCompare,
        clearCompare,
        isCompared,
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
