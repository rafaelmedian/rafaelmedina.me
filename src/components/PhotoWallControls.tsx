import { Dialog } from "@base-ui/react/dialog"
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react"
import { X } from "./NavigationIcons"

// One introduction per page load. Refreshing resets this; reopening does not.
let shownThisPage = false
export type PhotoWallGuidanceHandle = { interact: () => void }

export function PhotoWallControls({ ref }: { ref: Ref<PhotoWallGuidanceHandle> }) {
  const [showHint, setShowHint] = useState(() => !shownThisPage)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    shownThisPage = true
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  useImperativeHandle(ref, () => ({ interact() {
    // Keep the hint readable for three seconds after the first real action.
    // Subsequent drag frames must not continually postpone its dismissal.
    if (!showHint || timer.current !== null) return
    timer.current = window.setTimeout(() => setShowHint(false), 3000)
  } }), [showHint])

  return <div className="personal-photos-wall-controls">
    <p className="personal-photos-wall-hint" hidden={!showHint}>Drag to explore</p>
    <div className="personal-photos-wall-toolbar">
      <Dialog.Close className="personal-photos-wall-close" aria-label="Close photo wall"><span className="personal-photos-wall-close-label">Close</span><X size={20} strokeWidth={2.5} /></Dialog.Close>
    </div>
  </div>
}
