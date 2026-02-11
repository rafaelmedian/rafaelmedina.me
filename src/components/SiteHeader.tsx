type SiteHeaderProps = {
  name: string
  intro: string
}

export function SiteHeader({ name, intro }: SiteHeaderProps) {
  return (
    <header className="space-y-6 pt-6 text-center sm:space-y-7 sm:pt-8">
      <div className="space-y-4">
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold leading-[1.04] text-[var(--ink)] sm:text-5xl">
          <span className="inline-block rounded-none bg-[var(--accent)] px-3 py-1 text-[var(--ink)]">
            {name}
          </span>
          <span className="ml-3">Product designer</span>
        </h1>
      </div>
      <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-stone-600 sm:text-lg">
        {intro}
      </p>
    </header>
  )
}
