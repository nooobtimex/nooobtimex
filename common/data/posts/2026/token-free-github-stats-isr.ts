import type { PostDef } from '../../../interfaces'

/** Sources: lib/github.ts in full, components/github/GithubStats.tsx, app/(main)/github/page.tsx, commits 9283a04 and 9292255. */
export const tokenFreeGithubStatsIsr: PostDef = {
	id: 'token-free-github-stats-isr',
	title: 'Token-free GitHub stats with ISR: no PAT, no rate-limit wall',
	happenedAt: '2026-06-08',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'nextjs',
	description:
		'How I render live GitHub contributions, stars and language bytes with no access token: a public REST fan-out, daily ISR, and null on every failure.',
	tldr: "My portfolio renders live GitHub contributions, repo counts, stars and a byte-accurate language breakdown **without a personal access token**. Three things make that survivable: the contribution calendar comes from a public third-party endpoint (GitHub's own calendar is GraphQL-only, and GraphQL always needs auth), every fetch is cached for `86400` seconds by Next's ISR, and every fetcher returns `null` instead of throwing — so a rate-limited request degrades the section rather than breaking the build.",
	skills: ['next-js', 'typescript', 'react', 'git-github'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: 'On 8 June 2026 I rebuilt this site and added a GitHub section to the home page: a 365-day contribution heatmap, streaks, public repos, stars, followers. Everything you would normally get by pasting a third-party widget into a README. I wanted it rendered by my own components, from my own data fetch, on a page I control.'
		},
		{
			kind: 'p',
			text: 'The obvious way to do that is a personal access token in an environment variable. I did not want one. A PAT on a public marketing site is a credential that has to be provisioned, rotated, kept out of the image, and remembered a year later when it silently expires and the page goes blank. So the constraint I set was: the site must work with no token at all, and a token — if one happens to exist — may only make it better.'
		},
		{ kind: 'h2', text: "Why the calendar comes from someone else's API" },
		{
			kind: 'p',
			text: "The first wall is that GitHub's REST API does not expose the contribution calendar. That green grid lives only in the GraphQL API, and GraphQL requires authentication for every query, including public data. Token-free and contribution heatmap are, on GitHub's own surface, mutually exclusive."
		},
		{
			kind: 'p',
			text: 'So the heatmap is the one thing I do not fetch from GitHub. It comes from a public third-party mirror of the calendar, which takes a username and a year and answers without credentials.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: "lib/github.ts — the calendar fetcher. `year` is 'last' (trailing 12 months) or a 4-digit year.",
			code: "const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=${year}`, {\n\tnext: { revalidate: REVALIDATE }\n})\nif (!res.ok) return null\nconst json = (await res.json()) as { total?: Record<string, number>; contributions?: ContributionDay[] }\nconst total = year === 'last' ? (json.total?.lastYear ?? 0) : (json.total?.[year] ?? 0)\nreturn { total, days: json.contributions ?? [] }"
		},
		{
			kind: 'p',
			text: "This is the weakest link in the whole design and I should say so plainly. I have traded a credential I control for an availability dependency I do not. If that endpoint disappears, my heatmap disappears with it, and no amount of caching saves me past a day. The counterweight is that the alternative was a token, and everything else on the page — repos, stars, followers, languages — still comes straight from GitHub's public REST API."
		},
		{ kind: 'h2', text: 'The token is optional, and only ever optional' },
		{
			kind: 'code',
			lang: 'ts',
			caption: 'lib/github.ts — headers are built the same way whether or not a token exists.',
			code: "function ghHeaders(): Record<string, string> {\n\tconst headers: Record<string, string> = {\n\t\t'User-Agent': `${USERNAME}-portfolio`,\n\t\t'Accept': 'application/vnd.github+json'\n\t}\n\tif (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`\n\treturn headers\n}"
		},
		{
			kind: 'p',
			text: 'That `if` is the entire authentication story. There is no branch anywhere else in the module, no separate authenticated code path, no error when the variable is missing. In the deployed container `GITHUB_TOKEN` is simply not set. It **is** set in one place — the GitHub Actions workflow that regenerates my self-hosted SVG README cards, which imports the same module and gets the higher rate limit for free because Actions hands it a token anyway.'
		},
		{
			kind: 'p',
			text: 'Keeping the token optional rather than required is what let one module serve two very different callers: a public container with no secrets, and a CI job that has one lying around.'
		},
		{ kind: 'h2', text: 'Caching is the rate-limit strategy' },
		{
			kind: 'stat',
			value: '86400',
			label: 'seconds of ISR revalidation on every GitHub fetch — one refresh per day, per deployment',
			source: 'REVALIDATE in lib/github.ts'
		},
		{
			kind: 'p',
			text: 'Every fetch in the module passes `next: { revalidate: REVALIDATE }`, and `REVALIDATE` is 86400. Contribution counts change once a day at most in any way a visitor would notice, so a day-old number is not stale, it is correct. Traffic to the home page therefore does not translate into traffic to GitHub: the page is prerendered and re-rendered on a daily cadence, and the fetch cache absorbs the rest. The dedicated `/github` page awaits `searchParams` for its year selector, so it renders per request — but it reads the same cached fetches, so a visitor clicking through 2020, 2021 and 2022 costs one upstream call per year, per day.'
		},
		{ kind: 'h2', text: 'The fan-out I am least comfortable with' },
		{
			kind: 'p',
			text: "The language breakdown is the expensive part. A repo's `language` field is only its single dominant language, so a site built mostly of CSS and HTML shows up as nothing but TypeScript. To get honest bytes I have to call `/repos/:full_name/languages` for every repo and sum the maps."
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'lib/github.ts — one request per repo, in parallel, each failure swallowed individually.',
			code: "await Promise.all(\n\trepos.map(async r => {\n\t\ttry {\n\t\t\tconst res = await fetch(`https://api.github.com/repos/${r.full_name}/languages`, {\n\t\t\t\theaders: ghHeaders(),\n\t\t\t\tnext: { revalidate: REVALIDATE }\n\t\t\t})\n\t\t\tif (!res.ok) return\n\t\t\tconst data = (await res.json()) as Record<string, number>\n\t\t\tfor (const [name, bytes] of Object.entries(data)) totals.set(name, (totals.get(name) ?? 0) + bytes)\n\t\t} catch {\n\t\t\t// skip this repo's languages on failure\n\t\t}\n\t})\n)"
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'This is the part that can hit the wall',
			text: 'The repo list is fetched with `per_page=100`, so a cold render can fire up to a hundred unauthenticated requests at GitHub in one burst — and [unauthenticated REST is limited by IP](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api), at 60 requests an hour. The daily cache is what keeps that from happening more than once a day, but it is a mitigation, not a guarantee: a cold container plus a cache miss is still a hundred calls.'
		},
		{
			kind: 'p',
			text: 'The honest version of this design is that I am within budget because my repo count is small and my traffic is not. If either changed I would need a real answer — a prebuilt snapshot committed at build time, or a single cached aggregate — rather than a fan-out that happens to fit.'
		},
		{ kind: 'h2', text: 'Every failure returns null' },
		{
			kind: 'p',
			text: 'All three exported fetchers — `getContributions`, `getProfile`, `getRepos` — wrap their body in `try/catch`, return `null` on a non-OK response, and never throw. That choice is what makes a token-free design deployable at all: [[skill:next-js]] prerenders these pages at build time, so an upstream hiccup during a Railway deploy would otherwise fail the build over a decorative heatmap.'
		},
		{
			kind: 'p',
			text: 'The component then degrades in two tiers. If the contributions call returns `null` the whole section is omitted — no empty grid, no skeleton that never fills. If only the profile or repos call fails, the heatmap still renders and the affected counters print an em dash instead of a number.'
		},
		{
			kind: 'p',
			text: "The cost is that this is a failure mode with no alarm. A section can quietly vanish from my home page, or four stat cards can read as dashes, and the site is still green everywhere I would look: the build passed, the container is healthy, nothing logged. The number that says how many people I persuaded before I noticed is unknowable. I accepted that because the data is decoration and the alternative was a build that breaks on someone else's uptime — but degrade-silently is a decision, not a free lunch, and I would not make the same call for anything a visitor came here to read."
		}
	],
	lessons: [
		'Making the credential optional rather than required is what let one module serve both a secretless container and a CI job. If I had written the token as a requirement with a fallback, I would have ended up with two code paths and only tested one.',
		'Caching was the rate-limit answer, not backoff or retries. Setting `revalidate` to a full day was the cheapest correct decision in the module, because the underlying numbers genuinely do not change faster than that.',
		'Silent degradation needs a matching habit: if nothing errors when a section disappears, then looking at the page is the only monitoring I have. I would add a build-time warning next time, so at least the deploy log says the data was missing.'
	],
	faqs: [
		{
			q: 'Can you fetch a GitHub contribution graph without a token?',
			a: "Not from GitHub directly. The contribution calendar is exposed only through GitHub's GraphQL API, and GraphQL requires authentication for every query, even for public data. The REST API has no equivalent endpoint. The token-free options are a third-party mirror of the calendar, or scraping the profile page HTML."
		},
		{
			q: 'What are the GitHub REST API rate limits without authentication?',
			a: 'Unauthenticated REST requests are limited per IP address, at 60 requests per hour — versus 5,000 per hour once you send a token. That is fine for a handful of endpoints behind a cache, and not fine for a per-repo fan-out on every page view, which is why the caching layer matters more than the request code.'
		},
		{
			q: 'How do I cache external API calls in the Next.js App Router?',
			a: 'Pass `next: { revalidate: <seconds> }` to `fetch` in a server component. Next caches the response and serves it to every render until the window expires, then refreshes in the background. Because it is per-fetch rather than per-page, several pages can share one cached upstream call — my home page and my dedicated GitHub page read exactly the same cached data.'
		},
		{
			q: 'Why sum every repository language instead of using the repo language field?',
			a: "A repository's `language` field is only its single dominant language, so a portfolio full of styling and markup reports as pure TypeScript. Calling `/repos/:owner/:repo/languages` returns a byte count per language, and summing those maps across all repos gives a breakdown that reflects what is actually in the code. It costs one extra request per repository."
		},
		{
			q: 'Should a data fetch failure break a Next.js build?',
			a: 'It depends on whether the data is the point of the page. For decorative or supplementary data, returning `null` and omitting the section keeps deploys independent of someone else’s uptime. For content a visitor came to read, failing loudly is better — a silently missing section looks identical to a healthy site from every angle you would normally check.'
		}
	],
	sources: [
		{
			title: 'GitHub REST API — Rate limits',
			url: 'https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api'
		},
		{
			title: 'Next.js — Incremental Static Regeneration',
			url: 'https://nextjs.org/docs/app/guides/incremental-static-regeneration'
		}
	]
}
