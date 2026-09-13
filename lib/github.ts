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
		'User-Agent': `${USERNAME}-portfolio`,
		'Accept': 'application/vnd.github+json'
	}
	if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
	return headers
}

/**
 * Normalises a `?year=` value to what `getContributions` accepts. Home is always the
 * trailing year; only the dedicated page honours a selected calendar year.
 */
export const resolveGithubYear = (variant: 'home' | 'page', year?: string): string =>
	variant === 'page' && year && /^\d{4}$/.test(year) ? year : 'last'

// `year` is 'last' (trailing 12 months) or a 4-digit calendar year.
export async function getContributions(year: string): Promise<{ total: number; days: ContributionDay[] } | null> {
	try {
		const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=${year}`, {
			next: { revalidate: REVALIDATE }
		})
		if (!res.ok) return null
		const json = (await res.json()) as { total?: Record<string, number>; contributions?: ContributionDay[] }
		const total = year === 'last' ? (json.total?.lastYear ?? 0) : (json.total?.[year] ?? 0)
		return { total, days: json.contributions ?? [] }
	} catch {
		return null
	}
}

export async function getProfile(): Promise<{ repos: number; followers: number; createdYear: number } | null> {
	try {
		const res = await fetch(`https://api.github.com/users/${USERNAME}`, {
			headers: ghHeaders(),
			next: { revalidate: REVALIDATE }
		})
		if (!res.ok) return null
		const json = (await res.json()) as { public_repos?: number; followers?: number; created_at?: string }
		return {
			repos: json.public_repos ?? 0,
			followers: json.followers ?? 0,
			createdYear: json.created_at ? new Date(json.created_at).getFullYear() : new Date().getFullYear()
		}
	} catch {
		return null
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
	try {
		const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner&sort=updated`, {
			headers: ghHeaders(),
			next: { revalidate: REVALIDATE }
		})
		if (!res.ok) return null
		const raw = (await res.json()) as RepoRaw[]
		// Keep forks too — owned forks (e.g. a published config) still earn stars worth counting.
		const repos = raw

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
	} catch {
		return null
	}
}
