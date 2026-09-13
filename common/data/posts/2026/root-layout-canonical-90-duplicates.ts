import type { PostDef } from '../../../interfaces'

export const rootLayoutCanonical90Duplicates: PostDef = {
	id: 'root-layout-canonical-90-duplicates',
	title: 'One line in layout.tsx told Google 90 pages were duplicates of my homepage',
	happenedAt: '2026-08-24',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'ownership',
	category: 'seo-aeo',
	series: { id: 'seo-forensics', part: 1 },
	description:
		'A canonical set in a Next.js root layout is inherited by every route. Mine made all 90 pages declare themselves duplicates of the homepage — silently.',
	tldr: 'Never set `alternates` in a Next.js App Router root layout. Metadata is inherited by every child segment that does not override it, so a root `canonical: "/"` makes every page on the site declare the homepage as its canonical — which reads to Google as "do not index anything but /". Set the canonical per page instead, through one shared helper, and keep only `metadataBase` in the root layout.',
	skills: ['next-js', 'seo', 'aeo'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: 'While auditing this site’s live HTML I found the same tag on every single page: `<link rel="canonical" href="https://nooobtimex.me">`. The project page said it. The CV said it. All 61 skill pages said it. Ninety URLs, every one of them telling Google that the **real** version of itself was the homepage.'
		},
		{
			kind: 'p',
			text: '[A canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) is exactly that strong a claim. It says: this URL is a duplicate; index that other one instead. So the practical effect of one line of config was the whole site asking not to be indexed — with no error, no warning, and nothing visibly broken in the browser.'
		},
		{ kind: 'h2', text: 'How one line becomes ninety tags' },
		{
			kind: 'p',
			text: 'The App Router **inherits metadata**. Any field a segment does not declare is resolved from the nearest ancestor that does — and `alternates` is one of the inherited fields. My root layout had this:'
		},
		{
			kind: 'code',
			lang: 'tsx',
			caption: 'app/layout.tsx — the defect. Looks reasonable, applies to every child route.',
			code: "export const metadata: Metadata = {\n\tmetadataBase: new URL('https://nooobtimex.me'),\n\talternates: {\n\t\tcanonical: '/' // inherited by all 90 routes that never override it\n\t}\n}"
		},
		{
			kind: 'p',
			text: 'No child route overrode it, because nothing forces you to: a page without its own `alternates` builds, renders and looks completely fine. Inheritance is the right default for things like `metadataBase` or a title template. For a canonical it is exactly wrong — the one thing a canonical must never do is point somewhere generic.'
		},
		{ kind: 'h2', text: 'The fix: one helper, called by every route' },
		{
			kind: 'p',
			text: 'Deleting the root `alternates` is half the fix. The other half is making the per-page canonical the **cheap** path, so no future route forgets it. Every route on this site now gets its metadata from a single `pageMetadata()` helper:'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'lib/seo.ts — simplified. The canonical is derived from the one thing every page already knows: its own path.',
			code: 'export function pageMetadata({ path, title, description }: PageMetaInput): Metadata {\n\treturn {\n\t\ttitle,\n\t\tdescription: clampDescription(description),\n\t\talternates: { canonical: path }, // resolved against metadataBase\n\t\topenGraph: { /* … */ }\n\t}\n}'
		},
		{
			kind: 'p',
			text: 'Two details in that helper matter more than they look. The canonical is a **relative path**, resolved against the root layout’s `metadataBase` — so the domain lives in exactly one place. And `openGraph.images` is deliberately **omitted**: the file-convention `opengraph-image.tsx` is resolved separately by Next, and declaring images here would override it site-wide, which is the same class of inheritance accident this helper exists to prevent.'
		},
		{ kind: 'h2', text: 'Why nothing catches this' },
		{
			kind: 'list',
			items: [
				'**The build passes.** Metadata inheritance is a feature, not a lint rule. There is no "canonical points at another page" warning anywhere in the toolchain.',
				'**The pages render perfectly.** A canonical tag has zero visual effect; you only see it in view-source.',
				'**Search Console reports it slowly and vaguely** — pages drift into "Duplicate, Google chose different canonical" over weeks, long after the deploy that caused it.'
			]
		},
		{
			kind: 'p',
			text: 'The check that **does** catch it takes one line, against the built output or the live site:'
		},
		{
			kind: 'code',
			lang: 'bash',
			caption: 'Every page must name itself. Any page answering with the bare domain is declaring itself a duplicate.',
			code: 'curl -s https://nooobtimex.me/projects/flood-project | grep -o "<link rel=\\"canonical\\"[^>]*>"'
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'The invariant',
			text: 'The root layout owns `metadataBase` and the title template — never `alternates`. Canonicals come from the per-page helper, and every new route calls it. This is now written into the repo’s own instructions, because it is the kind of bug you only need to ship once.'
		}
	],
	lessons: [
		'Inherited defaults are only safe when inheriting is **correct**. For canonicals, inheritance is the failure mode.',
		'Any invariant that produces no error when violated needs a check you run on the OUTPUT — view-source, curl, a build gate — not on the source.',
		'Fix the class, not the instance: the helper makes the right thing the cheap thing, which is worth more than the one-line deletion.'
	],
	faqs: [
		{
			q: 'How do I set a canonical URL correctly in the Next.js App Router?',
			a: 'Set `metadataBase` once in the root layout, then declare `alternates: { canonical: "/its-own-path" }` in each page’s metadata (or `generateMetadata`). Use a shared helper so every route does it the same way. Never declare `alternates` in the root layout — it is inherited by every child segment that does not override it.'
		},
		{
			q: 'Why is my Next.js site indexed as only the homepage?',
			a: 'Check view-source on any inner page for its `<link rel="canonical">`. If it points at your homepage, an inherited `alternates.canonical` from a layout is telling Google every page is a duplicate of `/`. Google then keeps the homepage and drops the rest — with pages reported as "Duplicate, Google chose different canonical" in Search Console.'
		},
		{
			q: 'Does metadata in layout.tsx apply to all pages?',
			a: 'Yes — App Router metadata is merged down the tree, and any field a page does not declare is taken from the nearest ancestor that does. That is what you want for `metadataBase`, a title template, or default robots — and exactly what you do not want for `alternates` or per-page Open Graph images.'
		},
		{
			q: 'How do I audit which canonical each page actually ships?',
			a: 'Do not trust the source — check the output. `curl -s <url> | grep canonical` per URL, or walk the prerendered HTML in `.next/server/app` after a build. The tag either names the page itself or something is wrong; a canonical pointing at the bare domain from an inner page is always a defect.'
		}
	],
	sources: [
		{
			title: 'Next.js docs — generateMetadata and metadata inheritance',
			url: 'https://nextjs.org/docs/app/api-reference/functions/generate-metadata'
		},
		{
			title: 'Google Search Central — consolidate duplicate URLs with canonicals',
			url: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls'
		}
	]
}
