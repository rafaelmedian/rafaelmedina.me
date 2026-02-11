import { Agentation } from "agentation"
import { PortfolioGrid } from "./components/PortfolioGrid"
import { SiteFooter } from "./components/SiteFooter"
import { SiteHeader } from "./components/SiteHeader"
import { portfolioCards, siteLinks, siteProfile } from "./data/portfolio"

function App() {
  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7f7f5_0%,#efefec_45%,#e9e9e5_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_12%_-8%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0)_62%),radial-gradient(90%_75%_at_92%_0%,rgba(191,219,254,0.38)_0%,rgba(191,219,254,0)_60%),radial-gradient(80%_68%_at_52%_100%,rgba(120,113,108,0.11)_0%,rgba(120,113,108,0)_72%)]" />
      </div>
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
