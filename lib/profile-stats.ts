// Type-only: this module stays free of data imports, like lib/utils.ts.
import type { ExperienceItem } from '@/common'

/** One tile on the home proof strip. */
export interface ProfileStat {
	value: string
	label: string
	icon: string
	href?: '/projects' | '/blog' | '/skills' | '/career'
}

/**
 * Whole years between `from` (YYYY-MM-DD) and `now`. The anniversary has to have passed,
 * so Aug 2021 → Jul 2026 is 4, not 5. UTC throughout, because that is how a bare
 * `YYYY-MM-DD` parses (see `formatMilestoneDate`).
 */
export function wholeYearsBetween(from: string, now: Date): number {
	const start = new Date(from)
	const years = now.getUTCFullYear() - start.getUTCFullYear()
	const beforeAnniversary =
		now.getUTCMonth() < start.getUTCMonth()
		|| (now.getUTCMonth() === start.getUTCMonth() && now.getUTCDate() < start.getUTCDate())
	return Math.max(0, beforeAnniversary ? years - 1 : years)
}

/**
 * The "years shipping" number on the home proof strip — the first figure a client reads,
 * so it has to survive the question "since when, exactly?".
 *
 * `now` is passed in, never read here: the home page is prerendered, so the caller (a
 * server component) decides when "now" is — the same rule as `currentEntryId`.
 *
 * TODO(human): decide which roles count. The placeholder below counts from the earliest
 * work role of any kind (the 2021-08 part-time role → 5 years today). Alternatives: count
 * only paid client/full-time work (`type`), or only from the first freelance role
 * (2024-01 → 2 years). Whatever you pick, the label in HomeContent should match it.
 */
export function yearsShipping(roles: readonly ExperienceItem[], now: Date): number {
	const work = roles.filter(r => r.category === 'work' && new Date(r.startDate) <= now)
	if (work.length === 0) return 0
	const earliest = work.reduce((min, r) => (r.startDate < min ? r.startDate : min), work[0].startDate)
	return wholeYearsBetween(earliest, now)
}
