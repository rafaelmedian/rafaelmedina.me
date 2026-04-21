import { Fragment, useEffect, useId, useRef, useState, type CSSProperties } from "react"

import { HoverLogoLink } from "./HoverLogoLink"

type WorkedWithCompany = {
  id: string
  name: string
  compactName: string
  logoUrls: string[]
  href: string
  relationship: "recent" | "previous" | "additional"
  role: string
  description: string
  expandedText: string
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
    expandedText: "0x.org and Matcha.xyz, shaping trading experiences for one of the clearest DEX products in crypto.",
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
    expandedText: "0x.org and Matcha.xyz, shaping trading experiences for one of the clearest DEX products in crypto.",
  },
  {
    id: "moodys",
    name: "Moody's",
    compactName: "Moody's",
    logoUrls: ["/logos/moodys.png"],
    href: "https://www.moodys.com",
    relationship: "previous",
    role: "Product designer",
    description: "Designed financial product workflows for data-dense, decision-heavy tools.",
    expandedText: "Moody's, designed financial product workflows for data-dense, decision-heavy tools.",
  },
  {
    id: "twilio",
    name: "Twilio",
    compactName: "Twilio",
    logoUrls: ["/logos/twilio.svg"],
    href: "https://www.twilio.com",
    relationship: "previous",
    role: "Product designer",
    description: "Worked on developer tools and communication platform experiences.",
    expandedText: "Twilio, rethought developer tools and communication platform experiences.",
  },
  {
    id: "onit",
    name: "Onit",
    compactName: "Onit",
    logoUrls: ["/logos/onit.png"],
    href: "https://www.onit.com",
    relationship: "previous",
    role: "Product designer",
    description: "Helped make legal operations software easier to navigate and understand.",
    expandedText: "Onit, helped make legal operations software easier to navigate and understand.",
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
    expandedText: "Chainlink, contributed to Web3 infrastructure interfaces with a focus on clarity and trust.",
  },
  {
    id: "google",
    name: "Google",
    compactName: "Google",
    logoUrls: ["/logos/Google_logo.svg"],
    href: "https://www.google.com",
    relationship: "additional",
    role: "Product design collaborator",
    description: "Worked alongside product teams on focused interface explorations.",
    expandedText: "Google, worked alongside product teams on focused interface explorations.",
  },
  {
    id: "patrol",
    name: "Protector and Patrol",
    compactName: "Protector and Patrol",
    logoUrls: ["/logos/protector.svg", "/logos/patrol.svg"],
    href: "https://protector.so/",
    relationship: "additional",
    role: "Product design collaborator",
    description: "Shaped protection-focused mobile product experiences and interface explorations.",
    expandedText: "Protector and Patrol, shaped protection-focused mobile product experiences and interface explorations.",
  },
]

type WorkedWithCompaniesInlineProps = {
  variant?: "sentence" | "profile"
}

const recentGroupId = "recent-0x-matcha"
const moreInfoId = "more-info"
const typingWordDelayMs = 48
const collapseWordAnimationMs = 190
const collapseWordStaggerMs = typingWordDelayMs
const collapseSettleMs = 0
const recentExpandedSegments = [
  "0x.org and Matcha.xyz, shaping trading experiences",
  "for one of the clearest DEX products in crypto.",
]
const moreInfoSegments = [
  "I've worked in product design since 2015 and now freelance on focused, high-impact projects.",
  "You can reach me at @rafaelmedian or hey@rafaelmedina.me",
]
const moreInfoLinks: Record<string, string> = {
  "@rafaelmedian": "https://x.com/rafaelmedian",
  "hey@rafaelmedina.me": "mailto:hey@rafaelmedina.me",
}
const expandedCompanyLinks: Record<string, Record<string, string>> = {
  [recentGroupId]: {
    "0x.org": "https://0x.org",
    "Matcha.xyz,": "https://matcha.xyz",
  },
  moodys: {
    "Moody's,": "https://www.moodys.com",
  },
  chainlink: {
    "Chainlink,": "https://chain.link",
  },
  twilio: {
    "Twilio,": "https://www.twilio.com",
  },
  onit: {
    "Onit,": "https://www.onit.com",
  },
  google: {
    "Google,": "https://www.google.com",
  },
  patrol: {
    Protector: "https://protector.so/",
    "Patrol,": "https://patrol.so/",
  },
}
const companyExpandedSegments: Record<string, string[]> = {
  [recentGroupId]: recentExpandedSegments,
  [moreInfoId]: moreInfoSegments,
  "0x": recentExpandedSegments,
  matcha: recentExpandedSegments,
  moodys: ["Moody's, designed financial product workflows", "for data-dense, decision-heavy tools."],
  twilio: ["Twilio, rethought developer tools", "and communication platform experiences."],
  onit: ["Onit, helped make legal operations software", "easier to navigate and understand."],
  chainlink: ["Chainlink, contributed to Web3 infrastructure interfaces", "with a focus on clarity and trust."],
  google: ["Google, worked alongside product teams", "on focused interface explorations."],
  patrol: ["Protector and Patrol, shaped protection-focused", "mobile product experiences and interface explorations."],
}

function getExpandedSegmentsForCompanyId(companyId: string | null) {
  if (!companyId) return []
  return companyExpandedSegments[companyId] ?? []
}

function getExpandedTextForCompanyId(companyId: string | null) {
  if (!companyId) return ""
  const expandedSegments = getExpandedSegmentsForCompanyId(companyId)
  if (expandedSegments.length > 0) return expandedSegments.join(" ")
  return workedWithCompanies.find((company) => company.id === companyId)?.expandedText ?? ""
}

function shouldReduceMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getVisibleWordsForSegment(segments: string[], segmentIndex: number, visibleWordCount: number) {
  const precedingWordCount = segments
    .slice(0, segmentIndex)
    .reduce((wordCount, segment) => wordCount + segment.split(" ").length, 0)
  const segmentWords = segments[segmentIndex].split(" ")
  const visibleSegmentWordCount = Math.max(0, Math.min(segmentWords.length, visibleWordCount - precedingWordCount))

  return segmentWords.slice(0, visibleSegmentWordCount)
}

function getCollapseAnimationMs(visibleWordCount: number) {
  return collapseWordAnimationMs + Math.max(0, visibleWordCount - 1) * collapseWordStaggerMs + collapseSettleMs
}

function getCollapseStyle(visibleWordCount: number, isCollapsing: boolean) {
  if (!isCollapsing) return undefined

  return {
    "--mosaic-collapse-duration": `${getCollapseAnimationMs(visibleWordCount)}ms`,
    "--mosaic-collapse-logo-delay": `${Math.max(0, visibleWordCount - 1) * collapseWordStaggerMs}ms`,
  } as CSSProperties
}

function getCollapseWordStyle(collapseDelayIndex: number | undefined) {
  if (collapseDelayIndex === undefined) return undefined

  return {
    "--mosaic-collapse-word-index": collapseDelayIndex,
  } as CSSProperties
}

export function WorkedWithCompaniesInline({ variant = "sentence" }: WorkedWithCompaniesInlineProps) {
  const disclosureId = useId()
  const [activeCompanyIds, setActiveCompanyIds] = useState<string[]>([])
  const [collapsingCompanyIds, setCollapsingCompanyIds] = useState<string[]>([])
  const [collapseStartWordCounts, setCollapseStartWordCounts] = useState<Record<string, number>>({})
  const [visibleWordCounts, setVisibleWordCounts] = useState<Record<string, number>>({})
  const collapseTimeoutIdsRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const collapseTimeoutIds = collapseTimeoutIdsRef.current

    return () => {
      Object.values(collapseTimeoutIds).forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

  useEffect(() => {
    const typingCompanyIds = activeCompanyIds.filter((companyId) => !collapsingCompanyIds.includes(companyId))

    if (typingCompanyIds.length === 0 || shouldReduceMotion()) {
      return
    }

    const hasPendingWords = typingCompanyIds.some((companyId) => {
      const expandedText = getExpandedTextForCompanyId(companyId)
      const wordCount = expandedText.split(" ").length
      const visibleWordCount = visibleWordCounts[companyId] ?? 0

      return expandedText && visibleWordCount > 0 && visibleWordCount < wordCount
    })

    if (!hasPendingWords) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleWordCounts((currentWordCounts) => {
        let hasChanges = false
        const nextWordCounts = { ...currentWordCounts }

        typingCompanyIds.forEach((companyId) => {
          const expandedText = getExpandedTextForCompanyId(companyId)
          const wordCount = expandedText.split(" ").length
          const currentWordCount = nextWordCounts[companyId] ?? 0

          if (!expandedText || currentWordCount <= 0 || currentWordCount >= wordCount) {
            return
          }

          nextWordCounts[companyId] = Math.min(currentWordCount + 1, wordCount)
          hasChanges = true
        })

        return hasChanges ? nextWordCounts : currentWordCounts
      })
    }, typingWordDelayMs)

    return () => window.clearTimeout(timeoutId)
  }, [activeCompanyIds, collapsingCompanyIds, visibleWordCounts])

  useEffect(() => {
    const shrinkingCompanyIds = collapsingCompanyIds.filter((companyId) => (visibleWordCounts[companyId] ?? 0) > 0)

    if (shrinkingCompanyIds.length === 0 || shouldReduceMotion()) {
      return
    }

    const isFirstCollapseTick = shrinkingCompanyIds.some(
      (companyId) => visibleWordCounts[companyId] === collapseStartWordCounts[companyId],
    )
    const timeoutId = window.setTimeout(
      () => {
        setVisibleWordCounts((currentWordCounts) => {
          let hasChanges = false
          const nextWordCounts = { ...currentWordCounts }

          shrinkingCompanyIds.forEach((companyId) => {
            const currentWordCount = nextWordCounts[companyId] ?? 0

            if (currentWordCount <= 0) {
              return
            }

            nextWordCounts[companyId] = Math.max(0, currentWordCount - 1)
            hasChanges = true
          })

          return hasChanges ? nextWordCounts : currentWordCounts
        })
      },
      isFirstCollapseTick ? collapseWordAnimationMs : collapseWordStaggerMs,
    )

    return () => window.clearTimeout(timeoutId)
  }, [collapseStartWordCounts, collapsingCompanyIds, visibleWordCounts])

  const closeExpansion = (companyId: string) => {
    const finishCollapse = () => {
      setActiveCompanyIds((currentCompanyIds) => currentCompanyIds.filter((currentCompanyId) => currentCompanyId !== companyId))
      setCollapsingCompanyIds((currentCompanyIds) => currentCompanyIds.filter((currentCompanyId) => currentCompanyId !== companyId))
      setCollapseStartWordCounts((currentWordCounts) => {
        const nextWordCounts = { ...currentWordCounts }
        delete nextWordCounts[companyId]
        return nextWordCounts
      })
      setVisibleWordCounts((currentWordCounts) => {
        const nextWordCounts = { ...currentWordCounts }
        delete nextWordCounts[companyId]
        return nextWordCounts
      })
      delete collapseTimeoutIdsRef.current[companyId]
    }

    window.clearTimeout(collapseTimeoutIdsRef.current[companyId])

    if (shouldReduceMotion()) {
      finishCollapse()
      return
    }

    const visibleWordCountAtCollapse = visibleWordCounts[companyId] ?? 1
    setCollapseStartWordCounts((currentWordCounts) => ({
      ...currentWordCounts,
      [companyId]: visibleWordCountAtCollapse,
    }))
    setCollapsingCompanyIds((currentCompanyIds) =>
      currentCompanyIds.includes(companyId) ? currentCompanyIds : [...currentCompanyIds, companyId],
    )
    collapseTimeoutIdsRef.current[companyId] = window.setTimeout(
      finishCollapse,
      getCollapseAnimationMs(visibleWordCounts[companyId] ?? 1),
    )
  }

  const openExpansion = (companyId: string) => {
    window.clearTimeout(collapseTimeoutIdsRef.current[companyId])
    delete collapseTimeoutIdsRef.current[companyId]
    setCollapsingCompanyIds((currentCompanyIds) => currentCompanyIds.filter((currentCompanyId) => currentCompanyId !== companyId))
    setCollapseStartWordCounts((currentWordCounts) => {
      const nextWordCounts = { ...currentWordCounts }
      delete nextWordCounts[companyId]
      return nextWordCounts
    })

    const expandedText = getExpandedTextForCompanyId(companyId)
    const wordCount = expandedText.split(" ").length
    setVisibleWordCounts((currentWordCounts) => ({
      ...currentWordCounts,
      [companyId]: shouldReduceMotion() ? wordCount : 1,
    }))
    setActiveCompanyIds((currentCompanyIds) => (currentCompanyIds.includes(companyId) ? currentCompanyIds : [...currentCompanyIds, companyId]))
  }

  if (variant === "profile") {
    const recentCompanies = workedWithCompanies.filter((company) => company.relationship === "recent")
    const previousCompanyOrder = ["moodys", "chainlink", "twilio", "onit", "google", "patrol"]
    const previousCompanies = previousCompanyOrder.flatMap((companyId) => {
      const company = workedWithCompanies.find((candidate) => candidate.id === companyId)
      return company ? [company] : []
    })
    const isRecentCompanyActive = activeCompanyIds.includes(recentGroupId)
    const isMoreInfoActive = activeCompanyIds.includes(moreInfoId)
    const recentExpandedCompany = recentCompanies[1] ?? recentCompanies[0]
    const recentCollapsedLabel = "0x.org and Matcha.xyz"

    const toggleCompany = (companyId: string) => {
      if (activeCompanyIds.includes(companyId)) {
        closeExpansion(companyId)
        return
      }

      openExpansion(companyId)
    }

    const renderTypedWords = (
      words: string[],
      keyPrefix: string,
      {
        links = {},
        onLinkedWordClick,
        isCollapsing = false,
        collapseDelayOffset = 0,
      }: {
        links?: Record<string, string>
        onLinkedWordClick?: () => void
        isCollapsing?: boolean
        collapseDelayOffset?: number
      } = {},
    ) => {
      const hasLinkedWords = Object.keys(links).length > 0

      return (
        <span className="mosaic-work-history-chip-copy" aria-hidden={hasLinkedWords ? undefined : true}>
          {words.map((word, wordIndex) => {
            const href = links[word]
            const className = `mosaic-work-history-inline-word${href ? " mosaic-work-history-inline-link" : ""}`
            const collapseWordStyle = getCollapseWordStyle(
              isCollapsing ? collapseDelayOffset + words.length - wordIndex - 1 : undefined,
            )
            const children = (
              <>
                {word}
                {wordIndex < words.length - 1 ? "\u00a0" : ""}
              </>
            )

            return href ? (
              <a
                key={`${keyPrefix}-${word}-${wordIndex}`}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className={className}
                style={collapseWordStyle}
                onClick={(event) => {
                  event.stopPropagation()
                  onLinkedWordClick?.()
                }}
              >
                {children}
              </a>
            ) : (
              <span key={`${keyPrefix}-${word}-${wordIndex}`} className={className} style={collapseWordStyle}>
                {children}
              </span>
            )
          })}
        </span>
      )
    }

    const renderExpandedLogos = (company: WorkedWithCompany, logoUrls = company.logoUrls) => {
      if (logoUrls.length === 0) return null

      return (
        <span className="mosaic-work-history-expanded-logos" aria-hidden="true">
          {logoUrls.map((logoUrl) => (
            <span key={`${company.id}-${logoUrl}`} className="mosaic-work-history-expanded-logo-wrap">
              <img src={logoUrl} alt="" loading="eager" decoding="async" className="mosaic-work-history-expanded-logo" />
            </span>
          ))}
        </span>
      )
    }

    const renderTypedChipContent = (company: WorkedWithCompany, visibleWordCount: number) => {
      const words = company.expandedText.split(" ").slice(0, visibleWordCount)

      return (
        <>
          {renderExpandedLogos(company)}
          {renderTypedWords(words, company.id)}
        </>
      )
    }

    const renderExpandedSegmentButtons = ({
      company,
      segments,
      buttonId,
      logoUrls,
      keyPrefix,
      expansionId,
      links,
    }: {
      company: WorkedWithCompany
      segments: string[]
      buttonId: string
      logoUrls?: string[]
      keyPrefix: string
      expansionId: string
      links?: Record<string, string>
    }) => {
      const visibleWordCount = visibleWordCounts[expansionId] ?? 0
      const isCollapsing = collapsingCompanyIds.includes(expansionId)
      const collapseStartWordCount = collapseStartWordCounts[expansionId] ?? visibleWordCount
      const visibleSegmentWords = segments.map((_, segmentIndex) => getVisibleWordsForSegment(segments, segmentIndex, visibleWordCount))
      const collapseStartSegmentWords = segments.map((_, segmentIndex) =>
        getVisibleWordsForSegment(segments, segmentIndex, collapseStartWordCount),
      )

      return (
        segments.map((segment, segmentIndex) => {
          const visibleWords = visibleSegmentWords[segmentIndex]
          const collapseStartWords = collapseStartSegmentWords[segmentIndex]
          const hasVisibleWords = visibleWords.length > 0
          const collapseStartWordsAfterSegment = collapseStartSegmentWords
            .slice(segmentIndex + 1)
            .reduce((wordCount, segmentWords) => wordCount + segmentWords.length, 0)
          const collapseDelayOffset = collapseStartWordsAfterSegment + collapseStartWords.length - visibleWords.length

          if (segmentIndex > 0 && !hasVisibleWords) {
            return null
          }

          return (
            <Fragment key={`${keyPrefix}-${segment}`}>
              {segmentIndex > 0 ? <span className="mosaic-work-history-expanded-break" aria-hidden="true" /> : null}
              <span
                id={segmentIndex === 0 ? buttonId : undefined}
                className={`mosaic-work-history-chip mosaic-work-history-chip-expanded mosaic-work-history-chip-expanded-segment mosaic-work-history-chip-expanded-collapsible${
                  segmentIndex === 0 ? " mosaic-work-history-chip-expanded-segment-primary" : ""
                }${isCollapsing ? " mosaic-work-history-chip-collapsing" : ""}`}
                style={getCollapseStyle(collapseStartWordCount, isCollapsing)}
                onClick={() => closeExpansion(expansionId)}
              >
                {segmentIndex === 0 ? renderExpandedLogos(company, logoUrls) : null}
                {renderTypedWords(visibleWords, `${keyPrefix}-${segmentIndex}`, {
                  links,
                  onLinkedWordClick: () => closeExpansion(expansionId),
                  isCollapsing,
                  collapseDelayOffset,
                })}
              </span>
            </Fragment>
          )
        })
      )
    }

    const renderMoreInfoExpansion = () => {
      const visibleWordCount = visibleWordCounts[moreInfoId] ?? 0
      const isCollapsing = collapsingCompanyIds.includes(moreInfoId)
      const collapseStartWordCount = collapseStartWordCounts[moreInfoId] ?? visibleWordCount
      const visibleSegmentWords = moreInfoSegments.map((_, segmentIndex) =>
        getVisibleWordsForSegment(moreInfoSegments, segmentIndex, visibleWordCount),
      )
      const collapseStartSegmentWords = moreInfoSegments.map((_, segmentIndex) =>
        getVisibleWordsForSegment(moreInfoSegments, segmentIndex, collapseStartWordCount),
      )

      return moreInfoSegments.map((segment, segmentIndex) => {
        const visibleWords = visibleSegmentWords[segmentIndex]
        const collapseStartWords = collapseStartSegmentWords[segmentIndex]
        const hasVisibleWords = visibleWords.length > 0
        const collapseStartWordsAfterSegment = collapseStartSegmentWords
          .slice(segmentIndex + 1)
          .reduce((wordCount, segmentWords) => wordCount + segmentWords.length, 0)
        const collapseDelayOffset = collapseStartWordsAfterSegment + collapseStartWords.length - visibleWords.length

        if (segmentIndex > 0 && !hasVisibleWords) {
          return null
        }

        return (
          <Fragment key={`${moreInfoId}-${segment}`}>
            {segmentIndex > 0 ? <span className="mosaic-work-history-expanded-break" aria-hidden="true" /> : null}
            <span
              id={segmentIndex === 0 ? `${disclosureId}-more-info-expanded` : undefined}
              className={`mosaic-work-history-chip mosaic-work-history-chip-expanded mosaic-work-history-chip-expanded-segment mosaic-work-history-chip-expanded-collapsible mosaic-work-history-chip-expanded-info${
                isCollapsing ? " mosaic-work-history-chip-collapsing" : ""
              }`}
              style={getCollapseStyle(collapseStartWordCount, isCollapsing)}
              onClick={() => closeExpansion(moreInfoId)}
            >
              {renderTypedWords(visibleWords, `${moreInfoId}-${segmentIndex}`, {
                links: moreInfoLinks,
                onLinkedWordClick: () => closeExpansion(moreInfoId),
                isCollapsing,
                collapseDelayOffset,
              })}
            </span>
          </Fragment>
        )
      })
    }

    const renderCompanyButton = (company: WorkedWithCompany) => {
      const isActive = activeCompanyIds.includes(company.id)
      const companyDisclosureId = `${disclosureId}-${company.id}`
      const expandedSegments = getExpandedSegmentsForCompanyId(company.id)

      if (isActive && expandedSegments.length > 0) {
        return renderExpandedSegmentButtons({
          company,
          segments: expandedSegments,
          buttonId: companyDisclosureId,
          keyPrefix: company.id,
          expansionId: company.id,
          links: expandedCompanyLinks[company.id],
        })
      }

      return (
        <button
          key={company.id}
          id={isActive ? companyDisclosureId : undefined}
          type="button"
          className={`mosaic-work-history-chip${isActive ? " mosaic-work-history-chip-expanded" : ""}${
            collapsingCompanyIds.includes(company.id) ? " mosaic-work-history-chip-collapsing" : ""
          }`}
          style={getCollapseStyle(
            collapseStartWordCounts[company.id] ?? visibleWordCounts[company.id] ?? 0,
            collapsingCompanyIds.includes(company.id),
          )}
          aria-label={isActive ? company.expandedText : undefined}
          aria-expanded={isActive}
          onClick={() => toggleCompany(company.id)}
        >
          {isActive ? renderTypedChipContent(company, visibleWordCounts[company.id] ?? 0) : company.compactName}
        </button>
      )
    }

    return (
      <div className="mosaic-work-history" aria-label="Work history">
        <div className="mosaic-work-history-line">
          <span className="mosaic-work-history-copy">Recently at</span>
          {isRecentCompanyActive && recentExpandedCompany ? (
            <>
              {renderExpandedSegmentButtons({
                company: recentExpandedCompany,
                segments: recentExpandedSegments,
                buttonId: `${disclosureId}-recent-expanded`,
                logoUrls: recentCompanies.flatMap((company) => company.logoUrls),
                keyPrefix: recentGroupId,
                expansionId: recentGroupId,
                links: expandedCompanyLinks[recentGroupId],
              })}
            </>
          ) : (
            <button
              type="button"
              className="mosaic-work-history-chip"
              aria-label={recentCollapsedLabel}
              aria-expanded="false"
              onClick={() => openExpansion(recentGroupId)}
            >
              {recentCollapsedLabel}
            </button>
          )}
          <span className="mosaic-work-history-copy">previously worked with and at</span>
        </div>
        <div className="mosaic-work-history-line" aria-label="Previous companies">
          {previousCompanies.map(renderCompanyButton)}
          {isMoreInfoActive ? (
            <>
              <span className="mosaic-work-history-expanded-break" aria-hidden="true" />
              {renderMoreInfoExpansion()}
            </>
          ) : null}
          <button
            type="button"
            className="mosaic-work-history-chip mosaic-work-history-chip-more"
            aria-expanded={isMoreInfoActive}
            aria-controls={isMoreInfoActive ? `${disclosureId}-more-info-expanded` : undefined}
            onClick={() => toggleCompany(moreInfoId)}
          >
            ...
          </button>
        </div>
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
