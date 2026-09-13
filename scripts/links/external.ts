/**
 * The outbound-citation gate. Run: `bun run links:external` — deliberately NOT in `bun run build`.
 *
 * Every `sources[].url` and every external `[text](https://…)` in post prose is fetched and
 * has to answer. Nothing else in this repo can tell you whether an outbound link is real:
 * `links:check` filters to hrefs starting with `/`, so an external URL that 404s — or one
 * that was never a URL at all, just a plausible-looking string — passes every existing gate,
 * ships, and sits in a published article claiming to be a citation.
 *
 * That failure mode is the whole reason this file exists. A post written from a commit log
 * can only invent two things: a number, and a link. The numbers are checked by whoever
 * wrote the commit. The links were checked by nobody.
 *
 * Kept out of `build` on purpose. A network call inside the deploy gate makes the deploy
 * fail when a vendor's docs site is briefly down, which trains everyone to bypass the gate.
 * Run it before publishing, and in CI on a schedule where a red run is information rather
 * than an outage.
 *
 * Exit codes: 0 all reachable, 1 something is broken or malformed.
 */
import { postsData, privacyPolicy } from '../../common'
import type { Post, PostBlock } from '../../common/interfaces'

/** Non-post pages whose prose carries outbound links, checked under the same rules. */
const PAGES: { id: string; body: PostBlock[] }[] = [{ id: '/privacy', body: privacyPolicy.body }]

/** GitHub rate-limits unauthenticated HEADs harshly; a token is optional but helps. */
const UA = 'nooobtimex-links-external/1.0 (+https://nooobtimex.me)'
const TIMEOUT_MS = 15_000
const CONCURRENCY = 6

interface Citation {
	url: string
	postId: string
	where: string
}

/** Inline `[text](href)` links in prose, external ones only — internal is `links:check`'s job. */
function inlineExternalUrls(text: string): string[] {
	return [...text.matchAll(/\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)].map(m => m[1])
}

/** Every authored string in a run of blocks — the raw markup, since the link syntax is what we are reading. */
function blockText(blocks: PostBlock[]): string[] {
	const out: string[] = []
	for (const b of blocks) {
		for (const k of ['text', 'caption', 'label', 'title'] as const)
			if (k in b && typeof (b as Record<string, unknown>)[k] === 'string') out.push((b as Record<string, string>)[k])
		if (b.kind === 'list') out.push(...b.items)
		if (b.kind === 'table') out.push(...b.head, ...b.rows.flat())
	}
	return out
}

/** Every authored string in a post. */
function rawText(p: Post): string[] {
	const out: string[] = [p.tldr, p.description, ...(p.lessons ?? [])]
	for (const f of p.faqs) out.push(f.q, f.a)
	return [...out, ...blockText(p.body)]
}

function collect(): Citation[] {
	const out: Citation[] = []
	for (const post of postsData) {
		for (const s of post.sources ?? []) out.push({ url: s.url, postId: post.id, where: 'sources' })
		for (const text of rawText(post))
			for (const url of inlineExternalUrls(text)) out.push({ url, postId: post.id, where: 'prose' })
	}
	for (const page of PAGES)
		for (const text of blockText(page.body))
			for (const url of inlineExternalUrls(text)) out.push({ url, postId: page.id, where: 'page' })
	return out
}

/** Shape problems worth failing on before a single request goes out. */
function malformed(url: string): string | null {
	let u: URL
	try {
		u = new URL(url)
	} catch {
		return 'not a valid URL'
	}
	if (u.protocol !== 'https:') return 'must be https'
	// Fragments are kept on purpose: `…/image#qualities` cites the exact section rather than
	// a page the reader then has to search. Browsers ignore a stale anchor, so it degrades safely.
	if ([...u.searchParams.keys()].some(k => /^utm_|^ref$|^source$/i.test(k))) return 'strip tracking parameters'
	return null
}

async function reach(url: string): Promise<{ ok: boolean; detail: string }> {
	const opts = { redirect: 'follow' as const, headers: { 'user-agent': UA } }
	for (const method of ['HEAD', 'GET'] as const) {
		try {
			const res = await fetch(url, { ...opts, method, signal: AbortSignal.timeout(TIMEOUT_MS) })
			// Some doc hosts refuse HEAD outright; only a GET result is conclusive.
			if (res.status === 405 || res.status === 403 || res.status === 501) continue
			return { ok: res.ok, detail: `HTTP ${res.status}` }
		} catch (e) {
			if (method === 'GET') return { ok: false, detail: e instanceof Error ? e.message : String(e) }
		}
	}
	return { ok: false, detail: 'no response to HEAD or GET' }
}

async function pooled<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
	const results = new Array<R>(items.length)
	let next = 0
	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, async () => {
			for (let i = next++; i < items.length; i = next++) results[i] = await fn(items[i])
		})
	)
	return results
}

async function main(): Promise<void> {
	const citations = collect()
	if (citations.length === 0) {
		console.log('links:external — no outbound citations found.')
		return
	}

	// One request per distinct URL, however many posts cite it.
	const byUrl = new Map<string, Citation[]>()
	for (const c of citations) byUrl.set(c.url, [...(byUrl.get(c.url) ?? []), c])
	const urls = [...byUrl.keys()].sort()

	const broken: string[] = []

	for (const url of urls) {
		const why = malformed(url)
		if (why)
			broken.push(
				`  ${url}\n      ${why} — cited by ${byUrl
					.get(url)!
					.map(c => c.postId)
					.join(', ')}`
			)
	}

	const live = urls.filter(u => !malformed(u))
	const results = await pooled(live, CONCURRENCY, async url => ({ url, ...(await reach(url)) }))

	for (const r of results.filter(r => !r.ok)) {
		const cited = byUrl.get(r.url)!
		broken.push(`  ${r.url}\n      ${r.detail} — cited by ${cited.map(c => `${c.postId} (${c.where})`).join(', ')}`)
	}

	const postsWith = new Set(citations.filter(c => c.where !== 'page').map(c => c.postId)).size
	const pageLinks = citations.filter(c => c.where === 'page').length
	console.log(
		`links:external — ${urls.length} distinct URLs across ${postsWith}/${postsData.length} published posts`
			+ ` (${citations.filter(c => c.where === 'prose').length} inline, ${citations.filter(c => c.where === 'sources').length} in sources)`
			+ ` and ${PAGES.length} page(s) (${pageLinks} links).`
	)

	if (broken.length > 0) {
		console.error(`\n${broken.length} citation(s) do not resolve:\n${broken.join('\n')}\n`)
		console.error('A citation that does not answer is worse than no citation: it looks verified and is not.')
		process.exit(1)
	}
	console.log('All outbound citations reachable.')
}

await main()
