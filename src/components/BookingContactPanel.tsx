import { Dialog } from "@base-ui/react/dialog"
import { ArrowUpRight, ChevronRight, Mail, X } from "lucide-react"
import { useRef } from "react"
import { siteLinks, siteProfile } from "../data/portfolio"

export function BookingContactPanel() {
  const closeRef = useRef<HTMLButtonElement>(null)

  return <Dialog.Root>
    <Dialog.Trigger className="booking-name-tag" aria-label="Rafael Medina contact info">
      {siteProfile.name}<ChevronRight size={14} aria-hidden="true" />
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className="booking-contact-backdrop" />
      <Dialog.Popup className="booking-contact-panel" initialFocus={closeRef}>
        <div className="booking-contact-toolbar">
          <span>Contact info</span>
          <Dialog.Close ref={closeRef} className="booking-icon-button" aria-label="Close contact info">
            <X size={20} aria-hidden="true" />
          </Dialog.Close>
        </div>
        <header className="booking-contact-heading">
          <img src={siteProfile.photo} width="96" height="96" alt="" />
          <Dialog.Title>{siteProfile.name}</Dialog.Title>
          <Dialog.Description>{siteProfile.title}</Dialog.Description>
        </header>
        <a className="booking-contact-mail" href={`mailto:${siteLinks.email}`}>
          <Mail size={20} aria-hidden="true" /> Email Rafael
        </a>
        <div className="booking-contact-group">
          <a href={`mailto:${siteLinks.email}`}>
            <span><small>Email</small>{siteLinks.email}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href="https://rafaelmedina.me" target="_blank" rel="noreferrer">
            <span><small>Website</small>rafaelmedina.me</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href={siteLinks.linkedin} target="_blank" rel="noreferrer">
            <span><small>LinkedIn</small>rafaelmedian</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="booking-contact-group">
          <a href={siteLinks.resumePdf} target="_blank" rel="noreferrer">
            <span>View résumé</span><ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
}
