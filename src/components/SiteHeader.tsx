type SiteHeaderProps = {
  name: string
  title: string
  photo: string
}

export function SiteHeader({ name, title, photo }: SiteHeaderProps) {
  return (
    <header className="space-y-5 pt-5 sm:space-y-6 sm:pt-6">
      <div className="flex w-full max-w-5xl items-center gap-3 sm:gap-4">
        <img
          src={photo}
          alt={`${name} profile`}
          className="size-16 shrink-0 rounded-full object-cover ring-1 ring-[var(--border)] sm:size-20"
        />
        <div className="space-y-1">
          <h1 className="text-balance text-[clamp(1.25rem,1.9vw,2rem)] font-semibold leading-[1.08] text-[var(--ink)]">
            {name}
          </h1>
          <p className="text-pretty text-[clamp(0.9rem,1.1vw,1.12rem)] font-medium leading-[1.2] text-[var(--muted)]">
            <span>{title}</span>
            <span className="mx-2 inline-block size-1 rounded-full bg-[var(--accent)] align-middle" />
            <span className="text-[var(--muted-strong)]">open to collaborations</span>
          </p>
        </div>
      </div>
    </header>
  )
}
