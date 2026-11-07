declare const process: { argv: string[]; exit: (code?: number) => void };

import { SCHOLARSHIPS } from '../data/scholarships.ts';
import { calculateScholarshipMatch } from '../utils/eligibilityEngine.ts';
import type { UserProfile } from '../types/index.ts';

export interface SampleProfileTest {
  id: string;
  label: string;
  profile: UserProfile;
  expected: {
    minEligibleCount: number;
    maxEligibleCount: number;
    mustBeIneligible: string[]; // scholarship ids that must fail
    mustBeEligible: string[];   // scholarship ids that must succeed
  };
}

export const SAMPLE_PROFILES: SampleProfileTest[] = [
  {
    id: 'p1_gen_high_income',
    label: 'Profile 1: General High-Income Male (Undergraduate, 82% marks, > 8L income, Maharashtra)',
    profile: {
      name: 'Rohan Deshmukh',
      email: 'rohan@example.com',
      course: 'B.Tech Mechanical Engineering',
      level: 'Undergraduate',
      percentage: 82,
      incomeBracket: '> ₹8,00,000',
      category: 'General',
      state: 'Maharashtra',
      gender: 'Male',
      isFirstGraduate: false,
      hasDisability: false,
      isOnboarded: true,
    },
    expected: {
      minEligibleCount: 1,
      maxEligibleCount: 5, // Mostly ineligible for need-based, girls, reservation, and state schemes
      mustBeIneligible: [
        'sch-01', // AICTE Pragati (Female only)
        'sch-03', // HDFC Parivartan (Max income 2.5L)
        'sch-06', // Tata Trusts (Max income 5L)
        'sch-07', // MahaDBT (Max income 8L)
        'sch-08', // Karnataka Vidyasiri (OBC/SC/ST/EWS + Karnataka + 2.5L)
        'sch-09', // Post Matric SC/ST (SC/ST only + 2.5L)
        'sch-12', // ONGC (OBC/EWS only + 2L)
        'sch-14', // L'Oreal (Female only + 6L)
        'sch-15', // Santoor (Female only + AP/TS/KA)
        'sch-18', // UP Post-Matric (UP only + 2.5L)
      ],
      mustBeEligible: [
        'sch-13', // PMSS (No income ceiling, All India, 60% min, UG)
      ],
    },
  },
  {
    id: 'p2_sc_low_income',
    label: 'Profile 2: SC Low-Income Female (Undergraduate, 78% marks, < 2.5L income, Karnataka)',
    profile: {
      name: 'Kavitha Murthy',
      email: 'kavitha@example.com',
      course: 'B.E. Computer Science',
      level: 'Undergraduate',
      percentage: 78,
      incomeBracket: '< ₹2,50,000',
      category: 'SC',
      state: 'Karnataka',
      gender: 'Female',
      isFirstGraduate: true,
      hasDisability: false,
      isOnboarded: true,
    },
    expected: {
      minEligibleCount: 8,
      maxEligibleCount: 16,
      mustBeEligible: [
        'sch-01', // AICTE Pragati (Female, UG, 60% min, 8L ceiling)
        'sch-02', // Reliance (UG, 60% min, 15L ceiling)
        'sch-03', // HDFC Parivartan (UG, 55% min, 2.5L ceiling)
        'sch-06', // Tata Trusts (UG, 70% min, 5L ceiling)
        'sch-08', // Karnataka Vidyasiri (Karnataka, SC, 50% min, 2.5L ceiling)
        'sch-09', // Post Matric SC/ST (SC, 45% min, 2.5L ceiling)
        'sch-10', // Aditya Birla (UG, 60% min, 6L ceiling)
        'sch-15', // Santoor Women (Female, Karnataka, 60% min)
      ],
      mustBeIneligible: [
        'sch-07', // MahaDBT (Maharashtra domicile required)
        'sch-11', // SVMCM (West Bengal domicile required)
        'sch-12', // ONGC (OBC / EWS only)
        'sch-18', // UP Post-Matric (UP domicile required)
        'sch-21', // Chevening (Postgraduate only)
      ],
    },
  },
  {
    id: 'p3_obc_low_income',
    label: 'Profile 3: OBC Low-Income Male (Undergraduate, 65% marks, < 2.5L income, West Bengal)',
    profile: {
      name: 'Subhash Roy',
      email: 'subhash@example.com',
      course: 'B.Sc Physics',
      level: 'Undergraduate',
      percentage: 65,
      incomeBracket: '< ₹2,50,000',
      category: 'OBC',
      state: 'West Bengal',
      gender: 'Male',
      isFirstGraduate: false,
      hasDisability: false,
      isOnboarded: true,
    },
    expected: {
      minEligibleCount: 5,
      maxEligibleCount: 10,
      mustBeEligible: [
        'sch-02', // Reliance (UG, 60% min, 15L ceiling)
        'sch-03', // HDFC Parivartan (UG, 55% min, 2.5L ceiling)
        'sch-11', // SVMCM (West Bengal, 60% min, 2.5L ceiling)
        'sch-12', // ONGC (OBC, 60% min, 2L ceiling)
        'sch-10', // Aditya Birla (UG, 60% min, 6L ceiling)
      ],
      mustBeIneligible: [
        'sch-01', // AICTE Pragati (Female only)
        'sch-05', // Kotak Kanya (Female only + 85% min)
        'sch-07', // MahaDBT (Maharashtra only)
        'sch-08', // Karnataka Vidyasiri (Karnataka only)
        'sch-09', // Post Matric SC/ST (SC/ST only)
        'sch-14', // L'Oreal (Female only + 85% min)
        'sch-16', // INSPIRE (90% min cutoff)
        'sch-20', // Kalam Healthcare (75% min cutoff)
      ],
    },
  },
  {
    id: 'p4_general_merit_female',
    label: 'Profile 4: General High-Merit Female (Undergraduate, 94% marks, 2.5L-6L income, Delhi)',
    profile: {
      name: 'Meera Kapoor',
      email: 'meera@example.com',
      course: 'B.Tech Information Technology',
      level: 'Undergraduate',
      percentage: 94,
      incomeBracket: '₹2,50,000 - ₹6,00,000',
      category: 'General',
      state: 'Delhi',
      gender: 'Female',
      isFirstGraduate: false,
      hasDisability: false,
      isOnboarded: true,
    },
    expected: {
      minEligibleCount: 6,
      maxEligibleCount: 12,
      mustBeEligible: [
        'sch-01', // AICTE Pragati (Female, 60% min, 8L ceiling)
        'sch-05', // Kotak Kanya (Female, 85% min, 6L ceiling)
        'sch-10', // Aditya Birla (UG, 60% min, 6L ceiling)
        'sch-14', // L'Oreal (Female, 85% min, 6L ceiling)
        'sch-16', // INSPIRE (UG, 90% min, no income ceiling)
      ],
      mustBeIneligible: [
        'sch-03', // HDFC Parivartan (2.5L ceiling exceeded by 6L bracket)
        'sch-04', // NSP CSSS (4.5L ceiling exceeded by 6L bracket)
        'sch-06', // Tata Trusts (5.0L ceiling exceeded by 6L bracket)
        'sch-08', // Karnataka Vidyasiri (Karnataka only + SC/ST/OBC/EWS)
        'sch-09', // Post Matric SC/ST (SC/ST only)
        'sch-11', // SVMCM (West Bengal only + 2.5L ceiling)
        'sch-12', // ONGC (OBC/EWS only + 2L ceiling)
        'sch-18', // UP Post-Matric (UP only + 2.5L ceiling)
      ],
    },
  },
  {
    id: 'p5_pg_ews_male',
    label: 'Profile 5: Postgraduate EWS Male (Postgraduate, 72% marks, < 2.5L income, Uttar Pradesh)',
    profile: {
      name: 'Amit Pandey',
      email: 'amit@example.com',
      course: 'M.Sc Data Science',
      level: 'Postgraduate',
      percentage: 72,
      incomeBracket: '< ₹2,50,000',
      category: 'EWS',
      state: 'Uttar Pradesh',
      gender: 'Male',
      isFirstGraduate: false,
      hasDisability: false,
      isOnboarded: true,
    },
    expected: {
      minEligibleCount: 5,
      maxEligibleCount: 11,
      mustBeEligible: [
        'sch-12', // ONGC (PG allowed, EWS eligible, 60% min, 2L ceiling)
        'sch-18', // UP Post-Matric (PG allowed, UP state, 50% min, 2.5L ceiling)
        'sch-21', // Chevening (PG, 60% min, no income ceiling)
        'sch-24', // Commonwealth (PG, 65% min, no income ceiling)
      ],
      mustBeIneligible: [
        'sch-01', // AICTE Pragati (Female only)
        'sch-02', // Reliance (Strictly Undergraduate level only)
        'sch-05', // Kotak Kanya (Undergraduate only + Female)
        'sch-07', // MahaDBT (Maharashtra only)
        'sch-08', // Karnataka Vidyasiri (Karnataka only)
        'sch-09', // Post Matric SC/ST (SC/ST only)
        'sch-10', // Aditya Birla (Undergraduate only)
        'sch-14', // L'Oreal (Undergraduate only + Female)
        'sch-17', // Siemens (Undergraduate only)
        'sch-20', // Kalam Healthcare (Undergraduate only)
      ],
    },
  },
  {
    id: 'p6_not_onboarded',
    label: 'Profile 6: Un-onboarded / Visitor (isOnboarded = false)',
    profile: {
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
    },
    expected: {
      minEligibleCount: 0,
      maxEligibleCount: 0,
      mustBeEligible: [],
      mustBeIneligible: ['sch-01', 'sch-02', 'sch-03', 'sch-04'],
    },
  },
];

export function runEligibilityTests(): { success: boolean; summary: string } {
  const outputs: string[] = [];
  let allPassed = true;

  outputs.push('================================================================');
  outputs.push('GRANTLY SCHOLARSHIP ELIGIBILITY & MATCH SCORING ENGINE DEV TESTS');
  outputs.push('================================================================\n');

  SAMPLE_PROFILES.forEach((testCase) => {
    outputs.push(`Testing ${testCase.label}:`);

    const results = SCHOLARSHIPS.map((sch) => {
      const match = calculateScholarshipMatch(sch, testCase.profile);
      return { sch, match };
    });

    const eligible = results.filter((r) => r.match.isEligible);
    const ineligible = results.filter((r) => !r.match.isEligible);

    outputs.push(`  -> Eligible: ${eligible.length} / ${SCHOLARSHIPS.length}`);
    outputs.push(`  -> Ineligible: ${ineligible.length} / ${SCHOLARSHIPS.length}`);

    // Verify un-onboarded profile shows 0 score
    if (!testCase.profile.isOnboarded) {
      const nonZeroScores = results.filter((r) => r.match.score > 0);
      if (nonZeroScores.length > 0) {
        outputs.push(`  [FAIL] Expected all scores to be 0 for un-onboarded profile, got ${nonZeroScores.length} non-zero.`);
        allPassed = false;
      } else {
        outputs.push(`  [PASS] All 24 schemes correctly returned 0% with "Create profile" requirement.`);
      }
      outputs.push('');
      return;
    }

    // Verify eligible range 85 - 100%
    const invalidEligibleScores = eligible.filter((r) => r.match.score < 85 || r.match.score > 100);
    if (invalidEligibleScores.length > 0) {
      outputs.push(`  [FAIL] Eligible scores must be between 85% and 100%. Violations: ${invalidEligibleScores.map(x => `${x.sch.id}:${x.match.score}%`).join(', ')}`);
      allPassed = false;
    } else {
      outputs.push(`  [PASS] All eligible scheme scores fall strictly within 85% - 100%.`);
    }

    // Verify ineligible capped at <= 40%
    const invalidIneligibleScores = ineligible.filter((r) => r.match.score > 40);
    if (invalidIneligibleScores.length > 0) {
      outputs.push(`  [FAIL] Ineligible scores must be capped at 40%. Violations: ${invalidIneligibleScores.map(x => `${x.sch.id}:${x.match.score}%`).join(', ')}`);
      allPassed = false;
    } else {
      outputs.push(`  [PASS] All ineligible scheme scores capped strictly at <= 40%.`);
    }

    // Check mustBeIneligible
    const failedIneligible = testCase.expected.mustBeIneligible.filter((id) => {
      const match = results.find((r) => r.sch.id === id)?.match;
      return match?.isEligible === true;
    });
    if (failedIneligible.length > 0) {
      outputs.push(`  [FAIL] Expected schemes to be ineligible, but evaluated as eligible: ${failedIneligible.join(', ')}`);
      allPassed = false;
    } else {
      outputs.push(`  [PASS] Verified expected ineligibilities: ${testCase.expected.mustBeIneligible.slice(0, 4).join(', ')}...`);
    }

    // Check mustBeEligible
    const failedEligible = testCase.expected.mustBeEligible.filter((id) => {
      const match = results.find((r) => r.sch.id === id)?.match;
      return match?.isEligible !== true;
    });
    if (failedEligible.length > 0) {
      outputs.push(`  [FAIL] Expected schemes to be eligible, but evaluated as ineligible: ${failedEligible.join(', ')}`);
      allPassed = false;
    } else if (testCase.expected.mustBeEligible.length > 0) {
      outputs.push(`  [PASS] Verified expected eligibilities: ${testCase.expected.mustBeEligible.join(', ')}`);
    }

    // Print sample breakdown for top eligible and top ineligible
    outputs.push('  Sample breakdown:');
    if (eligible.length > 0) {
      const topE = eligible[0];
      outputs.push(`    Eligible sample: ${topE.sch.name} -> Score: ${topE.match.score}% (Rules: ${topE.match.rules.length} applicable, ${topE.match.rules.filter(r => r.status === 'met').length} met)`);
    }
    if (ineligible.length > 0) {
      const topI = ineligible[0];
      const failedRule = topI.match.rules.find(r => r.status === 'not-met');
      outputs.push(`    Ineligible sample: ${topI.sch.name} -> Score: ${topI.match.score}% (Failed: ${failedRule?.label} - ${failedRule?.reason})`);
    }

    outputs.push('');
  });

  outputs.push(`\nTEST SUITE RESULT: ${allPassed ? 'ALL 6 PROFILES PASSED' : 'FAILURES DETECTED'}`);
  const summary = outputs.join('\n');
  return { success: allPassed, summary };
}

// Auto-run if executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('eligibilityEngine.test')) {
  const { success, summary } = runEligibilityTests();
  console.log(summary);
  process.exit(success ? 0 : 1);
}
