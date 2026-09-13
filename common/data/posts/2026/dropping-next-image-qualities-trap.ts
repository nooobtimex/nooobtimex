import type { PostDef } from '../../../interfaces'

// Sources: next.config.ts (the images comment block), lib/og-assets.ts (lazy sharp import),
// CLAUDE.md (Deployment), and commits c63d98c "feat: webapp" (which introduced qualities: [100])
// and 0514b1c "perf: cut container RSS 402→126 MB and public/ 4.0→1.4 MB".
export const droppingNextImageQualitiesTrap: PostDef = {
	id: 'dropping-next-image-qualities-trap',
	title: 'Dropping next/image on purpose: libvips, host cores, and the qualities:[100] trap',
	happenedAt: '2026-07-31',
	publishedAt: '2026-09-05',
	chapter: 'freelance',
	category: 'infrastructure',
	series: { id: 'container-diet', part: 4 },
	description:
		'My image optimizer re-encoded every image at quality 100 because of a one-value allowlist, while keeping libvips resident. I removed it entirely.',
	tldr: "I turned [[skill:next-js]] image optimization off on purpose with `images: { unoptimized: true }`, and the site uses plain `<img>` tags. Two reasons. First, a config line I had written months earlier — `qualities: [100]` — was an allowlist with exactly one member, so requests that asked for nothing got Next's default of 75 snapped up to the only permitted value, re-encoding everything near-lossless. Second, the optimizer keeps libvips in the runtime container: roughly 23 MB resident on require, a 50 MB native cache, and one worker thread per **host** core, because libvips reads the machine rather than the cgroup. Every asset was already WebP at the right dimensions, so the optimizer was pure cost.",
	skills: ['next-js', 'docker', 'railway'],
	relatedProjectIds: ['portfolio'],
	body: [
		{
			kind: 'p',
			text: 'Turning off `next/image` is close to an anti-pattern. It is the framework feature people cite as a reason to use the framework, it fixes real problems, and switching it off is the kind of thing you have to justify to yourself twice before writing it down.'
		},
		{
			kind: 'p',
			text: 'I switched it off on [[project:portfolio]] anyway, because on this specific site it had stopped being an optimizer. It was doing work that produced no benefit, and it was doing that work at quality 100.'
		},
		{ kind: 'h2', text: 'An allowlist with one member is not a setting' },
		{
			kind: 'p',
			text: 'Months earlier, back in February, I had added a line to `next.config.ts` that I remember thinking of as harmless — a note to myself that this site should not ship mushy images.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption:
				'next.config.ts, as it stood from February to July. The intent was "allow high quality". The effect was different.',
			code: 'images: {\n\tqualities: [100]\n}'
		},
		{
			kind: 'p',
			text: '`qualities` is not a preference. It is [the list of quality values the optimizer is permitted to serve](https://nextjs.org/docs/app/api-reference/components/image#qualities), and it exists so an attacker cannot walk your image endpoint through a hundred distinct re-encodes. Restricting it is the right instinct. Restricting it to a single value changes what it means.'
		},
		{
			kind: 'p',
			text: 'Nothing in this codebase ever passed a `quality` prop — there was no reason to, since the assets were already the quality I wanted. So every request arrived asking for the default, 75, found that 75 was not on the permitted list, and got the only value that was: 100. A configuration meant to set a ceiling had quietly become a floor.'
		},
		{
			kind: 'callout',
			tone: 'danger',
			title: 'The failure has no error in it',
			text: 'Nothing warns you. The images render, they look correct — they look better than correct — and the only symptom is CPU and bytes. A setting that silently promotes every request to the most expensive option it can is worse than one that throws, because the throwing version gets fixed the same afternoon.'
		},
		{
			kind: 'p',
			text: 'And it did not happen once. The optimized-image cache expires on a short TTL by default, so this was not a one-time cost at build; it was the whole image set being re-encoded near-lossless, repeatedly, for as long as anyone was browsing.'
		},
		{ kind: 'h2', text: 'What the optimizer costs when it is idle' },
		{
			kind: 'p',
			text: 'Fixing the allowlist would have been one character. The larger question was what the optimizer was buying at all, and the answer on this site was nothing — because the input was already the output.'
		},
		{
			kind: 'p',
			text: 'Every asset in `public/` is WebP at dimensions that are already correct for where it is displayed. There is no oversized source for the optimizer to shrink and no legacy format for it to convert. Part 2 of this series covers the pass that got them there: `public/` went 4.0 MB to 1.4 MB, and the worst offender dropped from 417 KB to 76 KB at **unchanged dimensions**, because the problem was encoding rather than size.'
		},
		{
			kind: 'p',
			text: 'Meanwhile the optimizer is not free to keep around. It needs sharp, and sharp needs libvips, and libvips is a native library with opinions about the machine it is running on.'
		},
		{
			kind: 'stat',
			value: '1 thread per host core',
			label: 'libvips sizes its worker pool from the physical machine, not from the container cgroup quota',
			source: 'next.config.ts, images comment'
		},
		{
			kind: 'p',
			text: 'That last one is the same species of bug as the heap cap in part 3 of this series: a library reading the host when it should be reading the container. On a small service scheduled onto a large shared host, libvips will happily size a worker pool against CPUs the container will never be allowed to use. Add roughly 23 MB resident the moment it is required and a 50 MB native cache, and a feature doing no useful work is one of the larger residents in the image.'
		},
		{
			kind: 'table',
			head: ['', 'With next/image', 'With plain img'],
			rows: [
				[
					'Re-encoding work',
					'Every asset, at quality 100, on a short cache TTL',
					'None — the file on disk is what ships'
				],
				['Runtime dependency', 'sharp plus libvips resident in the container', 'No native image dependency at all'],
				['Route surface', 'A live `/_next/image` endpoint to reason about', 'No endpoint; assets are static files'],
				['What you give up', '—', '`srcset`, built-in lazy loading, layout-shift protection']
			]
		},
		{ kind: 'h2', text: 'Turning it off is one line, and it removes a route' },
		{
			kind: 'code',
			lang: 'ts',
			caption: 'next.config.ts now. The comment above it in the real file is longer than the setting, on purpose.',
			code: 'images: { unoptimized: true }'
		},
		{
			kind: 'p',
			text: 'This does more than skip the optimization. With `unoptimized` set and no `next/image` call sites, there is no `/_next/image` route in the deployed app — nothing to rate-limit, nothing to cache, nothing to be walked by a bored crawler. The image surface of the site is a directory of static files served by the same handler as everything else.'
		},
		{ kind: 'h2', text: 'sharp did not leave the repo, it moved' },
		{
			kind: 'p',
			text: 'One place still genuinely needs image processing: the social cards, which are rendered at build time and want real PNG data. Deleting sharp outright would have broken them. Instead the import moved inside the one function that uses it, so requiring the native library became something that happens during prerender and never at runtime.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'lib/og-assets.ts — a top-level import here would put libvips back in the runtime container.',
			code: "async function pngDataUri(src: string, width: number) {\n\tconst sharp = (await import('sharp')).default\n\t// …only ever called while prerendering the OG cards\n}"
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'This is load-bearing and easy to undo',
			text: 'Moving that `import sharp` back to the top of any module reachable from `app/` restores every cost this post is about, and nothing fails. The build passes, the pages render, the tests are green, and the container is quietly 23 MB heavier with a worker thread per host core. It is a one-line regression with no signal, which is why the constraint is written next to the import rather than in a document.'
		},
		{ kind: 'h2', text: 'What I gave up, and when this would be wrong' },
		{
			kind: 'p',
			text: 'I want to be straight about the trade, because the table above has a column I cannot fill in. Dropping `next/image` means giving up responsive `srcset` generation, automatic lazy loading, and the width and height plumbing that protects against layout shift. Those are real features and they were free.'
		},
		{
			kind: 'p',
			text: 'What makes it acceptable here is a precondition, not a principle: every image on this site is one I committed myself, at a size I chose, in a format I picked. The optimizer had no variance to absorb. I get the same bytes to the browser either way, so the only thing left to compare was the cost of the machinery.'
		},
		{
			kind: 'p',
			text: 'Change that precondition and the answer flips. On a site with user-uploaded images, or a CMS where an editor can drop in a 4000-pixel photograph on a Tuesday, the optimizer is absorbing exactly the variance it was designed for and turning it off would be a mistake. This is not an argument against `next/image`. It is an argument for checking whether the thing you are paying for has any work left to do.'
		}
	],
	lessons: [
		'An allowlist of one is a mandate. `qualities: [100]` read as "high quality is allowed" and behaved as "high quality is required", because the default value callers actually requested was not on the list.',
		'Price a framework feature by what it costs when idle. The optimizer produced identical bytes on this site and still carried a native library, a 50 MB cache and a worker pool sized against the host.',
		'Watch for libraries that read the machine instead of the container. libvips sizing threads from host cores is the same failure as V8 sizing the heap from host memory — correct behaviour against the wrong number.',
		'Turning a feature off can remove a route, not just a cost. With no `next/image` call sites there is no `/_next/image` endpoint to cache, rate-limit or defend.',
		'Justify the removal with the precondition, not the principle. This is only correct because every asset is hand-committed and pre-sized; on user-uploaded images the same change would be a regression.'
	],
	faqs: [
		{
			q: 'What does the images.qualities option in Next.js actually do?',
			a: 'It is an allowlist of the quality values the image optimizer will serve, meant to stop the endpoint being walked through many distinct re-encodes. It is not a default or a preference. If a request asks for a quality that is not on the list — including the built-in default of 75, which is what you get when no `quality` prop is passed — it does not fall back to something reasonable, it resolves to a permitted value. Setting the list to a single high number therefore promotes every request to that number.'
		},
		{
			q: 'Should I disable next/image optimization?',
			a: 'Only when the optimizer has no variance to absorb. If every asset is committed by hand, already in a modern format and already at display dimensions, the optimizer re-encodes files into approximately themselves while keeping sharp and libvips resident in your container. If images arrive from users or a CMS at unpredictable sizes, keep it — that is the case it exists for, and you would be giving up `srcset` and lazy loading for nothing.'
		},
		{
			q: 'How much memory does sharp add to a Node container?',
			a: 'In my container, roughly 23 MB of resident memory the moment it is required, plus a native cache around 50 MB, plus a libvips worker thread per CPU core. The thread count is the part that surprises people: libvips reads the host machine rather than the container cgroup quota, so a small service on a large shared host sizes its pool against cores it can never use.'
		},
		{
			q: 'How do you keep sharp out of a Next.js runtime container without deleting it?',
			a: "Import it lazily inside the single function that needs it, so the require happens during prerendering rather than at server start, and make sure no module reachable from `app/` imports it at the top level. In this repo that is one `await import('sharp')` inside the function that renders social-card PNGs. The constraint is fragile — moving that import back to module scope restores the whole cost with no build error — so it belongs in a comment next to the code."
		},
		{
			q: 'Does unoptimized: true remove the /_next/image route?',
			a: 'In practice, yes — with optimization disabled and no `next/image` call sites left in the app, the deployed build has no image endpoint at all. Images become ordinary static files served like any other asset. That is a security and caching simplification as much as a memory one: there is no longer a parameterised endpoint that turns query strings into CPU work.'
		}
	],
	sources: [
		{
			title: 'Next.js docs — images.qualities',
			url: 'https://nextjs.org/docs/app/api-reference/components/image#qualities'
		},
		{
			title: 'Next.js docs — images.unoptimized',
			url: 'https://nextjs.org/docs/app/api-reference/components/image#unoptimized'
		},
		{
			title: 'libvips — threading and concurrency',
			url: 'https://www.libvips.org/API/current/using-threads.html'
		}
	]
}
