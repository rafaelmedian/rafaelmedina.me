const currentMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  timeZone: "America/Santo_Domingo",
})

const monthNameFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
})

export function formatAvailability(date = new Date()) {
  // The one-based current month is the zero-based next month, including December.
  const nextMonth = new Date(Date.UTC(2000, Number(currentMonthFormatter.format(date)), 1))
  return `Available in ${monthNameFormatter.format(nextMonth)}`
}
