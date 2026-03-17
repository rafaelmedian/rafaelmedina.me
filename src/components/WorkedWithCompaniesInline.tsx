type WorkedWithCompany = {
  name: string
  logoUrls: string[]
  href: string
}

export const workedWithCompanies: WorkedWithCompany[] = [
  {
    name: "0x / Matcha",
    logoUrls: ["/logos/0x.png", "/logos/matcha.svg"],
    href: "https://matcha.xyz",
  },
  {
    name: "Moody's",
    logoUrls: ["/logos/moodys.png"],
    href: "https://www.moodys.com",
  },
  {
    name: "Twilio",
    logoUrls: ["/logos/twilio.svg"],
    href: "https://www.twilio.com",
  },
  {
    name: "Onit",
    logoUrls: ["/logos/onit.png"],
    href: "https://www.onit.com",
  },
  {
    name: "Chainlink",
    logoUrls: ["/logos/chainlink.svg"],
    href: "https://chain.link",
  },
]

export function WorkedWithCompaniesInline() {
  return (
    <span className="mosaic-company-inline-list" aria-label="Companies I have worked with">
      {workedWithCompanies.map((company, index) => (
        <span key={company.name} className="mosaic-company-inline-item">
          <a
            href={company.href}
            target="_blank"
            rel="noreferrer"
            className="mosaic-company-inline-link"
            aria-label={`${company.name} website`}
            title={company.name}
          >
            <span className="mosaic-company-inline-name">{company.name}</span>
            <span className="mosaic-company-inline-hover-logos" aria-hidden="true">
              {company.logoUrls.map((logoUrl) => (
                <span key={`${company.name}-${logoUrl}`} className="mosaic-company-inline-hover-logo-wrap">
                  <img src={logoUrl} alt="" loading="eager" decoding="async" className="mosaic-company-inline-hover-logo" />
                </span>
              ))}
            </span>
          </a>
          {index < workedWithCompanies.length - 2 ? ", " : index === workedWithCompanies.length - 2 ? ", and " : ""}
        </span>
      ))}
    </span>
  )
}
