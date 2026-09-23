import { Dialog } from "@base-ui/react/dialog"
import { PanelRightClose, ChevronRight, X } from "lucide-react"
import { useRef, type RefObject } from "react"
import { siteLinks, siteProfile } from "../data/portfolio"

export function BookingContactPanel({ open, onOpenChange, calendarFocus }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  calendarFocus?: RefObject<HTMLButtonElement | null>
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  return <Dialog.Root open={open} onOpenChange={onOpenChange} modal="trap-focus">
    <Dialog.Trigger className="booking-name-tag" aria-label="Rafael Medina contact info">
      Rafael<ChevronRight size={14} strokeWidth={3} aria-hidden="true" />
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className="booking-contact-backdrop" />
      <Dialog.Popup className="booking-contact-panel" initialFocus={closeRef} finalFocus={() => calendarFocus?.current ?? true}>
        <Dialog.Title className="sr-only">{siteProfile.name}</Dialog.Title>
        <Dialog.Description className="sr-only">Contact details and social profiles.</Dialog.Description>
        <Dialog.Close className="booking-icon-button booking-contact-back" aria-label="Back to conversation">
          <PanelRightClose size={20} aria-hidden="true" />
        </Dialog.Close>
        <Dialog.Close ref={closeRef} className="booking-icon-button booking-contact-close" aria-label="Close contact info">
          <X size={20} aria-hidden="true" />
        </Dialog.Close>
        <div className="booking-contact-content">
          <div className="booking-contact-group">
            <div className="booking-contact-row"><small>name</small>{siteProfile.name}</div>
            <div className="booking-contact-row"><small>work</small>{siteProfile.title}</div>
          </div>
          <div className="booking-contact-group">
            <a href={`mailto:${siteLinks.email}`}><small>email</small>{siteLinks.email}</a>
            <a href="https://rafaelmedina.me" target="_blank" rel="noreferrer"><small>website</small>rafaelmedina.me</a>
          </div>
          <div className="booking-contact-group">
            <a href={siteLinks.x} target="_blank" rel="noreferrer"><small>x.com</small>@rafaelmedian</a>
            <a href={siteLinks.github} target="_blank" rel="noreferrer"><small>github</small>@rafaelmedian</a>
            <a href={siteLinks.linkedin} target="_blank" rel="noreferrer"><small>linkedin</small>@rafaelmedian</a>
          </div>
          <div className="booking-contact-group">
            <a href={siteLinks.resumePdf} target="_blank" rel="noreferrer">View resume</a>
          </div>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
}
