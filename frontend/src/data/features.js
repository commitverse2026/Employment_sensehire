// All Day 1 feature card data
// Each entry drives one FeatureCard on the landing page

export const DAY1_FEATURES = [
  {
    id: 'F01',
    title: 'Onboarding Form',
    category: 'Core UX',
    difficulty: 'Beginner',
    description:
      'A clean, multi-step form that collects candidate name, skills (as tags), years of experience, and preferred job roles with smooth step transitions and real-time validation.',
    expected: 'Multi-step form at /onboarding with tag input, validation, and POST to /api/onboarding',
    files: [
      'frontend/src/features/F01-onboarding/index.jsx',
      'backend/routes/f01-onboarding.js',
      'backend/controllers/f01-onboarding.controller.js',
      'backend/data/candidates.json',
    ],
    apiNote: null,
    color: 'teal',
  },
  {
    id: 'F02',
    title: 'Disability Profiler',
    category: 'Core UX',
    difficulty: 'Beginner',
    description:
      'Interactive checklist/dropdown where users select their disability category — Visual, Hearing, Motor, or Cognitive. Each category expands to reveal relevant sub-types. Selection drives all downstream logic.',
    expected: 'Expandable category tree rendered at /profile/disability. Selection saved to local state and posted to backend.',
    files: [
      'frontend/src/features/F02-disability-profiler/index.jsx',
      'backend/routes/f02-disability.js',
      'backend/data/disability-types.json',
    ],
    apiNote: null,
    color: 'purple',
  },
  {
    id: 'F03',
    title: 'Ability Input Module',
    category: 'Core UX',
    difficulty: 'Intermediate',
    description:
      'Visual 1–5 slider scale for each functional ability (reading, speaking, fine motor, focus, hearing). As sliders move, contextual descriptions update live. Output feeds directly into the Ability Vector.',
    expected: 'Slider UI with 5 dimensions. Live description updates. Data stored to ability-vectors.json via POST.',
    files: [
      'frontend/src/features/F03-ability-input/index.jsx',
      'backend/routes/f03-ability.js',
      'backend/data/ability-vectors.json',
    ],
    apiNote: null,
    color: 'blue',
  },
  {
    id: 'F04',
    title: 'Job Posting Creator',
    category: 'Employer Tools',
    difficulty: 'Intermediate',
    description:
      'Rich employer form to post a job — title, description, required skills, experience level, and physical/cognitive task requirements (e.g. "Requires sustained visual monitoring", "Involves frequent phone calls"). Requirements are mapped to the Job Vector.',
    expected: 'Form at /jobs/new. On submit: POST to /api/jobs and append to jobs.json.',
    files: [
      'frontend/src/features/F04-job-posting/index.jsx',
      'backend/routes/f04-jobs.js',
      'backend/controllers/f04-jobs.controller.js',
      'backend/data/jobs.json',
    ],
    apiNote: null,
    color: 'amber',
  },
  {
    id: 'F05',
    title: 'Ability Vector Generator',
    category: 'AI Engine',
    difficulty: 'Intermediate',
    description:
      'Converts all user ability slider inputs into a structured numerical array — the Ability Vector (e.g. [1, 0, 5, 2, 4]). Each dimension = a functional domain. Vector stored per user. Displayed as a radar chart on the profile.',
    expected: 'Script that generates a 5-dimension vector from slider values. Radar chart rendered using Chart.js or Recharts. Vector saved to ability-vectors.json.',
    notAllowed: 'Do not hardcode vector values — they must always be derived from the slider inputs.',
    files: [
      'frontend/src/features/F05-ability-vector/index.jsx',
      'backend/routes/f05-ability-vector.js',
      'backend/data/ability-vectors.json',
    ],
    apiNote: null,
    color: 'coral',
  },
  {
    id: 'F06',
    title: 'Job Vector Generator',
    category: 'AI Engine',
    difficulty: 'Intermediate',
    description:
      'Mirror of the Ability Vector. Job postings are parsed and converted into a matching numerical array representing task demands. Each requirement maps to the same 5 dimensions as the candidate vector for direct comparison.',
    expected: 'Auto-generates a job vector from the task requirements entered in F04. Saved to job-vectors.json.',
    notAllowed: 'Vector dimensions MUST match F05 exactly — same order, same domains.',
    files: [
      'frontend/src/features/F06-job-vector/index.jsx',
      'backend/routes/f06-job-vector.js',
      'backend/data/job-vectors.json',
    ],
    apiNote: null,
    color: 'green',
  },
  {
    id: 'F07',
    title: 'Cosine Similarity Engine',
    category: 'AI Engine',
    difficulty: 'Advanced',
    description:
      'Implement cosine similarity between the Ability Vector and Job Vector from scratch. The formula measures the angle between two vectors — closer to 0° = better fit. No ML libraries allowed.',
    expected: 'A pure JS function cosineSimilarity(vecA, vecB) that returns a value between 0 and 1. Unit-testable. Used by F08.',
    files: [
      'frontend/src/features/F07-cosine-similarity/index.jsx',
      'backend/routes/f07-similarity.js',
      'backend/controllers/f07-similarity.controller.js',
    ],
    apiNote: null,
    color: 'pink',
  },
  {
    id: 'F08',
    title: 'Compatibility Score Display',
    category: 'AI Engine',
    difficulty: 'Intermediate',
    description:
      'Takes the cosine similarity output and presents it as a human-readable Compatibility Score (e.g. "92% Match"). Animated circular progress ring, plain-language summary, and color-coded tier: Excellent / Good / Possible / Unlikely.',
    expected: 'Score card component at /match/:jobId. Animated ring using SVG stroke-dashoffset. Tier badge with correct color.',
    files: [
      'frontend/src/features/F08-compatibility-score/index.jsx',
      'backend/routes/f08-compatibility.js',
    ],
    apiNote: null,
    color: 'teal',
  },
  {
    id: 'F09',
    title: 'Gap Identification Engine',
    category: 'AI Engine',
    difficulty: 'Advanced',
    description:
      'When match is not 100%, identify exactly which vector dimensions diverge. Translate them back into human-readable gaps (e.g. "Job requires phone communication; your hearing profile scores 1 on auditory tasks"). Rank gaps by severity.',
    expected: 'List of ranked gap objects with dimension name, job demand, candidate score, and severity level. Rendered as a card list.',
    notAllowed: 'Do not just show raw numbers — every gap must have a plain-language label.',
    files: [
      'frontend/src/features/F09-gap-engine/index.jsx',
      'backend/routes/f09-gaps.js',
      'backend/controllers/f09-gaps.controller.js',
    ],
    apiNote: null,
    color: 'amber',
  },
  {
    id: 'F10',
    title: 'AI Recommendation Engine',
    category: 'AI Engine',
    difficulty: 'Advanced',
    description:
      'Feed identified gaps into an AI API prompt and return specific, actionable accommodation suggestions (e.g. "Enable live captioning in Zoom", "Switch alerts from visual to haptic/audio"). Each suggestion links to a relevant tool or resource.',
    expected: '"Fix It" card list with suggestions. Each card has: suggestion text, resource link, and which gap it addresses.',
    notAllowed: [
      '⚠️ NEVER commit your API key — use .env only',
      'Your feature MUST show a graceful error card if the key is missing or the call fails',
      'The error must be contained to this component only — other pages must NOT break',
      'Other participants must not need your key to run the rest of the app',
    ],
    files: [
      'frontend/src/features/F10-ai-recommendations/index.jsx',
      'backend/routes/f10-recommendations.js',
      'backend/controllers/f10-recommendations.controller.js',
    ],
    apiNote: '⚠️ API KEY FEATURE — Read the "What NOT to do" section carefully.',
    color: 'coral',
  },
  {
    id: 'F11',
    title: 'Candidate Dashboard',
    category: 'Dashboards',
    difficulty: 'Intermediate',
    description:
      'Personal dashboard for candidates. Shows: profile completeness meter, ranked list of recommended jobs with compatibility scores, and a "Your Best Fit" hero card. Login accepts username/password from users.json. Clicking a job shows full match breakdown.',
    expected: 'Login screen → Dashboard at /candidate. Uses dummy data from users.json + candidates.json. Job list sorted by score.',
    notAllowed: 'Do not implement a real auth system — JSON lookup is sufficient for this.',
    files: [
      'frontend/src/features/F11-candidate-dashboard/index.jsx',
      'backend/routes/f11-candidate-dashboard.js',
      'backend/data/users.json',
      'backend/data/candidates.json',
    ],
    apiNote: null,
    color: 'blue',
  },
  {
    id: 'F12',
    title: 'Employer Dashboard',
    category: 'Dashboards',
    difficulty: 'Intermediate',
    description:
      'Recruiter-facing view listing all applicants sorted by compatibility score. Each applicant card shows: score, profile summary, and a one-line "gap summary" generated from F09 output.',
    expected: 'Dashboard at /employer. Applicant cards sorted descending by score. Gap summary visible on each card.',
    notAllowed: 'Do not show raw vector numbers to the employer — everything must be in plain language.',
    files: [
      'frontend/src/features/F12-employer-dashboard/index.jsx',
      'backend/routes/f12-employer-dashboard.js',
      'backend/data/candidates.json',
      'backend/data/ability-vectors.json',
    ],
    apiNote: null,
    color: 'purple',
  },
  {
    id: 'F13',
    title: 'Search & Accessibility Filter',
    category: 'Core UX',
    difficulty: 'Intermediate',
    description:
      'Smart search bar for candidates to filter jobs by keyword AND by Accessibility Score (e.g. "Show only jobs with ≥80% compatibility"). Filter chips for disability type, remote/on-site, and "No Accommodation Needed." Instant filtering, no reload.',
    expected: 'Search bar + filter chips at /jobs. Results update instantly on every keystroke and chip toggle.',
    files: [
      'frontend/src/features/F13-search-filter/index.jsx',
      'backend/data/jobs.json',
    ],
    apiNote: null,
    color: 'green',
  },
  {
    id: 'F14',
    title: 'Text-to-Speech Reader',
    category: 'Accessibility',
    difficulty: 'Beginner',
    description:
      'A "Listen" button reads entered text aloud using the Web Speech API with configurable speed and voice. A floating audio control bar appears at the bottom while reading — with pause/resume and stop controls.',
    expected: 'Text input area + Listen button. Floating control bar with pause and stop. Speed selector (0.5×, 1×, 1.5×, 2×).',
    files: [
      'frontend/src/features/F14-text-to-speech/index.jsx',
    ],
    apiNote: null,
    color: 'pink',
  },
  {
    id: 'F15',
    title: 'Speech-to-Text Profile Builder',
    category: 'Accessibility',
    difficulty: 'Intermediate',
    description:
      'Candidates fill out their profile by voice — hold a button, speak, and watch text appear in the correct form field in real time using the Web Speech API.',
    expected: 'Hold-to-speak button on each profile field. Live transcript appears as you speak. Works field-by-field.',
    files: [
      'frontend/src/features/F15-speech-to-text/index.jsx',
    ],
    apiNote: null,
    color: 'amber',
  },
]

export const DIFFICULTY_ORDER = { Beginner: 0, Intermediate: 1, Advanced: 2 }