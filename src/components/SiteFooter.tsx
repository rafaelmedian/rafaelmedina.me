export type SiteFooterProps = {
  links: {
    github: string
    linkedin: string
    email: string
  }
}

export function SiteFooter({ links }: SiteFooterProps) {
  return (
    <footer className="pointer-events-none fixed bottom-4 right-5 z-dock sm:bottom-6 sm:right-8 lg:right-12">
      <nav aria-label="Contact links" className="pointer-events-auto flex items-center gap-4 text-sm text-stone-700">
        <a href={links.github} target="_blank" rel="noreferrer" className="hover:underline">
          GitHub
        </a>
        <a href={links.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
          LinkedIn
        </a>
        <a href={`mailto:${links.email}`} className="hover:underline">
          Email
        </a>
      </nav>
    </footer>
  )
}
