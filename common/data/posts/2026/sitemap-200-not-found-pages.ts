import type { PostDef } from '../../../interfaces'

/** Sources: scripts/links/check.ts header, CLAUDE.md SEO invariant 3, commit f338c5c, app/sitemap.ts, lib/utils.ts. */
export const sitemap200NotFoundPages: PostDef = {
	id: 'sitemap-200-not-found-pages',
	title: 'Your sitemap can submit 200-status Not Found pages',
	happenedAt: '2026-08-24',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'ownership',
	series: { id: 'seo-forensics', part: 3 },
	category: 'seo-aeo',
	description:
		'My sitemap nominated a URL the build never emitted, because it composed detail URLs with slugify(name) while the routes were keyed by id.',
	tldr: 'A sitemap is the strongest indexing signal you send — you are asserting that these URLs exist and deserve crawl budget. Mine composed detail URLs with `slugify(name)` while the routes were keyed by `id`, so it submitted `/skills/vue-js`, a 200-status “Skill Not Found” page, to Google. Generate sitemap URLs from the exact value `generateStaticParams` emits, never from a display transform of a name.',
	skills: ['next-js', 'seo', 'aeo'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: "On 24 August 2026 I audited my own site the way I would audit a client's, and `sitemap.xml` was the file I opened last — because a generated sitemap feels like the safest file in the project. It is a `map()` over data I control. There is nothing in it to get wrong."
		},
		{
			kind: 'p',
			text: 'It listed 90 URLs. One of them was a page my build had never emitted. Not a stale entry left over from a rename, not a dead external link — a URL composed at build time, by my own code, for a page that did not exist. And because of a separate defect I have written up as [part 2 of this series](/blog/loading-tsx-soft-404), that URL answered **HTTP 200** with the title “Skill Not Found”.'
		},
		{ kind: 'h2', text: 'A sitemap is a nomination, not an index' },
		{
			kind: 'p',
			text: 'It is worth being precise about [what a sitemap does](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), because it changes how bad this is. A sitemap does not describe your site — it **nominates** URLs. It tells a crawler that these specific addresses exist, are canonical enough to be worth fetching, and should be spent crawl budget on. That is why a broken entry is worse than a broken link: a broken link needs a crawler to find the page that carries it, while a sitemap entry skips discovery entirely. Mine handed over an error page and asked for it to be indexed. What a crawler then does with that is on the record: [vercel/next.js#79942](https://github.com/vercel/next.js/issues/79942) is dynamic routes being tagged soft 404 by Googlebot and left unindexed, reported by a stranger a year before my audit.'
		},
		{
			kind: 'stat',
			value: '90',
			label: 'URLs my sitemap nominated for indexing — one of them a page the build never emitted',
			source: 'commit f338c5c'
		},
		{ kind: 'h2', text: 'Two functions, one URL, no shared source' },
		{
			kind: 'p',
			text: 'The route for a skill detail page is keyed by `Skill.id`. The sitemap built the same URL from `Skill.name`, run through the site-wide `slugify()` helper:'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'app/sitemap.ts before the fix — the URL is derived from the display name, not the route key.',
			code: "import { slugify } from '@/lib/utils'\n\n// …\n\treturn skillsData.map(item => ({\n\t\turl: `${domain}/skills/${slugify(item.name)}`,\n\t\tlastModified: new Date()\n\t}))"
		},
		{
			kind: 'p',
			text: 'The commit that fixed this counts **five call sites and the sitemap** building the URL that way — the skill node in the graph, the search palette, the company and experience detail pages. Every one of them was independently correct-looking. None of them referenced the route.'
		},
		{
			kind: 'p',
			text: '`slugify()` is a display transform. Mine lowercases, collapses whitespace, and replaces every non-word character with a hyphen — which is exactly what you want for turning a heading into an anchor, and exactly what you do not want for an identity. It is lossy and it is not invertible. [[skill:vue]] has the id `vue`; its name is “Vue.js”; the dot becomes a hyphen and you get `vue-js`. For 60 of my 61 skills the two values happened to be byte-identical, which is a high enough agreement rate that nobody — including me — ever thought to check the 61st.'
		},
		{ kind: 'h2', text: 'The fix: emit the same value the router does' },
		{
			kind: 'p',
			text: 'The repair is not "call slugify correctly". It is to delete the second derivation entirely. Detail-route URLs now come from `id`, the same value each route\'s `generateStaticParams` returns, so a sitemap URL and a prerendered page are the same string by construction:'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'app/sitemap.ts today — the comment is load-bearing, because the next person will be tempted again.',
			code: "// Detail routes are keyed by `id` — the same value each route's\n// `generateStaticParams` emits, so a sitemap URL can never 404.\n...projectsData.map(p => entry(`/projects/${p.id}`, 0.7)),\n...skillsData.map(s => entry(`/skills/${s.id}`, 0.5)),\n...experiencesData.map(e => entry(`/career/${e.id}`, 0.6)),\n...entitiesData.map(o => entry(`/companies/${o.id}`, 0.6)),"
		},
		{
			kind: 'p',
			text: 'This costs something real, and I want to name it. `/skills/vue` is a worse URL than `/skills/vue-js` for a human reading it and for [[skill:seo]] — the slugified name carries the keyword people actually search. I chose the uglier URL because a URL that resolves beats a URL that reads well, and because any scheme that lets the link and the route be computed separately will drift again. If I ever want prettier slugs, the right move is to change the `id` itself, in one place, and let both sides follow.'
		},
		{ kind: 'h2', text: 'The second lie in the same file: lastmod' },
		{
			kind: 'p',
			text: 'While I was in there I found a quieter defect. Every entry carried `lastModified: new Date()`, so all 90 URLs re-stamped themselves as freshly modified on every deploy — including deploys that changed nothing user-facing, like the workflow that regenerates my README SVGs. A `lastmod` that is always "now" is not a signal; it is noise a crawler learns to ignore, and once it is discounted you cannot get it back by being honest later.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'app/sitemap.ts — a frozen content date, bumped by hand when the content behind these routes changes.',
			code: "const CONTENT_LAST_MODIFIED = new Date('2026-08-24')"
		},
		{
			kind: 'p',
			text: 'The journal is the one deliberate divergence: each post entry carries its own `updatedAt ?? publishedAt`, because a post date is a content date rather than deploy noise. The trade is that the site-wide stamp is now a manual step, and a frozen `lastmod` that nobody bumps is its own quiet lie. I accepted that because real content changes here are rare and deliberate enough to remember, while deploys are not.'
		},
		{ kind: 'h2', text: 'What actually closed it' },
		{
			kind: 'p',
			text: 'Keying URLs off `id` fixed the instance. It did not fix the class — nothing in [[skill:next-js]], TypeScript or ESLint knows that a template literal in a `map()` is supposed to match a route. So the same commit added a post-build gate that walks the prerendered HTML and fails the build on any internal `href` the build did not emit; that gate is [part 4](/blog/links-check-build-gate). Afterwards I verified [[project:portfolio]] against a standalone build served the way the Dockerfile serves it: all 90 sitemap URLs answered 200, and the unknown slugs answered a real 404.'
		}
	],
	lessons: [
		'A generated file is only as trustworthy as the value it is generated from. Mapping over my own data felt safe, but the map was over the wrong field, and "generated" hid that better than a hand-written list would have.',
		'I now treat `slugify()` as strictly one-way — presentation only. Anything that has to round-trip to a route gets an explicit `id` that a human wrote down.',
		'`lastmod: new Date()` was me optimising a signal I had not thought about. Freshness you assert on every deploy is worth less than freshness you assert rarely and mean.',
		'Checking the sitemap last was backwards. It is the file where my claims about the site are most explicit, so it is the fastest place to see where those claims stopped matching reality.'
	],
	faqs: [
		{
			q: 'Can a sitemap contain URLs that return 404 or Not Found pages?',
			a: 'Yes, and nothing stops it. A sitemap is generated by your code, so any bug in how you compose URLs ends up in it verbatim. It is worse than a broken link because the crawler does not need to discover the page — you submitted the address directly and asked for it to be crawled.'
		},
		{
			q: 'How should I generate sitemap URLs for dynamic routes in the Next.js App Router?',
			a: "Derive them from the exact same value your route's `generateStaticParams` returns — usually a stable `id` field on your data. If the sitemap composes URLs from a different field, or transforms a name with a slug helper, the two can silently disagree and you will submit URLs the build never emitted."
		},
		{
			q: 'Why should I not use slugify(name) for detail-page URLs?',
			a: 'Slugification is lossy and one-way: punctuation is collapsed into hyphens, so "Vue.js" becomes `vue-js` and no longer maps back to the id `vue`. It also usually agrees with your id, which is the dangerous part — mine agreed for 60 of 61 records, so the mismatch never surfaced during development.'
		},
		{
			q: 'Should sitemap lastmod be the current date?',
			a: 'No. `lastModified: new Date()` re-stamps every URL on every deploy, including deploys that change nothing on those pages. Crawlers discount a lastmod that is always current. Use a real content date — a frozen constant you bump when content changes, or a genuine per-item date for things like posts.'
		},
		{
			q: 'How do I catch broken internal URLs before they reach my sitemap?',
			a: 'Compare the links your build produced against the routes your build emitted, as a post-build step. Reading the prerendered HTML in `.next/server/app` and checking every internal `href` against the emitted route list turns this class of drift into a build error instead of something a crawler finds later.'
		}
	],
	sources: [
		{
			title: 'vercel/next.js#79942 — Soft 404 on dynamic routes (Googlebot indexing)',
			url: 'https://github.com/vercel/next.js/issues/79942'
		},
		{
			title: 'Next.js — sitemap.ts file convention',
			url: 'https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap'
		},
		{
			title: 'Google Search Central — Build and submit a sitemap',
			url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap'
		},
		{
			title: 'Google Search Central — HTTP status codes and soft 404s',
			url: 'https://developers.google.com/crawling/docs/troubleshooting/http-status-codes'
		}
	]
}
