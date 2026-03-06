import { Agentation } from "agentation"

import { Portfolio2026 } from "./components/Portfolio2026"

function App() {
  return (
    <div className="min-h-dvh bg-[var(--fg26-canvas)] text-[var(--fg26-ink)]">
      <Portfolio2026 />
      {import.meta.env.DEV ? <Agentation /> : null}
    </div>
  )
}

export default App
