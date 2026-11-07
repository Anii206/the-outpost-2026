export type AcademicLevel = 
  | 'All Levels'
  | 'High School Senior'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'PhD / Doctorate';

export type ScholarshipCategory =
  | 'All Categories'
  | 'STEM'
  | 'Women in Tech'
  | 'Need-Based'
  | 'Merit-Based'
  | 'First-Generation'
  | 'Arts & Humanities'
  | 'Underrepresented Minorities'
  | 'Business & Leadership';

export interface EligibilityRules {
  minGpa?: number;
  allowedLevels: string[];
  eligibleCategories?: string[];
  maxFamilyIncome?: number; // USD per year
  targetStates?: string[]; // ['CA', 'NY', 'All']
  citizenshipRequirement?: string;
  descriptions: string[];
}

export interface ApplicationStep {
  step: number;
  title: string;
  description: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number; // numeric value for sorting/filtering
  amountFormatted: string; // e.g. "$25,000" or "$10,000/yr"
  level: AcademicLevel;
  category: ScholarshipCategory;
  country: string;
  deadline: string; // YYYY-MM-DD
  eligibilityRules: EligibilityRules;
  documentsRequired: string[];
  applicationSteps: ApplicationStep[];
  description: string;
  tags: string[];
  websiteUrl: string;
  featured?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  course: string;
  level: AcademicLevel;
  gpa: number;
  incomeBracket: '< $30,000' | '$30,000 - $60,000' | '$60,000 - $100,000' | '> $100,000';
  category: string[];
  state: string;
  country: string;
  isOnboarded: boolean;
}

export type TrackerStatus = 'saved' | 'applying' | 'submitted' | 'awarded';

export interface TrackerItem {
  scholarshipId: string;
  status: TrackerStatus;
  updatedAt: string;
  notes?: string;
  submissionDate?: string;
}

export interface FilterState {
  search: string;
  level: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  deadlineRange: 'all' | '30-days' | '60-days' | '90-days';
  sortBy: 'deadline-asc' | 'amount-desc' | 'amount-asc' | 'name-asc' | 'match-desc';
}
