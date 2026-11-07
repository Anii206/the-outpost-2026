export type AcademicLevel = 
  | 'All Levels'
  | 'Class 11-12'
  | 'Diploma / Polytechnic'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'PhD / Research';

export type SocialCategory =
  | 'General'
  | 'OBC'
  | 'SC'
  | 'ST'
  | 'EWS';

export type ScholarshipCategory =
  | 'All Categories'
  | 'Merit-Based'
  | 'Need-Based'
  | 'Girls in STEM'
  | 'SC/ST/OBC Welfare'
  | 'State Government Scheme'
  | 'Corporate CSR'
  | 'International Fellowship';

export type IncomeBracket = 
  | '< ₹2,50,000'
  | '₹2,50,000 - ₹6,00,000'
  | '₹6,00,000 - ₹8,00,000'
  | '> ₹8,00,000';

export interface EligibilityRules {
  minPercentage?: number;
  allowedLevels: string[];
  eligibleCategories?: SocialCategory[];
  maxFamilyIncome?: number; // In INR per annum
  targetStates?: string[]; // ['All India'] or ['Maharashtra', 'Karnataka']
  gender?: 'Female' | 'Any';
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
  amount: number; // In INR for sorting/filtering
  amountFormatted: string; // e.g. "₹50,000 / year"
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
  percentage: number;
  incomeBracket: IncomeBracket;
  category: SocialCategory;
  state: string;
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Prefer not to say';
  isFirstGraduate: boolean;
  hasDisability: boolean;
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

export interface RuleEvaluation {
  id: string;
  label: string;
  requirement: string;
  actual: string;
  status: 'met' | 'not-met' | 'unknown';
  reason: string;
}

export interface MatchResult {
  score: number;
  isEligible: boolean;
  rules: RuleEvaluation[];
  reasons: string[];
}

export interface FilterState {
  search: string;
  level: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  state: string;
  deadlineRange: 'all' | '30-days' | '60-days' | '90-days';
  sortBy: 'match-desc' | 'deadline-asc' | 'amount-desc' | 'amount-asc' | 'name-asc';
}
