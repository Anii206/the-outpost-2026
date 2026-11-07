import type { Scholarship } from '../types';

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-01',
    name: 'Generation Google STEM Fellowship',
    provider: 'Google LLC & Student Opportunity Hub',
    amount: 10000,
    amountFormatted: '$10,000',
    level: 'Undergraduate',
    category: 'Women in Tech',
    country: 'United States',
    deadline: '2026-11-28',
    featured: true,
    tags: ['Tech', 'Diversity', 'Computer Science'],
    websiteUrl: 'https://buildyourfuture.withgoogle.com',
    description: 'Designed to help aspiring students in computer science and technology excel and become active leaders in the computing industry.',
    eligibilityRules: {
      minGpa: 3.5,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['Women in Tech', 'STEM', 'Underrepresented Minorities'],
      citizenshipRequirement: 'US, Canada, or DACA Recipient',
      targetStates: ['All'],
      descriptions: [
        'Must be currently enrolled as a full-time undergraduate student in CS or related technical degree',
        'Demonstrate exemplary leadership and passion for supporting women in computing',
        'Maintain a cumulative GPA of 3.5 or higher on a 4.0 scale'
      ]
    },
    documentsRequired: [
      'Resume / Curriculum Vitae',
      'Official or Unofficial University Transcripts',
      'Two Short Technical Essays (500 words each)',
      'Letter of Academic Recommendation'
    ],
    applicationSteps: [
      { step: 1, title: 'Profile & Demographic Information', description: 'Complete personal details and verify enrollment status.' },
      { step: 2, title: 'Academic History & Transcripts', description: 'Upload latest semester transcripts and GPA verification.' },
      { step: 3, title: 'Essay Responses', description: 'Address the prompt on advancing diversity and equality in technology.' },
      { step: 4, title: 'Technical Portfolio Review', description: 'Provide GitHub or link to major engineering projects.' }
    ]
  },
  {
    id: 'sch-02',
    name: 'Jack Kent Cooke College Scholarship Program',
    provider: 'Jack Kent Cooke Foundation',
    amount: 55000,
    amountFormatted: '$55,000 / year',
    level: 'High School Senior',
    category: 'Need-Based',
    country: 'United States',
    deadline: '2026-12-05',
    featured: true,
    tags: ['High School', 'Prestigious', 'Full Ride Support'],
    websiteUrl: 'https://www.jkcf.org',
    description: 'An exceptional scholarship providing up to $55,000 per year, comprehensive educational advising, and funding for study abroad and internships.',
    eligibilityRules: {
      minGpa: 3.75,
      allowedLevels: ['High School Senior'],
      eligibleCategories: ['Need-Based', 'First-Generation', 'Merit-Based'],
      maxFamilyIncome: 95000,
      descriptions: [
        'Graduating high school senior intending to enroll in an accredited four-year college',
        'Minimum unweighted GPA of 3.75',
        'Demonstrated unmet financial need (annual family income up to $95,000)'
      ]
    },
    documentsRequired: [
      'High School Transcript & School Profile',
      'Two Academic Teacher Recommendations',
      'School Counselor Recommendation',
      'FAFSA / CSS Profile / 1040 Tax Returns'
    ],
    applicationSteps: [
      { step: 1, title: 'Eligibility Screening', description: 'Self-verify financial criteria and academic standing.' },
      { step: 2, title: 'Common App Integration', description: 'Link your Common Application materials.' },
      { step: 3, title: 'Financial Documentation', description: 'Submit household income tax transcripts.' },
      { step: 4, title: 'Finalist Interview', description: 'Participate in a virtual selection committee panel.' }
    ]
  },
  {
    id: 'sch-03',
    name: 'Adobe Design Circle Global Excellence Grant',
    provider: 'Adobe Foundation',
    amount: 25000,
    amountFormatted: '$25,000 / year',
    level: 'Undergraduate',
    category: 'Arts & Humanities',
    country: 'Global',
    deadline: '2026-12-15',
    featured: true,
    tags: ['Design', 'UI/UX', 'Digital Media', 'Creative'],
    websiteUrl: 'https://www.adobe.com/careers/university.html',
    description: 'Empowering young creators who want to enter product design, digital experience, or creative technology to solve community and social challenges.',
    eligibilityRules: {
      minGpa: 3.0,
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['Arts & Humanities', 'First-Generation'],
      descriptions: [
        'Enrolled in graphic design, interactive media, human-computer interaction, or digital arts',
        'Submitting a curated portfolio of at least 3 original projects',
        'Demonstrating desire to impact local community through creative design'
      ]
    },
    documentsRequired: [
      'Digital Design Portfolio (Behance / Figma / Personal site)',
      'Statement of Purpose (Video or 600-word written essay)',
      '1 Letter of Recommendation from Design Mentor or Professor',
      'Proof of Enrollment'
    ],
    applicationSteps: [
      { step: 1, title: 'Portfolio Submission', description: 'Curate your 3 best design case studies.' },
      { step: 2, title: 'Social Impact Statement', description: 'Describe how design thinking solves real community barriers.' },
      { step: 3, title: 'Faculty Endorsement', description: 'Request reference letter from an instructor.' }
    ]
  },
  {
    id: 'sch-04',
    name: 'Knight-Hennessy Scholars Program',
    provider: 'Stanford University',
    amount: 90000,
    amountFormatted: '$90,000 / year',
    level: 'Postgraduate',
    category: 'Merit-Based',
    country: 'United States',
    deadline: '2026-12-20',
    featured: true,
    tags: ['Graduate', 'Stanford', 'Full Funding', 'Leadership'],
    websiteUrl: 'https://knight-hennessy.stanford.edu',
    description: 'Cultivates a multidisciplinary, multicultural community of graduate scholars from around the world to prepare them for visionary leadership.',
    eligibilityRules: {
      allowedLevels: ['Postgraduate', 'PhD / Doctorate'],
      eligibleCategories: ['Merit-Based', 'Business & Leadership', 'STEM'],
      descriptions: [
        'Applying to any full-time Stanford graduate degree program (JD, MA, MBA, MD, MS, PhD)',
        'Received first undergraduate degree within the last seven years',
        'Independent thought, purposeful leadership, and a civic mindset'
      ]
    },
    documentsRequired: [
      'Online Knight-Hennessy Application with Stanford Graduate Application',
      'Resume (1 page)',
      'Two Recommendation Letters',
      'Three Essay Questions on Personal Values and Impact'
    ],
    applicationSteps: [
      { step: 1, title: 'Dual Program Application', description: 'Apply separately to your Stanford graduate degree program.' },
      { step: 2, title: 'Leadership Narrative', description: 'Complete the specific Knight-Hennessy prompts and video reflection.' },
      { step: 3, title: 'Immersion Weekend', description: 'Finalists attend an on-campus evaluation weekend at Stanford.' }
    ]
  },
  {
    id: 'sch-05',
    name: 'SWE Society of Women Engineers Future Leaders Grant',
    provider: 'Society of Women Engineers',
    amount: 15000,
    amountFormatted: '$15,000',
    level: 'Undergraduate',
    category: 'Women in Tech',
    country: 'United States',
    deadline: '2026-11-20',
    tags: ['Engineering', 'Women in STEM', 'Robotics'],
    websiteUrl: 'https://swe.org/scholarships',
    description: 'Supporting female students preparing for careers in engineering, engineering technology, and computer science with ABET-accredited programs.',
    eligibilityRules: {
      minGpa: 3.2,
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['Women in Tech', 'STEM'],
      descriptions: [
        'Identify as female or non-binary pursuing engineering',
        'Enrolled in an ABET-accredited baccalaureate or graduate program',
        'Active member of student engineering organization is a plus'
      ]
    },
    documentsRequired: [
      'Academic Transcript showing STEM coursework',
      'Resume highlighting maker projects or research',
      'Faculty Recommendation',
      'Personal Statement on Engineering Aspirations'
    ],
    applicationSteps: [
      { step: 1, title: 'Central SWE Profile', description: 'One application matches you to over 70 partner corporate awards.' },
      { step: 2, title: 'Transcript Verification', description: 'Ensure ABET major accreditation code is verified.' },
      { step: 3, title: 'Review & Submit', description: 'Submit before midnight on the deadline.' }
    ]
  },
  {
    id: 'sch-06',
    name: 'Dell Scholars College Completion Award',
    provider: 'Michael & Susan Dell Foundation',
    amount: 20000,
    amountFormatted: '$20,000 + Laptop',
    level: 'High School Senior',
    category: 'First-Generation',
    country: 'United States',
    deadline: '2026-12-01',
    tags: ['First-Gen', 'Tech Bundle', 'Mentorship'],
    websiteUrl: 'https://www.dellscholars.org',
    description: 'Provides $20,000 scholarship, a brand new Dell laptop with 4-year warranty, textbook credits, and intensive academic coaching.',
    eligibilityRules: {
      minGpa: 2.4,
      allowedLevels: ['High School Senior', 'Undergraduate'],
      eligibleCategories: ['First-Generation', 'Need-Based'],
      descriptions: [
        'Participate in an approved college readiness program (AVID, Upward Bound, GEAR UP, etc.) in grades 11 and 12',
        'Pell Grant eligible based on family financial information',
        'Grit, ambition, and determination to complete a bachelor degree'
      ]
    },
    documentsRequired: [
      'High School Transcript',
      'College Readiness Program Verification',
      'FAFSA Student Aid Report (SAR)',
      'One Counselor or Program Coordinator Reference'
    ],
    applicationSteps: [
      { step: 1, title: 'Initial Questionnaire', description: 'Confirm college readiness program affiliation.' },
      { step: 2, title: 'Semifinalist Phase', description: 'Submit SAR report and written life-challenges essay.' },
      { step: 3, title: 'Coaching Intake', description: 'Complete onboarding with Dell Scholar support specialists.' }
    ]
  },
  {
    id: 'sch-07',
    name: 'Gates Millennium Leadership Scholars',
    provider: 'Bill & Melinda Gates Foundation',
    amount: 80000,
    amountFormatted: 'Full Unmet Need',
    level: 'High School Senior',
    category: 'Underrepresented Minorities',
    country: 'United States',
    deadline: '2027-01-15',
    featured: true,
    tags: ['Full Need', 'Top Tier', 'Leadership'],
    websiteUrl: 'https://www.thegatesscholarship.org',
    description: 'Covers the full cost of attendance not already covered by other financial aid and the expected family contribution for exceptional minority leaders.',
    eligibilityRules: {
      minGpa: 3.3,
      allowedLevels: ['High School Senior'],
      eligibleCategories: ['Underrepresented Minorities', 'Need-Based'],
      maxFamilyIncome: 65000,
      descriptions: [
        'High school senior of African American, American Indian/Alaska Native, Asian & Pacific Islander, or Hispanic American heritage',
        'Pell-eligible student with exemplary academic achievement',
        'Demonstrated leadership qualities through extracurricular or service activities'
      ]
    },
    documentsRequired: [
      'Official Transcript & Counselor Assessment',
      'FAFSA Submission Confirmation & Financial Award Letter',
      'Four Essays on Resilience and Vision',
      'Community Recommender Letter'
    ],
    applicationSteps: [
      { step: 1, title: 'Phase I Application', description: 'Basic student profile, questionnaire, and academic stats.' },
      { step: 2, title: 'Phase II Semifinalist', description: 'Essays, recommendation letters, and financial forms.' },
      { step: 3, title: 'Phase III Finalist Interview', description: 'Virtual panel interview with foundation reviewers.' }
    ]
  },
  {
    id: 'sch-08',
    name: 'Palantir Women in Technology Scholarship',
    provider: 'Palantir Technologies',
    amount: 10000,
    amountFormatted: '$10,000 + Virtual Dev Summit',
    level: 'Undergraduate',
    category: 'Women in Tech',
    country: 'Global',
    deadline: '2026-11-25',
    tags: ['Data Science', 'Software', 'Women in Tech'],
    websiteUrl: 'https://www.palantir.com/careers/students/scholarship',
    description: 'Celebrating women who are launching careers in software engineering, technical infrastructure, and machine learning systems.',
    eligibilityRules: {
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['Women in Tech', 'STEM'],
      descriptions: [
        'Undergraduate or Master’s student actively studying Computer Science, Software Engineering, or related technical field',
        'Identify as a woman',
        'Have not previously received the Palantir scholarship'
      ]
    },
    documentsRequired: [
      'Resume / CV with coding projects and internships',
      'Current Academic Transcript',
      'Two Short Written Essays on Complex Technical Problems'
    ],
    applicationSteps: [
      { step: 1, title: 'Application Form', description: 'Submit resume, transcripts, and essay responses.' },
      { step: 2, title: 'Technical Problem Challenge', description: 'Short coding assessment or system design breakdown.' },
      { step: 3, title: 'Virtual Palantir Summit', description: 'Attend an exclusive 2-day workshop with Palantir engineers.' }
    ]
  },
  {
    id: 'sch-09',
    name: 'Rhodes Scholarship at Oxford University',
    provider: 'The Rhodes Trust',
    amount: 75000,
    amountFormatted: 'Full Tuition + £19,000 Stipend',
    level: 'Postgraduate',
    category: 'Merit-Based',
    country: 'United Kingdom',
    deadline: '2026-12-10',
    tags: ['Oxford', 'Global Leaders', 'Prestige'],
    websiteUrl: 'https://www.rhodeshouse.ox.ac.uk',
    description: 'The world’s oldest graduate fellowship, bringing outstanding young leaders from around the world to study at Oxford University.',
    eligibilityRules: {
      minGpa: 3.8,
      allowedLevels: ['Postgraduate', 'PhD / Doctorate'],
      eligibleCategories: ['Merit-Based', 'Arts & Humanities', 'STEM'],
      descriptions: [
        'Completed or completing undergraduate degree with first-class honors or equivalent GPA 3.8+',
        'Ages 18 to 24 at time of application',
        'Demonstrated moral force of character and instincts to lead'
      ]
    },
    documentsRequired: [
      'University Institutional Endorsement Letter',
      'Academic Transcripts',
      'Personal Statement (1,000 words max)',
      'Five to Eight Letters of Recommendation'
    ],
    applicationSteps: [
      { step: 1, title: 'Institutional Nomination', description: 'Secure formal endorsement from university fellowship committee.' },
      { step: 2, title: 'National District Review', description: 'Regional committee assesses dossiers and invites finalists.' },
      { step: 3, title: 'Selection Weekend Dinner & Interview', description: 'In-person multi-stage interview panel.' }
    ]
  },
  {
    id: 'sch-10',
    name: 'Tata Trust Global Scholars Endowment',
    provider: 'Tata Trusts & Higher Education Bureau',
    amount: 18000,
    amountFormatted: '$18,000 / year',
    level: 'Postgraduate',
    category: 'Need-Based',
    country: 'India',
    deadline: '2026-12-30',
    tags: ['International', 'Research', 'Community'],
    websiteUrl: 'https://www.tatatrusts.org',
    description: 'Assisting promising Indian students pursuing master’s and doctoral degrees abroad or at premier domestic institutions in science, medicine, and social impact.',
    eligibilityRules: {
      minGpa: 3.4,
      allowedLevels: ['Postgraduate', 'PhD / Doctorate'],
      eligibleCategories: ['Need-Based', 'STEM', 'Merit-Based'],
      maxFamilyIncome: 45000,
      descriptions: [
        'Graduated from an accredited Indian university with distinction',
        'Confirmed admission offer from an internationally ranked university',
        'Family income demonstrating loan or financial grant requirement'
      ]
    },
    documentsRequired: [
      'Admission Letter with fee schedule',
      'GRE / TOEFL / IELTS score cards',
      'Certified Statement of Assets & Liabilities',
      'Two Academic Recommendations'
    ],
    applicationSteps: [
      { step: 1, title: 'Online Portal Registration', description: 'Register with academic credentials and university acceptance.' },
      { step: 2, title: 'Financial Needs Assessment', description: 'Verify cost of living and tuition gap calculation.' },
      { step: 3, title: 'Subject Matter Interview', description: 'Interview with academic subject expert committee.' }
    ]
  },
  {
    id: 'sch-11',
    name: 'First-Gen Trailblazers Fellowship',
    provider: 'National First-Generation College Coalition',
    amount: 12000,
    amountFormatted: '$12,000',
    level: 'Undergraduate',
    category: 'First-Generation',
    country: 'United States',
    deadline: '2026-11-22',
    tags: ['First-Gen', 'Community Action', 'Mentorship'],
    websiteUrl: 'https://firstgenstudents.org',
    description: 'Dedicated to undergraduates whose parents did not complete a 4-year college degree, offering cash support and peer career mentorship.',
    eligibilityRules: {
      minGpa: 2.8,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['First-Generation', 'Need-Based'],
      descriptions: [
        'Neither biological nor adoptive parent possesses a four-year bachelor’s degree',
        'Current full-time undergraduate enrolled in 1st, 2nd, or 3rd year',
        'Active commitment to mentoring high school students in their home community'
      ]
    },
    documentsRequired: [
      'Proof of First-Gen Status Self-Declaration',
      'College Transcript',
      'Personal Narrative: "Carrying the Torch"',
      'Community Service Log'
    ],
    applicationSteps: [
      { step: 1, title: 'Initial Bio & Questionnaire', description: 'Fill in familial education history.' },
      { step: 2, title: 'Story Submission', description: 'Submit written or video story on overcoming obstacles.' },
      { step: 3, title: 'Cohort Matching', description: 'Assigned to regional award cohort upon approval.' }
    ]
  },
  {
    id: 'sch-12',
    name: 'Rotary Peace Fellowship',
    provider: 'The Rotary Foundation',
    amount: 40000,
    amountFormatted: 'Full Tuition & Living Expenses',
    level: 'Postgraduate',
    category: 'Arts & Humanities',
    country: 'Global',
    deadline: '2027-02-15',
    tags: ['Conflict Resolution', 'Diplomacy', 'Global Fellowship'],
    websiteUrl: 'https://www.rotary.org/peace-fellowships',
    description: 'Fully funded academic fellowships for master’s degree study in peace and development studies at world-class partner universities.',
    eligibilityRules: {
      allowedLevels: ['Postgraduate'],
      eligibleCategories: ['Arts & Humanities', 'Business & Leadership'],
      descriptions: [
        'Proficiency in English and strong academic background',
        'At least three years of full-time relevant work experience in peace or development fields',
        'Clear leadership potential and commitment to global community service'
      ]
    },
    documentsRequired: [
      'Comprehensive Curriculum Vitae',
      'Two Professional References and One Academic Reference',
      'Social Impact Essays',
      'Rotary District Endorsement'
    ],
    applicationSteps: [
      { step: 1, title: 'District Club Connection', description: 'Contact your local Rotary club for informal introduction.' },
      { step: 2, title: 'Formal Application Submission', description: 'Submit through the international Rotary portal.' },
      { step: 3, title: 'University Placement Match', description: 'Placement confirmed at one of the seven Rotary Peace Centers.' }
    ]
  },
  {
    id: 'sch-13',
    name: 'Microsoft Quantum & AI Pioneers Scholarship',
    provider: 'Microsoft Philanthropies',
    amount: 15000,
    amountFormatted: '$15,000 + Azure Credits',
    level: 'PhD / Doctorate',
    category: 'STEM',
    country: 'United States',
    deadline: '2026-12-18',
    tags: ['AI', 'Quantum', 'Doctoral Research'],
    websiteUrl: 'https://www.microsoft.com/research/academic-programs',
    description: 'Supporting exceptional PhD researchers advancing artificial intelligence, foundation models, quantum computing, and ethical computing.',
    eligibilityRules: {
      minGpa: 3.6,
      allowedLevels: ['PhD / Doctorate', 'Postgraduate'],
      eligibleCategories: ['STEM'],
      descriptions: [
        'Currently pursuing a PhD in CS, Electrical Engineering, Mathematics, or Physics',
        'Published at least one peer-reviewed paper in a recognized international conference',
        'Proposed research aligned with responsible AI or quantum algorithms'
      ]
    },
    documentsRequired: [
      'PhD Research Proposal (3 pages max)',
      'List of Publications and Google Scholar profile',
      'Letter from Thesis Advisor',
      'Curriculum Vitae'
    ],
    applicationSteps: [
      { step: 1, title: 'Research Abstract Submission', description: 'Upload research overview and target thesis goals.' },
      { step: 2, title: 'Technical Peer Review', description: 'Microsoft Research committee evaluates scientific novelty.' },
      { step: 3, title: 'Grant Allocation & Mentorship', description: 'Awards announced and Azure computing credits provisioned.' }
    ]
  },
  {
    id: 'sch-14',
    name: 'Horatio Alger National Career & Business Scholarship',
    provider: 'Horatio Alger Association',
    amount: 25000,
    amountFormatted: '$25,000',
    level: 'High School Senior',
    category: 'Business & Leadership',
    country: 'United States',
    deadline: '2026-11-18',
    tags: ['Entrepreneurship', 'Resilience', 'Business'],
    websiteUrl: 'https://scholars.horatioalger.org',
    description: 'Honoring students who have exhibited integrity and perseverance in overcoming great adversity while pursuing a bachelor’s degree in business or entrepreneurship.',
    eligibilityRules: {
      minGpa: 2.5,
      allowedLevels: ['High School Senior'],
      eligibleCategories: ['Business & Leadership', 'Need-Based', 'First-Generation'],
      maxFamilyIncome: 65000,
      descriptions: [
        'Demonstrated critical financial need ($65,000 or lower adjusted gross family income)',
        'Involvement in co-curricular and community activities',
        'Commitment to pursue a degree at an accredited nonprofit institution'
      ]
    },
    documentsRequired: [
      'Online Certification Form from Counselor',
      'High School Transcript',
      'Federal Tax Return / IRS Verification',
      'Personal Adversity and Leadership Statement'
    ],
    applicationSteps: [
      { step: 1, title: 'Student Portal Registration', description: 'Basic eligibility self-check.' },
      { step: 2, title: 'Counselor Verification', description: 'Counselor verifies GPA and disciplinary standing.' },
      { step: 3, title: 'National Review Board Selection', description: 'Awardees notified and invited to the Washington DC Forum.' }
    ]
  },
  {
    id: 'sch-15',
    name: 'Goldwater Excellence in Science & Mathematics Grant',
    provider: 'Barry Goldwater Scholarship and Excellence in Education Foundation',
    amount: 7500,
    amountFormatted: '$7,500 / year',
    level: 'Undergraduate',
    category: 'STEM',
    country: 'United States',
    deadline: '2027-01-25',
    tags: ['Natural Sciences', 'Research', 'Pre-Doctoral'],
    websiteUrl: 'https://goldwaterscholarship.gov',
    description: 'The preeminent undergraduate award of its type in mathematics, the natural sciences, and engineering in the United States.',
    eligibilityRules: {
      minGpa: 3.7,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['STEM', 'Merit-Based'],
      descriptions: [
        'Current full-time sophomore or junior pursuing research career in STEM',
        'Intend to pursue a research-focused Ph.D. or M.D./Ph.D.',
        'Nominated by college’s official Goldwater Campus Representative'
      ]
    },
    documentsRequired: [
      'Campus Representative Endorsement',
      '3-page Original Research Essay',
      'Complete College Transcripts',
      'Three Letters of Recommendation from STEM Research Mentors'
    ],
    applicationSteps: [
      { step: 1, title: 'Internal Campus Pre-Application', description: 'Compete for one of four college nomination slots.' },
      { step: 2, title: 'Official National Submission', description: 'Complete research essay and mentor recommendations.' },
      { step: 3, title: 'Trustees Final Selection', description: 'National panel ranks applicants.' }
    ]
  },
  {
    id: 'sch-16',
    name: 'Out To Innovate LGBTQ+ STEM Leadership Scholarship',
    provider: 'National Organization of Gay and Lesbian Scientists and Technical Professionals',
    amount: 5000,
    amountFormatted: '$5,000',
    level: 'All Levels',
    category: 'Underrepresented Minorities',
    country: 'United States',
    deadline: '2026-12-08',
    tags: ['LGBTQ+', 'Inclusion', 'STEM Careers'],
    websiteUrl: 'https://noglstp.org',
    description: 'Providing support and visibility for LGBTQ+ undergraduate and graduate students pursuing science, technology, engineering, and mathematics degrees.',
    eligibilityRules: {
      minGpa: 3.0,
      allowedLevels: ['Undergraduate', 'Postgraduate', 'PhD / Doctorate'],
      eligibleCategories: ['Underrepresented Minorities', 'STEM'],
      descriptions: [
        'Openly identify as a member of the LGBTQ+ community',
        'Major in an accredited STEM or STEM-education field',
        'Demonstrated active support for LGBTQ+ inclusion and student organizing'
      ]
    },
    documentsRequired: [
      'Resume demonstrating academic and community leadership',
      'Transcripts from current institution',
      'Personal Essay on diversity in scientific exploration',
      'Two Letters of Recommendation'
    ],
    applicationSteps: [
      { step: 1, title: 'Fill Identity & Academic Background', description: 'Detail course of study and community work.' },
      { step: 2, title: 'Submit Essays', description: 'Describe your vision for advancing queer voices in scientific fields.' },
      { step: 3, title: 'Committee Evaluation', description: 'Panel of industry engineers and researchers reviews applications.' }
    ]
  },
  {
    id: 'sch-17',
    name: 'Davis-Putter Social Justice Activist Grant',
    provider: 'Davis-Putter Scholarship Fund',
    amount: 15000,
    amountFormatted: 'Up to $15,000 / year',
    level: 'Undergraduate',
    category: 'Arts & Humanities',
    country: 'United States',
    deadline: '2027-02-01',
    tags: ['Social Justice', 'Civil Rights', 'Community Organizing'],
    websiteUrl: 'https://davisputter.org',
    description: 'Grants for students actively working for peace, economic justice, human rights, and environmental protection within their communities.',
    eligibilityRules: {
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['Arts & Humanities', 'Need-Based'],
      descriptions: [
        'Demonstrated active involvement in grassroots political and social movements',
        'Enrolled in trade school, college, or university degree programs',
        'Demonstrated financial need'
      ]
    },
    documentsRequired: [
      'Official or Unofficial Transcripts',
      'Two Letters from Movement Leaders or Faculty',
      'Financial Statement / 1040s',
      'Narrative of Organizing and Activism Work'
    ],
    applicationSteps: [
      { step: 1, title: 'Movement Narrative Submission', description: 'Describe campaigns or community efforts you have led.' },
      { step: 2, title: 'Reference Letters Verification', description: 'Community organizers endorse your active commitment.' },
      { step: 3, title: 'Award Allocation', description: 'Funds disbursed directly toward tuition or living costs.' }
    ]
  },
  {
    id: 'sch-18',
    name: 'Davidson Fellows STEM Laureate Award',
    provider: 'Davidson Institute for Talent Development',
    amount: 50000,
    amountFormatted: '$50,000',
    level: 'High School Senior',
    category: 'STEM',
    country: 'United States',
    deadline: '2027-02-12',
    featured: true,
    tags: ['Prodigy', 'Independent Research', 'Fellowship'],
    websiteUrl: 'https://www.davidsongifted.org',
    description: 'Recognizes extraordinary young people under 18 who have completed a significant, university-level piece of work in Science, Tech, or Math.',
    eligibilityRules: {
      allowedLevels: ['High School Senior'],
      eligibleCategories: ['STEM', 'Merit-Based'],
      descriptions: [
        'Must be 18 or younger as of the application deadline',
        'Completed a significant work that has the potential to benefit society',
        'Work must be independently researched or completed with lab mentorship'
      ]
    },
    documentsRequired: [
      'Formal Research Paper / Project Portfolio',
      'Two Nominating Evaluations by Domain Experts',
      'Video Presentation explaining the work to general audience',
      'Official Transcripts and Test Scores'
    ],
    applicationSteps: [
      { step: 1, title: 'Category Selection & Project Overview', description: 'Select Science, Technology, or Mathematics track.' },
      { step: 2, title: 'Paper & Video Submission', description: 'Upload 20-30 page scientific paper and video demo.' },
      { step: 3, title: 'Specialist Panel Review', description: 'College professors review experimental rigor.' }
    ]
  },
  {
    id: 'sch-19',
    name: 'Schwarzman Scholars at Tsinghua University',
    provider: 'Schwarzman College & Blackstone Foundation',
    amount: 85000,
    amountFormatted: 'Full Tuition + Room & Board + $5,000 Stipend',
    level: 'Postgraduate',
    category: 'Business & Leadership',
    country: 'Global',
    deadline: '2026-12-28',
    tags: ['Global Affairs', 'China', 'Public Policy', 'Leadership'],
    websiteUrl: 'https://www.schwarzmanscholars.org',
    description: 'Designed to prepare the next generation of global leaders with a fully funded Master of Global Affairs degree at Tsinghua University in Beijing.',
    eligibilityRules: {
      minGpa: 3.5,
      allowedLevels: ['Postgraduate'],
      eligibleCategories: ['Business & Leadership', 'Arts & Humanities'],
      descriptions: [
        'Undergraduate degree from accredited institution completed prior to start',
        'Ages 18 to 28 as of enrollment year',
        'Exemplary leadership demonstrated in business, politics, or civil society'
      ]
    },
    documentsRequired: [
      'Complete Academic Transcripts',
      'Three Letters of Recommendation',
      'Resume (2 pages maximum)',
      'Leadership Essay (750 words) and Statement of Purpose (500 words)'
    ],
    applicationSteps: [
      { step: 1, title: 'Comprehensive Application', description: 'Detail leadership milestones and global challenges vision.' },
      { step: 2, title: 'Video Introduction', description: '1-minute self-recorded video response.' },
      { step: 3, title: 'Global Interview Panels', description: 'Finalist interviews in New York, London, Bangkok, or Beijing.' }
    ]
  },
  {
    id: 'sch-20',
    name: 'Great Minds in STEM California & Texas Initiative',
    provider: 'Great Minds in STEM (GMiS)',
    amount: 10000,
    amountFormatted: '$10,000',
    level: 'Undergraduate',
    category: 'Underrepresented Minorities',
    country: 'United States',
    deadline: '2026-11-30',
    tags: ['Hispanic', 'Engineering', 'State Target'],
    websiteUrl: 'https://greatmindsinstem.org',
    description: 'Dedicated to increasing STEM degree completion rates for Hispanic and underserved students attending institutions in California, Texas, and New Mexico.',
    eligibilityRules: {
      minGpa: 3.0,
      allowedLevels: ['Undergraduate', 'Postgraduate'],
      eligibleCategories: ['Underrepresented Minorities', 'STEM'],
      targetStates: ['California', 'Texas', 'New Mexico'],
      descriptions: [
        'Enrolled at an accredited university in CA, TX, or NM',
        'Pursuing an engineering, applied science, or mathematics degree',
        'Active leadership within local campus minority professional societies (SHPE, MAES, NSBE)'
      ]
    },
    documentsRequired: [
      'Cumulative Transcripts',
      'Personal Statement on Hispanic heritage in STEM',
      'Letter of Recommendation from STEM Faculty',
      'State Residency Documentation'
    ],
    applicationSteps: [
      { step: 1, title: 'Residency & Major Validation', description: 'Verify state institution matriculation.' },
      { step: 2, title: 'Faculty Endorsement', description: 'Upload faculty evaluation letter.' },
      { step: 3, title: 'GMiS National Conference Recognition', description: 'Scholars recognized at annual conference.' }
    ]
  },
  {
    id: 'sch-21',
    name: 'National Merit Corporate Honors Scholarship',
    provider: 'National Merit Scholarship Corporation',
    amount: 8000,
    amountFormatted: '$8,000',
    level: 'High School Senior',
    category: 'Merit-Based',
    country: 'United States',
    deadline: '2026-12-02',
    tags: ['PSAT', 'High School', 'Academic Excellence'],
    websiteUrl: 'https://www.nationalmerit.org',
    description: 'Recognizing high school seniors who attained top 1% scoring bracket on the PSAT/NMSQT test with high scholastic accomplishments.',
    eligibilityRules: {
      minGpa: 3.85,
      allowedLevels: ['High School Senior'],
      eligibleCategories: ['Merit-Based'],
      descriptions: [
        'Designated as a Semifinalist by the National Merit Scholarship Corporation',
        'Enrolled full time as a high school senior progressing toward graduation',
        'Endorsed and recommended by high school principal'
      ]
    },
    documentsRequired: [
      'High School Principal Endorsement Form',
      'SAT or ACT Confirming Score Report',
      'Official 4-Year Academic Transcript',
      'Semifinalist Essay'
    ],
    applicationSteps: [
      { step: 1, title: 'NMSC Online Application Access', description: 'Log in with school provided student credential.' },
      { step: 2, title: 'Essay & Activities Entry', description: 'Document high school extracurricular leadership.' },
      { step: 3, title: 'Finalist Notification', description: 'Certificate and scholarship check mailed.' }
    ]
  },
  {
    id: 'sch-22',
    name: 'BioHealth Future Innovators Fellowship',
    provider: 'Novartis & Global Health Academic Alliance',
    amount: 30000,
    amountFormatted: '$30,000 / year',
    level: 'PhD / Doctorate',
    category: 'STEM',
    country: 'Global',
    deadline: '2027-01-20',
    tags: ['Biomedical', 'Pharma', 'Genetics', 'Global Health'],
    websiteUrl: 'https://www.novartis.com/research/fellowships',
    description: 'Fostering disruptive doctoral discoveries in genomic medicine, rare disease therapeutics, oncology, and sustainable pharmaceutical discovery.',
    eligibilityRules: {
      minGpa: 3.65,
      allowedLevels: ['PhD / Doctorate'],
      eligibleCategories: ['STEM', 'Merit-Based'],
      descriptions: [
        'Enrolled in 2nd or 3rd year of doctoral program in Biochemistry, Immunology, or Bioengineering',
        'Commitment to open-access scientific publishing of baseline thesis discoveries',
        'Laboratory safety and ethical review protocol approved'
      ]
    },
    documentsRequired: [
      'Doctoral Thesis Abstract & Methodology (5 pages)',
      'Principal Investigator Recommendation',
      'Curriculum Vitae with all published abstracts',
      'IRB / Laboratory Animal Care certifications if applicable'
    ],
    applicationSteps: [
      { step: 1, title: 'Dossier Upload', description: 'Submit experimental strategy and hypothesis.' },
      { step: 2, title: 'Scientific Review Board Evaluation', description: 'Global health research panel review.' },
      { step: 3, title: 'Annual Lab Grant Disbursement', description: 'Disbursed to university research office.' }
    ]
  },
  {
    id: 'sch-23',
    name: 'Women in FinTech & Algorithmic Trading Award',
    provider: 'Jane Street Capital & Citadel Educational Trust',
    amount: 35000,
    amountFormatted: '$35,000 + Paid NYC Summer Internship',
    level: 'Undergraduate',
    category: 'Women in Tech',
    country: 'United States',
    deadline: '2026-11-26',
    featured: true,
    tags: ['FinTech', 'Quantitative', 'Math', 'Internship'],
    websiteUrl: 'https://www.janestreet.com/join-jane-street/programs-and-events',
    description: 'An elite grant and learning cohort created for women undergraduates in mathematics, physics, and computer science interested in quantitative finance.',
    eligibilityRules: {
      minGpa: 3.7,
      allowedLevels: ['Undergraduate'],
      eligibleCategories: ['Women in Tech', 'STEM', 'Business & Leadership'],
      descriptions: [
        'Identify as a woman enrolled in 2nd or 3rd year of undergraduate studies',
        'Majoring in Mathematics, Statistics, Computer Science, or Physics',
        'High proficiency in problem solving, algorithms, and probability theory'
      ]
    },
    documentsRequired: [
      'Complete College Transcripts',
      'Resume with competition math or coding experience',
      'Brief 1-page writeup on interest in market microstructure'
    ],
    applicationSteps: [
      { step: 1, title: 'Resume Screening', description: 'Evaluate academic course rigor in quantitative subjects.' },
      { step: 2, title: 'Math & Logic Online Assessment', description: '45-minute timed probability and algorithmic quiz.' },
      { step: 3, title: 'Virtual Interview Day', description: 'Two technical interviews with quant researchers.' }
    ]
  },
  {
    id: 'sch-24',
    name: 'Ambedkar Social Mobility Fellowship',
    provider: 'Global Dalit & Indigenous Student Foundation',
    amount: 14000,
    amountFormatted: '$14,000',
    level: 'All Levels',
    category: 'Underrepresented Minorities',
    country: 'India',
    deadline: '2027-01-10',
    tags: ['Social Justice', 'Inclusion', 'Affirmative Action'],
    websiteUrl: 'https://ambedkarfellowship.org',
    description: 'Promoting higher education access and social mobility for marginalized caste and tribal students pursuing law, humanities, and technology degrees.',
    eligibilityRules: {
      allowedLevels: ['Undergraduate', 'Postgraduate', 'PhD / Doctorate'],
      eligibleCategories: ['Underrepresented Minorities', 'Need-Based'],
      maxFamilyIncome: 35000,
      descriptions: [
        'Belonging to historically marginalized or indigenous communities',
        'Enrolled in a recognized degree program in India or abroad',
        'Passionate about grassroots community upliftment and constitutional rights'
      ]
    },
    documentsRequired: [
      'Valid Community / Category Certificate',
      'Annual Income Verification Certificate',
      'Previous Examination Marksheets',
      'Statement of Purpose on Empowering Marginalized Groups'
    ],
    applicationSteps: [
      { step: 1, title: 'Document Verification', description: 'Submit official government certificates for community and income.' },
      { step: 2, title: 'Essay & Life Experience Statement', description: 'Share personal story and intended societal contribution.' },
      { step: 3, title: 'Grant Committee Interview', description: 'Brief conversation with committee members.' }
    ]
  }
];

export const ALL_CATEGORIES = [
  'All Categories',
  'STEM',
  'Women in Tech',
  'Need-Based',
  'Merit-Based',
  'First-Generation',
  'Arts & Humanities',
  'Underrepresented Minorities',
  'Business & Leadership'
] as const;

export const ALL_LEVELS = [
  'All Levels',
  'High School Senior',
  'Undergraduate',
  'Postgraduate',
  'PhD / Doctorate'
] as const;
