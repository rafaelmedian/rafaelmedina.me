export type CvExperience = {
  company: string
  clients?: CvExperienceClient[]
  location: string
  dates: string
  role: string
  /** One line, or a pair rendered as bullets. Two is the ceiling: a third turns
      an entry into a block nobody reads down the length of the sheet. */
  highlight: string | [string, string]
  /** Primary company link and decorative logo tooltip. */
  href?: string
  logoUrls?: string[]
  /** Selected portfolio examples shown in the illustrated resume reader. */
  projectIds?: string[]
}

export type CvExperienceClient = {
  name: string
  href: string
  logoUrl: string
}

export type CvEducation = {
  school: string
  location: string
  dates: string
  credential: string
  details?: string
}

export const cvExperience: CvExperience[] = [
  {
    company: "Stealth fintech",
    location: "Remote",
    dates: "2026 - Present",
    role: "Co-founder",
    highlight: [
      "Building a mobile wallet for colmados, the corner stores of the Dominican Republic.",
      "Owners manage payments and day-to-day finances from their phones.",
    ],
  },
  {
    company: "0x Project",
    location: "Remote, SF",
    dates: "2021 - 2026",
    role: "Senior Product Designer",
    href: "https://0x.org/",
    logoUrls: ["/logos/0x.png", "/logos/matcha.svg"],
    // Every print here has to be a card the home grid lays out -- the reader
    // hands the click back to the feed, and a card with no tile has no preview
    // to open. `preview-shot-19` and `preview-shot-22` are off the grid.
    projectIds: ["preview-shot-16", "preview-shot-21", "preview-shot-1", "preview-shot-14"],
    highlight: [
      "Redesigned Matcha.xyz from scratch.",
      "Introduced the monetization flows that generated sustainable revenue.",
    ],
  },
  {
    company: "BoldVoice",
    location: "Remote, NYC",
    dates: "2021",
    role: "Product Designer (Contract)",
    href: "https://boldvoice.com/",
    logoUrls: ["/logos/boldvoice.png"],
    highlight:
      "Sole designer for an accent-training app with more than 50K users, pairing with one developer to ship growth experiments.",
  },
  {
    company: "Moody's",
    location: "Remote, NYC",
    dates: "2021",
    role: "Product Designer (Contract)",
    href: "https://www.moodys.com/",
    logoUrls: ["/logos/moodys.png"],
    highlight: "Redesigned financial-analysis tools for institutional analysts, making data easier to find and workflows faster.",
  },
  {
    company: "TM",
    clients: [
      { name: "Chainlink", href: "https://chain.link/", logoUrl: "/logos/chainlink.svg" },
      { name: "Twilio", href: "https://www.twilio.com/", logoUrl: "/logos/twilio.svg" },
      { name: "Onit", href: "https://www.onit.com/", logoUrl: "/logos/onit.png" },
    ],
    location: "Remote, Los Angeles",
    dates: "2018 - 2020",
    role: "Product Designer & Frontend Developer",
    highlight: [
      "Collaborated with Chainlink on internal product tools and its brand system as the company scaled.",
      "The work made a complex oracle network read clearer and more consistent.",
    ],
  },
  {
    company: "Incubeta (Google)",
    location: "Remote, NYC",
    dates: "2018",
    role: "Product Designer & Developer (Contract)",
    href: "https://www.google.com/",
    logoUrls: ["/logos/Google_logo.svg"],
    highlight: "Designed Google Edu Directory, connecting schools around the world with certified Google trainers.",
  },
]

export const cvEducation: CvEducation[] = [
  {
    school: "CCI Program - NOVA Community College",
    location: "Washington, DC",
    dates: "2016 - 2018",
    credential: "Computer Science",
    details: "U.S. State Department scholarship recipient (1 of 5 from the Dominican Republic).",
  },
  {
    school: "ITLA - Las Americas Institute of Technology",
    location: "Dominican Republic",
    dates: "2015",
    credential: "Associate's, Computer Science",
    details: "GPA 3.8, Full Scholarship.",
  },
]
