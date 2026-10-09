/**
 * Token-free GitHub data fetchers shared by the site (/github page, ISR) and
 * the README asset generator (scripts/readme). Keep this module JSX-free.
 */

export const USERNAME = 'NooobtimeX'
export const REVALIDATE = 86400 // refresh daily

export interface ContributionDay {
	date: string
	count: number
	level: number
}

/** Optional GITHUB_TOKEN (set in CI) raises rate limits; the site runs without it. */
function ghHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		'User-Agent': `${USERNAME}-profile`,
		'Accept': 'application/vnd.github+json'
	}
	if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
	return headers
}

/** Backoff before each retry; its length is the retry count. */
const RETRY_DELAYS_MS = [500, 1500]

/**
 * GET a JSON endpoint, or `null` once it has failed for good. A network error, 429 or 5xx is
 * retried; any other non-2xx is final. Every failure is logged: these fetchers used to
 * swallow errors, so a build that prerendered `/github` while the API blinked shipped a
 * "data unavailable" page with nothing in the build log to say why.
 */
async function fetchJson<T>(url: string, init: RequestInit): Promise<T | null> {
	for (let attempt = 0; ; attempt++) {
		let reason: string
		try {
			const res = await fetch(url, init)
			if (res.ok) return (await res.json()) as T
			reason = `HTTP ${res.status}`
			if (res.status !== 429 && res.status < 500) {
				console.warn(`[github] ${url} → ${reason}`)
				return null
			}
		} catch (err) {
			reason = err instanceof Error ? err.message : String(err)
		}
		const delay = RETRY_DELAYS_MS[attempt]
		if (delay === undefined) {
			console.warn(`[github] ${url} → ${reason} (gave up after ${attempt + 1} attempts)`)
			return null
		}
		await new Promise(resolve => setTimeout(resolve, delay))
	}
}

/**
 * The year the GitHub account was created (2020-02-27). A constant, not an API read: it
 * decides which `/github/<year>` pages exist, and a route list must not depend on a
 * rate-limited fetch succeeding at build time.
 */
export const GITHUB_SINCE = 2020

/** A `/github` view: the trailing 12 months, or one calendar year. */
export type GithubPeriod = 'last' | `${number}`

/**
 * Calendar years with a `/github/<year>` page, newest first. `through` is the last year to
 * include — the current year for the year chips, the current year + 1 for
 * `generateStaticParams`, so a deploy made in December already has January's page.
 */
export const githubYears = (through: number): string[] =>
	Array.from({ length: Math.max(0, through - GITHUB_SINCE) + 1 }, (_, i) => String(through - i))

// `year` is 'last' (trailing 12 months) or a 4-digit calendar year.
export async function getContributions(year: string): Promise<{ total: number; days: ContributionDay[] } | null> {
	const json = await fetchJson<{ total?: Record<string, number>; contributions?: ContributionDay[] }>(
		`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=${year}`,
		{ next: { revalidate: REVALIDATE } }
	)
	if (!json) return null
	const total = year === 'last' ? (json.total?.lastYear ?? 0) : (json.total?.[year] ?? 0)
	return { total, days: json.contributions ?? [] }
}

/**
 * Contribution total per calendar year since the account opened — one request for every
 * year, so the year-over-year chart never needs eight fetches.
 */
export async function getYearTotals(): Promise<{ year: string; total: number }[] | null> {
	const json = await fetchJson<{ total?: Record<string, number> }>(
		`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=all`,
		{ next: { revalidate: REVALIDATE } }
	)
	if (!json) return null
	return Object.entries(json.total ?? {})
		.filter(([year]) => /^\d{4}$/.test(year))
		.map(([year, total]) => ({ year, total }))
		.sort((a, b) => a.year.localeCompare(b.year))
}

export async function getProfile(): Promise<{ repos: number; followers: number; createdYear: number } | null> {
	const json = await fetchJson<{ public_repos?: number; followers?: number; created_at?: string }>(
		`https://api.github.com/users/${USERNAME}`,
		{ headers: ghHeaders(), next: { revalidate: REVALIDATE } }
	)
	if (!json) return null
	return {
		repos: json.public_repos ?? 0,
		followers: json.followers ?? 0,
		createdYear: json.created_at ? new Date(json.created_at).getFullYear() : new Date().getFullYear()
	}
}

interface RepoRaw {
	name: string
	full_name: string
	html_url: string
	description: string | null
	language: string | null
	stargazers_count?: number
	fork?: boolean
	archived?: boolean
}

export interface RepoSummary {
	stars: number
	count: number
	languages: { name: string; bytes: number }[]
	top: { name: string; stars: number; language: string | null; url: string; description: string | null }[]
}

/** Sum the byte breakdown across every repo so CSS/HTML/etc. show — not just each repo's primary language. */
async function aggregateLanguages(repos: RepoRaw[]): Promise<{ name: string; bytes: number }[]> {
	const totals = new Map<string, number>()
	await Promise.all(
		repos.map(async r => {
			try {
				const res = await fetch(`https://api.github.com/repos/${r.full_name}/languages`, {
					headers: ghHeaders(),
					next: { revalidate: REVALIDATE }
				})
				if (!res.ok) return
				const data = (await res.json()) as Record<string, number>
				for (const [name, bytes] of Object.entries(data)) totals.set(name, (totals.get(name) ?? 0) + bytes)
			} catch {
				// skip this repo's languages on failure
			}
		})
	)
	return [...totals.entries()]
		.map(([name, bytes]) => ({ name, bytes }))
		.sort((a, b) => b.bytes - a.bytes || a.name.localeCompare(b.name))
}

export async function getRepos(): Promise<RepoSummary | null> {
	// Keep forks too — owned forks (e.g. a published config) still earn stars worth counting.
	const repos = await fetchJson<RepoRaw[]>(
		`https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner&sort=updated`,
		{ headers: ghHeaders(), next: { revalidate: REVALIDATE } }
	)
	if (!repos) return null

	const stars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0)
	const languages = await aggregateLanguages(repos)

	const top = [...repos]
		.sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0) || a.name.localeCompare(b.name))
		.slice(0, 5)
		.map(r => ({
			name: r.name,
			stars: r.stargazers_count ?? 0,
			language: r.language,
			url: r.html_url,
			description: r.description
		}))

	return { stars, count: repos.length, languages, top }
}
