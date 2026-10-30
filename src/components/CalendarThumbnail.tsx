import "../styles/calendar-thumbnail.css"
// The link preview's thumbnail: this month at a glance. It is drawn rather
// than fetched, so it never shows a stale screenshot or waits on cal.com, and
// it is only a hint -- the real slots are in the embed. Every week takes one
// weekday off and the rest are nearly full or open, picked by a hash of the
// date, so the month looks lived-in and stays the same across reloads.
function thumbnailHash(seed: number) {
  let hash = (seed + 0x9e3779b9) >>> 0
  hash = Math.imul(hash ^ (hash >>> 15), 0x85ebca6b)
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35)
  return (hash ^ (hash >>> 16)) >>> 0
}

function thumbnailDayState(year: number, month: number, day: number, weekday: number, week: number) {
  if (thumbnailHash(year * 1000 + month * 10 + week) % 5 + 1 === weekday) return "off"
  return thumbnailHash(year * 10000 + month * 100 + day) % 2 ? "busy" : "open"
}

export function CalendarThumbnail() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const lead = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  return <span className="booking-link-preview-thumbnail" aria-hidden="true">
    <span className="booking-thumbnail-month">{today.toLocaleDateString("en-US", { month: "long" })}</span>
    <span className="booking-thumbnail-grid">
      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={index} className="booking-thumbnail-weekday">{day}</span>)}
      {Array.from({ length: lead }, (_, index) => <span key={`lead-${index}`} />)}
      {Array.from({ length: days }, (_, index) => {
        const day = index + 1
        const weekday = (lead + index) % 7
        const ahead = day > today.getDate() && weekday > 0 && weekday < 6
        return <span key={day} className="booking-thumbnail-day"
          data-state={ahead ? thumbnailDayState(year, month, day, weekday, Math.floor((lead + index) / 7)) : undefined}
          data-today={day === today.getDate() || undefined}>{day}</span>
      })}
    </span>
  </span>
}
