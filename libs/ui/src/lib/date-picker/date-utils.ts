export interface CalendarCell {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

export interface WeekdayHeader {
  short: string
  full: string
}

// ── Construction / Cloning ──────────────────────────────────────────────

export function createDate(year: number, month: number, day: number): Date {
  const d = new Date(year, month, day)
  d.setHours(0, 0, 0, 0)
  return d
}

export function cloneDate(date: Date): Date {
  return new Date(date.getTime())
}

// ── Comparison ──────────────────────────────────────────────────────────

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  )
}

export function isDateBefore(date: Date, compare: Date): boolean {
  return createDate(date.getFullYear(), date.getMonth(), date.getDate()).getTime() <
    createDate(compare.getFullYear(), compare.getMonth(), compare.getDate()).getTime()
}

export function isDateAfter(date: Date, compare: Date): boolean {
  return createDate(date.getFullYear(), date.getMonth(), date.getDate()).getTime() >
    createDate(compare.getFullYear(), compare.getMonth(), compare.getDate()).getTime()
}

export function isDateInRange(
  date: Date,
  start: Date | null,
  end: Date | null,
): boolean {
  if (!start || !end) return false
  const d = createDate(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const s = createDate(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const e = createDate(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  return d > s && d < e
}

export function isDateDisabled(
  date: Date,
  min: Date | null,
  max: Date | null,
  dateFilter: ((date: Date) => boolean) | null,
): boolean {
  if (min && isDateBefore(date, min)) return true
  if (max && isDateAfter(date, max)) return true
  if (dateFilter && !dateFilter(date)) return true
  return false
}

// ── Calendar Math ───────────────────────────────────────────────────────

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function addMonths(date: Date, months: number): Date {
  const result = cloneDate(date)
  const targetMonth = result.getMonth() + months
  result.setMonth(targetMonth)
  // Handle overflow (e.g. Jan 31 + 1 month → Feb 28, not Mar 3)
  if (result.getMonth() !== ((targetMonth % 12) + 12) % 12) {
    result.setDate(0)
  }
  return result
}

export function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12)
}

// ── Grid Generation ─────────────────────────────────────────────────────

export function generateMonthGrid(year: number, month: number): CalendarCell[][] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDay = getFirstDayOfWeek(year, month)
  const daysInMonth = getDaysInMonth(year, month)
  const daysInPrevMonth = getDaysInMonth(year, month - 1)

  const cells: CalendarCell[] = []

  // Previous month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = createDate(year, month - 1, day)
    cells.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = createDate(year, month, day)
    cells.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
    })
  }

  // Next month padding (fill to 42 cells = 6 rows)
  const remaining = 42 - cells.length
  for (let day = 1; day <= remaining; day++) {
    const date = createDate(year, month + 1, day)
    cells.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
    })
  }

  // Split into weeks
  const grid: CalendarCell[][] = []
  for (let i = 0; i < 42; i += 7) {
    grid.push(cells.slice(i, i + 7))
  }

  return grid
}

// ── Formatting ──────────────────────────────────────────────────────────

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
})

const dayAriaFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const shortMonthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
})

export function formatMonthYear(date: Date): string {
  return monthYearFormatter.format(date)
}

export function formatDayAriaLabel(date: Date): string {
  return dayAriaFormatter.format(date)
}

export function formatShortMonth(date: Date): string {
  return shortMonthFormatter.format(date)
}

export function formatDate(date: Date | null): string {
  if (!date) return ''
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const y = date.getFullYear()
  return `${m}/${d}/${y}`
}

export function parseDate(text: string): Date | null {
  if (!text || !text.trim()) return null
  const trimmed = text.trim()

  // Try MM/DD/YYYY or M/D/YYYY
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    const [, mStr, dStr, yStr] = slashMatch
    const y = parseInt(yStr, 10)
    const m = parseInt(mStr, 10) - 1
    const d = parseInt(dStr, 10)
    const date = createDate(y, m, d)
    if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
      return date
    }
  }

  // Try YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const [, yStr, mStr, dStr] = isoMatch
    const y = parseInt(yStr, 10)
    const m = parseInt(mStr, 10) - 1
    const d = parseInt(dStr, 10)
    const date = createDate(y, m, d)
    if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
      return date
    }
  }

  return null
}

// ── Weekday Headers ─────────────────────────────────────────────────────

export const WEEKDAY_HEADERS: WeekdayHeader[] = [
  { short: 'Su', full: 'Sunday' },
  { short: 'Mo', full: 'Monday' },
  { short: 'Tu', full: 'Tuesday' },
  { short: 'We', full: 'Wednesday' },
  { short: 'Th', full: 'Thursday' },
  { short: 'Fr', full: 'Friday' },
  { short: 'Sa', full: 'Saturday' },
]

// ── Month Names ─────────────────────────────────────────────────────────

export const MONTH_NAMES: string[] = Array.from({ length: 12 }, (_, i) =>
  formatShortMonth(new Date(2000, i, 1)),
)

// ── Year Range ──────────────────────────────────────────────────────────

export function getYearRange(centerYear: number, range = 12): number[] {
  const start = centerYear - range
  return Array.from({ length: range * 2 }, (_, i) => start + i)
}
