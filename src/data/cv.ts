export type CvExperience = {
  company: string
  location: string
  dates: string
  role: string
  achievements: string[]
  /** Small logo coins shown beside the company name. */
  logoUrls?: string[]
}

export type CvEducation = {
  school: string
  location: string
  credential: string
  details?: string
}

export const cvExperience: CvExperience[] = [
  {
    company: "0x Project",
    location: "Remote, SF",
    dates: "Dec 2021 - Mar 2026",
    role: "Senior Product Designer",
    logoUrls: ["/logos/0x.png", "/logos/matcha.svg"],
    achievements: [
      "Redesigned Matcha.xyz from scratch and introduced monetization flows that generated sustainable revenue.",
      "Designed and shipped the 0x API dashboard in five weeks, contributing to API revenue scaling beyond $100K per month.",
      "Led marketing design strategy for 12 months across campaigns, video content, and web experiences that increased developer adoption.",
    ],
  },
  {
    company: "BoldVoice",
    location: "Remote, NYC",
    dates: "Jul 2021 - Dec 2021",
    role: "Product Designer (Contract)",
    logoUrls: ["/logos/boldvoice.png"],
    achievements: [
      "Sole designer for an accent-training mobile app with more than 50K users, partnering directly with one developer to ship growth experiments.",
      "Prioritized high-ROI product improvements over a full redesign to maximize impact with limited resources.",
    ],
  },
  {
    company: "Moody's",
    location: "Remote, NYC",
    dates: "Jan 2021 - Jul 2021",
    role: "Product Designer (Contract)",
    logoUrls: ["/logos/moodys.png"],
    achievements: [
      "Redesigned financial-analysis tools for institutional analysts, improving data discovery and workflow efficiency.",
      "Shaped UX for company profiles and government-entity features used by thousands of financial professionals.",
    ],
  },
  {
    company: "TM (Chainlink, Twilio, and Onit)",
    location: "Remote, Los Angeles",
    dates: "Dec 2018 - Dec 2020",
    role: "Product Designer & Frontend Developer",
    logoUrls: ["/logos/chainlink.svg", "/logos/twilio.svg", "/logos/onit.png"],
    achievements: [
      "Chainlink: collaborated on internal tools and the brand system for a leading blockchain oracle network.",
      "Twilio: led a redesign of the developer-tools platform, supported by user interviews and UX research.",
      "Onit: rebuilt a drag-and-drop logic builder with React for legal workflow automation.",
    ],
  },
  {
    company: "Incubeta (Google)",
    location: "Remote, NYC",
    dates: "Jan 2018 - May 2018",
    role: "Product Designer & Developer (Contract)",
    logoUrls: ["/logos/Google_logo.svg"],
    achievements: [
      "Designed Google Edu Directory, connecting schools globally with certified Google trainers.",
    ],
  },
]

export const cvEducation: CvEducation[] = [
  {
    school: "CCI Program - NOVA Community College",
    location: "Washington, DC",
    credential: "Computer Science, 2016 - 2018",
    details: "U.S. State Department scholarship recipient (1 of 5 from the Dominican Republic).",
  },
  {
    school: "ITLA - Las Americas Institute of Technology",
    location: "Dominican Republic",
    credential: "Associate's, Computer Science, 2015 - GPA 3.8, Full Scholarship",
  },
]
