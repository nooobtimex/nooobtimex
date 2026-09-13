import type { PostDef } from '../../../interfaces'

/** Sources: RS Award timeline + description in common/data/projects.ts (2025-12-04, 2026-01-28, 2026-01-30, 2026-02-10), the career timeline in common/data/experiences.ts, and general Thai typography knowledge. */
export const thaiLocalizationAndANewDesignSystem: PostDef = {
	id: 'thai-localization-and-a-new-design-system',
	title: 'Localizing a storefront to Thai while replacing its design system',
	happenedAt: '2026-01-30',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'scale',
	category: 'nextjs',
	description:
		"On 30 January 2026 I swapped RS Award's design system and localized it to Thai in one milestone. Thai is a typography constraint, not a translation step.",
	tldr: 'On 30 January 2026 the [[project:rs-award]] remake got a new design system with motion primitives and a Thai UI in the same milestone. That pairing was deliberate: **Thai is a typography constraint before it is a translation job** — no spaces between words, marks stacking above and below the baseline, and no italic tradition — so a component kit whose defaults were picked for English breaks in four places at once. The cost of batching them was that I could no longer attribute a regression to one change or the other.',
	skills: ['next-js', 'tailwind-css', 'shadcn-ui'],
	relatedProjectIds: ['rs-award'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: "On 30 January 2026 the RS Award remake got two things on the same day: a new design system with motion primitives, and a Thai user interface. RS Award is my family's plaque and award catalog — [[company:ruamsuk-plating]] has been making and plating awards in Pathum Thani since 2006 — and I had started remaking its 2022 WordPress build in [[skill:next-js]] eight weeks earlier, on 4 December 2025."
		},
		{
			kind: 'p',
			text: 'Two days before this milestone the data layer had moved from Prisma/Postgres to [[skill:mongodb]], mid-build. My full-time job at that point was somewhere else entirely: the career timeline on this site puts me at [[career:jasmine-tech]] from July 2025, with no role at the family company again until the CTO one in August 2026. The remake carried on through that gap anyway, which is the honest shape of a lot of family-company work — no title on it, no sprint board, just the site that sells the plaques.'
		},
		{ kind: 'h2', text: 'Thai is a typography constraint, not a translation layer' },
		{
			kind: 'p',
			text: 'The naive model of localization is that strings go out to be translated and come back longer. Thai punishes that model immediately, because the script itself disagrees with the assumptions baked into a Latin-first component kit. Four of those assumptions broke on the same afternoon.'
		},
		{
			kind: 'list',
			items: [
				'**Thai does not put spaces between words.** A run of text is one uninterrupted token as far as a naive line-breaker is concerned, so the browser either breaks anywhere or refuses to break at all — and a long product name pushes a card out of its own grid.',
				'**Vowels and tone marks stack.** They sit above and below the consonant, so a line-height chosen to look tight in English clips the marks against the line above.',
				'**There is no italic tradition.** Ask a browser for italic Thai and it synthesizes a slant that reads as a rendering fault, not as emphasis.',
				'**A font that looks fine in the picker may have no Thai coverage at all** — the fallback silently substitutes another face, and suddenly two typefaces are sharing one paragraph.'
			]
		},
		{
			kind: 'p',
			text: 'None of that is fixable string by string. It is fixable exactly once, in [the tokens the whole system reads from](https://tailwindcss.com/docs/theme) — which is why replacing the design system and localizing to Thai were not two projects that happened to collide. They were one project.'
		},
		{
			kind: 'code',
			lang: 'css',
			caption: 'Illustrative — the two tokens that fixed most of it: a taller line box and an explicit break policy.',
			code: ':root {\n\t--font-sans: "Noto Sans Thai", system-ui, sans-serif;\n\t--leading-body: 1.75; /* a Latin-tuned 1.5 clips Thai tone marks */\n}\n\n[lang="th"] {\n\tline-height: var(--leading-body);\n\tline-break: loose;\n\toverflow-wrap: anywhere;\n\tfont-style: normal; /* never synthesize italic Thai */\n}'
		},
		{
			kind: 'p',
			text: 'The italic rule is the one worth arguing about. Dropping a style at the token level is heavy-handed — some day a component will genuinely want emphasis and find the door locked. I took that trade because the alternative is worse: a synthesized slant on Thai text looks like a bug to a Thai buyer, and the buyer never files the report. Emphasis moved to weight and colour, which both scripts render honestly.'
		},
		{ kind: 'h2', text: 'Motion primitives on a catalog nobody visits to be entertained' },
		{
			kind: 'p',
			text: 'The new design system brought motion primitives with it, and motion is the part of a design system that is easiest to overspend. A plaque and award catalog has one job: get a buyer from a search result to a product page to a quote conversation. Custom awards are quoted, not carted, so every animation sits directly between the visitor and a phone call.'
		},
		{
			kind: 'p',
			text: 'So the motion budget was deliberately small — entrance transitions on cards and page-level fades, nothing that delays a click — and everything gated on the user preference rather than my taste.'
		},
		{
			kind: 'code',
			lang: 'css',
			caption: 'Illustrative — the guard every motion primitive in the kit was wrapped in.',
			code: '@media (prefers-reduced-motion: reduce) {\n\t*,\n\t*::before,\n\t*::after {\n\t\tanimation-duration: 0.01ms !important;\n\t\tanimation-iteration-count: 1 !important;\n\t\ttransition-duration: 0.01ms !important;\n\t}\n}'
		},
		{ kind: 'h2', text: 'Two variables, one milestone' },
		{
			kind: 'p',
			text: 'Here is the part I would defend least. Changing the design system and the language of the interface in a single milestone means that when something looks wrong afterwards, you cannot say which change did it. That is a real cost and I paid it — a few layout oddities in the first pass could plausibly have come from either side, and I had to bisect them by hand instead of by history.'
		},
		{
			kind: 'p',
			text: 'I did it anyway for a boring reason: both changes touched the same surface. Every component in the catalog needed its typography revisited for Thai, and every component was being restyled by the new system regardless. Splitting the milestone would have meant restyling the entire catalog twice, alone, in evenings that were already borrowed from a full-time job somewhere else. With a reviewer or a QA pass, I would split it. Solo, on a build that was still changing shape weekly, batching won.'
		},
		{
			kind: 'stat',
			value: '2 days',
			label: 'between swapping the database and swapping the design system — 28 to 30 January 2026, on the same build',
			source: 'RS Award project timeline, common/data/projects.ts'
		},
		{
			kind: 'p',
			text: 'That pace is the other thing worth being honest about. A data-layer migration on Wednesday and a design-system replacement on Friday is not discipline, it is a small project with exactly one person in it and no coordination cost. It works at this size. It stops working the moment a second person has to know what changed.'
		},
		{
			kind: 'callout',
			tone: 'info',
			title: 'The rule that came out of it',
			text: 'A locale is an input to the design system, not a post-processing step applied to it. If the tokens cannot express the language — line box, break policy, font stack, emphasis — the translation will look broken no matter how good the words are.'
		},
		{
			kind: 'p',
			text: 'The words themselves were never mine to invent. The product vocabulary on those pages is what the company has used with Thai buyers since 2006, and my job was narrower than it first looked: stop the layout from mangling language that already worked. Eleven days later the same site got its product pages, structured data and client-side search — but none of that would have been worth shipping on a page that clipped its own tone marks.'
		}
	],
	lessons: [
		'If I ran it again I would land the design system first, verify it, then do the Thai pass — not because batching was wrong for a solo build, but because I traded away the ability to say which change caused what.',
		'Typography tokens are the cheapest place to hold a language. Line box, break policy, font stack and an emphasis rule fixed more Thai layout bugs than any component-level patch did.',
		'Motion primitives arrive with a design system whether you asked for them or not. Deciding the budget before adopting them is much easier than trimming them back afterwards.',
		'The existing Thai copy was an asset, not a starting point to improve on. Twenty years of selling awards produced the vocabulary; the interface just had to render it without damage.'
	],
	faqs: [
		{
			q: 'How do you localize a Next.js UI to Thai without breaking the layout?',
			a: 'Set the `lang` attribute so the browser applies the right line-breaking rules, then fix four things in your design tokens rather than in components: a taller line-height so stacked vowels and tone marks are not clipped, an explicit break policy for text with no word spaces, a font stack that actually has Thai coverage, and a rule that Thai never renders italic. Component-level patches will not hold, because every new component reintroduces the same four bugs.'
		},
		{
			q: 'Why does Thai text break lines badly in a browser?',
			a: 'Thai is written without spaces between words, so a line-breaker with no dictionary sees one long token. Depending on the engine, you get either a line that overflows its container or a break placed in the middle of a word. Declaring the language and setting an explicit `line-break` and overflow-wrap policy gives the browser permission to break sensibly instead of guessing.'
		},
		{
			q: 'Should Thai text ever be italic?',
			a: 'No. Thai has no italic tradition, and browsers respond to an italic request by synthesizing an oblique — a mechanical slant that Thai readers see as a rendering fault rather than as emphasis. Use weight, size or colour for emphasis instead, all of which read correctly in both scripts.'
		},
		{
			q: 'Is it safe to replace a design system and localize an app in the same release?',
			a: 'Only when one person owns both changes and there is no live traffic to regress. The two touch the same surface, so batching them avoids restyling every component twice. The price is attribution: when something looks wrong afterwards you cannot tell from the history which change caused it, so you bisect by hand. With a reviewer or a QA pass in the loop, split them.'
		}
	],
	sources: [
		{ title: 'Tailwind CSS — Theme configuration', url: 'https://tailwindcss.com/docs/theme' },
		{ title: 'shadcn/ui — Theming', url: 'https://ui.shadcn.com/docs/theming' },
		{ title: 'RS Award — the live site this post is about', url: 'https://www.rs-award.com' }
	]
}
