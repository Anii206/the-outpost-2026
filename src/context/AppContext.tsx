/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserProfile, 
  TrackerItem, 
  TrackerStatus, 
  Scholarship, 
  MatchResult 
} from '../types';
import { calculateScholarshipMatch } from '../utils/eligibilityEngine';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  resetProfile: () => void;
  savedIds: string[];
  toggleSave: (scholarshipId: string) => boolean;
  isSaved: (scholarshipId: string) => boolean;
  trackerItems: Record<string, TrackerItem>;
  setTrackerStatus: (scholarshipId: string, status: TrackerStatus, notes?: string) => boolean;
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
  loadDemoProfile: () => void;
}

export const DEMO_PROFILE: UserProfile = {
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

export const EMPTY_PROFILE: UserProfile = {
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
      return stored ? JSON.parse(stored) : EMPTY_PROFILE;
    } catch {
      return EMPTY_PROFILE;
    }
  });

  // 2. Saved IDs state
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('grantly_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 3. Tracker items state
  const [trackerItems, setTrackerItems] = useState<Record<string, TrackerItem>>(() => {
    try {
      const stored = localStorage.getItem('grantly_tracker');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // 4. Checklist documents persisted per scholarship
  const [checkedDocs, setCheckedDocs] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem('grantly_checked_docs');
      return stored ? JSON.parse(stored) : {};
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

  const loadDemoProfile = () => {
    setProfile(DEMO_PROFILE);
  };

  const toggleSave = (scholarshipId: string): boolean => {
    const isCurrentlySaved = savedIds.includes(scholarshipId);
    const willBeSaved = !isCurrentlySaved;
    setSavedIds(prev => {
      if (prev.includes(scholarshipId)) {
        return prev.filter(id => id !== scholarshipId);
      } else {
        return [...prev, scholarshipId];
      }
    });
    return willBeSaved;
  };

  const isSaved = (scholarshipId: string) => savedIds.includes(scholarshipId);

  const setTrackerStatus = (scholarshipId: string, status: TrackerStatus, notes?: string): boolean => {
    const existing = trackerItems[scholarshipId];
    if (existing && existing.status === status && notes === undefined) {
      return false; // Idempotent no-op
    }
    setTrackerItems(prev => ({
      ...prev,
      [scholarshipId]: {
        scholarshipId,
        status,
        updatedAt: new Date().toISOString(),
        notes: notes !== undefined ? notes : prev[scholarshipId]?.notes,
      }
    }));
    return true;
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
    return calculateScholarshipMatch(scholarship, customProfile || profile);
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
        loadDemoProfile,
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
