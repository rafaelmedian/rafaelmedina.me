import { HoverLogoLink } from "./HoverLogoLink"

type WorkedWithCompany = {
  id: string
  name: string
  compactName: string
  logoUrls: string[]
  href: string
  relationship: "recent" | "previous" | "additional"
  role: string
  description: string
}

type ResumeExperience = {
  id: string
  period: string
  role: string
  companies: WorkedWithCompany[]
  summary: string
}

const workedWithCompanies: WorkedWithCompany[] = [
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
    role: "Product designer",
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
    description: "Worked on developer tools and communication platform experiences.",
  },
  {
    id: "onit",
    name: "Onit",
    compactName: "Onit",
    logoUrls: ["/logos/onit.png"],
    href: "https://www.onit.com",
    relationship: "previous",
    role: "Product designer",
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
    id: "google",
    name: "Google",
    compactName: "Google",
    logoUrls: ["/logos/Google_logo.svg"],
    href: "https://www.google.com",
    relationship: "additional",
    role: "Product design collaborator",
    description: "Worked alongside product teams on focused interface explorations.",
  },
  {
    id: "patrol",
    name: "Protector and Patrol",
    compactName: "Protector and Patrol",
    logoUrls: ["/logos/protector.svg", "/logos/patrol.svg"],
    href: "https://protector.so/",
    relationship: "additional",
    role: "Product design collaborator",
    description: "Shaped protection-focused mobile product experiences and interface explorations.",
  },
]

type WorkedWithCompaniesInlineProps = {
  variant?: "sentence" | "profile"
}

function getCompanies(companyIds: string[]) {
  return companyIds.flatMap((companyId) => {
    const company = workedWithCompanies.find((candidate) => candidate.id === companyId)
    return company ? [company] : []
  })
}

const resumeExperiences: ResumeExperience[] = [
  {
    id: "0x-matcha",
    period: "2021-present",
    role: "Product designer",
    companies: getCompanies(["0x", "matcha"]),
    summary: "Shaping trading experiences and product surfaces across the 0x ecosystem.",
  },
  {
    id: "moodys",
    period: "2019-2021",
    role: "Product designer",
    companies: getCompanies(["moodys"]),
    summary: "Designed financial product workflows for data-dense, decision-heavy tools.",
  },
  {
    id: "platforms",
    period: "2016-2019",
    role: "Product designer",
    companies: getCompanies(["twilio", "chainlink"]),
    summary: "Worked across developer tools, communication products, and Web3 infrastructure interfaces.",
  },
  {
    id: "selected-collabs",
    period: "2015-present",
    role: "Product design collaborator",
    companies: getCompanies(["onit", "google", "patrol"]),
    summary: "Partnered with focused product teams on enterprise software, mobile UX, and interface explorations.",
  },
]

function ResumeLogoCluster({ companies }: { companies: WorkedWithCompany[] }) {
  return (
    <span className="mosaic-work-resume-logo-cluster" aria-hidden="true">
      {companies.flatMap((company) =>
        company.logoUrls.map((logoUrl) => (
          <span key={`${company.id}-${logoUrl}`} className="mosaic-work-resume-logo-frame">
            <img src={logoUrl} alt="" loading="eager" decoding="async" className="mosaic-work-resume-logo" />
          </span>
        )),
      )}
    </span>
  )
}

function ResumeCompanyLinks({ companies }: { companies: WorkedWithCompany[] }) {
  return (
    <span className="mosaic-work-resume-companies">
      {companies.map((company, index) => (
        <span key={company.id} className="mosaic-work-resume-company-wrap">
          <a href={company.href} target="_blank" rel="noreferrer" className="mosaic-work-resume-company">
            {company.name}
          </a>
          {index < companies.length - 2 ? ", " : index === companies.length - 2 ? " / " : ""}
        </span>
      ))}
    </span>
  )
}

function ResumeExperienceItem({ experience }: { experience: ResumeExperience }) {
  return (
    <li className="mosaic-work-resume-item">
      <div className="mosaic-work-resume-marker">
        <ResumeLogoCluster companies={experience.companies} />
      </div>
      <div className="mosaic-work-resume-body">
        <div className="mosaic-work-resume-row">
          <div className="mosaic-work-resume-title-group">
            <ResumeCompanyLinks companies={experience.companies} />
            <span className="mosaic-work-resume-role">{experience.role}</span>
          </div>
          <span className="mosaic-work-resume-period">{experience.period}</span>
        </div>
        <p className="mosaic-work-resume-summary">{experience.summary}</p>
      </div>
    </li>
  )
}

export function WorkedWithCompaniesInline({ variant = "sentence" }: WorkedWithCompaniesInlineProps) {
  if (variant === "profile") {
    return (
      <section className="mosaic-work-history mosaic-work-resume" aria-labelledby="mosaic-work-resume-heading">
        <div className="mosaic-work-resume-header">
          <p className="mosaic-work-resume-kicker">Experience</p>
          <h3 id="mosaic-work-resume-heading">Product design, 2015-present</h3>
        </div>
        <ol className="mosaic-work-resume-list">
          {resumeExperiences.map((experience) => (
            <ResumeExperienceItem key={experience.id} experience={experience} />
          ))}
        </ol>
      </section>
    )
  }

  return (
    <span className="mosaic-company-inline-list" aria-label="Companies I have worked with">
      {workedWithCompanies.map((company, index) => (
        <span key={company.name} className="mosaic-company-inline-item">
          <HoverLogoLink
            href={company.href}
            logoUrls={company.logoUrls}
            className="mosaic-company-inline-link"
            ariaLabel={`${company.name} website`}
            title={company.name}
          >
            {company.name}
          </HoverLogoLink>
          {index < workedWithCompanies.length - 2 ? ", " : index === workedWithCompanies.length - 2 ? ", and " : ""}
        </span>
      ))}
    </span>
  )
}
