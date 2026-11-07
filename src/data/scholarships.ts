import type { Scholarship, AcademicLevel, ScholarshipCategory, SocialCategory } from '../types';

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-01',
    name: 'AICTE Pragati Scholarship for Girls',
    provider: 'All India Council for Technical Education (Govt. of India)',
    amount: 50000,
    amountFormatted: '₹50,000 / year',
    level: 'Undergraduate',
    category: 'Girls in STEM',
    country: 'India',
    deadline: '2026-11-15',
    featured: true,
    tags: ['AICTE', 'Engineering', 'Girls Only', 'Govt Scheme'],
    websiteUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati',
    description: 'A dedicated government initiative to empower young women pursuing technical degree and diploma courses in AICTE-approved institutions across India.',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Undergraduate', 'Diploma / Polytechnic'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 800000,
      targetStates: ['All India'],
      gender: 'Female',
      descriptions: [
        'Female candidate admitted to 1st year of Degree/Diploma level technical course',
        'Annual family income must not exceed ₹8,00,000 from all sources',
        'Maximum two girl children per family eligible'
      ]
    },
    documentsRequired: [
      'Class 10 and 12 Board Marksheets',
      'Tuition Fee Receipt for Current Academic Year',
      'Income Certificate issued by Competent Authority (Tehsildar/SDM)',
      'Aadhaar Card linked with Bank Account',
      'AICTE College Admission Letter & Bonafide Certificate'
    ],
    applicationSteps: [
      { step: 1, title: 'National Scholarship Portal Registration', description: 'Create student OTR on NSP portal with Aadhaar authentication.' },
      { step: 2, title: 'Institute Verification', description: 'College nodal officer verifies admission and fee records online.' },
      { step: 3, title: 'State / AICTE Approval', description: 'Direct DBT transfer initiated to student’s Aadhaar-seeded bank account.' }
    ]
  },
  {
    id: 'sch-02',
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation (CSR)',
    amount: 200000,
    amountFormatted: 'Up to ₹2,00,000 total',
    level: 'Undergraduate',
    category: 'Corporate CSR',
    country: 'India',
    deadline: '2026-11-20',
    featured: true,
    tags: ['Reliance', 'Merit & Need', 'All Streams', 'Mentorship'],
    websiteUrl: 'https://www.scholarships.reliancefoundation.org',
    description: 'Selects 5,000 meritorious undergraduate students from all disciplines across India, providing financial support and a strong alumni mentorship network.',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 1500000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Resident Indian citizen enrolled in 1st year of any full-time undergraduate degree',
        'Passed Class 12 with minimum 60% aggregate marks',
        'Household income preferably under ₹2.5 Lakhs (up to ₹15 Lakhs eligible)'
      ]
    },
    documentsRequired: [
      'Class 12 Marksheet',
      'Current College ID Card & Bonafide Letter',
      'Family Income Proof (ITR / Ration Card / Income Certificate)',
      'Passport size photograph & Identity Proof'
    ],
    applicationSteps: [
      { step: 1, title: 'Online Application & Eligibility Quiz', description: 'Complete basic academic and income details.' },
      { step: 2, title: 'Aptitude Test', description: '60-minute online cognitive and general mental ability assessment.' },
      { step: 3, title: 'Merit-cum-Means Selection', description: 'Award letters issued based on test scores and income priority.' }
    ]
  },
  {
    id: 'sch-03',
    name: 'HDFC Bank Parivartan’s ECSS Programme',
    provider: 'HDFC Bank Parivartan Foundation',
    amount: 75000,
    amountFormatted: '₹75,000 / year',
    level: 'Undergraduate',
    category: 'Need-Based',
    country: 'India',
    deadline: '2026-11-12',
    featured: true,
    tags: ['HDFC', 'Crisis Support', 'Need-Based'],
    websiteUrl: 'https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility',
    description: 'Educational Crisis Scholarship Support (ECSS) designed for students facing personal or financial crises, ensuring zero dropouts due to inability to pay college fees.',
    eligibilityRules: {
      minPercentage: 55,
      allowedLevels: ['Class 11-12', 'Diploma / Polytechnic', 'Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 250000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Students currently studying in Class 11, 12, Diploma, UG, or PG courses',
        'Minimum 55% marks in previous academic year',
        'Family income less than or equal to ₹2,50,000 per annum'
      ]
    },
    documentsRequired: [
      'Previous Year Marksheet (minimum 55% marks)',
      'Admission Proof (College ID Card / Fee Receipt / Bonafide)',
      'Income Certificate (Salary slip / BPL card / Tehsildar certificate)',
      'Bank Account Passbook / Cancelled Cheque'
    ],
    applicationSteps: [
      { step: 1, title: 'Buddy4Study Application', description: 'Fill the structured Parivartan form online.' },
      { step: 2, title: 'Document & Need Verification', description: 'Reviewers verify financial distress and income.' },
      { step: 3, title: 'Fund Disbursement', description: 'Grant transferred directly to verified bank account.' }
    ]
  },
  {
    id: 'sch-04',
    name: 'Central Sector Scheme of Scholarship (NSP CSSS)',
    provider: 'Department of Higher Education (MoE, Govt. of India)',
    amount: 20000,
    amountFormatted: '₹20,000 / year (UG/PG)',
    level: 'Undergraduate',
    category: 'Merit-Based',
    country: 'India',
    deadline: '2026-11-30',
    featured: true,
    tags: ['NSP', 'Top 20th Percentile', 'MoE', 'Govt of India'],
    websiteUrl: 'https://scholarships.gov.in',
    description: 'Awarded to top 20th percentile board exam scorers to assist meritorious students from low-income families while pursuing higher studies.',
    eligibilityRules: {
      minPercentage: 80,
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 450000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Above 80th percentile of successful candidates in relevant stream in Class 12 board',
        'Enrolled in regular full-time degree courses (not correspondence or distance)',
        'Gross parental income should not exceed ₹4,50,000 per annum'
      ]
    },
    documentsRequired: [
      'Class 12 Board Exam Marksheet & Rank Certificate',
      'Parental Income Certificate',
      'Bonafide Certificate from University / College',
      'Aadhaar Number seeded with bank account'
    ],
    applicationSteps: [
      { step: 1, title: 'NSP Portal Submission', description: 'Apply under Ministry of Education CSSS scheme.' },
      { step: 2, title: 'School & College e-Verification', description: 'Institutions verify board percentile and admission.' },
      { step: 3, title: 'PFMS DBT Credit', description: 'Scholarship credited annually through PFMS portal.' }
    ]
  },
  {
    id: 'sch-05',
    name: 'Kotak Kanya Scholarship for Professional Studies',
    provider: 'Kotak Education Foundation',
    amount: 150000,
    amountFormatted: 'Up to ₹1,50,000 / year',
    level: 'Undergraduate',
    category: 'Girls in STEM',
    country: 'India',
    deadline: '2026-11-10',
    featured: true,
    tags: ['Kotak', 'Engineering & MBBS', 'Girls Only', 'Full Professional Support'],
    websiteUrl: 'https://kotakeducation.org',
    description: 'Empowering meritorious female students from economically weaker sections pursuing professional graduation courses in Engineering, MBBS, Architecture, and Law.',
    eligibilityRules: {
      minPercentage: 85,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 600000,
      targetStates: ['All India'],
      gender: 'Female',
      descriptions: [
        'Female student enrolled in 1st year of professional degree (Engineering, MBBS, Architecture, Design, Integrated LLB)',
        'Scored 85% or more in Class 12 board examinations',
        'Annual household income less than ₹6,00,000'
      ]
    },
    documentsRequired: [
      'Class 10 and 12 Board Marksheets (85%+ required)',
      'College Admission Letter with Fee Structure',
      'Income Certificate (Issued by Tehsildar or SDM) / ITR',
      'Statement of Purpose on career aspirations'
    ],
    applicationSteps: [
      { step: 1, title: 'Document Submission', description: 'Upload verified academic and income proofs.' },
      { step: 2, title: 'Telephonic Screening', description: 'Preliminary interview regarding financial background.' },
      { step: 3, title: 'Selection Panel Interview', description: 'Virtual interview with education foundation panel.' }
    ]
  },
  {
    id: 'sch-06',
    name: 'Tata Trusts Medical & Engineering Grant',
    provider: 'Tata Trusts Higher Education Department',
    amount: 120000,
    amountFormatted: '₹1,20,000 / year',
    level: 'Undergraduate',
    category: 'Need-Based',
    country: 'India',
    deadline: '2026-12-15',
    tags: ['Tata', 'Healthcare & Tech', 'Merit-cum-Means'],
    websiteUrl: 'https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants',
    description: 'Provides tuition support to underprivileged students pursuing professional degrees in Medicine, Pharmacy, Dentistry, and Engineering across accredited Indian colleges.',
    eligibilityRules: {
      minPercentage: 70,
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 500000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Enrolled in recognized undergraduate or postgraduate degree program in Engineering or Medicine',
        'Maintained minimum 70% or 7.5 CGPA in preceding academic exams',
        'Family income strictly below ₹5,00,000 per year'
      ]
    },
    documentsRequired: [
      'Attested copies of Marksheets for all previous semesters',
      'College Fee Receipt for Academic Year',
      'Employer certificate or Tehsildar Income proof of parents',
      'Caste certificate (if applicable)'
    ],
    applicationSteps: [
      { step: 1, title: 'Tata Trusts Portal Application', description: 'Register with academic transcripts and fee breakdown.' },
      { step: 2, title: 'Scrutiny by Trust Committee', description: 'Committee evaluates financial need and fee gap.' },
      { step: 3, title: 'Cheque / NEFT Release', description: 'Grant disbursed directly to institute or student.' }
    ]
  },
  {
    id: 'sch-07',
    name: 'MahaDBT Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulk Scheme',
    provider: 'Higher & Technical Education Dept (Govt. of Maharashtra)',
    amount: 100000,
    amountFormatted: '50% to 100% Fee Reimbursement',
    level: 'Undergraduate',
    category: 'State Government Scheme',
    country: 'India',
    deadline: '2026-11-25',
    featured: true,
    tags: ['Maharashtra', 'MahaDBT', 'EBC', 'Fee Waiver'],
    websiteUrl: 'https://mahadbt.maharashtra.gov.in',
    description: 'Maharashtra state government scheme offering 50% tuition and exam fee reimbursement to Economically Backward Class (EBC) students in professional courses.',
    eligibilityRules: {
      minPercentage: 50,
      allowedLevels: ['Diploma / Polytechnic', 'Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'EWS'],
      maxFamilyIncome: 800000,
      targetStates: ['Maharashtra'],
      gender: 'Any',
      descriptions: [
        'Domicile of Maharashtra state with valid certificate',
        'Admitted through CAP (Centralized Admission Process) round',
        'Annual family income up to ₹8,00,000'
      ]
    },
    documentsRequired: [
      'Maharashtra Domicile Certificate',
      'Tahshildar Income Certificate (Valid for current year)',
      'CAP Allotment Letter',
      'Previous Year Marksheet & Current College Fee Receipt'
    ],
    applicationSteps: [
      { step: 1, title: 'MahaDBT User Login', description: 'Authenticate using Aadhaar number and OTP.' },
      { step: 2, title: 'College Desk Approval', description: 'College scrutiny officer verifies student admission and CAP status.' },
      { step: 3, title: 'Department Disbursement', description: 'First installment credited directly into fee ledger.' }
    ]
  },
  {
    id: 'sch-08',
    name: 'Government of Karnataka Vidyasiri ePASS Scholarship',
    provider: 'Backward Classes Welfare Dept (Govt. of Karnataka)',
    amount: 15000,
    amountFormatted: '₹15,000 / year + Hosteller Allowance',
    level: 'Undergraduate',
    category: 'State Government Scheme',
    country: 'India',
    deadline: '2026-12-05',
    tags: ['Karnataka', 'ePASS', 'Hostel Support', 'OBC'],
    websiteUrl: 'https://karepass.cgg.gov.in',
    description: 'Food and accommodation scholarship assistance for post-matric students belonging to backward classes studying in Karnataka colleges.',
    eligibilityRules: {
      minPercentage: 50,
      allowedLevels: ['Class 11-12', 'Diploma / Polytechnic', 'Undergraduate', 'Postgraduate'],
      eligibleCategories: ['OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 250000,
      targetStates: ['Karnataka'],
      gender: 'Any',
      descriptions: [
        'Permanent resident of Karnataka state with minimum 75% attendance',
        'Belong to Category 1, 2A, 2B, 3A, or 3B',
        'Rural / non-local students residing in private accommodation or paying guest'
      ]
    },
    documentsRequired: [
      'Karnataka Domicile / Ration Card',
      'RD Number Caste and Income Certificate',
      'College Bonafide & Attendance Certificate',
      'Hostel / Accommodation Declaration'
    ],
    applicationSteps: [
      { step: 1, title: 'SSP / ePASS Portal Registration', description: 'Enter SATS and Aadhaar demographic details.' },
      { step: 2, title: 'Taluk Officer Scrutiny', description: 'Verification by district welfare inspector.' },
      { step: 3, title: 'DBT Payment', description: 'Monthly stipend credited via Karnataka DBT.' }
    ]
  },
  {
    id: 'sch-09',
    name: 'Post Matric Scholarship for SC/ST Students',
    provider: 'Ministry of Social Justice & Empowerment (Govt. of India)',
    amount: 60000,
    amountFormatted: 'Full Tuition Waiver + ₹13,500 Allowance',
    level: 'Undergraduate',
    category: 'SC/ST/OBC Welfare',
    country: 'India',
    deadline: '2026-11-28',
    featured: true,
    tags: ['Social Justice', 'Full Fee Waiver', 'SC/ST', 'NSP'],
    websiteUrl: 'https://socialjustice.gov.in',
    description: 'Comprehensive financial support covering full compulsory non-refundable fees, study tour charges, and maintenance allowances for SC/ST students.',
    eligibilityRules: {
      minPercentage: 45,
      allowedLevels: ['Class 11-12', 'Diploma / Polytechnic', 'Undergraduate', 'Postgraduate', 'PhD / Research'],
      eligibleCategories: ['SC', 'ST'],
      maxFamilyIncome: 250000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Belong to Scheduled Caste (SC) or Scheduled Tribe (ST)',
        'Pursuing recognized post-matriculation or post-secondary courses',
        'Total family income from all sources must not exceed ₹2,50,000 per annum'
      ]
    },
    documentsRequired: [
      'Caste Certificate issued by Revenue Authority',
      'Income Certificate',
      'Admission Fee Structure verified by College Principal',
      'Bank Account Passbook with Aadhaar Seeding'
    ],
    applicationSteps: [
      { step: 1, title: 'State / Central Portal Submission', description: 'Apply via state scholarship portal or NSP.' },
      { step: 2, title: 'College & Welfare Dept Approval', description: 'Fee receipts and caste validity checked.' },
      { step: 3, title: 'Full Tuition Reimbursement', description: 'Tuition paid to college and stipend credited to student.' }
    ]
  },
  {
    id: 'sch-10',
    name: 'Aditya Birla Capital Scholarship for College Students',
    provider: 'Aditya Birla Capital Foundation',
    amount: 60000,
    amountFormatted: 'Up to ₹60,000',
    level: 'Undergraduate',
    category: 'Corporate CSR',
    country: 'India',
    deadline: '2026-11-18',
    tags: ['Aditya Birla', 'General & Professional', 'CSR'],
    websiteUrl: 'https://www.adityabirlacapital.com',
    description: 'A CSR project aiming to provide financial aid to meritorious students from disadvantaged families to ensure uninterrupted graduation studies.',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 600000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Students enrolled in 1st, 2nd, or 3rd year of undergraduate courses (General or Professional)',
        'Scored at least 60% in Class 12 or previous academic year',
        'Annual family income less than ₹6,00,000'
      ]
    },
    documentsRequired: [
      'Marksheet of previous qualifying exam (Class 12 / previous semester)',
      'Government-issued ID (Aadhaar / Voter ID)',
      'Current Year Admission Proof (Fee Receipt / Admission Letter / ID card)',
      'Income Certificate issued by Tehsildar / Form 16 / ITR'
    ],
    applicationSteps: [
      { step: 1, title: 'Online Form & Profile', description: 'Upload transcripts and family income details.' },
      { step: 2, title: 'Document Verification', description: 'Checks on marks criteria and income validity.' },
      { step: 3, title: 'Scholarship Grant Allotment', description: 'Selected applicants receive direct grant credit.' }
    ]
  },
  {
    id: 'sch-11',
    name: 'Swami Vivekananda Merit-cum-Means (SVMCM) Scholarship',
    provider: 'Higher Education Department (Govt. of West Bengal)',
    amount: 60000,
    amountFormatted: '₹18,000 - ₹60,000 / year',
    level: 'Undergraduate',
    category: 'State Government Scheme',
    country: 'India',
    deadline: '2026-12-10',
    tags: ['West Bengal', 'SVMCM', 'Merit-cum-Means'],
    websiteUrl: 'https://svmcm.wbhed.gov.in',
    description: 'Premier West Bengal government scheme assisting meritorious and economically vulnerable students pursuing Higher Secondary, UG, and PG programs.',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Class 11-12', 'Diploma / Polytechnic', 'Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 250000,
      targetStates: ['West Bengal'],
      gender: 'Any',
      descriptions: [
        'Resident of West Bengal studying in an institution in West Bengal',
        'Scored at least 60% in Madhyamik (10th) or HS (12th) examinations',
        'Annual household income must be within ₹2,50,000'
      ]
    },
    documentsRequired: [
      'Madhyamik / HS Marksheet',
      'Income Certificate from BDO / SDO / Joint BDO',
      'First page of Bank Passbook',
      'College Admission Fee receipt'
    ],
    applicationSteps: [
      { step: 1, title: 'SVMCM Registration', description: 'Register with WB Board roll number.' },
      { step: 2, title: 'HOI Forwarding', description: 'Head of Institution verifies student records online.' },
      { step: 3, title: 'Treasury Disbursal', description: 'Direct disbursement into bank account.' }
    ]
  },
  {
    id: 'sch-12',
    name: 'ONGC Foundation Scholarship for OBC & EWS Students',
    provider: 'ONGC Foundation',
    amount: 48000,
    amountFormatted: '₹48,000 / year',
    level: 'Undergraduate',
    category: 'SC/ST/OBC Welfare',
    country: 'India',
    deadline: '2026-11-22',
    tags: ['ONGC', 'Engineering & MBBS', 'OBC', 'EWS', 'PSU'],
    websiteUrl: 'https://ongcscholar.org',
    description: 'Exclusive scholarship by India’s energy major for meritorious OBC and Economically Weaker Section students pursuing engineering, MBBS, or MBA.',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['OBC', 'EWS'],
      maxFamilyIncome: 200000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Enrolled in 1st year of Engineering / MBBS / MBA / Master in Geophysics/Geology',
        'Minimum 60% marks in Class 12 for Engineering/MBBS courses',
        'Total annual family income from all sources not exceeding ₹2,00,000'
      ]
    },
    documentsRequired: [
      'Class 12 Marksheet',
      'OBC Non-Creamy Layer / EWS Certificate in prescribed Central format',
      'Parental Income Certificate',
      'PAN Card & ECS mandate form from bank'
    ],
    applicationSteps: [
      { step: 1, title: 'ONGC Scholar Portal Entry', description: 'Submit personal, college, and caste credentials.' },
      { step: 2, title: 'Zonal Shortlisting', description: 'Applications evaluated zone-wise (North, South, East, West).' },
      { step: 3, title: 'Award Notification', description: 'Scholarship of ₹4,000 per month credited annually.' }
    ]
  },
  {
    id: 'sch-13',
    name: 'Prime Minister’s Scholarship Scheme (PMSS) for CAPF & AR',
    provider: 'Welfare and Rehabilitation Board (Ministry of Home Affairs)',
    amount: 36000,
    amountFormatted: '₹36,000 / yr (Girls) • ₹30,000 / yr (Boys)',
    level: 'Undergraduate',
    category: 'Merit-Based',
    country: 'India',
    deadline: '2026-11-14',
    tags: ['Defence', 'PMSS', 'CAPF', 'Armed Forces'],
    websiteUrl: 'https://www.warb-mha.gov.in',
    description: 'Encouraging higher technical and professional education for dependent wards and widows of Central Armed Police Forces (CRPF, BSF, CISF, ITBP, SSB).',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Wards and widows of deceased or retired personnel of CAPFs & Assam Rifles',
        'Minimum 60% marks in Minimum Educational Qualification (MEQ) i.e. 10+2 / Diploma',
        'Pursuing professional courses (Engineering, Medical, Dental, Veterinary, BBA, BCA, Pharmacy)'
      ]
    },
    documentsRequired: [
      'Serving Certificate or Discharge Book of parent',
      'Bonafide Certificate from College',
      'Marksheet of Class 12 / Diploma',
      'PPO copy in case of ex-servicemen'
    ],
    applicationSteps: [
      { step: 1, title: 'NSP Portal Submission', description: 'Select PMSS under Ministry of Home Affairs on NSP.' },
      { step: 2, title: 'WARB Verification', description: 'Force headquarters verifies service and casualty category.' },
      { step: 3, title: 'Monthly Scholarship Release', description: 'Credited directly to ward’s bank account.' }
    ]
  },
  {
    id: 'sch-14',
    name: 'L’Oréal India For Young Women in Science Scholarship',
    provider: 'L’Oréal India',
    amount: 250000,
    amountFormatted: '₹2,50,000 total',
    level: 'Undergraduate',
    category: 'Girls in STEM',
    country: 'India',
    deadline: '2026-12-08',
    featured: true,
    tags: ['Loreal', 'Girls in Science', 'Prestigious'],
    websiteUrl: 'https://www.loreal.com/en/india',
    description: 'Extending financial assistance to young women who want to pursue higher education in any scientific field (Pure Sciences, Applied Sciences, Medicine, Engineering).',
    eligibilityRules: {
      minPercentage: 85,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 600000,
      targetStates: ['All India'],
      gender: 'Female',
      descriptions: [
        'Passed Class 12 in Science stream (PCM / PCB / PCMB) with minimum 85% marks',
        'Currently enrolled in 1st year of bachelor’s degree in a science/tech field in India',
        'Annual family income not exceeding ₹6,00,000'
      ]
    },
    documentsRequired: [
      'Class 10 and Class 12 Marksheets',
      'Proof of College Admission (College ID / Admission letter)',
      'Government Income Certificate or Form 16',
      'SOP on scientific ambitions and motivation'
    ],
    applicationSteps: [
      { step: 1, title: 'Online Screening Form', description: 'Submit academic profile and essay response.' },
      { step: 2, title: 'Telephonic Round', description: 'Short telephone discussion with assessment team.' },
      { step: 3, title: 'Jury Interview', description: 'Final virtual interview with eminent scientists.' }
    ]
  },
  {
    id: 'sch-15',
    name: 'Santoor Women’s Scholarship',
    provider: 'Wipro Consumer Care & Wipro Cares',
    amount: 24000,
    amountFormatted: '₹24,000 / year',
    level: 'Undergraduate',
    category: 'Girls in STEM',
    country: 'India',
    deadline: '2026-11-19',
    tags: ['Wipro', 'Girls Only', 'South & Central India'],
    websiteUrl: 'https://www.santoorscholarships.com',
    description: 'Recurring annual support for disadvantaged young women from Andhra Pradesh, Telangana, Karnataka, and Chhattisgarh pursuing higher education.',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      targetStates: ['Andhra Pradesh', 'Telangana', 'Karnataka'],
      gender: 'Female',
      descriptions: [
        'Passed Class 10 from local government school',
        'Passed Class 12 from government junior college or school',
        'Enrolled in full-time graduate degree of minimum 3 years duration'
      ]
    },
    documentsRequired: [
      'Class 10 and 12 Marksheets showing government school attendance',
      'College ID card or Bonafide Certificate',
      'Aadhaar Card and Student Bank Passbook'
    ],
    applicationSteps: [
      { step: 1, title: 'Registration on Santoor Portal', description: 'Fill out student academic and school background.' },
      { step: 2, title: 'Physical / Virtual Verification', description: 'Confirm schooling criteria and enrollment.' },
      { step: 3, title: 'Annual Cheque Handover', description: '₹24,000 renewed each year till completion of graduation.' }
    ]
  },
  {
    id: 'sch-16',
    name: 'INSPIRE Scholarship for Higher Education (SHE)',
    provider: 'Department of Science and Technology (Govt. of India)',
    amount: 80000,
    amountFormatted: '₹80,000 / year',
    level: 'Undergraduate',
    category: 'Merit-Based',
    country: 'India',
    deadline: '2026-12-20',
    featured: true,
    tags: ['DST', 'Pure Sciences', 'Top 1% Board', 'Govt of India'],
    websiteUrl: 'https://online-inspire.gov.in',
    description: 'Flagship DST program attracting meritorious students to study Natural and Basic Sciences at the B.Sc., B.S., and Int. M.Sc. level with ₹60,000 scholarship + ₹20,000 mentorship project grant.',
    eligibilityRules: {
      minPercentage: 90,
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Top 1% in Class 12 Board examinations across India',
        'Enrolled in B.Sc. / B.S. / Int. M.Sc. in Physics, Chemistry, Mathematics, Biology, Statistics, etc.',
        'Or secured ranks in JEE Advanced / NEET within top 10,000 and choosing basic sciences'
      ]
    },
    documentsRequired: [
      'Class 12 Board Marksheet with Top 1% Advisory Note',
      'Endorsement Certificate signed by Head of College',
      'Aadhaar seeded SBI / Nationalized Bank details',
      'Annual Summer Research Project Report for renewal'
    ],
    applicationSteps: [
      { step: 1, title: 'INSPIRE Web Portal Entry', description: 'Register with board advisory note details.' },
      { step: 2, title: 'Science Advisory Committee Approval', description: 'Verification of recognized basic science subject.' },
      { step: 3, title: 'Direct Bank Transfer', description: '₹80,000 released annually via DBT mode.' }
    ]
  },
  {
    id: 'sch-17',
    name: 'Siemens Scholarship Program for Engineering Students',
    provider: 'Siemens India CSR',
    amount: 140000,
    amountFormatted: 'Full Tuition + Laptop + Allowance',
    level: 'Undergraduate',
    category: 'Corporate CSR',
    country: 'India',
    deadline: '2026-11-26',
    tags: ['Siemens', 'Engineering', 'Industry Mentorship', 'Laptop'],
    websiteUrl: 'https://www.siemens.com/in/en/company/sustainability/siemens-scholarship-program.html',
    description: 'Comprehensive 4-year financial and holistic development scholarship for 1st-year government engineering college students, including technical and soft skills training.',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 200000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        '1st year students of Government Engineering Colleges in Mechanical, Production, Electrical, Electronics, Instrumentation, IT, CS',
        'Minimum 60% in Class 10 and 50% in Class 12 (with minimum 60% in PCM)',
        'Annual family income not exceeding ₹2,00,000'
      ]
    },
    documentsRequired: [
      'Class 10 and 12 Marksheets',
      'JEE / State CET Scorecard & College Allotment letter',
      'Income Certificate issued by competent revenue officer',
      'College Fee Structure'
    ],
    applicationSteps: [
      { step: 1, title: 'Registration on Siemens Portal', description: 'Submit entrance ranks and income documents.' },
      { step: 2, title: 'Online Assessment & Background Check', description: 'Aptitude test and third-party household verification.' },
      { step: 3, title: 'Executive Interaction', description: 'Final interaction with Siemens leadership.' }
    ]
  },
  {
    id: 'sch-18',
    name: 'Uttar Pradesh Post-Matric Scholarship Scheme',
    provider: 'Social Welfare Department (Govt. of Uttar Pradesh)',
    amount: 50000,
    amountFormatted: 'Full Fee Reimbursement + Maintenance Allowance',
    level: 'Undergraduate',
    category: 'State Government Scheme',
    country: 'India',
    deadline: '2026-12-02',
    tags: ['UP Govt', 'Fee Reimbursement', 'State Scheme'],
    websiteUrl: 'https://scholarship.up.gov.in',
    description: 'State government initiative for UP domicile students enrolled in post-matric diploma, undergraduate, and postgraduate programs across public and private colleges.',
    eligibilityRules: {
      minPercentage: 50,
      allowedLevels: ['Class 11-12', 'Diploma / Polytechnic', 'Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 250000,
      targetStates: ['Uttar Pradesh'],
      gender: 'Any',
      descriptions: [
        'Permanent resident of Uttar Pradesh',
        'Family income under ₹2,00,000 (General/OBC) or ₹2,50,000 (SC/ST)',
        'Enrolled in course affiliated with state university or board'
      ]
    },
    documentsRequired: [
      'UP Domicile & Niwas Praman Patra',
      'Cast & Income Certificates verified through e-District',
      'Fee Receipt with Non-Refundable Fee component',
      'Aadhaar card authenticated with mobile OTP'
    ],
    applicationSteps: [
      { step: 1, title: 'UP Scholarship Portal Entry', description: 'Register with High School roll number.' },
      { step: 2, title: 'Institute Forwarding', description: 'College verifies attendance and fee records.' },
      { step: 3, title: 'District Welfare Scrutiny', description: 'District Social Welfare Officer approves fund release.' }
    ]
  },
  {
    id: 'sch-19',
    name: 'Sitaram Jindal Foundation Scholarship',
    provider: 'Sitaram Jindal Foundation',
    amount: 30000,
    amountFormatted: '₹2,500 / month (₹30,000/yr)',
    level: 'Undergraduate',
    category: 'Need-Based',
    country: 'India',
    deadline: '2026-12-25',
    tags: ['Jindal', 'Polytechnic & UG', 'Pan India'],
    websiteUrl: 'https://www.sitaramjindalfoundation.org',
    description: 'Charitable monthly scholarship supporting meritorious underprivileged students pursuing diploma, ITI, graduation, and post-graduation across India.',
    eligibilityRules: {
      minPercentage: 65,
      allowedLevels: ['Diploma / Polytechnic', 'Undergraduate', 'Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 400000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Boys must have 65% and girls must have 60% in previous exam (Karnataka/West Bengal 70%/65%)',
        'Gross family income within ₹4,00,000 for salaried or ₹2,50,000 for others',
        'Regular students of recognized colleges only'
      ]
    },
    documentsRequired: [
      'Class 12 / Degree Marksheet',
      'Income Certificate / BPL Card',
      'Bonafide Certificate signed by Principal',
      'Hostel certificate if staying in paying accommodation'
    ],
    applicationSteps: [
      { step: 1, title: 'Application Dossier Dispatch', description: 'Download and mail signed application form.' },
      { step: 2, title: 'Scrutiny at Bangalore HQ', description: 'Trust checks academic consistency and poverty level.' },
      { step: 3, title: 'Quarterly Demand Draft', description: 'Scholarship sent directly to student via account payee check.' }
    ]
  },
  {
    id: 'sch-20',
    name: 'Dr. APJ Abdul Kalam Healthcare Scholars Grant',
    provider: 'MIND Foundation & Indian Medical Aid',
    amount: 75000,
    amountFormatted: '₹75,000 / year',
    level: 'Undergraduate',
    category: 'Need-Based',
    country: 'India',
    deadline: '2026-11-17',
    tags: ['Medical', 'MBBS', 'NEET Qualified', 'Healthcare'],
    websiteUrl: 'https://kalamfoundation.org',
    description: 'Dedicated to helping financially constrained students pursuing MBBS, BDS, BAMS, and BHMS degrees in government and municipal medical colleges.',
    eligibilityRules: {
      minPercentage: 75,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxFamilyIncome: 350000,
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Valid NEET UG ranking and admission in government medical college',
        'Minimum 75% in PCB in Class 12 board',
        'Annual household income under ₹3,50,000'
      ]
    },
    documentsRequired: [
      'NEET Scorecard & Rank Letter',
      'Class 12 Marksheet',
      'Medical College Admission Slip & Hostel fee bill',
      'Income certificate issued by SDM'
    ],
    applicationSteps: [
      { step: 1, title: 'Online Registration', description: 'Submit NEET roll number and medical college allotment.' },
      { step: 2, title: 'Verification Call', description: 'Discussion with doctor mentors.' },
      { step: 3, title: 'Medical Book & Fee Grant', description: 'Stipend released directly for books, instruments, and fees.' }
    ]
  },
  {
    id: 'sch-21',
    name: 'Chevening Scholarship to Study in the UK',
    provider: 'Foreign, Commonwealth & Development Office (UK Govt)',
    amount: 4000000,
    amountFormatted: '₹40,00,000 (Full Tuition + UK Stipend)',
    level: 'Postgraduate',
    category: 'International Fellowship',
    country: 'United Kingdom',
    deadline: '2026-12-18',
    featured: true,
    tags: ['UK', 'Chevening', 'Masters', 'Global Fellowship'],
    websiteUrl: 'https://www.chevening.org/scholarship/india',
    description: 'The UK government’s global scholarship programme, offering future Indian leaders full financial support to study for any eligible master’s degree at any UK university.',
    eligibilityRules: {
      minPercentage: 60,
      allowedLevels: ['Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Citizen of India with an undergraduate degree equivalent to an upper second-class 2:1 honors',
        'At least two years of work experience (equivalent to 2,800 hours)',
        'Commitment to return to India for a minimum of two years post completion'
      ]
    },
    documentsRequired: [
      'Undergraduate Degree Transcripts and Certificate',
      'Three Eligible UK Master’s Course Choices',
      'Two Professional References',
      'Four 500-word Essays on Leadership, Networking, Career Plan, and UK Study'
    ],
    applicationSteps: [
      { step: 1, title: 'Online Application & Essays', description: 'Submit leadership narrative and university selections.' },
      { step: 2, title: 'Independent Reading Committee', description: 'Expert academics score essays.' },
      { step: 3, title: 'High Commission Interview', description: 'In-person interview at British High Commission, New Delhi.' }
    ]
  },
  {
    id: 'sch-22',
    name: 'Inlaks Shivdasani Foundation Overseas Scholarships',
    provider: 'Inlaks Shivdasani Foundation',
    amount: 8500000,
    amountFormatted: 'Up to ₹85,00,000 (US/Europe Masters)',
    level: 'Postgraduate',
    category: 'International Fellowship',
    country: 'Global',
    deadline: '2027-01-15',
    tags: ['Inlaks', 'Ivy League & Oxford', 'Arts & Sciences'],
    websiteUrl: 'https://www.inlaksfoundation.org',
    description: 'Supports exceptional young Indians with outstanding talent to pursue master’s, M.Phil., or doctorate degrees at premier institutions in America and Europe.',
    eligibilityRules: {
      minPercentage: 70,
      allowedLevels: ['Postgraduate', 'PhD / Research'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Indian citizen holding a first-class undergraduate degree from a recognized Indian university',
        'Under 30 years of age at the time of application',
        'Possess an unconditional admission offer from top ranked institution abroad'
      ]
    },
    documentsRequired: [
      'Unconditional Admission Letter from overseas university',
      'All Academic Transcripts and CV',
      'Evidence of extra-curricular or creative achievements',
      'Two Confidential Referee Reports'
    ],
    applicationSteps: [
      { step: 1, title: 'Portal Dossier Submission', description: 'Upload university acceptance and portfolio.' },
      { step: 2, title: 'Preliminary Selection Round', description: 'Virtual interview with subject-matter panelists.' },
      { step: 3, title: 'Trustee Final Interview', description: 'In-person meeting in Mumbai with foundation trustees.' }
    ]
  },
  {
    id: 'sch-23',
    name: 'Quad Fellowship for STEM Leaders',
    provider: 'Schmidt Futures & Governments of Quad Nations',
    amount: 4200000,
    amountFormatted: '₹42,00,000 ($50,000 Stipend + Travel)',
    level: 'PhD / Research',
    category: 'International Fellowship',
    country: 'Global',
    deadline: '2027-01-20',
    tags: ['Quad', 'STEM', 'US Graduate Study', 'Prestigious'],
    websiteUrl: 'https://www.quadfellowship.org',
    description: 'First-of-its-kind initiative designed to build ties among the next generation of scientists and technologists across Australia, India, Japan, and the United States.',
    eligibilityRules: {
      minPercentage: 75,
      allowedLevels: ['Postgraduate', 'PhD / Research'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Citizen or lawful permanent resident of India',
        'Enrolled or applying to STEM master’s or doctoral program in the United States',
        'Superior academic record and proven innovation track record'
      ]
    },
    documentsRequired: [
      'GRE / TOEFL / Academic Marksheets',
      'Three Letters of Recommendation from STEM Researchers',
      'Technical Research Proposal and Vision Statement'
    ],
    applicationSteps: [
      { step: 1, title: 'Online Application & Endorsements', description: 'Submit technical research abstract.' },
      { step: 2, title: 'Technical Review', description: 'Reviewed by top academic researchers.' },
      { step: 3, title: 'Virtual Panel Interview', description: 'Interview by multinational selection committee.' }
    ]
  },
  {
    id: 'sch-24',
    name: 'Commonwealth Master’s Scholarship to the UK',
    provider: 'Commonwealth Scholarship Commission (CSC UK)',
    amount: 3800000,
    amountFormatted: 'Full Tuition + £1,347/month living stipend',
    level: 'Postgraduate',
    category: 'International Fellowship',
    country: 'United Kingdom',
    deadline: '2026-12-12',
    tags: ['Commonwealth', 'Full Ride', 'UK Masters'],
    websiteUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships',
    description: 'Aimed at talented and motivated individuals whose development impact in India can be amplified through world-class British master’s training.',
    eligibilityRules: {
      minPercentage: 65,
      allowedLevels: ['Postgraduate'],
      eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      targetStates: ['All India'],
      gender: 'Any',
      descriptions: [
        'Indian citizen unable to afford study in the UK without scholarship',
        'Hold first degree of at least upper second class (2:1) honors standard (minimum 60-65%)',
        'Provide development impact statement aligning with UN Sustainable Development Goals'
      ]
    },
    documentsRequired: [
      'Proof of Indian Citizenship',
      'University Transcripts and Degree Certificate',
      'Detailed Development Impact Narrative',
      'Two Reference Letters'
    ],
    applicationSteps: [
      { step: 1, title: 'Ministry of Education (India) Nomination', description: 'Apply on Sakshat portal for national nomination.' },
      { step: 2, title: 'CSC Electronic Application System', description: 'Apply simultaneously through CSC UK portal.' },
      { step: 3, title: 'Final CSC UK Selection', description: 'Final award confirmation and visa documentation issued.' }
    ]
  }
];

export const ALL_CATEGORIES: ScholarshipCategory[] = [
  'All Categories',
  'Merit-Based',
  'Need-Based',
  'Girls in STEM',
  'SC/ST/OBC Welfare',
  'State Government Scheme',
  'Corporate CSR',
  'International Fellowship'
];

export const ALL_LEVELS: AcademicLevel[] = [
  'All Levels',
  'Class 11-12',
  'Diploma / Polytechnic',
  'Undergraduate',
  'Postgraduate',
  'PhD / Research'
];

export const INDIAN_STATES: string[] = [
  'All India',
  'Maharashtra',
  'Karnataka',
  'Uttar Pradesh',
  'West Bengal',
  'Tamil Nadu',
  'Delhi NCR',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Rajasthan',
  'Bihar',
  'Gujarat',
  'Madhya Pradesh'
];

export const SOCIAL_CATEGORIES: SocialCategory[] = [
  'General',
  'OBC',
  'SC',
  'ST',
  'EWS'
];
