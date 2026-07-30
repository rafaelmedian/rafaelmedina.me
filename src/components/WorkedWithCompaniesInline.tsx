import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from "react"

import { applyPointerTilt, popoverTilt, resetPointerTilt } from "../lib/pointerTilt"
import { HoverLogoLink } from "./HoverLogoLink"

const popoverTiltPrefix = "mosaic-popover"

type WorkedWithCompany = {
  id: string
  name: string
  compactName: string
  logoUrls: string[]
  href: string
  relationship: "recent" | "previous" | "additional"
  role: string
  description: string
}

const workedWithCompanies: WorkedWithCompany[] = [
  {
    id: "0x",
    name: "0x.org",
    compactName: "0x.org",
    logoUrls: ["/logos/0x.png"],
    href: "https://0x.org",
    relationship: "recent",
    role: "Product designer",
    description: "Designing product surfaces across the 0x ecosystem.",
  },
  {
    id: "matcha",
    name: "Matcha.xyz",
    compactName: "Matcha.xyz",
    logoUrls: ["/logos/matcha.svg"],
    href: "https://matcha.xyz",
    relationship: "recent",
    role: "Product designer",
    description: "Shaping trading experiences for one of the clearest DEX products in crypto.",
  },
  {
    id: "moodys",
    name: "Moody's",
    compactName: "Moody's",
    logoUrls: ["/logos/moodys.png"],
    href: "https://www.moodys.com",
    relationship: "previous",
    role: "Frontend dev and designer",
    description: "Designed financial product workflows for data-dense, decision-heavy tools.",
  },
  {
    id: "twilio",
    name: "Twilio",
    compactName: "Twilio",
    logoUrls: ["/logos/twilio.svg"],
    href: "https://www.twilio.com",
    relationship: "previous",
    role: "Product designer",
    description: "Rethought developer tools and communication platform experiences.",
  },
  {
    id: "onit",
    name: "Onit",
    compactName: "Onit",
    logoUrls: ["/logos/onit.png"],
    href: "https://www.onit.com",
    relationship: "previous",
    role: "Frontend dev and designer",
    description: "Helped make legal operations software easier to navigate and understand.",
  },
  {
    id: "chainlink",
    name: "Chainlink",
    compactName: "Chainlink",
    logoUrls: ["/logos/chainlink.svg"],
    href: "https://chain.link",
    relationship: "previous",
    role: "Product designer",
    description: "Contributed to Web3 infrastructure interfaces with a focus on clarity and trust.",
  },
  {
    id: "google",
    name: "Google",
    compactName: "Google",
    logoUrls: ["/logos/Google_logo.svg"],
    href: "https://www.google.com",
    relationship: "additional",
    role: "Design collab",
    description: "Worked alongside product teams on focused interface explorations.",
  },
  {
    id: "patrol",
    name: "Protector and Patrol",
    compactName: "Protector and Patrol",
    logoUrls: ["/logos/protector.svg", "/logos/patrol.svg"],
    href: "https://protector.so/",
    relationship: "additional",
    role: "Design collab",
    description: "Shaped protection-focused mobile product experiences and interface explorations.",
  },
]

type WorkedWithCompaniesInlineProps = {
  variant?: "sentence" | "profile"
}

type PopoverPosition = {
  arrowX: number
  side: "above" | "below"
  x: number
  y: number
}

const recentGroupId = "recent-0x-matcha"
const openDelayMs = 120
const closeDelayMs = 180

function isHoverCapable() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches
}

function WorkHistoryTrigger({
  active,
  company,
  descriptionId,
  popoverId,
  onBlur,
  onClick,
  onFocus,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  setTrigger,
}: {
  active: boolean
  company: WorkedWithCompany
  descriptionId: string
  popoverId: string
  onBlur: (event: FocusEvent<HTMLElement>) => void
  onClick: (companyId: string) => void
  onFocus: (companyId: string) => void
  onPointerDown: (companyId: string) => void
  onPointerEnter: (companyId: string) => void
  onPointerLeave: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void
  setTrigger: (companyId: string, element: HTMLButtonElement | null) => void
}) {
  return (
    <button
      ref={(element) => setTrigger(company.id, element)}
      type="button"
      className={`mosaic-work-history-chip${active ? " is-active" : ""}`}
      aria-expanded={active}
      aria-controls={popoverId}
      aria-describedby={descriptionId}
      onClick={() => onClick(company.id)}
      onFocus={() => onFocus(company.id)}
      onBlur={onBlur}
      onPointerDown={() => onPointerDown(company.id)}
      onPointerEnter={() => onPointerEnter(company.id)}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
    >
      {company.compactName}
    </button>
  )
}

export function WorkedWithCompaniesInline({ variant = "sentence" }: WorkedWithCompaniesInlineProps) {
  const popoverId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>())
  const openTimeoutRef = useRef<number | undefined>(undefined)
  const closeTimeoutRef = useRef<number | undefined>(undefined)
  const pointerFocusCompanyIdRef = useRef<string | null>(null)
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null)
  const [isSwitchingCompany, setIsSwitchingCompany] = useState(false)
  const [position, setPosition] = useState<PopoverPosition>({ arrowX: 192, side: "above", x: 192, y: 0 })

  const profileCompanies = useMemo(() => {
    const recentCompanies = workedWithCompanies.filter((company) => company.relationship === "recent")
    const recentCompany = recentCompanies[1] ?? recentCompanies[0]
    const recentGroup: WorkedWithCompany | undefined = recentCompany
      ? {
          ...recentCompany,
          id: recentGroupId,
          name: "0x.org and Matcha.xyz",
          compactName: "0x.org and Matcha.xyz",
          logoUrls: recentCompanies.flatMap((company) => company.logoUrls),
        }
      : undefined
    const previousCompanyOrder = ["moodys", "chainlink", "twilio", "onit", "google", "patrol"]
    const previousCompanies = previousCompanyOrder.flatMap((companyId) => {
      const company = workedWithCompanies.find((candidate) => candidate.id === companyId)
      return company ? [company] : []
    })

    return { previousCompanies, recentGroup }
  }, [])

  const activeCompany =
    activeCompanyId === recentGroupId
      ? profileCompanies.recentGroup
      : profileCompanies.previousCompanies.find((company) => company.id === activeCompanyId)

  const clearOpenTimeout = () => window.clearTimeout(openTimeoutRef.current)
  const clearCloseTimeout = () => window.clearTimeout(closeTimeoutRef.current)

  const closePopover = useCallback(() => {
    clearOpenTimeout()
    clearCloseTimeout()
    setIsSwitchingCompany(false)
    setActiveCompanyId(null)
    // Otherwise a keyboard-opened panel inherits the lean from the last hover.
    if (containerRef.current) resetPointerTilt(containerRef.current, popoverTiltPrefix)
  }, [])

  const positionPopover = useCallback((companyId: string) => {
    const container = containerRef.current
    const popover = popoverRef.current
    const trigger = triggerRefs.current.get(companyId)
    if (!container || !popover || !trigger) return

    const containerBox = container.getBoundingClientRect()
    const triggerBox = trigger.getBoundingClientRect()
    const popoverWidth = popover.offsetWidth
    const popoverHeight = popover.offsetHeight
    const gap = 10
    const triggerCenter = triggerBox.left - containerBox.left + triggerBox.width / 2
    const halfPopover = popoverWidth / 2
    const x = Math.max(halfPopover, Math.min(triggerCenter, containerBox.width - halfPopover))
    const spaceAbove = triggerBox.top
    const spaceBelow = window.innerHeight - triggerBox.bottom
    const side: PopoverPosition["side"] =
      spaceAbove >= popoverHeight + gap || spaceAbove >= spaceBelow ? "above" : "below"
    const y =
      side === "above"
        ? triggerBox.top - containerBox.top - gap
        : triggerBox.bottom - containerBox.top + gap

    setPosition({
      arrowX: triggerCenter - (x - halfPopover),
      side,
      x,
      y,
    })
  }, [])

  useLayoutEffect(() => {
    if (activeCompanyId) positionPopover(activeCompanyId)
  }, [activeCompanyId, positionPopover])

  useEffect(() => {
    const handlePositionChange = () => {
      if (activeCompanyId) positionPopover(activeCompanyId)
    }
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) closePopover()
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || !activeCompanyId) return
      const activeTrigger = triggerRefs.current.get(activeCompanyId)
      closePopover()
      activeTrigger?.focus()
    }

    window.addEventListener("resize", handlePositionChange)
    window.addEventListener("scroll", handlePositionChange, { passive: true })
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("resize", handlePositionChange)
      window.removeEventListener("scroll", handlePositionChange)
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeCompanyId, closePopover, positionPopover])

  useEffect(
    () => () => {
      clearOpenTimeout()
      clearCloseTimeout()
    },
    [],
  )

  if (variant === "profile") {
    /** Let the panel fall flat once the cursor is no longer steering it. */
    const settleTilt = () => {
      if (containerRef.current) resetPointerTilt(containerRef.current, popoverTiltPrefix)
    }

    const openPopover = (companyId: string, delay = false) => {
      clearCloseTimeout()
      clearOpenTimeout()
      if (!delay || activeCompanyId) {
        setIsSwitchingCompany(activeCompanyId !== null && activeCompanyId !== companyId)
        setActiveCompanyId(companyId)
        return
      }
      openTimeoutRef.current = window.setTimeout(() => {
        setIsSwitchingCompany(false)
        setActiveCompanyId(companyId)
      }, openDelayMs)
    }

    const scheduleClose = () => {
      clearOpenTimeout()
      clearCloseTimeout()
      closeTimeoutRef.current = window.setTimeout(() => {
        setIsSwitchingCompany(false)
        setActiveCompanyId(null)
        settleTilt()
      }, closeDelayMs)
    }

    const handleTriggerPointerEnter = (companyId: string) => {
      if (isHoverCapable()) openPopover(companyId, true)
    }

    const handleTriggerFocus = (companyId: string) => {
      if (pointerFocusCompanyIdRef.current === companyId) return
      openPopover(companyId)
    }

    const handleTriggerPointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
      if (!isHoverCapable()) return
      settleTilt()
      const destination = event.relatedTarget
      if (destination instanceof Node && popoverRef.current?.contains(destination)) return
      scheduleClose()
    }

    // The popover is a sibling of the triggers, so measure the pointer against
    // the word it is leaning away from but hang the variables on the shared
    // container the popover can actually inherit from.
    const handleTriggerPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
      const container = containerRef.current
      if (!container || !isHoverCapable()) return

      applyPointerTilt({
        target: container,
        box: event.currentTarget.getBoundingClientRect(),
        pointer: event,
        scales: popoverTilt,
        prefix: popoverTiltPrefix,
      })
    }

    const handleFocusLeave = (event: FocusEvent<HTMLElement>) => {
      const destination = event.relatedTarget
      if (destination instanceof Node && containerRef.current?.contains(destination)) return
      closePopover()
    }

    const setTrigger = (companyId: string, element: HTMLButtonElement | null) => {
      if (element) triggerRefs.current.set(companyId, element)
      else triggerRefs.current.delete(companyId)
    }

    const handleTriggerClick = (companyId: string) => {
      clearOpenTimeout()
      clearCloseTimeout()
      pointerFocusCompanyIdRef.current = null
      const nextCompanyId = activeCompanyId === companyId ? null : companyId
      setIsSwitchingCompany(activeCompanyId !== null && nextCompanyId !== null)
      setActiveCompanyId(nextCompanyId)
    }

    const popoverStyle = {
      "--mosaic-popover-arrow-x": `${position.arrowX}px`,
      "--mosaic-popover-x": `${position.x}px`,
      "--mosaic-popover-y": `${position.y}px`,
    } as CSSProperties

    return (
      <div ref={containerRef} className="mosaic-work-history" aria-label="Work history">
        <div className="mosaic-work-history-line">
          <span className="mosaic-work-history-copy">Recently at</span>
          {profileCompanies.recentGroup ? (
            <WorkHistoryTrigger
              active={activeCompanyId === profileCompanies.recentGroup.id}
              company={profileCompanies.recentGroup}
              descriptionId={`${popoverId}-${profileCompanies.recentGroup.id}-description`}
              popoverId={popoverId}
              onBlur={handleFocusLeave}
              onClick={handleTriggerClick}
              onFocus={handleTriggerFocus}
              onPointerDown={(companyId) => {
                pointerFocusCompanyIdRef.current = companyId
              }}
              onPointerEnter={handleTriggerPointerEnter}
              onPointerLeave={handleTriggerPointerLeave}
              onPointerMove={handleTriggerPointerMove}
              setTrigger={setTrigger}
            />
          ) : null}
          <span className="mosaic-work-history-copy">previously worked with and at</span>
        </div>
        <div className="mosaic-work-history-line" aria-label="Previous companies">
          {profileCompanies.previousCompanies.map((company) => (
            <WorkHistoryTrigger
              key={company.id}
              active={activeCompanyId === company.id}
              company={company}
              descriptionId={`${popoverId}-${company.id}-description`}
              popoverId={popoverId}
              onBlur={handleFocusLeave}
              onClick={handleTriggerClick}
              onFocus={handleTriggerFocus}
              onPointerDown={(companyId) => {
                pointerFocusCompanyIdRef.current = companyId
              }}
              onPointerEnter={handleTriggerPointerEnter}
              onPointerLeave={handleTriggerPointerLeave}
              onPointerMove={handleTriggerPointerMove}
              setTrigger={setTrigger}
            />
          ))}
        </div>

        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-label={activeCompany ? `${activeCompany.name}, ${activeCompany.role}` : "Work history details"}
          aria-hidden={activeCompany ? undefined : true}
          className="mosaic-work-history-popover"
          data-open={activeCompany ? "true" : "false"}
          data-switching={isSwitchingCompany ? "true" : "false"}
          data-side={position.side}
          style={popoverStyle}
          onFocus={() => clearCloseTimeout()}
          onBlur={handleFocusLeave}
          onPointerEnter={() => {
            clearCloseTimeout()
            // Reading the panel should not fight the lean it arrived with.
            settleTilt()
          }}
          onPointerLeave={(event) => {
            if (!isHoverCapable()) return
            const destination = event.relatedTarget
            if (destination instanceof Node && containerRef.current?.contains(destination)) return
            scheduleClose()
          }}
        >
          <span className="mosaic-work-history-popover-arrow" aria-hidden="true" />
          {activeCompany ? (
            <div key={activeCompany.id} className="mosaic-work-history-popover-content">
              <div className="mosaic-work-history-popover-heading">
                <span className="mosaic-work-history-popover-logos" aria-hidden="true">
                  {activeCompany.logoUrls.map((logoUrl) => (
                    <span key={`${activeCompany.id}-${logoUrl}`} className="mosaic-work-history-popover-logo-wrap">
                      <img src={logoUrl} alt="" loading="eager" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="mosaic-work-history-popover-title">
                  <span className="mosaic-work-history-popover-name">{activeCompany.name}</span>
                  <span className="mosaic-work-history-popover-role">{activeCompany.role}</span>
                </span>
              </div>
              <p className="mosaic-work-history-popover-description">{activeCompany.description}</p>
              <a
                href={activeCompany.href}
                target="_blank"
                rel="noreferrer"
                className="mosaic-work-history-popover-link"
                aria-label={`Visit ${new URL(activeCompany.href).hostname.replace(/^www\./, "")}`}
              >
                {new URL(activeCompany.href).hostname.replace(/^www\./, "")}
                <span aria-hidden="true">›</span>
              </a>
            </div>
          ) : null}
        </div>

        <span className="sr-only">
          {[profileCompanies.recentGroup, ...profileCompanies.previousCompanies].flatMap((company) =>
            company ? (
              <span key={company.id} id={`${popoverId}-${company.id}-description`}>
                {company.role}. {company.description}
              </span>
            ) : [],
          )}
        </span>
      </div>
    )
  }

  return (
    <span className="mosaic-company-inline-list" aria-label="Companies I have worked with">
      {workedWithCompanies.map((company, index) => (
        <span key={company.name} className="mosaic-company-inline-item">
          <HoverLogoLink
            href={company.href}
            logoUrls={company.logoUrls}
            className="mosaic-company-inline-link"
            ariaLabel={`${company.name} website`}
            title={company.name}
          >
            {company.name}
          </HoverLogoLink>
          {index < workedWithCompanies.length - 2 ? ", " : index === workedWithCompanies.length - 2 ? ", and " : ""}
        </span>
      ))}
    </span>
  )
}
