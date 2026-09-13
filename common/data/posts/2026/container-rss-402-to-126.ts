import type { PostDef } from '../../../interfaces'

// Sources: commit 0514b1c "perf: cut container RSS 402→126 MB and public/ 4.0→1.4 MB",
// lib/og-palette.ts header, scripts/icons/collections.ts, next.config.ts, Dockerfile.
export const containerRss402To126: PostDef = {
	id: 'container-rss-402-to-126',
	title: '402 MB to 126 MB: what was actually in my Next.js container',
	happenedAt: '2026-07-31',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'infrastructure',
	series: { id: 'container-diet', part: 2 },
	description:
		'My portfolio held 402 MB resident for a static site. Most of it was 26.7 MB of icon JSON the page graph never used but loaded at boot anyway.',
	tldr: 'A mostly-static portfolio was holding **402 MB of resident memory**. The cause was not traffic or a leak: `lib/og-assets.ts` imported six full `@iconify-json` collections at module scope — **32,844 icons, 26.7 MB**, of which the site server-renders about a hundred. Turbopack inlined that into two 25 MB server chunks and Next 16 materialised both at boot. The data was provably dead in the page graph; it was reachable only because `app/opengraph-image.tsx` — a metadata convention Next evaluates for **every** page — imported an 8-key colour palette from the same module. Splitting that palette into a file with zero imports, and generating a small committed icon subset instead, took it to **126 MB**.',
	skills: ['next-js', 'docker', 'railway', 'bun-js'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: 'On 2026-07-31 I went looking at [[project:portfolio]] in production and found the container sitting at 402 MB resident. This is a portfolio. Almost every route is prerendered. There is no database, no queue, and no meaningful traffic. Nothing about the workload explains that number.'
		},
		{
			kind: 'stat',
			value: '402 MB → 126 MB',
			label: 'container RSS after the fix; server chunks went 52 MB → 2.9 MB',
			source: 'commit 0514b1c, measured before and after'
		},
		{ kind: 'h2', text: 'The 26.7 MB nobody asked for' },
		{
			kind: 'p',
			text: 'The icons on this site are stored as strings in the data layer — `logos:react`, `mdi:home-variant-outline`. Something has to turn a string into an SVG. For the social cards, that job lived in `lib/og-assets.ts`, which imported six `@iconify-json` collections at module scope so it could look any icon up.'
		},
		{
			kind: 'p',
			text: '[Those six packages](https://github.com/iconify/icon-sets) are **32,844 icons and 26.7 MB of JSON**. The site server-renders on the order of a hundred of them. So 26.7 MB was being loaded to serve about 0.4% of itself — and worse, Turbopack inlined the payload into two 25 MB server chunks, which Next 16 materialises at boot rather than lazily.'
		},
		{
			kind: 'callout',
			tone: 'info',
			title: 'The part that took longest to understand',
			text: 'Tree-shaking had actually worked. It dropped the function that reads the icon data. It kept the data, because something else still pulled the module in — and that something was not on any page I would have thought to check.'
		},
		{ kind: 'h2', text: 'How a metadata file drags in your whole import graph' },
		{
			kind: 'p',
			text: '`app/opengraph-image.tsx` is a file convention. It exports `alt`, `size` and `contentType`, and Next evaluates it during metadata resolution **for every page on the site**. That makes its import graph effectively global.'
		},
		{
			kind: 'p',
			text: "It imported one thing from `og-assets.ts`: an eight-key colour palette. Eight hex strings. And because it imported that module, the module's whole graph — including 26.7 MB of icon JSON that nothing in the page graph actually reads — got welded into the shared chunk that every route entry loads at boot."
		},
		{
			kind: 'p',
			text: 'The fix is almost insultingly small: move the palette into its own file that imports nothing at all.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'lib/og-palette.ts — the constraint is the entire reason the file exists, so it is written at the top of it.',
			code: '// ⚠️ THIS FILE MUST HAVE ZERO IMPORTS, and lib/og-assets.ts must never\n// re-export OG. app/opengraph-image.tsx is a metadata convention: Next\n// evaluates it for EVERY page and welds its whole import graph into the\n// shared chunk. A re-export re-welds all 26 MB with no visible symptom.\nexport const OG = { bg: "#06070d", fg: "#e6fbff" /* … */ }'
		},
		{ kind: 'h2', text: 'Replacing the library with an artifact' },
		{
			kind: 'p',
			text: 'Splitting the palette stops the accidental import. It does not solve the real problem, which is that a build-time renderer needed icon data at all. So the icon set became a generated artifact: a committed JSON file holding only the icons this site actually uses, produced from the typed data layer and checked into the repo.'
		},
		{
			kind: 'p',
			text: 'Two decisions inside that are worth stating, because both were arrived at the hard way. First, the required-icon list is derived from **the typed data layer, never a source scan** — `common/data` mentions icon names inside doc comments, and a regex over source files would fail the build on icons nobody uses. Second, the six `@iconify-json` packages moved to `devDependencies`, with exactly one module permitted to import them.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'scripts/icons/collections.ts — dependency placement used as an architectural boundary.',
			code: '// The ONLY module in this repo that imports @iconify-json/*.\n// Nothing under app/, components/ or lib/ may import this file.\n// The packages live in devDependencies to keep that boundary honest.'
		},
		{
			kind: 'p',
			text: 'A build gate closes the loop: `icons:check` runs before `next build` and fails by name if anything in `common/data` references an icon the artifact does not carry. The failure it prevents is a blank slot on a social card that nobody notices until it has already been shared.'
		},
		{ kind: 'h2', text: 'The rest of the 276 MB' },
		{
			kind: 'p',
			text: 'The icon payload was the headline, but the same commit removed three smaller residents of the runtime container, all of the same species — cost paid at boot for capability never used at runtime.'
		},
		{
			kind: 'list',
			items: [
				'**`next/image` dropped for plain `<img>`.** Every asset in `public/` is already WebP at a sane size, so the optimizer bought nothing while keeping libvips resident in the container.',
				'**`sharp` imported lazily**, inside the one function that needs it — and that function only runs while prerendering the share cards, so the native library never loads at runtime.',
				'**`MALLOC_ARENA_MAX` and a heap cap** set in the runner stage only, never the builder — the build genuinely needs the headroom, the server does not.'
			]
		},
		{
			kind: 'p',
			text: 'The verification that mattered was not the memory graph. It was that all twelve prerendered OG cards came out **byte-identical** before and after. That is what proves 26.7 MB of icon data was dead weight rather than something the renderer was quietly relying on.'
		},
		{ kind: 'h2', text: 'The guard' },
		{
			kind: 'p',
			text: 'A fix like this regresses silently. Someone adds a convenient re-export, the graph re-welds, and nothing looks wrong — the site builds, the cards render, the tests pass. So the check is a grep against the build output, and it has to print nothing:'
		},
		{
			kind: 'code',
			lang: 'bash',
			caption: 'The regression guard. Any multi-megabyte server chunk means the payload is back.',
			code: "find .next/standalone/.next/server/chunks -name '*.js' -size +1M"
		},
		{
			kind: 'p',
			text: 'I want to be fair about what this was. This was not clever optimization — it was finding a large accident. Nobody decided to ship 26.7 MB of icons; a reasonable import of a colour constant did it invisibly, and the tooling reported nothing wrong at any point. The useful skill here was not knowing a trick. It was being suspicious of a number that did not match the workload.'
		}
	],
	lessons: [
		'Be suspicious of resource numbers that do not match the workload. 402 MB for a prerendered site was the only real signal I had, and it was enough.',
		'Metadata file conventions have global import graphs. Anything `opengraph-image.tsx` touches is effectively imported by every page — treat that file as a boundary, not as ordinary code.',
		'When a fix depends on an absence, guard the absence. "This file must have zero imports" is not enforceable by review, so the check became a grep over build output that must return nothing.',
		'Generate an artifact instead of importing a library, when you need 0.4% of it. The subset is committed, diffable, and gated by a build check that names what is missing.'
	],
	faqs: [
		{
			q: 'Why is my Next.js container using so much memory when the site is static?',
			a: 'Look at what your server chunks contain, not at your pages. A module imported at the top level of a widely-evaluated file gets bundled into the shared chunk even if tree-shaking removed the code that reads it. In my case a colour constant imported from a module that also imported 26.7 MB of icon JSON put all of it in every route entry, loaded at boot.'
		},
		{
			q: 'Does opengraph-image.tsx affect every page in the App Router?',
			a: 'Its import graph does. Next evaluates the file during metadata resolution for every page, so whatever it imports ends up in the shared server chunk. Keep it importing only leaf modules with no dependencies of their own — in this repo that meant a palette file with a comment at the top stating it must have zero imports.'
		},
		{
			q: 'How do you avoid bundling a whole icon library on the server?',
			a: 'Generate a committed subset of just the icons your data layer actually references, and quarantine the full packages behind one module that nothing in app/, components/ or lib/ may import — with the packages in devDependencies so the boundary is enforced by installation, not discipline. Then gate it: a check before the build fails by name if a referenced icon is missing from the artifact.'
		},
		{
			q: 'How do you prove a large removal did not change anything?',
			a: 'Compare the artifacts the removed code was supposedly feeding. Here all twelve prerendered OG cards were byte-identical before and after, which demonstrates the 26.7 MB was never being read at render time. A memory graph shows the win; the byte comparison shows nothing broke to get it.'
		}
	],
	sources: [
		{
			title: 'Next.js — output: standalone',
			url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/output'
		},
		{
			title: 'Iconify — icon-sets, the JSON collections this imported',
			url: 'https://github.com/iconify/icon-sets'
		}
	]
}
