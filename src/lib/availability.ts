const currentMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  year: "numeric",
  timeZone: "America/Santo_Domingo",
})

const monthNameFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
})

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function monthIndex(year: number, month: number) {
  return year * 12 + (month - 1)
}

/**
 * The month Rafael can start something new, as `YYYY-MM`, is a value he sets
 * in src/data/portfolio.ts rather than one worked out from the clock. "Next
 * month" from today was always true and so never said anything: it could not
 * say he was free now, or that he was booked up until spring.
 *
 * The clock only decides the wording once that month arrives: from then on the
 * line says "now" instead of naming a month that has already started.
 */
export function formatAvailability(availableFrom: string, date = new Date()) {
  const [fromYear, fromMonth] = availableFrom.split("-").map(Number)
  const parts = currentMonthFormatter.formatToParts(date)
  const year = Number(parts.find((part) => part.type === "year")!.value)
  const month = Number(parts.find((part) => part.type === "month")!.value)

  if (monthIndex(year, month) >= monthIndex(fromYear, fromMonth)) return "Available now"
  const start = new Date(Date.UTC(fromYear, fromMonth - 1, 1))
  // A month in a later year needs its year, or "January" in October reads as
  // the January just gone.
  return `Available in ${(fromYear === year ? monthNameFormatter : monthYearFormatter).format(start)}`
}
