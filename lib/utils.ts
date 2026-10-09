import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
// Type-only: erased at compile time, so client components importing `cn` pull in no data.
import type { Project } from '@/common'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Utility function to format date range for organization
export function formatExperienceDuration(startDate: string, endDate?: string): string {
	const start = new Date(startDate)
	const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
	const startYear = start.getFullYear()

	if (!endDate) {
		// A role that hasn't started yet reads as upcoming, not ongoing.
		if (start.getTime() > Date.now()) {
			return `Starts ${startMonth} ${startYear}`
		}
		return `${startMonth} ${startYear} - Present`
	}

	const end = new Date(endDate)
	const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
	const endYear = end.getFullYear()

	return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
}

/**
 * Format a `YYYY-MM-DD` date as e.g. "Jun 2026" — project milestones and a post's `happenedAt`.
 *
 * Formatted in UTC because that is how the string parses: `new Date('2021-08-01')` is UTC
 * midnight, so formatting it in local time prints "Jul 2021" on any machine west of UTC.
 */
export function formatMilestoneDate(date: string): string {
	return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

/**
 * The hire link as text a person can read, copy or type — `fastwork.co/byob/DJpB7L1xWm`.
 *
 * Derived from the BYOB `url`, never from `hire.profileUrl`: Fastwork credits a client to
 * this seller only when they arrive through the BYOB path, so a typed generic profile
 * address (`fastwork.co/user/…`) silently drops them onto the normal commission. The
 * query is dropped for legibility — the code in the path is what carries attribution.
 */
export function hireLinkLabel(url: string): string {
	return url.replace(/^https?:\/\//, '').replace(/\?.*$/, '')
}

/** Format a kebab-case position id for display, e.g. 'chief-technology-officer' → 'Chief Technology Officer'. */
export function formatPosition(position: string): string {
	return position
		.split('-')
		.map(w => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')
}

/**
 * A card-length excerpt: whole sentences while they fit in `max` characters, otherwise the
 * text cut at a word boundary with an ellipsis.
 *
 * Cards used to render a full description behind `line-clamp-3`, which hides text from the
 * eye but not from the HTML — so a 200-word project description shipped verbatim on every
 * page that listed the project (15+ skill pages for MONOMax). The full text belongs on the
 * detail page; everywhere else carries this.
 *
 * Sentences split only where `.`/`!`/`?` is followed by whitespace and a capital, digit or
 * quote, so `Next.js` and `e.g. restaurants` stay intact.
 */
export function excerpt(text: string, max = 180): string {
	const flat = text.replace(/\s+/g, ' ').trim()
	if (flat.length <= max) return flat

	let out = ''
	for (const sentence of flat.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/)) {
		const next = out ? `${out} ${sentence}` : sentence
		if (next.length > max) break
		out = next
	}
	if (out) return out

	const cut = flat.slice(0, max)
	return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]$/, '')}…`
}

/** Where a build stands, as its card, dossier and share cards say it. */
export type ProjectStatus = 'live' | 'in-development' | 'archived'

/**
 * The one place a project's status is decided. It used to be `links.live ? … : 'Archived'`
 * inline at four call sites, which made every private build read "Archived" — right for a
 * delivered freelance job, wrong for one still being built this week.
 */
export function projectStatus(project: Pick<Project, 'links' | 'stage' | 'endDate'>): ProjectStatus {
	// An explicit stage outranks the derived status — a public beta has a live link and is
	// still in development — but never outlives the work: an `endDate` voids a stale flag.
	if (project.stage === 'in-development' && !project.endDate) return 'in-development'
	return project.links.live ? 'live' : 'archived'
}

/**
 * Converts a string into a URL-friendly slug.
 * Example: "Next.js" -> "next-js"
 */
export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w-]+/g, '-') // Replace all non-word chars with - (handles . in Next.js)
		.replace(/--+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start
		.replace(/-+$/, '') // Trim - from end
}

/**
 * Reverses a slug back into a display-friendly name (best effort)
 * Note: This is mainly used for mapping back to the data objects.
 */
export function unslugify(slug: string): string {
	return slug.replace(/-/g, ' ').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}
