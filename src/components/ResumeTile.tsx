import { Dialog } from "@base-ui/react/dialog"
import { ArrowUpRight } from "lucide-react"
import { useRef, useState } from "react"

import { cvExperience } from "../data/cv"
import { trackEvent } from "../lib/analytics"
import { ResumeContent } from "./ResumeContent"

const previewExperience = cvExperience.slice(0, 2)

function previewCompany(company: string) {
  return company === "0x Project" ? "0x / Matcha" : company
}

export function ResumeTile({ href, onOpenChange }: { href: string; onOpenChange?: (open: boolean) => void }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [scrolled, setScrolled] = useState(false)

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) trackEvent("resume_reader_open", { resume_placement: "work_tile" })
        onOpenChange?.(open)
      }}
      onOpenChangeComplete={(open) => {
        if (!open) setScrolled(false)
      }}
    >
      <Dialog.Trigger className="mosaic-row-card resume-tile" aria-label="Open résumé">
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
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="writings-backdrop resume-dialog-backdrop" />
        <Dialog.Popup
          initialFocus={titleRef}
          data-scrolled={scrolled}
          className={(state) =>
            `writings-dialog resume-dialog t-modal ${state.transitionStatus === "starting" ? "" : state.open ? "is-open" : "is-closing"}`
          }
        >
          <header className="writings-toolbar resume-dialog-toolbar">
            <div className="writings-toolbar-leading resume-dialog-toolbar-leading">
              <Dialog.Title ref={titleRef} tabIndex={-1} className="writings-toolbar-title">Work history</Dialog.Title>
            </div>
          </header>
          <Dialog.Description className="sr-only">
            Rafael Medina's work history and education, with a link to the PDF résumé.
          </Dialog.Description>
          <div className="resume-dialog-scroll" onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}>
            <article className="resume-dialog-content mosaic-about-body">
              <p className="mosaic-about-resume-download resume-dialog-download">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="mosaic-about-link"
                  onClick={() => {
                    trackEvent("social_link_click", {
                      social_label: "View Resume",
                      social_href: href,
                      social_placement: "resume_dialog",
                    })
                  }}
                >
                  View resume PDF <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </p>
              <ResumeContent illustrated />
            </article>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
