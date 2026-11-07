import type { Scholarship, UserProfile, MatchResult, RuleEvaluation, IncomeBracket } from '../types';

/**
 * Returns the upper limit in INR for the given income bracket.
 */
export function getIncomeUpperLimit(bracket: IncomeBracket): number {
  switch (bracket) {
    case '< ₹2,50,000':
      return 250000;
    case '₹2,50,000 - ₹6,00,000':
      return 600000;
    case '₹6,00,000 - ₹8,00,000':
      return 800000;
    case '> ₹8,00,000':
      return Infinity;
    default:
      return Infinity;
  }
}

/**
 * Explicit Indian Scholarship Eligibility & Match Engine.
 * Evaluates scholarship criteria against the student's profile.
 *
 * Rules:
 * - Rules not applicable to a scheme are skipped.
 * - If any mandatory rule fails ("not-met"): score is capped at 40% and isEligible = false ("Not eligible").
 * - If all mandatory rules pass: score is between 85% and 100%, and isEligible = true.
 * - If any rule cannot be checked (missing profile field): status = "unknown" (Review), score capped at 75%, isEligible = false.
 * - If profile is missing or not onboarded: score = 0, isEligible = false.
 */
export function calculateScholarshipMatch(
  scholarship: Scholarship,
  profile?: UserProfile
): MatchResult {
  // If no profile or not onboarded, show no score
  if (!profile || !profile.isOnboarded) {
    return {
      score: 0,
      isEligible: false,
      rules: [],
      reasons: ['Create a profile to calculate eligibility match'],
    };
  }

  const p = profile;
  const rules: RuleEvaluation[] = [];
  const reasons: string[] = [];

  const { eligibilityRules } = scholarship;

  // 1. Education Level Rule (Mandatory if scheme restricts levels)
  const allowedLevels = eligibilityRules.allowedLevels || [];
  const hasLevelRestriction =
    allowedLevels.length > 0 &&
    !allowedLevels.includes('All Levels') &&
    scholarship.level !== 'All Levels';

  if (hasLevelRestriction) {
    if (!p.level) {
      rules.push({
        id: 'level',
        label: 'Course / Education Level',
        requirement: allowedLevels.join(' or '),
        actual: 'Not specified in profile',
        status: 'unknown',
        reason: 'Review required — education level missing in profile',
      });
    } else {
      const isLevelMatch = allowedLevels.includes(p.level) || scholarship.level === p.level;
      if (isLevelMatch) {
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
        rules.push({
          id: 'level',
          label: 'Course / Education Level',
          requirement: allowedLevels.join(' or '),
          actual: p.level,
          status: 'not-met',
          reason: `Requires ${allowedLevels.join(' or ')} (you are in ${p.level})`,
        });
        reasons.push(`Level mismatch (requires ${allowedLevels[0]})`);
      }
    }
  }

  // 2. Minimum Marks % Rule (Mandatory if scheme specifies a minimum %)
  if (eligibilityRules.minPercentage !== undefined && eligibilityRules.minPercentage > 0) {
    const minP = eligibilityRules.minPercentage;
    if (p.percentage === undefined || p.percentage === null || p.percentage <= 0) {
      rules.push({
        id: 'percentage',
        label: 'Academic Percentage',
        requirement: `Minimum ${minP}% aggregate`,
        actual: 'Not specified in profile',
        status: 'unknown',
        reason: 'Review required — marks percentage missing in profile',
      });
    } else if (p.percentage >= minP) {
      rules.push({
        id: 'percentage',
        label: 'Academic Percentage',
        requirement: `Minimum ${minP}% aggregate`,
        actual: `${p.percentage}%`,
        status: 'met',
        reason: `Your score (${p.percentage}%) meets or exceeds the ${minP}% cutoff`,
      });
      reasons.push(`Academic score (${p.percentage}%) meets threshold`);
    } else {
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
  }

  // 3. Social Category / Reservation Check (Mandatory if scheme restricts category)
  const allowedCategories = eligibilityRules.eligibleCategories || [];
  const hasCategoryRestriction =
    allowedCategories.length > 0 &&
    allowedCategories.length < 5; // Restricted to specific categories

  if (hasCategoryRestriction) {
    if (!p.category) {
      rules.push({
        id: 'category',
        label: 'Social Category',
        requirement: allowedCategories.join(', '),
        actual: 'Not specified in profile',
        status: 'unknown',
        reason: 'Review required — social category missing in profile',
      });
    } else if (allowedCategories.includes(p.category)) {
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
  }

  // 4. Family Income Limit Check (Mandatory if scheme has a maximum income ceiling)
  if (eligibilityRules.maxFamilyIncome !== undefined && eligibilityRules.maxFamilyIncome > 0) {
    const maxInc = eligibilityRules.maxFamilyIncome;
    if (!p.incomeBracket) {
      rules.push({
        id: 'income',
        label: 'Annual Family Income',
        requirement: `Under ₹${maxInc.toLocaleString('en-IN')}`,
        actual: 'Not specified in profile',
        status: 'unknown',
        reason: 'Review required — family income missing in profile',
      });
    } else {
      let meetsIncome = false;
      if (p.incomeBracket === '< ₹2,50,000') {
        meetsIncome = maxInc >= 200000;
      } else {
        meetsIncome = getIncomeUpperLimit(p.incomeBracket) <= maxInc;
      }

      if (meetsIncome) {
        rules.push({
          id: 'income',
          label: 'Annual Family Income',
          requirement: `Under ₹${maxInc.toLocaleString('en-IN')}`,
          actual: p.incomeBracket,
          status: 'met',
          reason: `Income bracket (${p.incomeBracket}) is within the ₹${maxInc.toLocaleString('en-IN')} ceiling`,
        });
        reasons.push('Meets annual income limit criteria');
      } else {
        rules.push({
          id: 'income',
          label: 'Annual Family Income',
          requirement: `Under ₹${maxInc.toLocaleString('en-IN')}`,
          actual: p.incomeBracket,
          status: 'not-met',
          reason: `Income bracket (${p.incomeBracket}) exceeds the scheme limit of ₹${maxInc.toLocaleString('en-IN')}`,
        });
        reasons.push(`Exceeds income ceiling of ₹${maxInc.toLocaleString('en-IN')}`);
      }
    }
  }

  // 5. Gender Specific Rule (Mandatory if women-only)
  if (eligibilityRules.gender && eligibilityRules.gender === 'Female') {
    if (!p.gender || p.gender === 'Prefer not to say') {
      rules.push({
        id: 'gender',
        label: 'Gender Eligibility',
        requirement: 'Female candidates only',
        actual: 'Not specified in profile',
        status: 'unknown',
        reason: 'Review required — gender not specified in profile',
      });
    } else if (p.gender === 'Female') {
      rules.push({
        id: 'gender',
        label: 'Gender Eligibility',
        requirement: 'Female candidates only',
        actual: p.gender,
        status: 'met',
        reason: 'Meets female scholar requirement',
      });
      reasons.push('Female scholar requirement met');
    } else {
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

  // 6. State / Domicile Check (Mandatory if regional scheme)
  const targetStates = eligibilityRules.targetStates || [];
  const hasStateRestriction = targetStates.length > 0 && !targetStates.includes('All India');

  if (hasStateRestriction) {
    if (!p.state) {
      rules.push({
        id: 'domicile',
        label: 'State of Domicile',
        requirement: targetStates.join(', '),
        actual: 'Not specified in profile',
        status: 'unknown',
        reason: 'Review required — domicile state missing in profile',
      });
    } else {
      const isStateMatch = targetStates.includes(p.state) || p.state === 'All India';
      if (isStateMatch) {
        rules.push({
          id: 'domicile',
          label: 'State of Domicile',
          requirement: targetStates.join(', '),
          actual: p.state,
          status: 'met',
          reason: `Your domicile state (${p.state}) matches this regional scheme`,
        });
        reasons.push(`Domicile matches ${targetStates.join('/')}`);
      } else {
        rules.push({
          id: 'domicile',
          label: 'State of Domicile',
          requirement: targetStates.join(', '),
          actual: p.state,
          status: 'not-met',
          reason: `Restricted to residents of ${targetStates.join(', ')} (your state is ${p.state})`,
        });
        reasons.push(`Restricted to ${targetStates.join('/')}`);
      }
    }
  }

  // 7. Special Factors (Only if scheme explicitly requires them)
  const descString = (eligibilityRules.descriptions || []).join(' ').toLowerCase();
  const tagsString = (scholarship.tags || []).join(' ').toLowerCase();
  const requiresFirstGen = descString.includes('first-generation') || tagsString.includes('first-gen');
  const requiresDisability = descString.includes('disability') || descString.includes('pwd') || tagsString.includes('pwd');

  if (requiresFirstGen) {
    if (p.isFirstGraduate) {
      rules.push({
        id: 'first-gen',
        label: 'First-Generation Graduate',
        requirement: 'First in family to attend university',
        actual: 'Yes',
        status: 'met',
        reason: 'Meets first-generation graduate requirement',
      });
    } else {
      rules.push({
        id: 'first-gen',
        label: 'First-Generation Graduate',
        requirement: 'First in family to attend university',
        actual: 'No',
        status: 'not-met',
        reason: 'Requires first-generation graduate status',
      });
      reasons.push('Requires first-generation graduate status');
    }
  }

  if (requiresDisability) {
    if (p.hasDisability) {
      rules.push({
        id: 'disability',
        label: 'Persons with Disabilities (PwD)',
        requirement: 'Benchmarked disability (40%+)',
        actual: 'Yes',
        status: 'met',
        reason: 'Meets disability requirement',
      });
    } else {
      rules.push({
        id: 'disability',
        label: 'Persons with Disabilities (PwD)',
        requirement: 'Benchmarked disability (40%+)',
        actual: 'No',
        status: 'not-met',
        reason: 'Scheme reserved for students with disabilities',
      });
      reasons.push('Reserved for PwD students');
    }
  }

  // Score Calculation
  const applicableCount = rules.length;
  const metCount = rules.filter((r) => r.status === 'met').length;
  const notMetCount = rules.filter((r) => r.status === 'not-met').length;
  const unknownCount = rules.filter((r) => r.status === 'unknown').length;

  let score = 0;
  let isEligible = false;

  if (applicableCount === 0) {
    // Open scheme with no restrictions
    score = 100;
    isEligible = true;
  } else if (notMetCount > 0) {
    // HARD RULE: Any mandatory rule not met -> Cap score at 40%, label "Not eligible"
    const rawRatio = metCount / applicableCount;
    score = Math.min(40, Math.round(rawRatio * 40));
    isEligible = false;
  } else if (unknownCount > 0) {
    // Rule cannot be checked -> Mark "Review", cap score at 75%
    const rawScore = Math.round((metCount / applicableCount) * 100);
    score = Math.min(75, rawScore);
    isEligible = false;
  } else {
    // Every mandatory rule is met -> 85 - 100%
    isEligible = true;
    let bonus = 0;
    if (eligibilityRules.minPercentage !== undefined) {
      const excess = Math.max(0, (p.percentage || 0) - eligibilityRules.minPercentage);
      bonus = Math.min(15, Math.round((excess / 20) * 15));
    } else {
      bonus = (p.percentage || 0) >= 80 ? 10 : 5;
    }
    score = Math.min(100, Math.max(85, 85 + bonus));
  }

  return {
    score,
    isEligible,
    rules,
    reasons,
  };
}
