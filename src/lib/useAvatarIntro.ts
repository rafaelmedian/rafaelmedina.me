import { useEffect, useRef, useSyncExternalStore } from "react"
import { cssTimeToMilliseconds } from "./cssTime"

const isPending = () => document.documentElement.dataset.avatarIntro === "pending"
const serverPending = () => true
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-avatar-intro"] })
  return () => observer.disconnect()
}

/** Show the real header portrait first, then reveal the surrounding content. */
export function useAvatarIntro() {
  const avatarRef = useRef<HTMLButtonElement>(null)
  const pending = useSyncExternalStore(subscribe, isPending, serverPending)

  useEffect(() => {
    const avatar = avatarRef.current
    const portrait = avatar?.querySelector<HTMLImageElement>(".mosaic-avatar-face-front")
    if (!isPending() || !portrait || !avatar) return

    let disposed = false
    let holdTimer: number | undefined
    let revealTimer: number | undefined
    const root = document.documentElement
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    if (motion.matches) {
      delete root.dataset.avatarIntro
      return
    }
    const style = getComputedStyle(portrait)
    const staggerDuration = cssTimeToMilliseconds(style.getPropertyValue("--duration-fast"))
    const revealDuration = cssTimeToMilliseconds(style.getPropertyValue("--duration-slow"))
    const finish = (reveal = false) => {
      if (disposed || !isPending()) return
      if (reveal) {
        root.dataset.avatarIntro = "revealing"
        revealTimer = window.setTimeout(() => {
          delete root.dataset.avatarIntro
        }, revealDuration + staggerDuration)
      } else {
        delete root.dataset.avatarIntro
      }
      window.clearTimeout(holdTimer)
    }
    // Changes of intent or geometry end the intro immediately. Never fight a
    // scroll, keyboard navigation, a resized viewport, or a motion preference.
    const interrupt = () => finish()
    window.addEventListener("resize", interrupt)
    window.addEventListener("scroll", interrupt, { passive: true })
    window.addEventListener("keydown", interrupt)
    window.addEventListener("pointerdown", interrupt)
    window.addEventListener("pagehide", interrupt)
    motion.addEventListener("change", interrupt)

    // Start the short hold only once the face is decoded. The image itself
    // keeps its resting appearance and position throughout the intro.
    void portrait.decode().then(() => {
      if (disposed || !isPending()) return
      holdTimer = window.setTimeout(() => finish(true), revealDuration)
    }).catch(() => finish())

    return () => {
      disposed = true
      window.clearTimeout(holdTimer)
      window.clearTimeout(revealTimer)
      window.removeEventListener("resize", interrupt)
      window.removeEventListener("scroll", interrupt)
      window.removeEventListener("keydown", interrupt)
      window.removeEventListener("pointerdown", interrupt)
      window.removeEventListener("pagehide", interrupt)
      motion.removeEventListener("change", interrupt)
    }
  }, [])

  return { avatarRef, pending }
}
