import { Fragment } from "react"

import { cvEducation, cvExperience, type CvExperience } from "../data/cv"
import { portfolioCards } from "../data/portfolio"

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

function IllustratedExperience({ job }: { job: CvExperience }) {
  const logos = job.logoUrls ?? job.clients?.map((client) => client.logoUrl) ?? []
  const projects = (job.projectIds ?? []).flatMap((id) => {
    const project = portfolioCards.find((card) => card.id === id)
    return project ? [project] : []
  })

  return (
    <li className="resume-experience">
      {logos.length > 0 ? (
        <div className="resume-experience-logos" aria-hidden="true">
          {logos.map((src) => <img key={src} src={src} alt="" width={40} height={40} loading="lazy" />)}
        </div>
      ) : null}
      <div className="resume-experience-details">
        <div className="resume-experience-heading">
          <h3 className="resume-experience-company" aria-label={`${job.role} at ${getCompanyLabel(job)}`}>
            <ResumeCompany job={job} />{job.company === "0x Project" ? " / Matcha" : null}
          </h3>
          <p className="resume-experience-dates">{job.dates}</p>
        </div>
        <p className="resume-experience-role">{job.role}</p>
        <p className="resume-experience-location">{job.location}</p>
        <p className="resume-experience-description">{job.highlight}</p>
        {projects.length > 0 ? (
          <div className="resume-experience-projects" aria-label={`${job.company} project screenshots`}>
            {projects.map((project) => (
              <a key={project.id} href={`/work/${project.slug}/`} target="_blank" rel="noreferrer" className="resume-project">
                <img
                  src={project.previewPoster ?? project.image}
                  alt={`${project.title} interface`}
                  width={project.previewPosterWidth ?? project.previewWidth}
                  height={project.previewPosterHeight ?? project.previewHeight}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </li>
  )
}

export function ResumeContent({ revealOnScroll = false, illustrated = false }: { revealOnScroll?: boolean; illustrated?: boolean }) {
  const fadeProps = revealOnScroll ? { "data-about-fade": "" } : {}

  return (
    <>
      <ol className={`mosaic-about-resume mosaic-about-work-list${illustrated ? " resume-experience-list" : ""}`} aria-label="Work history">
        {cvExperience.map((job) => illustrated ? (
          <IllustratedExperience key={`${job.company}-${job.dates}`} job={job} />
        ) : (
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
