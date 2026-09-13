/**
 * The crawler's-eye gate. Run: `bun run seo:check` — wired into `bun run build`.
 *
 * Reads the prerendered HTML the way a crawler that does not run JavaScript would, and
 * fails on two things no browser, lint or type check will ever show you.
 *
 * 1. CONTENT HIDDEN IN A STREAMED SEGMENT. React 19.2 *outlines* a completed Suspense
 *    boundary larger than 500 B once the response passes its 12,800 B progressive chunk
 *    size (`isEligibleForOutlining` / `flushSegment` in react-dom-server): the fallback is
 *    written in place, the real content moves into `<div hidden id="S:0">` near the end of
 *    the document, and an inline `$RC()` script swaps the two after parse. Nothing has to
 *    suspend; the boundary was simply big. The root `app/loading.tsx` did that to 123 of
 *    126 prerendered pages — every one read "Loading…", 1 visible word against 1,759
 *    hidden on a Journal post — while AdSense rated the site "Low value content".
 *
 * 2. A SITEMAP THAT DISAGREES WITH THE ROBOTS TAGS. Thin pages are `noindex, follow` and
 *    left out of the sitemap (`common/data/coverage.ts`). A sitemap that nominates a
 *    noindexed page, or omits an indexable one, is the two halves of that decision
 *    drifting apart — so every sitemap URL must be a prerendered, indexable page, and
 *    every indexable prerendered page must be in the sitemap.
 *
 * Like `links:check`, this reads the BUILD OUTPUT: both rules are about what the build
 * emitted, which reading the component tree does not predict.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const APP_DIR = '.next/server/app'
const SITEMAP = join(APP_DIR, 'sitemap.xml.body')

/** React's outlined segment. Next's own wrappers render `hidden=""`, so they never match. */
const OUTLINED_SEGMENT = /<div hidden id="S:\d+">/

function walk(dir: string): string[] {
	if (!existsSync(dir)) return []
	return readdirSync(dir).flatMap(name => {
		const full = join(dir, name)
		return statSync(full).isDirectory() ? walk(full) : [full]
	})
}

/** What a reader gets: the head, scripts, styles and templates stripped, then all tags. */
const readableText = (html: string) =>
	html
		.replace(/<head\b[\s\S]*?<\/head>/i, ' ')
		.replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')

const countWords = (text: string) => text.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length

const routeOf = (file: string) => {
	const route = '/' + relative(APP_DIR, file).replace(/\.html$/, '')
	return route === '/index' ? '/' : route
}

/**
 * Everything after the first outlined segment is hidden segments plus scripts, so any
 * readable word past that point is content a non-JS reader never sees. A segment with no
 * words (an icon, an empty wrapper) costs nothing and passes.
 */
function hiddenContent(pages: Map<string, string>): string[] {
	const failures: string[] = []
	for (const [route, html] of pages) {
		const cut = html.search(OUTLINED_SEGMENT)
		if (cut === -1) continue

		const hidden = countWords(readableText(html.slice(cut)))
		if (hidden === 0) continue

		const visible = countWords(readableText(html.slice(0, cut)))
		failures.push(`  ${route} — ${visible} visible word(s), ${hidden} hidden`)
	}
	return failures.sort()
}

/** Both directions of the sitemap ↔ robots agreement. `/_not-found` and friends are exempt. */
function sitemapDrift(pages: Map<string, string>): string[] {
	if (!existsSync(SITEMAP)) throw new Error(`No ${SITEMAP} in the build output. Run \`next build\` first.`)

	const listed = new Set(
		[...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
			m => new URL(m[1]).pathname.replace(/(.)\/$/, '$1') || '/'
		)
	)

	const indexable = new Map<string, boolean>()
	for (const [route, html] of pages) {
		if (route.startsWith('/_')) continue
		const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? ''
		indexable.set(route, !/\bnoindex\b/.test(robots))
	}

	const failures: string[] = []
	for (const route of listed) {
		if (!indexable.has(route)) failures.push(`  ${route} — in the sitemap, but not a prerendered page`)
		else if (!indexable.get(route)) failures.push(`  ${route} — in the sitemap, but marked noindex`)
	}
	for (const [route, ok] of indexable)
		if (ok && !listed.has(route)) failures.push(`  ${route} — indexable, but missing from the sitemap`)
	return failures.sort()
}

function main(): void {
	const files = walk(APP_DIR).filter(f => f.endsWith('.html'))

	if (files.length === 0) {
		throw new Error(`No prerendered HTML found in ${APP_DIR}. Run \`next build\` first.`)
	}

	const pages = new Map(files.map(f => [routeOf(f), readFileSync(f, 'utf8')]))

	const hidden = hiddenContent(pages)
	if (hidden.length > 0) {
		throw new Error(
			`${hidden.length} prerendered page(s) ship content inside a hidden streamed segment:\n${hidden.join('\n')}\n\n`
				+ `A Suspense boundary (a loading.tsx is one) wraps content React outlined into\n`
				+ `<div hidden id="S:…">. Remove the boundary, or scope it to something whose absence\n`
				+ `from the HTML costs nothing. See scripts/seo/check.ts for why this gate exists.`
		)
	}

	const drift = sitemapDrift(pages)
	if (drift.length > 0) {
		throw new Error(
			`${drift.length} disagreement(s) between app/sitemap.ts and the pages' robots tags:\n${drift.join('\n')}\n\n`
				+ `Both must come from one decision — for skills, \`indexableSkillIds\` in\n`
				+ `common/data/coverage.ts; for a single page, its \`pageMetadata({ index })\`.`
		)
	}

	const indexed = [...pages].filter(
		([route, html]) => !route.startsWith('/_') && !/<meta name="robots" content="[^"]*\bnoindex\b/.test(html)
	).length
	console.log(
		`seo:check — ${pages.size} pages, no content hidden in streamed segments; `
			+ `sitemap agrees with robots (${indexed} indexable).`
	)
}

main()
