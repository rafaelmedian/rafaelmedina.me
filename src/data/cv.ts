export type CvExperience = {
  company: string
  location: string
  dates: string
  role: string
  highlight: string
  /** Primary company link and decorative logo tooltip. */
  href?: string
  logoUrls?: string[]
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
    company: "Startup",
    location: "Remote",
    dates: "2026 - Present",
    role: "Co-founder",
    highlight:
      "Building a mobile wallet for colmados, helping neighborhood store owners in the Dominican Republic manage payments and day-to-day finances from their phones.",
  },
  {
    company: "0x Project",
    location: "Remote, SF",
    dates: "2021 - 2026",
    role: "Senior Product Designer",
    href: "https://0x.org/",
    logoUrls: ["/logos/0x.png", "/logos/matcha.svg"],
    highlight: "Redesigned Matcha.xyz from scratch and introduced monetization flows that generated sustainable revenue.",
  },
  {
    company: "BoldVoice",
    location: "Remote, NYC",
    dates: "2021",
    role: "Product Designer (Contract)",
    href: "https://boldvoice.com/",
    logoUrls: ["/logos/boldvoice.png"],
    highlight:
      "Sole designer for an accent-training mobile app with more than 50K users, partnering directly with one developer to ship growth experiments.",
  },
  {
    company: "Moody's",
    location: "Remote, NYC",
    dates: "2021",
    role: "Product Designer (Contract)",
    href: "https://www.moodys.com/",
    logoUrls: ["/logos/moodys.png"],
    highlight: "Redesigned financial-analysis tools for institutional analysts, improving data discovery and workflow efficiency.",
  },
  {
    company: "TM (Chainlink, Twilio, and Onit)",
    location: "Remote, Los Angeles",
    dates: "2018 - 2020",
    role: "Product Designer & Frontend Developer",
    href: "https://chain.link/",
    logoUrls: ["/logos/chainlink.svg", "/logos/twilio.svg", "/logos/onit.png"],
    highlight:
      "Chainlink: collaborated on internal product tools and the brand system, helping make a complex blockchain oracle network clearer and more consistent as the company scaled.",
  },
  {
    company: "Incubeta (Google)",
    location: "Remote, NYC",
    dates: "2018",
    role: "Product Designer & Developer (Contract)",
    href: "https://www.google.com/",
    logoUrls: ["/logos/Google_logo.svg"],
    highlight: "Designed Google Edu Directory, connecting schools globally with certified Google trainers.",
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
