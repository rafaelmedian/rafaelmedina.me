import { useEffect, useRef, useSyncExternalStore } from "react"
import { cssTimeToMilliseconds } from "./cssTime"

const isActive = () => Boolean(document.documentElement.dataset.avatarIntro)
const serverActive = () => true
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-avatar-intro"] })
  return () => observer.disconnect()
}

/** Show the real header portrait first, then reveal the surrounding content. */
export function useAvatarIntro() {
  const avatarRef = useRef<HTMLButtonElement>(null)
  const active = useSyncExternalStore(subscribe, isActive, serverActive)

  useEffect(() => {
    const avatar = avatarRef.current
    const portrait = avatar?.querySelector<HTMLImageElement>(".mosaic-avatar-face-front .mosaic-avatar-portrait")
    if (document.documentElement.dataset.avatarIntro !== "pending" || !portrait || !avatar) return

    let disposed = false
    let portraitTimer: number | undefined
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
      const phase = root.dataset.avatarIntro
      if (disposed || !phase) return
      if (reveal) {
        if (phase !== "pending" && phase !== "portrait") return
        root.dataset.avatarIntro = "revealing"
        revealTimer = window.setTimeout(() => {
          delete root.dataset.avatarIntro
        }, revealDuration + staggerDuration * 4)
      } else {
        delete root.dataset.avatarIntro
      }
      window.clearTimeout(portraitTimer)
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

    // Animate the decoded face in place before the surrounding groups enter.
    void portrait.decode().then(() => {
      if (disposed || root.dataset.avatarIntro !== "pending") return
      root.dataset.avatarIntro = "portrait"
      portraitTimer = window.setTimeout(() => finish(true), revealDuration)
    }).catch(() => finish())

    return () => {
      disposed = true
      window.clearTimeout(portraitTimer)
      window.clearTimeout(revealTimer)
      window.removeEventListener("resize", interrupt)
      window.removeEventListener("scroll", interrupt)
      window.removeEventListener("keydown", interrupt)
      window.removeEventListener("pointerdown", interrupt)
      window.removeEventListener("pagehide", interrupt)
      motion.removeEventListener("change", interrupt)
    }
  }, [])

  return { avatarRef, active }
}
