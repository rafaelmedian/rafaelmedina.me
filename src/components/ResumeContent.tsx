import { Fragment, type CSSProperties } from "react"

import { cvEducation, cvExperience, type CvExperience } from "../data/cv"
const RESUME_DRAWINGS = [
  { row: 1, object: "pencil", place: "right", size: "3rem", pull: "0.3", drop: "1.25rem", tilt: "8deg" },
  { row: 3, object: "cup", place: "left", size: "3.5rem", pull: "0.65", drop: "0.5rem", tilt: "-7deg" },
  { row: 5, object: "sheet", place: "right", size: "3.25rem", pull: "0.1", drop: "1rem", tilt: "5deg" },
] as const

type ResumeDrawing = (typeof RESUME_DRAWINGS)[number]

function ResumeMarginDrawing({ drawing }: { drawing: ResumeDrawing }) {
  return (
    <span className="resume-margin-drawing" data-place={drawing.place} aria-hidden="true" style={{
      "--resume-drawing-mark": `url("/writings/marks/drawing-${drawing.object}-frames.png")`,
      "--resume-drawing-size": drawing.size,
      "--resume-drawing-pull": drawing.pull,
      "--resume-drawing-drop": drawing.drop,
      "--resume-drawing-tilt": drawing.tilt,
    } as CSSProperties} />
  )
}

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

function IllustratedExperience({ job, level, drawing }: { job: CvExperience; level: ResumeHeadingLevel; drawing?: ResumeDrawing }) {
  const Company = `h${level}` as const

  return (
    <li className="resume-experience">
      {drawing ? <ResumeMarginDrawing drawing={drawing} /> : null}
      <div className="resume-experience-details">
        <div className="resume-experience-heading">
          <div className="resume-experience-identity">
            <Company className="mosaic-about-resume-title resume-experience-company" aria-label={`${job.role} at ${getCompanyLabel(job)}`}>
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
      <ol className="mosaic-about-resume mosaic-about-work-list resume-experience-list" aria-label="Work history">
        {cvExperience.map((job, index) => (
          <IllustratedExperience key={`${job.company}-${job.dates}`} job={job} level={level}
            drawing={RESUME_DRAWINGS.find((drawing) => drawing.row === index)} />
        ))}
      </ol>

      <div className="mosaic-about-resume-education">
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
              <p className="resume-experience-role">{school.credential}</p>
              <p className="mosaic-about-resume-location">{school.location}</p>
              {school.details ? <p className="mosaic-about-resume-description">{school.details}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
