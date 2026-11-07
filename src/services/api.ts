import { SCHOLARSHIPS } from '../data/scholarships';
import type { Scholarship, FilterState } from '../types';
import { getDaysRemaining } from '../utils/dateUtils';

// Helper to simulate network latency between 400ms and 650ms
const simulateLatency = <T>(data: T, minMs = 400, maxMs = 650): Promise<T> => {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

/**
 * Fetch all scholarships with optional query and filter parameters
 */
export async function getScholarships(filters?: Partial<FilterState>): Promise<Scholarship[]> {
  let list = [...SCHOLARSHIPS];

  if (filters) {
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.category.toLowerCase().includes(q)
      );
    }

    if (filters.level && filters.level !== 'All Levels') {
      const selectedLevel = filters.level;
      list = list.filter((s) => {
        const allowed = s.eligibilityRules.allowedLevels;
        return (
          s.level === 'All Levels' ||
          s.level === selectedLevel ||
          allowed.includes('All Levels') ||
          allowed.includes(selectedLevel)
        );
      });
    }

    if (filters.category && filters.category !== 'All Categories') {
      const selectedCategory = filters.category;
      list = list.filter((s) => s.category === selectedCategory);
    }

    if (filters.state && filters.state !== 'All India') {
      const selectedState = filters.state;
      list = list.filter((s) => {
        const targetStates = s.eligibilityRules.targetStates || ['All India'];
        return targetStates.includes('All India') || targetStates.includes(selectedState);
      });
    }

    if (typeof filters.minAmount === 'number' && filters.minAmount > 0) {
      const minAmount = filters.minAmount;
      list = list.filter((s) => s.amount >= minAmount);
    }

    if (filters.deadlineRange && filters.deadlineRange !== 'all') {
      const range = filters.deadlineRange;
      list = list.filter((s) => {
        const days = getDaysRemaining(s.deadline);
        if (days < 0) return false;
        if (range === '30-days') return days <= 30;
        if (range === '60-days') return days <= 60;
        if (range === '90-days') return days <= 90;
        return true;
      });
    }

    // Sort order
    if (filters.sortBy) {
      if (filters.sortBy === 'deadline-asc') {
        list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      } else if (filters.sortBy === 'amount-desc') {
        list.sort((a, b) => b.amount - a.amount);
      } else if (filters.sortBy === 'amount-asc') {
        list.sort((a, b) => a.amount - b.amount);
      } else if (filters.sortBy === 'name-asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  }

  return simulateLatency(list);
}

/**
 * Fetch a single scholarship by its unique ID
 */
export async function getScholarshipById(id: string): Promise<Scholarship | null> {
  const match = SCHOLARSHIPS.find((s) => s.id === id) || null;
  return simulateLatency(match, 400, 550);
}

/**
 * Fetch related / similar scholarships
 */
export async function getSimilarScholarships(id: string, limit = 3): Promise<Scholarship[]> {
  const target = SCHOLARSHIPS.find((s) => s.id === id);
  if (!target) return simulateLatency([]);

  const similar = SCHOLARSHIPS.filter(
    (s) => s.id !== id && (s.category === target.category || s.level === target.level)
  ).slice(0, limit);

  return simulateLatency(similar, 350, 500);
}

/**
 * Fetch all indexed scholarships without filtering
 */
export async function getAllScholarships(): Promise<Scholarship[]> {
  return simulateLatency([...SCHOLARSHIPS], 400, 600);
}
