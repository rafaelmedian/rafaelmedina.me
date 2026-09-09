import { cvExperience } from "../data/cv"
import { trackEvent } from "../lib/analytics"

const previewExperience = cvExperience.slice(0, 2)

function previewCompany(company: string) {
  return company === "0x Project" ? "0x / Matcha" : company
}

export function ResumeTile({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mosaic-row-card resume-tile"
      aria-label="Open Rafael Medina's resume PDF"
      onClick={() => {
        trackEvent("social_link_click", {
          social_label: "View Resume",
          social_href: href,
          social_placement: "work_tile",
        })
      }}
    >
      <span className="resume-tile-sheet" aria-hidden="true">
        <span className="resume-tile-copy">
          {previewExperience.map((job) => (
            <span className="resume-tile-entry" key={`${job.company}-${job.dates}`}>
              <strong>{previewCompany(job.company)}</strong>
              <span>{job.dates}</span>
              <span>{job.role}</span>
              <p>{job.highlight}</p>
            </span>
          ))}
        </span>
        <svg className="resume-tile-fold" viewBox="0 0 80 80" aria-hidden="true">
          <path className="resume-tile-fold-shadow" d="M0 80h80V0C64 13 56 30 50 48 44 65 27 76 0 80Z" />
          <path className="resume-tile-fold-page" d="M0 80c24-3 41-14 49-31C57 31 64 14 80 0 68 27 69 55 80 80H0Z" />
        </svg>
      </span>
    </a>
  )
}
