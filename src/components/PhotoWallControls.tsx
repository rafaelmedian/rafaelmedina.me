import { Dialog } from "@base-ui/react/dialog"
import { usePhotoControlMorph } from "../lib/usePhotoControlMorph"
import { X } from "./NavigationIcons"

export function PhotoWallControls({ open }: { open: boolean }) {
  const button = usePhotoControlMorph(open)
  return <div className="personal-photos-wall-controls">
    <div className="personal-photos-wall-toolbar">
      <Dialog.Close ref={button} className="personal-photos-wall-close" aria-label="Close photo wall"><span className="personal-photos-wall-close-content"><span className="personal-photos-wall-close-label">Close</span><X size={16} strokeWidth={2.5} /></span></Dialog.Close>
    </div>
  </div>
}
