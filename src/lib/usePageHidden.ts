import { useSyncExternalStore } from "react"

const subscribeVisibility = (listener: () => void) => {
  document.addEventListener("visibilitychange", listener)
  return () => document.removeEventListener("visibilitychange", listener)
}
const pageIsHidden = () => document.hidden
const hiddenOnServer = () => true

export function usePageHidden() {
  return useSyncExternalStore(subscribeVisibility, pageIsHidden, hiddenOnServer)
}
