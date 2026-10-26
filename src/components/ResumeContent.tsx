import { Fragment } from "react"

import { cvEducation, cvExperience, type CvExperience } from "../data/cv"

function ResumeCompanyLink({ company, href }: { company: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="mosaic-company-inline-link">
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

  if (job.href) return <ResumeCompanyLink company={job.company} href={job.href} />
  return <span>{job.company}</span>
}

/* The About sheet and the gallery slide sit under an h2, so their companies are
   h3; the standalone /resume/ page has an h1 of its own and its companies are
   h2. Education sits at the same level as a company, its schools one below. */
export type ResumeHeadingLevel = 2 | 3

function ResumeExperience({ job, level }: { job: CvExperience; level: ResumeHeadingLevel }) {
  const Company = `h${level}` as const

  return (
    <li className="resume-experience">
      <div className="resume-experience-details">
        <div className="resume-experience-heading">
          <div className="resume-experience-identity">
            <Company className="mosaic-about-resume-title resume-experience-company" aria-label={job.company === "Freelance" ? `Freelance ${job.role}` : `${job.role} at ${getCompanyLabel(job)}`}>
              <ResumeCompany job={job} />{job.company === "0x Project" ? " / Matcha" : null}
            </Company>
          </div>
          <p className="mosaic-about-resume-dates">{job.dates}</p>
        </div>
        <div className="resume-experience-meta">
          <p className="resume-experience-role">{job.role}</p>
          <span className="resume-experience-meta-separator" aria-hidden="true">·</span>
          <p className="mosaic-about-resume-location">{job.location}</p>
        </div>
        {Array.isArray(job.highlight) ? (
          <ul className="mosaic-about-resume-description resume-experience-points">
            {job.highlight.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="mosaic-about-resume-description">{job.highlight}</p>
        )}

      </div>
    </li>
  )
}

export function ResumeContent({ level = 3 }: { level?: ResumeHeadingLevel }) {
  const SectionHeading = `h${level}` as const
  const School = level === 2 ? "h3" : "h4"
  return (
    <div className="resume-content">
      <div className="resume-section">
        <SectionHeading className="mosaic-about-resume-heading">Experience</SectionHeading>
        <ol className="mosaic-about-resume mosaic-about-work-list resume-experience-list" aria-label="Work history">
          {cvExperience.map((job) => (
            <ResumeExperience key={`${job.company}-${job.dates}`} job={job} level={level} />
          ))}
        </ol>
      </div>

      <div className="mosaic-about-resume-education resume-section">
        <SectionHeading className="mosaic-about-resume-heading">Education</SectionHeading>
        <ul className="mosaic-about-resume mosaic-about-education-list" aria-label="Education">
          {cvEducation.map((school) => (
            <li className="resume-experience" key={school.school}>
              <div className="resume-experience-heading">
                <School className="mosaic-about-resume-title" aria-label={`${school.credential} at ${school.school}`}>
                  {school.school}
                </School>
                <p className="mosaic-about-resume-dates">{school.dates}</p>
              </div>
              <div className="resume-experience-meta">
                <p className="resume-experience-role">{school.credential}</p>
                <span className="resume-experience-meta-separator" aria-hidden="true">·</span>
                <p className="mosaic-about-resume-location">{school.location}</p>
              </div>
              {school.details ? <p className="mosaic-about-resume-description">{school.details}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
