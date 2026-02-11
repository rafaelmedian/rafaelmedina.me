import { useEffect, useState } from "react"
import { Agentation } from "agentation"
import { PortfolioGrid } from "./components/PortfolioGrid"
import { SiteFooter } from "./components/SiteFooter"
import { SiteHeader } from "./components/SiteHeader"
import { portfolioCards, siteLinks, siteProfile } from "./data/portfolio"

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
        className="fixed right-5 top-4 z-modal inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-bg)] px-4 text-sm font-semibold text-[var(--ink)] shadow-[0_1px_2px_rgba(0,0,0,0.16)] transition-colors duration-150 ease-out hover:bg-[var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--accent)_72%,transparent)] sm:right-8 lg:right-12"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <main className="relative z-dock mx-auto flex w-full max-w-[1800px] flex-col gap-14 px-5 pb-12 pt-[calc(1.25rem+env(safe-area-inset-top))] sm:px-8 sm:pb-16 lg:px-12">
        <SiteHeader name={siteProfile.name} intro={siteProfile.intro} />
        <PortfolioGrid cards={portfolioCards} />
      </main>

      <SiteFooter links={siteLinks} />
      {import.meta.env.DEV ? <Agentation /> : null}
    </div>
  )
}

export default App
