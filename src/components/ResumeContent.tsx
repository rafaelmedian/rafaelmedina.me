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

export function ResumeContent({ revealOnScroll = false }: { revealOnScroll?: boolean }) {
  const fadeProps = revealOnScroll ? { "data-about-fade": "" } : {}

  return (
    <>
      <ol className="mosaic-about-resume mosaic-about-work-list" aria-label="Work history">
        {cvExperience.map((job) => (
          <li
            key={`${job.company}-${job.dates}`}
            className="mosaic-about-resume-entry mosaic-about-work-entry"
            {...fadeProps}
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
        <h3 className="mosaic-about-resume-heading" {...fadeProps}>Education</h3>
        <ul className="mosaic-about-resume mosaic-about-education-list" aria-label="Education">
          {cvEducation.map((school) => (
            <li
              key={school.school}
              className="mosaic-about-resume-entry mosaic-about-work-entry"
              {...fadeProps}
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
                {school.details ? <p className="mosaic-about-resume-description">{school.details}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
