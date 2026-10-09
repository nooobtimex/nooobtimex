/**
 * Every number the GitHub section derives from the daily contribution series — pure
 * functions, JSX-free, no fetching. The pages that call them are prerendered and
 * revalidated daily, so all of this runs at build/ISR time, never per visitor.
 *
 * `today` is passed in, never read here: a calendar year in progress arrives from the API
 * with every remaining day of the year at zero, and treating those as "missed" days was
 * what pinned the current year's streak at 0 and sank its active-days share.
 */
import type { ContributionDay, RepoSummary } from '@/lib/github'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export interface MonthPoint {
	key: string // YYYY-MM
	label: string // 'Jun'
	full: string // 'Jun 2026'
	count: number
	/** The month containing `today` — still filling up, so it must not read as a drop. */
	partial: boolean
}

export interface Streak {
	length: number
	start: string | null
	end: string | null
}

/** The contribution counts behind one heatmap shade — GitHub assigns levels per calendar. */
export interface LevelRange {
	level: number
	min: number
	max: number
}

export interface PeriodStats {
	total: number
	elapsedDays: number
	activeDays: number
	activePct: number
	avgPerActiveDay: number
	/** Null when the period has ended — a past year has a year-end run, not a current one. */
	currentStreak: number | null
	longestStreak: Streak
	busiestDay: { date: string; count: number } | null
	monthly: MonthPoint[]
	/** Mean of the complete months shown — the reference line on the monthly chart. */
	monthlyAvg: number
	peakMonth: MonthPoint | null
	weekday: { label: string; name: string; count: number }[]
	busiestWeekday: { name: string; count: number } | null
	levels: LevelRange[]
}

/** `YYYY-MM-DD` in UTC — the API's dates are calendar days with no zone. */
export const isoDay = (d: Date): string => d.toISOString().slice(0, 10)

export const formatDay = (date: string, withYear = false): string =>
	new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		...(withYear && { year: 'numeric' }),
		timeZone: 'UTC'
	})

/**
 * The run of active days ending today. Today counts as unfinished: a day with nothing yet
 * does not break yesterday's run (GitHub's own rule), so the streak isn't 0 every morning.
 */
function currentStreak(days: ContributionDay[], today: string): number {
	let i = days.length - 1
	if (i >= 0 && days[i].date === today && days[i].count === 0) i--
	let n = 0
	for (; i >= 0 && days[i].count > 0; i--) n++
	return n
}

function longestStreak(days: ContributionDay[]): Streak {
	let best: Streak = { length: 0, start: null, end: null }
	let runStart: string | null = null
	let run = 0
	for (const d of days) {
		if (d.count > 0) {
			if (run === 0) runStart = d.date
			run++
			if (run > best.length) best = { length: run, start: runStart, end: d.date }
		} else {
			run = 0
		}
	}
	return best
}

function monthlySeries(days: ContributionDay[], today: string): MonthPoint[] {
	const sums = new Map<string, number>()
	for (const d of days) sums.set(d.date.slice(0, 7), (sums.get(d.date.slice(0, 7)) ?? 0) + d.count)
	// The trailing-year window opens mid-month; keeping the last 12 drops that sliver.
	return [...sums.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.slice(-12)
		.map(([key, count]) => {
			const m = Number(key.slice(5, 7)) - 1
			return {
				key,
				label: MONTHS[m],
				full: `${MONTHS[m]} ${key.slice(0, 4)}`,
				count,
				partial: key === today.slice(0, 7)
			}
		})
}

function levelRanges(days: ContributionDay[]): LevelRange[] {
	const ranges = new Map<number, LevelRange>()
	for (const d of days) {
		const r = ranges.get(d.level)
		if (!r) ranges.set(d.level, { level: d.level, min: d.count, max: d.count })
		else {
			r.min = Math.min(r.min, d.count)
			r.max = Math.max(r.max, d.count)
		}
	}
	return [...ranges.values()].sort((a, b) => a.level - b.level)
}

/**
 * Every derived figure for one period. `total` is the API's own figure, so the headline
 * matches GitHub's profile exactly; the rates are computed from the elapsed days.
 */
export function periodStats(
	allDays: ContributionDay[],
	total: number,
	today: string,
	/** True for the trailing year and the current calendar year — the caller knows, the dates may lag a day. */
	ongoing: boolean
): PeriodStats {
	const days = allDays.filter(d => d.date <= today).sort((a, b) => a.date.localeCompare(b.date))

	let activeDays = 0
	let sum = 0
	let busiestDay: PeriodStats['busiestDay'] = null
	const weekdaySums = Array<number>(7).fill(0)
	for (const d of days) {
		if (d.count > 0) activeDays++
		sum += d.count
		weekdaySums[new Date(`${d.date}T00:00:00Z`).getUTCDay()] += d.count
		if (d.count > 0 && (!busiestDay || d.count > busiestDay.count)) busiestDay = { date: d.date, count: d.count }
	}

	const monthly = monthlySeries(days, today)
	const complete = monthly.filter(m => !m.partial)
	const avgBase = complete.length ? complete : monthly
	const monthlyAvg = avgBase.length ? avgBase.reduce((s, m) => s + m.count, 0) / avgBase.length : 0
	const peakMonth = monthly.reduce<MonthPoint | null>((best, m) => (m.count > (best?.count ?? 0) ? m : best), null)

	const weekday = WEEKDAYS.map((label, i) => ({ label, name: WEEKDAY_NAMES[i], count: weekdaySums[i] }))
	const topWeekday = weekday.reduce((best, w) => (w.count > best.count ? w : best), weekday[0])

	return {
		total,
		elapsedDays: days.length,
		activeDays,
		activePct: days.length ? Math.round((activeDays / days.length) * 100) : 0,
		avgPerActiveDay: activeDays ? sum / activeDays : 0,
		currentStreak: ongoing ? currentStreak(days, today) : null,
		longestStreak: longestStreak(days),
		busiestDay,
		monthly,
		monthlyAvg,
		peakMonth,
		weekday,
		busiestWeekday: topWeekday.count > 0 ? { name: topWeekday.name, count: topWeekday.count } : null,
		levels: levelRanges(days)
	}
}

/** Top languages by bytes, the long tail folded into "Other" — never more bars than a reader can hold. */
export function foldLanguages(
	languages: RepoSummary['languages'],
	keep = 5
): { name: string; bytes: number; share: number }[] {
	const total = languages.reduce((s, l) => s + l.bytes, 0)
	if (!total) return []
	const head = languages.slice(0, keep)
	const tail = languages.slice(keep).reduce((s, l) => s + l.bytes, 0)
	const rows = tail > 0 ? [...head, { name: 'Other', bytes: tail }] : head
	return rows.map(l => ({ ...l, share: (l.bytes / total) * 100 }))
}

const fmt = (n: number) => n.toLocaleString('en-US')

/**
 * The period in one plain sentence — the chart's takeaway for anyone who doesn't read
 * charts, and the server-rendered text a crawler gets in place of a heatmap.
 */
export function describePeriod(stats: PeriodStats, period: string, today: string): string {
	const inProgress = period === 'last' || period === today.slice(0, 4)
	const when =
		period === 'last' ? 'in the last 12 months'
		: inProgress ? `in ${period} so far`
		: `in ${period}`
	if (stats.total === 0) return `No contributions recorded ${when}.`

	const parts = [
		`${fmt(stats.total)} contribution${stats.total === 1 ? '' : 's'} ${when}, on ${fmt(stats.activeDays)} of ${fmt(stats.elapsedDays)} days (${stats.activePct}%).`
	]
	if (stats.peakMonth) parts.push(`Busiest month: ${stats.peakMonth.full} with ${fmt(stats.peakMonth.count)}.`)
	if (stats.busiestWeekday) parts.push(`Most active weekday: ${stats.busiestWeekday.name}.`)
	const { longestStreak: ls } = stats
	if (ls.length > 1 && ls.start && ls.end)
		parts.push(`Longest run: ${ls.length} days in a row (${formatDay(ls.start)} – ${formatDay(ls.end, true)}).`)
	return parts.join(' ')
}
