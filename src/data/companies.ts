export type WorkedWithCompany = {
  id: string
  name: string
  compactName: string
  logoUrls: string[]
  href: string
  relationship: "recent" | "previous" | "additional"
  role: string
  description: string
}

/** Every company on the site's "worked with" surfaces reads from this list:
    the design system's inline sentence, the profile's work-history chips, and
    the About sheet's logo grid. They used to keep their own copies, which is
    how the grid could advertise a client the sentence had never heard of. */
export const workedWithCompanies: WorkedWithCompany[] = [
  {
    id: "0x",
    name: "0x.org",
    compactName: "0x.org",
    logoUrls: ["/logos/0x.png"],
    href: "https://0x.org",
    relationship: "recent",
    role: "Product designer",
    description: "Designing product surfaces across the 0x ecosystem.",
  },
  {
    id: "matcha",
    name: "Matcha.xyz",
    compactName: "Matcha.xyz",
    logoUrls: ["/logos/matcha.svg"],
    href: "https://matcha.xyz",
    relationship: "recent",
    role: "Product designer",
    description: "Shaping trading experiences for one of the clearest DEX products in crypto.",
  },
  {
    id: "moodys",
    name: "Moody's",
    compactName: "Moody's",
    logoUrls: ["/logos/moodys.png"],
    href: "https://www.moodys.com",
    relationship: "previous",
    role: "Frontend dev and designer",
    description: "Designed financial product workflows for data-dense, decision-heavy tools.",
  },
  {
    id: "twilio",
    name: "Twilio",
    compactName: "Twilio",
    logoUrls: ["/logos/twilio.svg"],
    href: "https://www.twilio.com",
    relationship: "previous",
    role: "Product designer",
    description: "Rethought developer tools and communication platform experiences.",
  },
  {
    id: "onit",
    name: "Onit",
    compactName: "Onit",
    logoUrls: ["/logos/onit.png"],
    href: "https://www.onit.com",
    relationship: "previous",
    role: "Frontend dev and designer",
    description: "Helped make legal operations software easier to navigate and understand.",
  },
  {
    id: "chainlink",
    name: "Chainlink",
    compactName: "Chainlink",
    logoUrls: ["/logos/chainlink.svg"],
    href: "https://chain.link",
    relationship: "previous",
    role: "Product designer",
    description: "Contributed to Web3 infrastructure interfaces with a focus on clarity and trust.",
  },
  {
    id: "boldvoice",
    name: "BoldVoice",
    compactName: "BoldVoice",
    logoUrls: ["/logos/boldvoice.png"],
    href: "https://boldvoice.com",
    relationship: "previous",
    role: "Product designer",
    description: "Sole designer on an accent-training app used by more than 50K people.",
  },
  {
    id: "google",
    name: "Google",
    compactName: "Google",
    logoUrls: ["/logos/Google_logo.svg"],
    href: "https://www.google.com",
    relationship: "additional",
    role: "Design collab",
    description: "Worked alongside product teams on focused interface explorations.",
  },
  {
    id: "patrol",
    name: "Protector and Patrol",
    compactName: "Protector and Patrol",
    logoUrls: ["/logos/protector.svg", "/logos/patrol.svg"],
    href: "https://protector.so/",
    relationship: "additional",
    role: "Design collab",
    description: "Shaped protection-focused mobile product experiences and interface explorations.",
  },
]
