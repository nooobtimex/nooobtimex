/**
 * The internal-link drift gate. Run: `bun run links:check` — wired into `bun run build`.
 *
 * Fails when an `href` in the prerendered HTML points at a route the build did not emit.
 *
 * It exists because that class of bug used to be invisible. `Skill.id` for Vue.js is
 * `vue`, but five call sites built the URL with `slugify(skill.name)` → `vue-js`.
 * Nothing broke loudly: the root `app/loading.tsx` (since deleted) streamed a shell for
 * any matched route, which flushed response headers at 200, so `/skills/vue-js` returned
 * **HTTP 200** with the title "Skill Not Found" — and `app/sitemap.ts` submitted that URL
 * to Google. No build, lint or type check said a word.
 *
 * `dynamicParams = false` on the `[...id]` routes turned those into real 404s, which at
 * least makes the failure visible — but only once a human or a crawler clicks. This
 * turns it into a build error instead.
 *
 * Reads the BUILD OUTPUT rather than re-deriving routes from `common/data`: the point is
 * to compare what the links say against what the build actually emitted. Deriving both
 * sides from one source would defeat it.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const APP_DIR = '.next/server/app'

function walk(dir: string): string[] {
	if (!existsSync(dir)) return []
	return readdirSync(dir).flatMap(name => {
		const full = join(dir, name)
		return statSync(full).isDirectory() ? walk(full) : [full]
	})
}

/**
 * Every path the build can serve.
 *
 * `.html` / `.body` files are the prerendered pages and static route handlers.
 * `app-path-routes-manifest.json` supplies the routes that render on demand (e.g.
 * `/github`, which awaits `searchParams`) and so leave no file behind. Bracketed
 * patterns are deliberately excluded — with `dynamicParams = false`, an unprerendered
 * dynamic path is exactly what we want to flag.
 */
function validRoutes(): Set<string> {
	const routes = new Set<string>(['/'])

	for (const file of walk(APP_DIR)) {
		const m = file.match(/\.(html|body)$/)
		if (!m) continue
		const route = '/' + relative(APP_DIR, file).replace(/\.(html|body)$/, '')
		if (route.startsWith('/_')) continue // _not-found, _global-error
		routes.add(route === '/index' ? '/' : route)
	}

	const manifestPath = '.next/app-path-routes-manifest.json'
	if (existsSync(manifestPath)) {
		const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, string>
		for (const route of Object.values(manifest)) {
			if (route.includes('[') || route.startsWith('/_')) continue
			routes.add(route)
		}
	}

	return routes
}

/** Internal `href`s, normalised: query and hash stripped, trailing slash removed. */
function internalHrefs(html: string): string[] {
	return [...html.matchAll(/href="(\/[^"]*)"/g)]
		.map(m => m[1].replace(/[?#].*$/, ''))
		.filter(h => h !== '' && !h.startsWith('//'))
		.map(h => (h.length > 1 ? h.replace(/\/$/, '') : h))
}

function main(): void {
	const pages = walk(APP_DIR).filter(f => f.endsWith('.html'))

	if (pages.length === 0) {
		throw new Error(`No prerendered HTML found in ${APP_DIR}. Run \`next build\` first.`)
	}

	const routes = validRoutes()
	// Map of broken target -> the pages that link to it, so the error names a place to fix.
	const broken = new Map<string, Set<string>>()

	for (const page of pages) {
		const source = '/' + relative(APP_DIR, page).replace(/\.html$/, '')
		for (const href of internalHrefs(readFileSync(page, 'utf8'))) {
			if (routes.has(href)) continue
			// Static assets under public/ are served directly and leave no route behind.
			if (/\.[a-z0-9]{2,5}$/i.test(href)) continue
			if (!broken.has(href)) broken.set(href, new Set())
			broken.get(href)!.add(source)
		}
	}

	if (broken.size > 0) {
		const detail = [...broken.entries()]
			.sort()
			.map(([href, sources]) => {
				const from = [...sources].sort().slice(0, 4)
				const more = sources.size > from.length ? ` (+${sources.size - from.length} more)` : ''
				return `  ${href}\n      linked from: ${from.join(', ')}${more}`
			})
			.join('\n')

		throw new Error(
			`${broken.size} internal link(s) point at routes this build did not emit:\n${detail}\n\n`
				+ `Detail-route URLs must be keyed by \`id\` — the same value \`generateStaticParams\`\n`
				+ `emits — never \`slugify(name)\`. See scripts/links/check.ts for why this gate exists.`
		)
	}

	console.log(`links:check — ${pages.length} pages, ${routes.size} routes, no broken internal links.`)
}

main()
