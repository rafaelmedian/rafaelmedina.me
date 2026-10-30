import { useEffect, useRef, useSyncExternalStore } from "react"

declare global {
  interface Window {
    startAvatarIntro?: () => void
    pageStylesReady?: Promise<void>
  }
}

const isActive = () => Boolean(document.documentElement.dataset.avatarIntro)
const serverActive = () => true
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-avatar-intro"] })
  return () => observer.disconnect()
}

/** The intro itself runs from an inline script in index.html, ahead of the bundle. */
export function useAvatarIntro() {
  const avatarRef = useRef<HTMLButtonElement>(null)
  const active = useSyncExternalStore(subscribe, isActive, serverActive)

  // Only the dev server gets here with the intro unstarted: it has no
  // prerendered portrait until this mounts.
  useEffect(() => {
    window.startAvatarIntro?.()
  }, [])

  return { avatarRef, active }
}
