import { Tooltip } from "@base-ui/react/tooltip"

import { contributionCalendar } from "../data/githubActivity"
import { siteActivity } from "../data/siteActivity"

const HANDLE = contributionCalendar.login
const PROFILE_URL = `https://github.com/${HANDLE}`
const NAME = "Rafael Medina"
// Self-hosted rather than hotlinked from avatars.githubusercontent.com: the
// card is build-time data everywhere else, and a third-party request for one
// 128px image would be the only thing on this page waiting on somebody else's
// CDN. Re-download it when the GitHub avatar changes.
const AVATAR = "/people/github-rafaelmedian.jpg"

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

const fullFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

// Five steps, the same shape GitHub's own graph uses: empty, then four bands of
// increasing weight. The bands come from the data rather than from fixed
// numbers -- they are the quartiles of the days that had any work at all, so
// the graph stays legible whether a normal day is three contributions or thirty.
const [BAND_1, BAND_2, BAND_3] = contributionCalendar.thresholds

function level(count: number) {
  if (count === 0) return 0
  if (count <= BAND_1) return 1
  if (count <= BAND_2) return 2
  if (count <= BAND_3) return 3
  return 4
}

/** `YYYY-MM-DD` parsed as UTC midnight rather than as local time. */
const asUtcDate = (day: string) => new Date(`${day}T00:00:00Z`)

export function SiteLastUpdated() {
  const { lastUpdated } = siteActivity
  const { weeks, total } = contributionCalendar

  // No git history to read means no honest date to print, so the clause simply
  // is not there rather than showing a placeholder.
  if (!lastUpdated) return null

  const updatedDate = asUtcDate(lastUpdated)
  const label = monthFormatter.format(updatedDate)
  const hasCalendar = weeks.length > 0
  // GitHub's own word, and the honest one: the graph counts pushes, pull
  // requests, reviews, and issues across every repository, not commits here.
  const summary = `${total.toLocaleString("en-US")} contributions in the last six months`

  // One span, not two flex children: the trigger is an inline-flex box so the
  // card can centre inside it, and flex would eat the space before the date.
  const trigger = (
    <span className="mosaic-last-updated-label">
      Last updated <time dateTime={lastUpdated}>{label}</time>
    </span>
  )

  // The calendar is a committed artefact; an empty one means the generator has
  // not run yet, and a card with no graph in it is not worth opening.
  if (!hasCalendar) {
    return <span className="mosaic-last-updated mosaic-last-updated-plain">{trigger}</span>
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        delay={200}
        closeDelay={140}
        className="mosaic-last-updated"
        render={
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={`Last updated ${fullFormatter.format(updatedDate)}. View @${HANDLE} on GitHub`}
          />
        }
      >
        {trigger}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        {/* Above the line for the same reason the address's card was: the
            contact pills are the row below, and a card this size covering them
            hides the next thing worth pressing. */}
        <Tooltip.Positioner
          side="top"
          align="center"
          sideOffset={10}
          collisionPadding={16}
          className="activity-card-positioner"
        >
          {/* GitHub's own hovercard, near enough: who wrote it, then what they
              have been writing. The trigger is a link to the same profile, so
              the card is a preview of where the click goes rather than a
              second, unrelated surface. */}
          <Tooltip.Popup className="activity-card">
            <span className="activity-card-identity">
              <img
                className="activity-card-avatar"
                src={AVATAR}
                alt=""
                width={128}
                height={128}
                loading="lazy"
                decoding="async"
              />
              <span className="activity-card-names">
                <strong>{NAME}</strong>
                <span>@{HANDLE}</span>
              </span>
            </span>
            {/* One column per week, oldest on the left -- the same reading
                order as the graph this borrows from. The whole grid is one
                image to a screen reader; the sentence below it is the part
                worth hearing, so the grid never has to be read dot by dot. */}
            <span className="activity-card-grid" role="img" aria-label={summary}>
              {weeks.map((week) => (
                <span key={week.find(Boolean)?.date} className="activity-card-week">
                  {week.map((day, index) => (
                    <span
                      key={day?.date ?? `pad-${index}`}
                      className="activity-card-day"
                      data-level={day ? level(day.count) : "outside"}
                    />
                  ))}
                </span>
              ))}
            </span>
            {/* No date here: the clause under the pointer already says when,
                and repeating it stretched the card past the grid it is meant
                to be the width of. */}
            <span className="activity-card-footer">{summary}</span>
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
