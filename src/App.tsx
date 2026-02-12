import { useEffect, useState } from "react"
import { Agentation } from "agentation"
import { InfiniteCanvasBoard } from "./components/InfiniteCanvasBoard"
import { portfolioCards, siteProfile } from "./data/portfolio"

type Theme = "light" | "dark"

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light"
    const savedTheme = window.localStorage.getItem("theme")
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]">
      <button
        type="button"
        onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-5 z-modal inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-bg)] px-4 text-sm font-semibold text-[var(--ink)] shadow-[0_1px_2px_rgba(0,0,0,0.16)] transition-colors duration-150 ease-out hover:bg-[var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--accent)_72%,transparent)] sm:left-8 sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] lg:left-12"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <main className="relative z-dock">
        <InfiniteCanvasBoard cards={portfolioCards} profile={siteProfile} />
      </main>
      {import.meta.env.DEV ? <Agentation /> : null}
    </div>
  )
}

export default App
