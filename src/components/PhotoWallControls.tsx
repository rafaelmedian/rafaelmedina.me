import { Dialog } from "@base-ui/react/dialog"
import { X } from "./NavigationIcons"

export function PhotoWallControls() {
  return <div className="personal-photos-wall-controls">
    <div className="personal-photos-wall-toolbar">
      <Dialog.Close className="personal-photos-wall-close" aria-label="Close photo wall"><span className="personal-photos-wall-close-label">Close</span><X size={20} strokeWidth={2.5} /></Dialog.Close>
    </div>
  </div>
}
