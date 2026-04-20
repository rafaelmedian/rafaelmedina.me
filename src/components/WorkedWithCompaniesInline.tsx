import { useId, useState } from "react"

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
]

type WorkedWithCompaniesInlineProps = {
  variant?: "sentence" | "profile"
}

export function WorkedWithCompaniesInline({ variant = "sentence" }: WorkedWithCompaniesInlineProps) {
  const disclosureId = useId()
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null)
  const [showMoreCompanies, setShowMoreCompanies] = useState(false)

  if (variant === "profile") {
    const recentCompanies = workedWithCompanies.filter((company) => company.relationship === "recent")
    const previousCompanies = workedWithCompanies.filter((company) => company.relationship === "previous")
    const additionalCompanies = workedWithCompanies.filter((company) => company.relationship === "additional")
    const activeCompany = workedWithCompanies.find((company) => company.id === activeCompanyId)
    const activeDisclosureId = activeCompany ? `${disclosureId}-${activeCompany.id}` : undefined

    const toggleCompany = (companyId: string) => {
      setActiveCompanyId((currentCompanyId) => (currentCompanyId === companyId ? null : companyId))
    }

    const renderCompanyButton = (company: WorkedWithCompany) => {
      const isActive = activeCompanyId === company.id
      const companyDisclosureId = `${disclosureId}-${company.id}`

      return (
        <button
          key={company.id}
          type="button"
          className="mosaic-work-history-chip"
          aria-expanded={isActive}
          aria-controls={isActive ? companyDisclosureId : undefined}
          onClick={() => toggleCompany(company.id)}
        >
          {company.compactName}
        </button>
      )
    }

    return (
      <div className="mosaic-work-history" aria-label="Work history">
        <div className="mosaic-work-history-line">
          <span className="mosaic-work-history-copy">Recently at</span>
          {recentCompanies[0] ? renderCompanyButton(recentCompanies[0]) : null}
          <span className="mosaic-work-history-copy">and</span>
          {recentCompanies[1] ? renderCompanyButton(recentCompanies[1]) : null}
          <span className="mosaic-work-history-copy">previously at</span>
        </div>
        <div className="mosaic-work-history-line" aria-label="Previous companies">
          {previousCompanies.map(renderCompanyButton)}
          {showMoreCompanies ? additionalCompanies.map(renderCompanyButton) : null}
          {additionalCompanies.length > 0 ? (
            <button
              type="button"
              className="mosaic-work-history-chip mosaic-work-history-chip-more"
              aria-expanded={showMoreCompanies}
              onClick={() => {
                if (showMoreCompanies && additionalCompanies.some((company) => company.id === activeCompanyId)) {
                  setActiveCompanyId(null)
                }
                setShowMoreCompanies((currentValue) => !currentValue)
              }}
            >
              ...
            </button>
          ) : null}
        </div>
        {activeCompany ? (
          <div id={activeDisclosureId} className="mosaic-work-history-expanded">
            <span className="mosaic-work-history-expanded-logos" aria-hidden="true">
              {activeCompany.logoUrls.map((logoUrl) => (
                <span key={`${activeCompany.id}-${logoUrl}`} className="mosaic-work-history-expanded-logo-wrap">
                  <img src={logoUrl} alt="" loading="eager" decoding="async" className="mosaic-work-history-expanded-logo" />
                </span>
              ))}
            </span>
            <span className="mosaic-work-history-expanded-copy">
              <strong>{activeCompany.name}</strong>
              <span>{activeCompany.role}</span>
              <span>{activeCompany.description}</span>
              <a href={activeCompany.href} target="_blank" rel="noreferrer">
                Visit site
              </a>
            </span>
          </div>
        ) : null}
      </div>
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
