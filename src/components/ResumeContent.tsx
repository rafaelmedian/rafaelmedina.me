import { Fragment } from "react"

import { cvEducation, cvExperience, type CvExperience } from "../data/cv"
import { portfolioCards } from "../data/portfolio"
import { buildPreviewSrcSet } from "../lib/media"

/* The rendered width of a print, which is what `sizes` has to declare: the CSS
   fixes the height at `clamp(2.8rem, 12vw, 4.4rem)` and lets the width follow
   the shot's 4:3 ratio, so the width is that clamp times 4/3 -- 60px until 12vw
   clears the floor at 373px, then 16vw, then 94px once the height caps at
   587px. Without this the browser assumes a full-width slot and takes the
   1600px original for a thumbnail. */
const PRINT_SIZES = "(max-width: 373px) 60px, (max-width: 587px) 16vw, 94px"

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

function IllustratedExperience({ job, onSelectProject }: { job: CvExperience; onSelectProject?: (id: string) => boolean }) {
  const logos = job.logoUrls ?? job.clients?.map((client) => client.logoUrl) ?? []
  const projects = (job.projectIds ?? []).flatMap((id) => {
    const project = portfolioCards.find((card) => card.id === id)
    return project ? [project] : []
  })

  return (
    <li className="resume-experience">
      {logos.length > 0 ? (
        <div className="resume-experience-logos" aria-hidden="true">
          {logos.map((src) => (
            <span className="resume-experience-logo" key={src}>
              <img src={src} alt="" width={18} height={18} loading="lazy" />
            </span>
          ))}
        </div>
      ) : null}
      <div className="resume-experience-details">
        <div className="resume-experience-heading">
          <h3 className="mosaic-about-resume-title resume-experience-company" aria-label={`${job.role} at ${getCompanyLabel(job)}`}>
            <ResumeCompany job={job} />{job.company === "0x Project" ? " / Matcha" : null}
          </h3>
          <p className="mosaic-about-resume-dates">{job.dates}</p>
        </div>
        <p className="resume-experience-role">{job.role}</p>
        <p className="mosaic-about-resume-location">{job.location}</p>
        {Array.isArray(job.highlight) ? (
          <ul className="mosaic-about-resume-description resume-experience-points">
            {job.highlight.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="mosaic-about-resume-description">{job.highlight}</p>
        )}
        {projects.length > 0 ? (
          <div className="resume-experience-projects" role="group" aria-label={`${job.company} project screenshots`}>
            {projects.map((project) => {
              const source = project.previewPoster ?? project.image
              const width = project.previewPosterWidth ?? project.previewWidth
              // The same `-480w`/`-960w` siblings the grid tiles load. A print
              // is a fraction of a tile, so the original would be oversampled
              // by an order of magnitude here.
              const srcSet = buildPreviewSrcSet(source, width)
              return (
                <a
                  key={project.id}
                  href={`/work/${project.slug}/`}
                  className="resume-project"
                  onClick={(event) => {
                    // Modified clicks stay the browser's to handle; a plain one
                    // opens the project over the feed like its tile does. A
                    // project with no tile on the grid reports back unhandled and
                    // the link falls through to its own page.
                    if (!onSelectProject) return
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
                    if (!onSelectProject(project.id)) return
                    event.preventDefault()
                  }}
                >
                  <img
                    src={source}
                    srcSet={srcSet}
                    sizes={srcSet ? PRINT_SIZES : undefined}
                    alt={`${project.title} interface`}
                    width={width}
                    height={project.previewPosterHeight ?? project.previewHeight}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              )
            })}
          </div>
        ) : null}
      </div>
    </li>
  )
}

export function ResumeContent({ onSelectProject }: { onSelectProject?: (id: string) => boolean }) {
  return (
    <>
      <ol className="mosaic-about-resume mosaic-about-work-list resume-experience-list" aria-label="Work history">
        {cvExperience.map((job) => (
          <IllustratedExperience key={`${job.company}-${job.dates}`} job={job} onSelectProject={onSelectProject} />
        ))}
      </ol>

      <div className="mosaic-about-resume-education">
        <h3 className="mosaic-about-resume-heading">Education</h3>
        <ul className="mosaic-about-resume mosaic-about-education-list" aria-label="Education">
          {cvEducation.map((school) => (
            <li className="resume-experience" key={school.school}>
              <div className="resume-experience-heading">
                <h4 className="mosaic-about-resume-title" aria-label={`${school.credential} at ${school.school}`}>
                  {school.school}
                </h4>
                <p className="mosaic-about-resume-dates">{school.dates}</p>
              </div>
              <p className="resume-experience-role">{school.credential}</p>
              <p className="mosaic-about-resume-location">{school.location}</p>
              {school.details ? <p className="mosaic-about-resume-description">{school.details}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
