import { AlertDialog } from "@base-ui/react/alert-dialog"
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Copy,
  Clock3,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

type Decision = "yes" | "no" | "discuss"
type Filter = "all" | "open" | Decision

type AuditItem = {
  id: string
  category: string
  priority: "High" | "Medium"
  title: string
  detail: string
  recommendation: string
  evidence: {
    src: string
    alt: string
    position: string
  }
  updatedIdea: string
}

type AuditResponse = {
  decision?: Decision
  note?: string
}

type SavedAudit = {
  projectName: string
  responses: Record<string, AuditResponse>
}

const STORAGE_KEY = "mobile-ux-audit-review-board-v3"

const auditItems: AuditItem[] = [
  {
    id: "contact-action-targets",
    category: "Touch targets",
    priority: "High",
    title: "Make primary contact actions easier to tap",
    detail: "Copy email, Message, and Follow are the hero’s primary conversion actions, but each control is only 32px tall. At 320px wide the Follow action also drops onto a second row by itself, weakening the group’s visual balance.",
    recommendation: "Increase coarse-pointer targets toward 44px and tune the narrow-screen padding and gaps so the three actions remain a deliberate group.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: mobile hero with compact Copy email, Message, and Follow actions",
      position: "center 14%",
    },
    updatedIdea: `[ Copy email ] [ Message ] [ Follow ]
      44px          44px        44px

At 320px: preserve one balanced row,
or use three equal-width columns.`,
  },
  {
    id: "company-chip-targets",
    category: "Touch targets",
    priority: "High",
    title: "Give compact controls more touch room",
    detail: "The company chips are roughly 29px tall and sit close together across multiple lines. Their density makes accidental taps more likely when a visitor opens a company detail on a phone.",
    recommendation: "Increase the effective hit area on coarse pointers while preserving the compact visual chip treatment.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: tightly grouped company chips in the mobile hero",
      position: "center 8%",
    },
    updatedIdea: `Recently at [ 0x + Matcha ]

[ Moody's ] [ Chainlink ] [ Twilio ]
[ Onit ]    [ Google ]    [ Protector ]

Visual chip stays compact;
touch target expands around it.`,
  },
  {
    id: "about-link-targets",
    category: "Touch targets",
    priority: "High",
    title: "Enlarge the About panel links",
    detail: "The Elsewhere links use text-sized targets; the X link measures about 10 by 18px. The links are visually clear but unnecessarily difficult to tap accurately near the bottom of a long page.",
    recommendation: "Add invisible inline padding or turn the destinations into compact 44px pills while keeping the understated styling.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: small text links in the mobile About panel",
      position: "center 96%",
    },
    updatedIdea: `Elsewhere

[ X ] [ GitHub ] [ LinkedIn ] [ Dribbble ]

Quiet visual styling,
comfortable touch geometry.`,
  },
  {
    id: "visible-work-heading",
    category: "Content hierarchy",
    priority: "High",
    title: "Show a visible Selected work heading",
    detail: "The Selected work heading exists for assistive technology but is visually hidden. On mobile, project cards begin immediately after the contact actions without an explicit transition into the portfolio.",
    recommendation: "Add a compact visible heading above the first project card; one short framing line is optional, not required.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: mobile layout moves directly from contact actions into project cards",
      position: "center 20%",
    },
    updatedIdea: `SELECTED WORK

+----------------------------+
| Matcha - Multiwallet flow  |
+----------------------------+`,
  },
  {
    id: "about-tab-targets",
    category: "Touch targets",
    priority: "Medium",
    title: "Enlarge the About switcher targets",
    detail: "About me and Work history are only 28px tall. The control reads clearly, but its interactive area is smaller than the project viewer controls and the mobile reveal button.",
    recommendation: "Keep the compact segmented-control appearance while expanding each tab’s hit target toward 44px on coarse pointers.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: compact About me and Work history tab controls",
      position: "center 83%",
    },
    updatedIdea: `+-------------------------------+
|   About me   |  Work history  |
+-------------------------------+
        44px minimum target`,
  },
  {
    id: "body-text-wrapping",
    category: "Typography",
    priority: "Medium",
    title: "Let body copy wrap naturally",
    detail: "A global text-wrap: balance rule affects every paragraph, label, and link. On narrow screens this shapes body copy into visually even but less natural lines and makes wrapping harder to predict.",
    recommendation: "Reserve text-wrap: balance for headings and use text-wrap: pretty for paragraphs and longer descriptions.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: globally balanced paragraph wrapping in the mobile About panel",
      position: "center 90%",
    },
    updatedIdea: `Headings:   text-wrap: balance
Paragraphs: text-wrap: pretty
Controls:   normal wrapping rules`,
  },
  {
    id: "location-status-wrap",
    category: "Responsive copy",
    priority: "Medium",
    title: "Keep the location status together",
    detail: "At 320px, the centered location and availability sentence can wrap with the middle dot leading the second line. The content remains understandable, but the punctuation looks stranded.",
    recommendation: "Model the location and availability as two nowrap groups and handle their separator explicitly when they wrap.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: centered location and availability status in the mobile hero",
      position: "center 12%",
    },
    updatedIdea: `Punta Cana & NYC
Available for work

No orphaned separator when wrapping.`,
  },
  {
    id: "theme-color",
    category: "Mobile browser",
    priority: "Medium",
    title: "Match the browser chrome to the page canvas",
    detail: "The document theme color is #f5f5f4 while the visible canvas is white or near-white. Mobile browser chrome can therefore show a subtly different band of color around the page.",
    recommendation: "Use the actual canvas color for the theme-color metadata, or deliberately carry the warmer surface into the page background.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: near-white portfolio canvas used as reference for the mobile browser theme color",
      position: "center 0%",
    },
    updatedIdea: `Page canvas:  #ffffff
Theme color:  #ffffff

Browser chrome and page meet cleanly.`,
  },
]
const decisions: Array<{ value: Decision; label: string; icon: typeof Check }> = [
  { value: "yes", label: "Yes", icon: Check },
  { value: "no", label: "No", icon: X },
  { value: "discuss", label: "Discuss", icon: MessageCircle },
]

const readSavedAudit = (): SavedAudit => {
  if (typeof window === "undefined") return { projectName: "Rafael Medina portfolio", responses: {} }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (!value) return { projectName: "Rafael Medina portfolio", responses: {} }
    const parsed = JSON.parse(value) as Partial<SavedAudit>
    return {
      projectName: typeof parsed.projectName === "string" ? parsed.projectName : "Rafael Medina portfolio",
      responses: parsed.responses && typeof parsed.responses === "object" ? parsed.responses : {},
    }
  } catch {
    return { projectName: "Rafael Medina portfolio", responses: {} }
  }
}

const formatAuditResponses = (savedAudit: SavedAudit) => {
  const groups: Array<{ heading: string; decision?: Decision }> = [
    { heading: "Yes", decision: "yes" },
    { heading: "No", decision: "no" },
    { heading: "Discuss", decision: "discuss" },
    { heading: "Open" },
  ]
  const reviewed = Object.values(savedAudit.responses).filter((response) => response.decision).length
  const sections = groups.flatMap(({ heading, decision }) => {
    const items = auditItems.filter((item) => savedAudit.responses[item.id]?.decision === decision)
    if (items.length === 0) return []

    const lines = items.flatMap((item) => {
      const note = savedAudit.responses[item.id]?.note?.trim()
      return note ? [`- ${item.title}`, `  - Note: ${note}`] : [`- ${item.title}`]
    })
    return [`## ${heading}`, ...lines, ""]
  })

  return [
    `# UX audit responses — ${savedAudit.projectName.trim() || "Untitled audit"}`,
    "",
    `Reviewed: ${reviewed} of ${auditItems.length}`,
    "",
    ...sections,
  ].join("\n").trimEnd()
}

export function AuditPage() {
  const [savedAudit, setSavedAudit] = useState(readSavedAudit)
  const [filter, setFilter] = useState<Filter>("all")
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")
  const copyResetTimeoutRef = useRef<number | undefined>(undefined)
  const clearCancelRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAudit))
  }, [savedAudit])

  useEffect(() => () => window.clearTimeout(copyResetTimeoutRef.current), [])

  const counts = useMemo(() => {
    const summary = { yes: 0, no: 0, discuss: 0 }
    for (const response of Object.values(savedAudit.responses)) {
      if (response.decision) summary[response.decision] += 1
    }
    return summary
  }, [savedAudit.responses])

  const reviewed = counts.yes + counts.no + counts.discuss
  const open = auditItems.length - reviewed
  const completion = (reviewed / auditItems.length) * 100
  const visibleItems = auditItems.filter((item) => {
    const decision = savedAudit.responses[item.id]?.decision
    if (filter === "all") return true
    if (filter === "open") return !decision
    return decision === filter
  })

  const setDecision = (itemId: string, decision: Decision) => {
    setSavedAudit((current) => ({
      ...current,
      responses: {
        ...current.responses,
        [itemId]: { ...current.responses[itemId], decision },
      },
    }))
  }

  const setNote = (itemId: string, note: string) => {
    setSavedAudit((current) => ({
      ...current,
      responses: {
        ...current.responses,
        [itemId]: { ...current.responses[itemId], note },
      },
    }))
  }

  const clearResponses = () => {
    setSavedAudit((current) => ({ ...current, responses: {} }))
    setFilter("all")
  }

  const copyResponses = async () => {
    try {
      await navigator.clipboard.writeText(formatAuditResponses(savedAudit))
      setCopyState("copied")
    } catch {
      setCopyState("error")
    }

    window.clearTimeout(copyResetTimeoutRef.current)
    copyResetTimeoutRef.current = window.setTimeout(() => setCopyState("idle"), 1800)
  }

  const filters: Array<{ value: Filter; label: string; count: number }> = [
    { value: "all", label: "All", count: auditItems.length },
    { value: "open", label: "Open", count: open },
    { value: "yes", label: "Yes", count: counts.yes },
    { value: "no", label: "No", count: counts.no },
    { value: "discuss", label: "Discuss", count: counts.discuss },
  ]

  return (
    <AlertDialog.Root>
      <div className="audit-app">
      <a className="audit-skip-link" href="#audit-list">
        Skip to recommendations
      </a>

      <header className="audit-topbar">
        <a className="audit-brand" href="/audit" aria-label="UX Audit home">
          <span className="audit-brand-mark" aria-hidden="true">
            <Sparkles size={17} strokeWidth={2} />
          </span>
          Review board
        </a>
        <div className="audit-save-state">
          <ShieldCheck size={15} aria-hidden="true" />
          Saved locally
        </div>
      </header>

      <main className="audit-shell">
        <section className="audit-intro" aria-labelledby="audit-title">
          <div className="audit-eyebrow">
            <span>Product review</span>
            <ChevronRight size={14} aria-hidden="true" />
            <label htmlFor="project-name">Audit</label>
          </div>
          <div className="audit-title-row">
            <div>
              <h1 id="audit-title">Mobile UX audit</h1>
              <p>Review the current mobile portfolio findings, then capture which improvements to accept, deny, or discuss before implementation.</p>
            </div>
            <div className="audit-title-actions">
              <button
                className="audit-copy-button"
                type="button"
                aria-label="Copy responses"
                onClick={copyResponses}
                disabled={reviewed === 0}
              >
                {copyState === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy responses"}
              </button>
              <AlertDialog.Trigger className="audit-clear-button" disabled={reviewed === 0}>
                <RotateCcw size={15} aria-hidden="true" />
                Clear responses
              </AlertDialog.Trigger>
            </div>
          </div>
          <div className="audit-project-field">
            <label htmlFor="project-name">Project or flow</label>
            <input
              id="project-name"
              value={savedAudit.projectName}
              onChange={(event) => setSavedAudit((current) => ({ ...current, projectName: event.target.value }))}
              placeholder="Name this audit"
            />
          </div>
        </section>

        <div className="audit-workspace">
          <aside className="audit-summary" aria-label="Audit progress">
            <div className="audit-summary-header">
              <span className="audit-summary-label">Review progress</span>
              <span className="audit-summary-fraction">{reviewed} / {auditItems.length}</span>
            </div>
            <div className="audit-progress-track" aria-hidden="true">
              <span className="t-resize" style={{ width: `${completion}%` }} />
            </div>
            <p className="audit-reviewed-count">{reviewed} of {auditItems.length} reviewed</p>

            <dl className="audit-tally">
              <div>
                <dt><span className="audit-dot audit-dot-yes" />Yes</dt>
                <dd data-testid="yes-count">{counts.yes}</dd>
              </div>
              <div>
                <dt><span className="audit-dot audit-dot-no" />No</dt>
                <dd data-testid="no-count">{counts.no}</dd>
              </div>
              <div>
                <dt><span className="audit-dot audit-dot-discuss" />Discuss</dt>
                <dd data-testid="discuss-count">{counts.discuss}</dd>
              </div>
            </dl>

            <div className="audit-summary-note">
              <Clock3 size={16} aria-hidden="true" />
              <p>Your responses stay in this browser so you can leave and pick up where you stopped.</p>
            </div>
          </aside>

          <section className="audit-review-panel" aria-labelledby="recommendations-heading">
            <div className="audit-panel-header">
              <div>
                <p className="audit-section-kicker">Audit checklist</p>
                <h2 id="recommendations-heading">Recommendations</h2>
              </div>
              <div className="audit-filter-list" aria-label="Filter recommendations">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className="audit-filter"
                    aria-pressed={filter === item.value}
                    onClick={() => setFilter(item.value)}
                  >
                    {item.label} <span>{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="audit-list" id="audit-list">
              {visibleItems.length > 0 ? visibleItems.map((item) => {
                const response = savedAudit.responses[item.id] ?? {}
                return (
                  <article className="audit-item" key={item.id} data-decision={response.decision ?? "open"}>
                    <div className="audit-item-number" aria-hidden="true">
                      {response.decision ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    <div className="audit-item-content">
                      <div className="audit-item-meta">
                        <span>{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className={`audit-priority audit-priority-${item.priority.toLowerCase()}`}>{item.priority} priority</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.detail}</p>
                      <div className="audit-recommendation">
                        <strong>Suggestion</strong>
                        <span>{item.recommendation}</span>
                      </div>

                      <div className="audit-comparison">
                        <figure className="audit-before">
                          <figcaption>Before</figcaption>
                          <div className="audit-before-frame">
                            <img
                              className="audit-evidence-image"
                              src={item.evidence.src}
                              alt={item.evidence.alt}
                              loading="lazy"
                              style={{ objectPosition: item.evidence.position }}
                            />
                          </div>
                        </figure>
                        <figure className="audit-updated-idea">
                          <figcaption>Updated idea</figcaption>
                          <pre aria-label={`ASCII updated idea for ${item.title}`}>{item.updatedIdea}</pre>
                        </figure>
                      </div>

                      <div className="audit-decision-row">
                        <div className="audit-decision-group" role="radiogroup" aria-label={`Decision for ${item.title}`}>
                          {decisions.map(({ value, label, icon: Icon }) => (
                            <label
                              className={`audit-decision audit-decision-${value}`}
                              key={value}
                            >
                              <input
                                type="radio"
                                name={`decision-${item.id}`}
                                value={value}
                                checked={response.decision === value}
                                onChange={() => setDecision(item.id, value)}
                              />
                              <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                              {label}
                            </label>
                          ))}
                        </div>
                        {!response.decision ? <span className="audit-awaiting">Awaiting review</span> : null}
                      </div>

                      {response.decision === "discuss" ? (
                        <div className="audit-note-field">
                          <label htmlFor={`${item.id}-note`}>Discussion note</label>
                          <textarea
                            id={`${item.id}-note`}
                            value={response.note ?? ""}
                            onChange={(event) => setNote(item.id, event.target.value)}
                            placeholder="What needs alignment? Add a question, owner, or next step…"
                            rows={3}
                          />
                        </div>
                      ) : null}
                    </div>
                  </article>
                )
              }) : (
                <div className="audit-empty-state">
                  <CheckCircle2 size={24} aria-hidden="true" />
                  <h3>No recommendations here</h3>
                  <p>Try another filter to continue the review.</p>
                  <button type="button" onClick={() => setFilter("all")}>Show all</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      </div>

      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="audit-dialog-backdrop" />
        <AlertDialog.Popup className="audit-dialog t-modal" initialFocus={clearCancelRef}>
            <div className="audit-dialog-icon"><RotateCcw size={19} aria-hidden="true" /></div>
            <AlertDialog.Title>Clear every response?</AlertDialog.Title>
            <AlertDialog.Description>This removes all decisions and discussion notes from this browser. Your project name will stay.</AlertDialog.Description>
            <div className="audit-dialog-actions">
              <AlertDialog.Close ref={clearCancelRef}>Cancel</AlertDialog.Close>
              <AlertDialog.Close className="audit-dialog-confirm" onClick={clearResponses}>Clear all</AlertDialog.Close>
            </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
