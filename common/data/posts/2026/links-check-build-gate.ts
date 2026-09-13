import type { PostDef } from '../../../interfaces'

/** Sources: scripts/links/check.ts in full (its header carries the design rationale), package.json build script, commit f338c5c. */
export const linksCheckBuildGate: PostDef = {
	id: 'links-check-build-gate',
	title: 'A 116-line build gate that fails on broken internal links',
	happenedAt: '2026-08-24',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'ownership',
	series: { id: 'seo-forensics', part: 4 },
	category: 'engineering',
	description:
		'A post-build script that walks the prerendered HTML and fails the build on any internal href the build did not emit — and why it reads output, not data.',
	tldr: 'After three SEO defects that no build, lint or type check reported, I added a 116-line post-build gate. It walks the prerendered HTML in `.next/server/app`, collects every internal `href`, and fails the build if one points at a route the build did not emit. The design rule that makes it work: it reads the **build output** on both sides, never the data layer — deriving links and routes from the same source would only prove that source agrees with itself.',
	skills: ['next-js', 'typescript', 'bun-js', 'seo'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: 'The August 2026 audit of this site turned up three defects in a row: [a root-layout canonical that declared 90 pages duplicates of the homepage](/blog/root-layout-canonical-90-duplicates), [a streaming loading shell that turned every unknown slug into a 200-status Not Found page](/blog/loading-tsx-soft-404), and [a sitemap that nominated one of those pages for indexing](/blog/sitemap-200-not-found-pages).'
		},
		{
			kind: 'p',
			text: 'They had one thing in common that bothered me more than the defects did. Not one of them was a bug in code that runs. Every function did exactly what it said. Each defect was a **disagreement between two artifacts** — a link and a route, a sitemap URL and a prerendered page — and disagreements have no runtime, so nothing in the toolchain has an opinion about them. The build passed. [[skill:typescript]] passed. [[skill:eslint]] passed. So I wrote the thing that would have failed.'
		},
		{
			kind: 'stat',
			value: '116',
			label: 'lines of build gate, added after three defects that no build, lint or type check reported',
			source: 'scripts/links/check.ts, commit f338c5c'
		},
		{ kind: 'h2', text: 'What it actually compares' },
		{
			kind: 'p',
			text: 'The gate builds two sets and subtracts one from the other. The first is [every path the build can serve](https://nextjs.org/docs/app/api-reference/functions/generate-static-params). It comes from walking `.next/server/app` and reading the filenames — `.html` and `.body` files are the prerendered pages and static route handlers:'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'scripts/links/check.ts, abridged — the route set is derived from files the build actually wrote.',
			code: "const APP_DIR = '.next/server/app'\n\nfunction validRoutes(): Set<string> {\n\tconst routes = new Set<string>(['/'])\n\tfor (const file of walk(APP_DIR)) {\n\t\tif (!/\\.(html|body)$/.test(file)) continue\n\t\tconst route = '/' + relative(APP_DIR, file).replace(/\\.(html|body)$/, '')\n\t\tif (route.startsWith('/_')) continue // _not-found, _global-error\n\t\troutes.add(route === '/index' ? '/' : route)\n\t}\n\treturn routes\n}"
		},
		{
			kind: 'p',
			text: 'Files alone are not the whole picture, because some routes leave nothing behind. `/github` awaits `searchParams`, so it renders on demand and never writes an `.html`; those come from `.next/app-path-routes-manifest.json`. Bracketed patterns from that manifest are deliberately dropped — with `dynamicParams = false` on every `[...id]` route, a dynamic path that was not prerendered is exactly the thing I want flagged, not excused. The second set is every internal link the site actually rendered, scraped out of the same HTML files and normalised so cosmetic differences do not read as breakage:'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'scripts/links/check.ts — query and hash stripped, trailing slash removed, protocol-relative URLs skipped.',
			code: "function internalHrefs(html: string): string[] {\n\treturn [...html.matchAll(/href=\"(\\/[^\"]*)\"/g)]\n\t\t.map(m => m[1].replace(/[?#].*$/, ''))\n\t\t.filter(h => h !== '' && !h.startsWith('//'))\n\t\t.map(h => (h.length > 1 ? h.replace(/\\/$/, '') : h))\n}"
		},
		{
			kind: 'p',
			text: 'Anything in the second set that is not in the first is a broken link. The script keeps a map of broken target to the set of pages that link to it, so the failure names somewhere to go — the target alone would send me grepping. Static assets under `public/` are skipped by a file-extension test, since they are served directly and leave no route behind.'
		},
		{ kind: 'h2', text: 'Why it reads the build output and not my data' },
		{
			kind: 'p',
			text: 'The obvious implementation is shorter and wrong. You import `skillsData`, `projectsData` and the rest from `common/data`, generate the list of legal URLs, and check the links against it — milliseconds, no build required. It would also have missed the bug it exists for. The broken links were produced by components rendering `slugify(skill.name)`; a checker built from `common/data` would have been checking my data against my data, and reported that my data is consistent — which was true, and irrelevant. The link said `vue-js` because a **component** said so. Only the rendered HTML knows that.'
		},
		{
			kind: 'p',
			text: 'So both sides of the comparison are outputs, and neither is my belief about the site. What the components emitted, versus what the router emitted. That is the whole design, and the header comment in the file says so in one line, because it is the thing a future refactor will be most tempted to undo.'
		},
		{ kind: 'h2', text: 'Where it sits, and why it has to sit there' },
		{
			kind: 'code',
			lang: 'json',
			caption: 'package.json — the gate is the last thing in the build, and it needs the build to have happened.',
			code: '"build": "bun run icons:check && next build && bun run links:check"'
		},
		{
			kind: 'p',
			text: 'It runs after `next build`, and throws immediately if `.next/server/app` holds no prerendered HTML rather than passing an empty check — a checker that silently succeeds when it has nothing to look at is worse than no checker. It is plain [[skill:typescript]] executed directly by [[skill:bun-js]], so there is no build step for the build gate. The position has a cost I feel every time, though: feedback takes a full production build, so this can never be a pre-commit hook or an editor squiggle. I called that a fair price because the failure it prevents is silent and long-lived — a broken link ships, gets crawled, and sits there — but if my build ran ten minutes instead of a couple, I would be hunting for a cheaper approximation.'
		},
		{ kind: 'h2', text: 'What it does not catch' },
		{
			kind: 'list',
			items: [
				'**Links that are not `href`s in prerendered HTML.** My command palette navigates with a router call, not an anchor. One of the original broken call sites was exactly that — so the gate that was written for this bug would not have caught every instance of this bug.',
				'**Client-only markup.** Anything rendered after mount is invisible to a scraper of static output.',
				'**External links.** Out of scope on purpose: they fail for reasons I do not control, and a network call would make the build flaky.',
				'**Hashes and query strings.** Both are stripped before comparison, so `/skills/vue#usage` is checked as `/skills/vue` and a dead anchor still passes.',
				'**Anything that looks like a file.** The extension heuristic that skips `public/` assets would also skip a route ending in a dot suffix.'
			]
		},
		{
			kind: 'p',
			text: 'That list is longer than the guarantee, and I would rather write it down than let the gate feel like proof. Passing `links:check` means no anchor in my prerendered HTML points at a route the build did not emit. It does not mean the site has no broken links.'
		},
		{
			kind: 'quote',
			text: 'Detail-route URLs must be keyed by `id` — the same value `generateStaticParams` emits — never `slugify(name)`.',
			cite: 'scripts/links/check.ts, the text printed when the gate fails'
		},
		{
			kind: 'p',
			text: 'The failure message carries that sentence because a build error is the one piece of documentation that gets read at the exact moment it matters. Whoever hits this — me in a year, or an agent editing [[project:portfolio]] — will not have read the [[skill:seo]] section of my CLAUDE.md. They will have read a stack trace.'
		}
	],
	lessons: [
		'The bugs that survive longest in a solo project are not wrong functions, they are two artifacts quietly disagreeing. Type checks cannot see those, so a build gate has to compare two independent outputs.',
		'A checker built from the same source as the thing it checks always passes. If I cannot name the two different places my two sets come from, I have written a tautology with a progress bar.',
		'Writing down what a gate does not cover was the most useful part of building it. The list is longer than the guarantee, and knowing that stops me trusting a green build more than it deserves.',
		'I put the fix instruction in the error text, not just in the repo docs. Documentation people search for gets skipped; documentation that appears in a failing build gets read.'
	],
	faqs: [
		{
			q: 'How do I check for broken internal links in a Next.js build?',
			a: 'After `next build`, walk `.next/server/app` for the prerendered `.html` files, extract every internal `href`, and compare it against the set of routes the build emitted — the `.html`/`.body` filenames plus the on-demand routes in `.next/app-path-routes-manifest.json`. Fail the process when a link has no matching route. Wire it into the build script so it cannot be skipped.'
		},
		{
			q: 'Why check the rendered HTML instead of my route definitions?',
			a: 'Because broken links are usually produced by components, not by your data. If the checker derives both the links and the valid routes from the same data source, it only proves that source is internally consistent — which was true in my case while the site was still shipping links to a page that did not exist.'
		},
		{
			q: 'Can a build-time link checker catch client-side navigation?',
			a: 'No. Anything navigated with a router call rather than an anchor, or rendered only after mount, leaves no `href` in the prerendered HTML and is invisible to this kind of gate. It is a real gap, not a rounding error — one of the call sites that caused my original bug was exactly that shape.'
		},
		{
			q: 'Should a link check run in lint, in a pre-commit hook, or after the build?',
			a: 'After the build, if you want it to compare against what the build actually emitted. That is the tradeoff: you get real feedback but only at production-build speed, so it cannot be an editor hint or a fast pre-commit hook. Make it fail loudly when there is no build output to inspect, so it never passes vacuously.'
		},
		{
			q: 'Is a custom link checker worth it on a small site?',
			a: 'It was for me at roughly 90 routes, because the failure it prevents is invisible: a broken internal link ships, gets crawled, and stays wrong until a human clicks it. The cost is real though — a script to maintain, and a build that now needs its output. On a site where every link is hand-written and reviewed, the odds change.'
		}
	],
	sources: [
		{
			title: 'Next.js — generateStaticParams',
			url: 'https://nextjs.org/docs/app/api-reference/functions/generate-static-params'
		},
		{
			title: 'Google Search Central — HTTP status codes and soft 404s',
			url: 'https://developers.google.com/crawling/docs/troubleshooting/http-status-codes'
		}
	]
}
