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
    company: "Freelance",
    location: "Remote",
    dates: "2026 – Present",
    role: "Product Designer",
    highlight: [
      "End-to-end product design for startups, from the first user interview to the shipped screen.",
      "Fractional design partner for teams without an in-house designer.",
    ],
  },
  {
    company: "0x Project",
    location: "Remote, SF",
    dates: "2021 – 2026",
    role: "Senior Product Designer",
    href: "https://0x.org/",
    logoUrls: ["/logos/0x.png", "/logos/matcha.svg"],
    // Every print here has to be a card the home grid lays out -- the reader
    // hands the click back to the feed, and a card with no tile has no preview
    // to open. `preview-shot-19` and `preview-shot-22` are off the grid.
    highlight: [
      "Redesigned Matcha.xyz, 0x's trading app, from the ground up.",
      "Designed the monetization flows that turned it into a sustainable source of revenue.",
    ],
  },
  {
    company: "BoldVoice",
    location: "Remote, NYC",
    dates: "2021",
    role: "Product Designer (Contract)",
    href: "https://boldvoice.com/",
    logoUrls: ["/logos/boldvoice.webp"],
    highlight:
      "Sole designer on an accent-training app with 50K+ users, shipping growth experiments alongside one engineer.",
  },
  {
    company: "Moody's",
    location: "Remote, NYC",
    dates: "2021",
    role: "Product Designer (Contract)",
    href: "https://www.moodys.com/",
    logoUrls: ["/logos/moodys.png"],
    highlight: "Redesigned financial-analysis tools for institutional analysts, so they find data sooner and move through their work faster.",
  },
  {
    company: "TM",
    clients: [
      { name: "Chainlink", href: "https://chain.link/", logoUrl: "/logos/chainlink.svg" },
      { name: "Twilio", href: "https://www.twilio.com/", logoUrl: "/logos/twilio.svg" },
      { name: "Onit", href: "https://www.onit.com/", logoUrl: "/logos/onit.png" },
    ],
    location: "Remote, Los Angeles",
    dates: "2018 – 2020",
    role: "Product Designer & Frontend Developer",
    highlight: [
      "Designed internal product tools and the brand system for Chainlink as the company scaled.",
      "Made a complex oracle network clearer and more consistent across product and brand.",
    ],
  },
  {
    company: "Incubeta (Google)",
    location: "Remote, NYC",
    dates: "2018",
    role: "Product Designer & Developer (Contract)",
    href: "https://www.google.com/",
    logoUrls: ["/logos/Google_logo.svg"],
    highlight: "Designed the Google Edu Directory, which connects schools around the world with certified Google trainers.",
  },
]

export const cvEducation: CvEducation[] = [
  {
    school: "CCI Program - NOVA Community College",
    location: "Washington, DC",
    dates: "2016 – 2018",
    credential: "Computer Science",
    details: "U.S. State Department scholarship, one of five recipients from the Dominican Republic.",
  },
  {
    school: "ITLA - Las Americas Institute of Technology",
    location: "Dominican Republic",
    dates: "2015",
    credential: "Associate's degree, Computer Science",
    details: "Full scholarship, 3.8 GPA.",
  },
]
