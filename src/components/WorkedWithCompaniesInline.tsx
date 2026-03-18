import { HoverLogoLink } from "./HoverLogoLink"

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
    name: "Google",
    logoUrls: ["/logos/Google_logo.svg"],
    href: "https://www.google.com",
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
