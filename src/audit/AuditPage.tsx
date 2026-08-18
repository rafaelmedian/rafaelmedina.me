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

const STORAGE_KEY = "ux-audit-review-board-v2"

const auditItems: AuditItem[] = [
  {
    id: "specific-positioning",
    category: "Landing",
    priority: "High",
    title: "Make the positioning specific above the fold",
    detail: "The opening identifies Rafael as a freelance product designer, but his strongest differentiators—prototyping in code and experience across fintech, web3, and consumer products—appear much later.",
    recommendation: "Replace the generic role line with a short value proposition that says what Rafael is unusually good at and who he helps.",
    evidence: {
      src: "/audit/before-desktop-landing.png",
      alt: "Before: desktop portfolio introduction with the generic Product Designer, Freelance role line",
      position: "center 0%",
    },
    updatedIdea: `+----------------------------------+
| Rafael Medina                    |
| Product designer who prototypes  |
| complex fintech products in code |
|                                  |
| [Selected work]  [Email me]      |
+----------------------------------+`,
  },
  {
    id: "work-introduction",
    category: "Work grid",
    priority: "High",
    title: "Introduce the work before showing the mosaic",
    detail: "The desktop experience moves directly from availability into a large image grid. The “Selected work” heading is present semantically, but it is not visually carrying the transition or explaining how the grid works.",
    recommendation: "Add a visible section heading and one concise line that frames the work, the interaction, and the kind of contribution shown.",
    evidence: {
      src: "/audit/before-desktop-landing.png",
      alt: "Before: desktop portfolio transitions directly from availability to the image mosaic",
      position: "center 23%",
    },
    updatedIdea: `SELECTED WORK
Complex product problems, shipped.
Open a project for context and outcomes.

                |
                v
+----------+ +----------+ +----------+
| Project  | | Project  | | Project  |
+----------+ +----------+ +----------+`,
  },
  {
    id: "persistent-project-labels",
    category: "Work grid",
    priority: "High",
    title: "Keep project labels visible on desktop",
    detail: "Desktop visitors initially see strong imagery without project names, roles, or outcomes; titles appear only after hover or keyboard focus. Mobile visitors get persistent titles, creating a clearer scan.",
    recommendation: "Show a compact title and project type on every tile by default, then reserve hover for secondary detail or motion.",
    evidence: {
      src: "/audit/before-desktop-landing.png",
      alt: "Before: desktop project mosaic shows unlabeled artwork before hover",
      position: "center 40%",
    },
    updatedIdea: `+--------------------------+
|                          |
|       PROJECT ART        |
|                          |
+--------------------------+
| Matcha multiwallet       |
| Product UX - Fintech     |
+--------------------------+`,
  },
  {
    id: "desktop-preview-exit",
    category: "Project viewer",
    priority: "High",
    title: "Give the desktop project viewer a visible close control",
    detail: "The desktop viewer exposes previous and next arrows but no close button. Escape and clicking outside work, yet neither exit is discoverable from the interface. Mobile does include a clear close control.",
    recommendation: "Use the same visible close button on every viewport and keep it grouped with the viewer navigation.",
    evidence: {
      src: "/audit/before-desktop-project-preview.png",
      alt: "Before: desktop project viewer shows previous and next controls without a close button",
      position: "center",
    },
    updatedIdea: `+----------------------------------+
| Project preview             [X] |
|                                  |
|          PROJECT ART             |
|                                  |
+----------------------------------+
| [< Previous]  1 / 12  [Next >]  |
+----------------------------------+`,
  },
  {
    id: "case-study-depth",
    category: "Project detail",
    priority: "High",
    title: "Turn visual previews into evidence of impact",
    detail: "The viewer explains the product, industry, team, and a short scenario, but it does not show Rafael’s role, the problem, key decisions, or measurable outcome—information a hiring manager needs to assess the work.",
    recommendation: "Add a lightweight case-study layer for each project: challenge, ownership, one pivotal decision, and outcome before the gallery metadata.",
    evidence: {
      src: "/audit/before-desktop-project-preview.png",
      alt: "Before: project viewer contains artwork and metadata but limited case-study context",
      position: "center",
    },
    updatedIdea: `+------------+    +------------+
| CHALLENGE  | -> | DECISION   |
| 2 wallets  |    | one switch |
+------------+    +------------+
        \\
         +------> +----------------+
                  | OUTCOME        |
                  | fewer dropoffs |
                  +----------------+`,
  },
  {
    id: "preview-orientation",
    category: "Project viewer",
    priority: "Medium",
    title: "Show position and navigation meaning on desktop",
    detail: "Mobile shows “1 / 12” and groups previous, next, and close. Desktop uses two compact vertical arrow buttons without a visible count, so the size and direction of the collection are harder to understand.",
    recommendation: "Add a current/total counter and make previous versus next legible without relying on arrow direction alone.",
    evidence: {
      src: "/audit/before-desktop-project-preview.png",
      alt: "Before: desktop project viewer uses two unlabeled vertical arrows and no position counter",
      position: "center",
    },
    updatedIdea: `+----------------------------------+
| Matcha multiwallet               |
|                                  |
| [< Previous]   1 / 12   [Next >]|
|                                  |
| Keyboard: arrows move, Esc exits |
+----------------------------------+`,
  },
  {
    id: "mobile-scan-length",
    category: "Mobile",
    priority: "High",
    title: "Shorten the path through selected work on mobile",
    detail: "All 12 previews stack before the About section. The imagery remains readable, but the sequence becomes a long undifferentiated scroll before visitors can learn how Rafael thinks or reach the closing contact prompt.",
    recommendation: "Lead with three to five strongest projects, then reveal the rest with “View more” or organize the work into compact case-study groups.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: mobile portfolio stacks all twelve project previews before the About section",
      position: "center 50%",
    },
    updatedIdea: `+------------------+
| Hero             |
+------------------+
| Case study 1     |
| Case study 2     |
| Case study 3     |
+------------------+
| [View 9 more]    |
+------------------+
| About + Contact  |
+------------------+`,
  },
  {
    id: "project-grouping",
    category: "Information architecture",
    priority: "Medium",
    title: "Group repeated Matcha work into a coherent story",
    detail: "Most tiles are Matcha screens, mixed one-by-one with Popparazi and Protector. This shows range within the product but makes the portfolio read like a gallery of screens rather than a curated set of projects.",
    recommendation: "Group related Matcha artifacts under one case study with chapters, and let distinct products lead their own project entries.",
    evidence: {
      src: "/audit/before-desktop-landing.png",
      alt: "Before: individual Matcha screens are mixed with unrelated projects in one mosaic",
      position: "center 58%",
    },
    updatedIdea: `[MATCHA CASE STUDY]
 |
 +-- Wallet management
 +-- Trading experience
 \\-- Mobile navigation

[POPPARAZI CASE STUDY]

[PROTECTOR CASE STUDY]`,
  },
  {
    id: "shareable-resume",
    category: "Résumé",
    priority: "Medium",
    title: "Make the résumé easy to share and take away",
    detail: "The résumé tab is clear and detailed, but it has no dedicated URL, download action, or print-friendly handoff. Recruiters cannot link directly to this state or keep a conventional copy.",
    recommendation: "Give the résumé a stable hash or route and add a restrained “Download PDF” or “Print résumé” action.",
    evidence: {
      src: "/audit/before-desktop-resume.png",
      alt: "Before: desktop résumé tab has no share, print, or download action",
      position: "center",
    },
    updatedIdea: `ABOUT ME  |  RESUME
-------------------------------
Senior Product Designer
Ten years across web3, fintech...

[Download PDF]  [Copy resume link]

Experience
0x Project ........ 2021 - 2026`,
  },
  {
    id: "repeat-contact-path",
    category: "Contact",
    priority: "Medium",
    title: "Repeat a strong contact path after the work",
    detail: "Copy email and LinkedIn are clear near the top, and the copy action gives excellent inline and screen-reader feedback. After the long mobile work sequence, however, the next contact opportunity is a quiet text link at the bottom of About.",
    recommendation: "Add a compact availability and contact block directly after Selected work, repeating email and LinkedIn at the moment interest is highest.",
    evidence: {
      src: "/audit/before-mobile-landing.png",
      alt: "Before: mobile contact prompt appears only after the long work and About sequence",
      position: "center 100%",
    },
    updatedIdea: `[SELECTED WORK ENDS]

+----------------------------+
| Available for new projects |
|                            |
| [Copy email]  [LinkedIn]   |
+----------------------------+

[ABOUT RAFAEL]`,
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
        <a className="audit-brand" href="/audit.html" aria-label="UX Audit home">
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
              <h1 id="audit-title">UX audit</h1>
              <p>Review findings from the portfolio’s desktop and mobile visitor journey, then capture where the team agrees, disagrees, or needs a conversation.</p>
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
              <span style={{ width: `${completion}%` }} />
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
        <AlertDialog.Popup className="audit-dialog" initialFocus={clearCancelRef}>
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
