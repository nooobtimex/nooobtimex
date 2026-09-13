import type { PostDef } from '../../../interfaces'

/** Sources: doc comments in app/(main)/projects/[...id]/page.tsx and scripts/links/check.ts, CLAUDE.md's SEO invariants, commit f338c5c, app/loading.tsx, app/not-found.tsx. Update callout: commit 8257568 (loading.tsx deleted) and scripts/seo/check.ts. */
export const loadingTsxSoft404: PostDef = {
	id: 'loading-tsx-soft-404',
	title: 'loading.tsx turns every notFound() into an indexable soft-404',
	publishedAt: '2026-08-24',
	updatedAt: '2026-09-14',
	chapter: 'ownership',
	series: { id: 'seo-forensics', part: 2 },
	category: 'seo-aeo',
	description:
		'A streaming loading.tsx flushes headers at 200, so notFound() paints 404 UI into a committed response. Finding and fixing an indexable soft-404 factory.',
	tldr: 'A streaming `loading.tsx` flushes response headers before the page component runs, so the status is committed at **200** and a later `notFound()` can only paint 404 UI into a 200 response. On my catch-all detail routes that turned every mistyped slug into an indexable soft-404 — one of them was in my sitemap. The fix is `generateStaticParams` plus `export const dynamicParams = false`, which makes Next reject unknown params at the routing layer, before anything streams.',
	skills: ['next-js', 'seo'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: "On 24 August 2026 I audited my own portfolio the way I would audit a client's site: curl against the live HTML, no dev server, no assumptions. Part 1 of this series covered [the root-layout canonical that declared 90 pages duplicates of my homepage](/blog/root-layout-canonical-90-duplicates). This post is the second defect from the same audit: `/skills/vue-js` — a page that does not exist — answered **HTTP 200**, titled “Skill Not Found”."
		},
		{
			kind: 'p',
			text: 'The page was not even orphaned. Every Vue link on the site pointed at it, and my sitemap submitted it to Google. The mechanism that made it [a 200 instead of a 404](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes) was a file I had added purely for user experience: `app/loading.tsx`.'
		},
		{ kind: 'h2', text: 'How a loading spinner commits a 200' },
		{
			kind: 'p',
			text: "`app/loading.tsx` is the App Router's loading-UI convention: put a component there and Next wraps the routes below it in a Suspense boundary, streams the shell immediately, and swaps in the page when it resolves. Mine was a full-screen spinner in the site's Cyberpunk style."
		},
		{
			kind: 'code',
			lang: 'tsx',
			caption:
				'app/loading.tsx (since deleted), abridged — a full-screen shell that streamed for any matched route while the page resolved.',
			code: "export default function Loading() {\n\treturn (\n\t\t<div className='bg-background fixed inset-0 z-50 …'>\n\t\t\t<div className='border-t-cyber-cyan size-20 animate-spin …' />\n\t\t\t<p className='neon-text-cyan animate-pulse …'>Loading…</p>\n\t\t</div>\n\t)\n}"
		},
		{
			kind: 'p',
			text: 'Streaming is the trap. To send that shell before the page is ready, Next must flush the response headers immediately — and it flushes them with status **200**, because at that moment nothing has gone wrong yet. When my page component then looked up the slug, found nothing, and called `notFound()`, the status was already on the wire. Next did the only thing it still could: render the 404 UI into the body of an already-committed 200. This is not something peculiar to my setup: [vercel/next.js#93253](https://github.com/vercel/next.js/issues/93253) reports exactly it — `notFound()` answering 200 whenever a sibling `loading.tsx` is present — filed by someone I have never met, against a canary I was not running.'
		},
		{
			kind: 'p',
			text: "My detail routes are catch-alls — `[...id]` under `/skills/`, `/projects/`, `/career/` and `/companies/` — so they matched **any** slug, and every mistyped or stale URL got this treatment. Google's name for a page that says “not found” but answers 200 is a **soft 404**, and unlike a real 404 it is crawlable, indexable surface. I had an unbounded supply of them."
		},
		{ kind: 'h2', text: 'The one skill out of 61 that proved it live' },
		{
			kind: 'p',
			text: 'This was not a theoretical hole. My skill detail URLs were built with `slugify(skill.name)` in five call sites, while the route itself was keyed by `Skill.id`. For 60 of my 61 skills the two values happened to agree, so everything looked fine. [[skill:vue]] was the exception: its id is `vue`, its slugified name is `vue-js`.'
		},
		{
			kind: 'stat',
			value: '60 / 61',
			label: 'skills whose slugify(name) happened to equal their id — Vue.js was the one that did not',
			source: 'commit f338c5c post-mortem'
		},
		{
			kind: 'p',
			text: 'So every Vue link on the site pointed at `/skills/vue-js`, and `app/sitemap.ts` — built from the same slugify call — submitted that URL to Google. Thanks to the streaming 200, nothing anywhere reported a problem: no build failure, no type error, no 404 in any crawl report. A “Skill Not Found” page, formally nominated for indexing.'
		},
		{ kind: 'h2', text: 'The fix: refuse to enter the segment' },
		{
			kind: 'p',
			text: 'The tempting patch was metadata. My `generateMetadata` returns `robots: { index: false }` when the slug is unknown, and that fallback still exists as a belt — but it is not a fix, because the response is still a 200 that a crawler may or may not honour. The status itself had to be right, which means `notFound()` must be decided **before** anything streams. In the App Router that is a routing-layer decision:'
		},
		{
			kind: 'code',
			lang: 'tsx',
			caption: 'app/(main)/projects/[...id]/page.tsx — repeated on every [...id] detail route.',
			code: 'export async function generateStaticParams() {\n\treturn projectsData.map(p => ({ id: [p.id] }))\n}\n\n// Unknown slugs must 404 at the routing layer, not render.\nexport const dynamicParams = false'
		},
		{
			kind: 'p',
			text: '`generateStaticParams` enumerates every real id from the data layer, and `dynamicParams = false` tells [[skill:next-js]] the list is exhaustive. For any other param, Next never enters the segment at all — no loading shell, no stream, no flushed headers — and the request resolves as a genuine 404. The URLs themselves are now keyed by `id`, never `slugify(name)`, so the link and the route derive from the same value and cannot drift apart.'
		},
		{
			kind: 'p',
			text: 'Becoming a real 404 also changed what the 404 page is for. It is now the actual destination of every mistyped or stale inbound link, so `app/not-found.tsx` carries the same crawlable section links as the site nav — a crawler or a human landing there can still reach every section instead of hitting a dead end.'
		},
		{ kind: 'h2', text: 'What this fix costs, and what it still misses' },
		{
			kind: 'p',
			text: '`dynamicParams = false` is the right call here and the wrong default in general. It means every valid URL must be known at build time. On [[project:portfolio]] that is free — the content is code, so new content ships with a build anyway. On a site with CMS-driven or user-generated detail pages, the same line would 404 every page created after the last deploy, and I would have had to solve the status problem some other way.'
		},
		{
			kind: 'p',
			text: 'I also considered deleting `app/loading.tsx`, since the spinner was the mechanism. I kept it. Streaming loading UI was working exactly as documented; the defect was letting an unknown slug get far enough to stream. Removing the spinner would have patched this symptom and left the class of bug alive.'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'Update · 14 September 2026',
			text: "Three weeks later I deleted `app/loading.tsx` after all, for a reason this post missed. React 19.2's server renderer [sends the fallback instead of a Suspense boundary's content](https://github.com/react/react/issues/35460) when that content is larger than 500 bytes and the response has already passed 12,800 bytes — even when nothing suspended. The real content goes into a `hidden` element that an inline script reveals. My spinner wrapped every page, so 123 of 126 prerendered pages shipped as “Loading…”: a Journal post had 1 visible word and 1,759 hidden. In a browser the script swapped it in almost at once; anything reading the HTML without running JavaScript got a loading screen on every URL, while Google AdSense rated the site “Low value content”. The routing-layer fix above still stands, and a second build gate now fails any page whose content ships hidden."
		},
		{
			kind: 'p',
			text: 'And the fix only makes failures **visible**, not impossible — a real 404 still needs a human or a crawler to hit it before anyone notices the link pointing there. That gap is closed by `scripts/links/check.ts`, a post-build gate that walks the prerendered HTML in `.next/server/app` and fails the build on any internal `href` the build did not emit. It reads the build output rather than re-deriving routes from `common/data`, because comparing a thing against itself proves nothing. After the change I verified the site the way Railway serves it — standalone build, injected port, no `.env`: all 90 sitemap URLs answered 200, and `/skills/vue-js`, along with every other unknown slug, answered a real 404.'
		}
	],
	lessons: [
		"Status codes are part of the page contract, and streaming quietly rewrites them. I now check what the wire says — `curl -s -o /dev/null -w '%{http_code}'` — instead of trusting what the UI shows.",
		'Two representations of the same value will drift. `id` and `slugify(name)` agreed 60 times out of 61, which is exactly enough agreement to stop anyone looking. Next time I key everything off one value from day one.',
		'A fix that makes failures visible is half a fix. The other half is the build gate that makes the broken link a build error, so nobody has to click it first.'
	],
	faqs: [
		{
			q: 'Why does my Next.js notFound() page return HTTP 200 instead of 404?',
			a: 'Almost certainly a `loading.tsx` (or any Suspense boundary) above the route. Streaming the loading shell flushes the response headers at status 200 before your page component runs, so a later `notFound()` can only render 404 UI into an already-committed 200 response. The status must be decided before anything streams — at the routing layer, not inside the page.'
		},
		{
			q: 'What is a soft 404 and why does Google care?',
			a: 'A soft 404 is a page that tells the user “not found” while answering HTTP 200. Because the status says success, crawlers treat it as a real, indexable page — it can rank, waste crawl budget, and pollute the index with error pages. Google Search Console flags detected ones, but a streamed 200 with a valid-looking shell can also simply get indexed.'
		},
		{
			q: 'How do I make unknown dynamic route slugs return a real 404 in the Next.js App Router?',
			a: 'Export `generateStaticParams` returning every valid param from your data source, and add `export const dynamicParams = false` to the route. Next then refuses to enter the segment for any param not in the list and serves `not-found.tsx` with a genuine 404 status — the loading shell never streams, so the status is never committed at 200.'
		},
		{
			q: 'Should I delete loading.tsx to avoid soft 404s?',
			a: 'Not to fix soft 404s — `dynamicParams = false` rejects unknown slugs at the routing layer whatever wraps the page. But check what a route-level `loading.tsx` does to your HTML. In React 19.2 a completed Suspense boundary larger than 500 bytes, in a response already past 12,800 bytes, is sent as its fallback, with the real content in a hidden element that an inline script reveals. Around a whole page that makes every page read as a loading screen to anything that does not run JavaScript. If your build emits that, remove the route-level boundary and scope Suspense to the parts that genuinely wait on data.'
		}
	],
	sources: [
		{
			title: 'vercel/next.js#93253 — notFound() returns HTTP 200 when a sibling loading.tsx is present',
			url: 'https://github.com/vercel/next.js/issues/93253'
		},
		{
			title: 'vercel/next.js#93238 — HTTPAccessFallbackBoundary swallows the notFound() status code',
			url: 'https://github.com/vercel/next.js/issues/93238'
		},
		{
			title: 'vercel/next.js#91806 — Next / React 19.2 suspense boundary outlining bug',
			url: 'https://github.com/vercel/next.js/issues/91806'
		},
		{
			title: 'react/react#35460 — In React 19.2 Suspense renders fallback instead of children if children are too big',
			url: 'https://github.com/react/react/issues/35460'
		},
		{
			title: 'Next.js — loading.js file convention',
			url: 'https://nextjs.org/docs/app/api-reference/file-conventions/loading'
		},
		{
			title: 'Next.js — notFound()',
			url: 'https://nextjs.org/docs/app/api-reference/functions/not-found'
		},
		{
			title: 'Google Search Central — HTTP status codes and soft 404s',
			url: 'https://developers.google.com/crawling/docs/troubleshooting/http-status-codes'
		}
	]
}
