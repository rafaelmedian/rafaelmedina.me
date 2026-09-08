import { Fragment } from "react"

import { cvEducation, cvExperience } from "../data/cv"
import type { CvExperience } from "../data/cv"
import type { SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"
import { PersonalPhotos } from "./PersonalPhotos"

type AboutPanelProps = {
  links: SiteLinks
}

const hobbies = [
  { emoji: "🥊", label: "Kickboxing" },
  { emoji: "🚵", label: "Mountain biking" },
  { emoji: "🏊", label: "Lap swimming" },
  { emoji: "🥾", label: "Hiking" },
  { emoji: "💃", label: "Salsa", learning: true },
  { emoji: "🥋", label: "Jiu jitsu", learning: true },
]

function ResumeCompanyLink({ company, href }: { company: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mosaic-company-inline-link"
    >
      <span className="mosaic-company-inline-name">{company}</span>
    </a>
  )
}

function getCompanyLabel(job: CvExperience) {
  if (!job.clients) return job.company

  const clientNames = job.clients.map((client) => client.name)
  const clients =
    clientNames.length > 1
      ? `${clientNames.slice(0, -1).join(", ")}, and ${clientNames.at(-1)}`
      : clientNames[0]

  return `${job.company} (${clients})`
}

function ResumeCompany({ job }: { job: CvExperience }) {
  const clients = job.clients

  if (clients) {
    return (
      <>
        <span>{job.company} (</span>
        {clients.map((client, index) => (
          <Fragment key={client.name}>
            {index > 0 ? (index === clients.length - 1 ? ", and " : ", ") : null}
            <ResumeCompanyLink company={client.name} href={client.href} />
          </Fragment>
        ))}
        <span>)</span>
      </>
    )
  }

  if (job.href) {
    return <ResumeCompanyLink company={job.company} href={job.href} />
  }

  return <span>{job.company}</span>
}

export function AboutPanel({ links }: AboutPanelProps) {
  return (
    <article
      id="about-panel"
      className="mosaic-about"
      tabIndex={-1}
      aria-label="About Rafael Medina"
    >
      <h2 className="sr-only">About Rafael Medina</h2>
      <div className="mosaic-about-panel">
        <div className="mosaic-about-body">
          <section
            id="about-section"
            className="mosaic-about-section mosaic-about-section-intro"
            aria-labelledby="about-section-heading"
          >
            <div className="mosaic-about-section-copy">
              <h2 id="about-section-heading" className="mosaic-about-lede">
                About me
              </h2>
              <p>
                I design the complicated parts of products people prefer not to think about. I figure out
                what to build, test it with real people, and prototype in code because working interactions
                answer questions faster than static mockups.
              </p>
              <p>
                When I&rsquo;m not working, I&rsquo;m probably kickboxing, swimming, riding a bike, or being humbled
                by salsa and jiu jitsu.
              </p>

              <ul className="mosaic-about-hobbies">
                {hobbies.map((hobby) => (
                  <li key={hobby.label}>
                    <span className="mosaic-about-hobby-emoji" aria-hidden="true">
                      {hobby.emoji}
                    </span>
                    {hobby.label}
                    {hobby.learning ? (
                      <span className="mosaic-about-hobby-note"> (learning)</span>
                    ) : null}
                  </li>
                ))}
              </ul>

              {/* The address is spelled out here as persistent text; the hero
                  copy action also exposes it in a pointer tooltip. */}
              <p className="mosaic-about-closing">
                Building something? Email me at{" "}
                <a
                  href={`mailto:${links.email}`}
                  className="mosaic-about-link"
                  onClick={() => {
                    trackEvent("social_link_click", {
                      social_label: "Email",
                      social_href: `mailto:${links.email}`,
                      social_placement: "about_panel",
                    })
                  }}
                >
                  {links.email}
                </a>
                .
              </p>
            </div>

            <PersonalPhotos />
          </section>

          <section
            id="about-panel-resume"
            tabIndex={-1}
            className="mosaic-about-section mosaic-about-work-history"
            aria-labelledby="about-work-history-heading"
          >
            <div className="mosaic-about-work-history-copy">
              <h2
                id="about-work-history-heading"
                className="mosaic-about-section-heading"
              >
                Work history
              </h2>
              <ol className="mosaic-about-resume mosaic-about-work-list">
                {cvExperience.map((job) => (
                  <li
                    key={`${job.company}-${job.dates}`}
                    className="mosaic-about-resume-entry mosaic-about-work-entry"
                  >
                    <p className="mosaic-about-resume-dates">{job.dates}</p>
                    <div className="mosaic-about-resume-details">
                      <h3
                        className="mosaic-about-resume-title"
                        aria-label={`${job.role} at ${getCompanyLabel(job)}`}
                      >
                        {job.role} at <ResumeCompany job={job} />
                      </h3>
                      <p className="mosaic-about-resume-location">{job.location}</p>
                      <p className="mosaic-about-resume-description">{job.highlight}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mosaic-about-resume-education">
                <h3 className="mosaic-about-resume-heading">
                  Education
                </h3>
                <ul className="mosaic-about-resume mosaic-about-education-list">
                  {cvEducation.map((school) => (
                    <li
                      key={school.school}
                      className="mosaic-about-resume-entry mosaic-about-work-entry"
                    >
                      <p className="mosaic-about-resume-dates">{school.dates}</p>
                      <div className="mosaic-about-resume-details">
                        <h4
                          className="mosaic-about-resume-title"
                          aria-label={`${school.credential} at ${school.school}`}
                        >
                          {school.credential} at <span>{school.school}</span>
                        </h4>
                        <p className="mosaic-about-resume-location">{school.location}</p>
                        {school.details ? (
                          <p className="mosaic-about-resume-description">{school.details}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Same term and behavior as the corner "Resume" link: one
                  artifact, one verb. The browser's PDF viewer keeps its own
                  download button for people who want the file. */}
              <p className="mosaic-about-resume-download">
                <a
                  href={links.resumePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="mosaic-about-link"
                  onClick={() => {
                    trackEvent("social_link_click", {
                      social_label: "View Resume",
                      social_href: links.resumePdf,
                      social_placement: "about_panel",
                    })
                  }}
                >
                  View resume (PDF)
                </a>
              </p>
            </div>

          </section>
        </div>
      </div>
    </article>
  )
}
