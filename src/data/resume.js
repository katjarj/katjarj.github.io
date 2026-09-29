export const links = {
  linkedin: 'https://linkedin.com/in/katja-radovic-jonsson',
  github: 'https://github.com/katjarj',
};
export const intro = {
  name: 'Katja Radovic-Jonsson',
  tagline:
    'Computer science at UBC. Hackathon builder, teacher, and ski instructor at Whistler Blackcomb.',
  where: 'Vancouver, BC. Willing to relocate.',
};
export const education = {
  group: 'education',
  title: 'B.Sc. Computer Science',
  org: 'The University of British Columbia',
  when: '2024 – present',
  pts: [
    '92.3% GPA',
    'Dean’s Scholar Award; Loran Provincial Award',
    'Courses: CPSC 110, 121, 210, 213, 221; DSCI 100',
  ],
};
export const work = [
  {
    group: 'technical',
    title: 'Software developer co-op',
    org: 'UBC Faculty of Medicine Digital Solutions',
    when: 'Jan – Aug 2026',
    pts: [
      'Develop and maintain Java-based web applications with HTML, CSS, JavaScript, and React on the front end',
      'Work in an Agile team, using Jira for sprint planning and issue tracking',
      'Automate builds and deployment pipelines with Atlassian Bamboo for CI/CD',
      'Build and optimize relational databases in SQL Server',
    ],
  },
  {
    group: 'technical',
    title: 'Undergraduate teaching assistant',
    org: 'UBC Department of Computer Science',
    when: 'Jan – Aug 2026',
    pts: ['TA for CPSC 213: Introduction to Computer Systems'],
  },
];
// The project categories, in the order they appear on the sign. Each project
// below carries a `cat` id, so adding a project is a one-line change there and
// re-ordering, renaming or re-rating a whole category is a one-line change
// here. `diff` is the trail rating, which drives the run's colour and symbol.
export const projectCats = [
  { id: 'academic', title: 'Academic', diff: 'green' },
  { id: 'hackathons', title: 'Hackathons', diff: 'blue' },
  { id: 'side', title: 'Side Projects', diff: 'black' },
];

// Each project carries an `img` and a `github`. Both are empty until you fill
// them in: drop a screenshot at `public/projects/<name>.png` and set `img` to
// `/projects/<name>.png`, and set `github` to the repo URL. An empty string
// renders a labelled placeholder, so a half-finished project still looks right.
export const projects = [
  {
    title: 'Music Player',
    cat: 'academic',
    when: 'Jan – Apr 2025',
    img: '',
    github: 'https://github.com/katjarj/music-player',
    pts: [
      'Playlist manager and player for local files in object-oriented Java, with JSON save/load',
      'Java Swing GUI; 6 user stories and 100% JUnit test coverage',
    ],
  },
  {
    title: 'Rabbit Hole',
    cat: 'hackathons',
    org: 'cmd-f hackathon. Best Use of Gemini API Award',
    when: 'Mar 2026',
    img: '',
    github: 'https://github.com/selinuz/RabbitHole',
    pts: [
      'Next.js web app that helps users navigate difficult conversations with science-backed frameworks',
      'Gemini API critically analyzes the issue and gives subtle guidance toward a solution',
      'ElevenLabs API for speech-to-text and text-to-speech',
    ],
  },
  {
    title: 'AwardScope',
    cat: 'hackathons',
    org: 'Hack the Coast hackathon',
    when: 'Feb 2026',
    img: '',
    github: 'https://github.com/Tjindl/AwardScope',
    pts: [
      'Full-stack Next.js app that helps students find financial aid they qualify for, deployed on Vercel',
      'MongoDB database for aid matching; Gemini API for customized application plans',
    ],
  },
  {
    title: 'Arc’Share’yx',
    cat: 'hackathons',
    org: 'youCode hackathon',
    when: 'Apr 2025',
    img: '',
    github: 'https://github.com/katjarj/arc-share-yx',
    pts: [
      'Outdoor gear-sharing web app: post and respond to listings, earn credits for sharing',
      'Built the front end solo with Tailwind CSS and deployed on Vercel',
      'Pitched to a panel of judges chosen by sponsor Arc’teryx',
    ],
  },
  {
    title: 'BusBuddies',
    cat: 'hackathons',
    org: 'cmd-f hackathon',
    when: 'Mar 2025',
    img: '',
    github: 'https://github.com/joy1234567891/BusBuddies',
    pts: [
      'Managed a team of four building a web app that matches students by bus route',
      'Designed a Figma prototype and presented to adjudicators and sponsors',
    ],
  },
  {
    title: 'WellSpring',
    cat: 'hackathons',
    org: 'HackCamp hackathon. Finalist and Most Accessible Design Awards',
    when: 'Nov 2024',
    img: '',
    github: 'https://github.com/RuhaniMittal29/WellSpring',
    pts: [
      'Led a team of four building a web app to track health stats like fitness and water intake',
      'Prototyped in Figma; made a presentation video for adjudication',
    ],
  },
  {
    title: 'Personal Website',
    cat: 'side',
    when: '2026',
    img: '',
    github: 'https://github.com/katjarj/katjarj.github.io',
    pts: [
      'This site: a ski trail map drawn on a single canvas, where every run pans that same scene',
      'Sections are the trail map with the camera moved, so the world never changes — it only moves',
      'Astro, plain CSS and a little vanilla JS; no UI framework',
    ],
  },
];
export const community = [
  {
    title: 'VP Internal',
    org: 'UBC Women in Computer Science',
    when: 'May 2026 – present',
    pts: [
      'Manage three Internal Events Directors, organizing events for 1500+ UBC CS students',
      'Work with the CS Department on Tri-Mentorship Program events; lead weekly huddles and mentor new execs',
    ],
  },
  {
    title: 'Community Events Director',
    org: 'UBC Women in Computer Science',
    when: 'May 2025 – Apr 2026',
    pts: ['Planned and ran 1–2 events per month and started partnerships with other UBC clubs'],
  },
  {
    title: 'First Year Representative',
    org: 'UBC Women in Computer Science',
    when: 'Sep 2024 – Apr 2025',
    pts: [
      'Grew outreach to high school and first-year students',
      'Taught an intro Python seminar to 30+ high school and university students',
    ],
  },
  {
    title: 'Computer science peer tutor',
    org: 'Eric Hamber Secondary School',
    when: 'Jan – Jun 2024',
    pts: ['Helped 25+ students with Python, binary arithmetic, and digital circuits'],
  },
  {
    title: 'Co-President',
    org: 'STEM Sorority',
    when: 'Sep 2023 – Jun 2024',
    pts: [
      'Organized workshops and events encouraging girls and gender minorities into STEM; applied for grants',
    ],
  },
  {
    title: 'Managing Editor',
    org: 'The Griffins’ Nest',
    when: 'Sep 2023 – Jun 2024',
    pts: [
      'Oversaw bimonthly student newspaper issues, mentoring 100+ student writers',
      'Kept the website updated and secured advertising funding from local businesses',
    ],
  },
];
export const other = [
  {
    group: 'nontechnical',
    title: 'Ski instructor',
    org: 'Whistler Blackcomb',
    when: 'Dec 2022 – present',
    pts: [
      'Teach beginner to intermediate skiing in group and private lessons',
      'Supervise students and meet their needs; give feedback to students and parents; debrief with supervisors daily',
    ],
  },
  {
    group: 'nontechnical',
    title: 'Private math tutor',
    org: 'Vancouver, BC',
    when: 'May 2025 – present',
    pts: [
      'Teach high school and intro university math, with personalized goals and progress tracking',
    ],
  },
  {
    group: 'nontechnical',
    title: 'Tech specialist',
    org: 'London Drugs',
    when: 'Nov 2022 – Dec 2025',
    pts: ['Advised clients across the Tech department and ran photo orders at the Photo Lab'],
  },
];

// ─── Sub-signs: how the Experience section sorts itself ───────────
// The section is cut into sub-signs, one per group, each carrying a trail
// rating in `diff`. Every entry above is tagged with a `group` id, so adding a
// job is a one-line change there, while reordering or re-rating a whole group
// is a one-line change here. A group with no entries is simply not drawn.
export const groups = [
  { id: 'technical', title: 'Technical', diff: 'green' },
  { id: 'nontechnical', title: 'Non-technical', diff: 'blue' },
  { id: 'education', title: 'Education', diff: 'black' },
];

// ─── The runs on the main TRAIL MAP sign ──────────────────────
// `diff` is the trail rating, and it drives both the row's colour and its
// symbol from this one value, so the two can never drift apart. `dir` is the
// way the camera travels when you take that run. A run with no `diff` is
// unrated — it wears the sign's own frame colour and carries no symbol.
export const trailMap = [
  { id: 'experience', title: 'Experience', diff: 'green', dir: 'left' },
  { id: 'projects', title: 'Personal Projects', diff: 'blue', dir: 'upleft' },
  { id: 'community', title: 'Extracurricular', diff: 'black', dir: 'upright' },
  { id: 'skills', title: 'Skills', diff: 'dblack', dir: 'right' },
];
// Skill categories. Each is a run on the SKILLS sign and a page behind it, so
// each carries an `id` (which names its layer) and a `diff` (its trail rating,
// which drives both the row's colour and its symbol). Re-rate freely.
export const skills = [
  {
    id: 'programming',
    title: 'Programming',
    diff: 'green',
    items: 'Python, C++, Java, C, R, Racket',
  },
  {
    id: 'tools',
    title: 'Tools',
    diff: 'blue',
    items: 'Git, UML, Figma, VS Code, Docker, Jira, Bamboo, GitHub Copilot, Claude Code',
  },
  {
    id: 'web',
    title: 'Web',
    diff: 'black',
    items: 'HTML, Tailwind CSS, TypeScript, React.js, Next.js',
  },
];
