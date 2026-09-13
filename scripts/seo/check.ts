/**
 * The crawler's-eye gate. Run: `bun run seo:check` — wired into `bun run build`.
 *
 * Fails when a prerendered page ships its content inside a hidden streamed segment.
 *
 * It exists because that bug is invisible from a browser. React 19.2 *outlines* a
 * completed Suspense boundary larger than 500 B once the response passes its 12,800 B
 * progressive chunk size (`isEligibleForOutlining` / `flushSegment` in react-dom-server):
 * the fallback is written in place, the real content moves into `<div hidden id="S:0">`
 * near the end of the document, and an inline `$RC()` script swaps the two after parse.
 * Nothing suspended; the boundary was simply big. A browser shows the page a moment later;
 * anything that reads the HTML without running JavaScript sees only the fallback.
 *
 * The root `app/loading.tsx` did that to 123 of 126 prerendered pages. Every one of them
 * read "Loading…" — 1 visible word against 1,759 hidden on a Journal post — while AdSense
 * rated the site "Low value content". No build, lint or type check said a word.
 *
 * Like `links:check`, this reads the BUILD OUTPUT: the rule is about what React emitted,
 * which reading the component tree does not predict.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const APP_DIR = '.next/server/app'

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
function hiddenContent(pages: string[]): string[] {
	const failures: string[] = []
	for (const page of pages) {
		const html = readFileSync(page, 'utf8')
		const cut = html.search(OUTLINED_SEGMENT)
		if (cut === -1) continue

		const hidden = countWords(readableText(html.slice(cut)))
		if (hidden === 0) continue

		const visible = countWords(readableText(html.slice(0, cut)))
		failures.push(`  ${routeOf(page)} — ${visible} visible word(s), ${hidden} hidden`)
	}
	return failures.sort()
}

function main(): void {
	const pages = walk(APP_DIR).filter(f => f.endsWith('.html'))

	if (pages.length === 0) {
		throw new Error(`No prerendered HTML found in ${APP_DIR}. Run \`next build\` first.`)
	}

	const hidden = hiddenContent(pages)
	if (hidden.length > 0) {
		throw new Error(
			`${hidden.length} prerendered page(s) ship content inside a hidden streamed segment:\n${hidden.join('\n')}\n\n`
				+ `A Suspense boundary (a loading.tsx is one) wraps content React outlined into\n`
				+ `<div hidden id="S:…">. Remove the boundary, or scope it to something whose absence\n`
				+ `from the HTML costs nothing. See scripts/seo/check.ts for why this gate exists.`
		)
	}

	console.log(`seo:check — ${pages.length} pages, no content hidden in streamed segments.`)
}

main()
