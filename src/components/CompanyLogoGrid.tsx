import { workedWithCompanies } from "../data/companies"
import { trackEvent } from "../lib/analytics"

/** The order the grid reads in: most recent work first, then the earlier
    engagements, then the collaborations. Nine companies fill three rows of
    three exactly, so the wall never ends on a ragged half row. */
const gridOrder = [
  "0x",
  "matcha",
  "boldvoice",
  "moodys",
  "chainlink",
  "twilio",
  "onit",
  "google",
  "patrol",
]

const gridCompanies = gridOrder.flatMap((companyId) => {
  const company = workedWithCompanies.find((candidate) => candidate.id === companyId)
  return company ? [company] : []
})

export function CompanyLogoGrid() {
  return (
    <ul className="mosaic-about-logo-grid">
      {gridCompanies.map((company) => (
        <li key={company.id} className="mosaic-about-logo-cell">
          <a
            href={company.href}
            target="_blank"
            rel="noreferrer"
            className="mosaic-about-logo-link"
            onClick={() => {
              trackEvent("social_link_click", {
                social_label: company.name,
                social_href: company.href,
                social_placement: "about_logo_grid",
              })
            }}
          >
            {/* The marks are decoration: the name beside each one is already
                the accessible label, so a second reading of "Twilio" as alt
                text would only make the link announce itself twice. */}
            <span
              className={`mosaic-about-logo-marks${company.logoUrls.length > 1 ? " is-pair" : ""}`}
              aria-hidden="true"
            >
              {company.logoUrls.map((logoUrl) => (
                <img
                  key={logoUrl}
                  className="mosaic-about-logo-mark"
                  src={logoUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </span>
            <span className="mosaic-about-logo-name">{company.name}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
