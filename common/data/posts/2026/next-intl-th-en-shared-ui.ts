import type { PostDef } from '../../../interfaces'

// Sources: common/data/projects.ts (rs-trophy timeline 2026-05-06 / 2026-05-09) + common/data/entities.ts + common/data/experiences.ts (role dates).
export const nextIntlThEnSharedUi: PostDef = {
	id: 'next-intl-th-en-shared-ui',
	title: 'next-intl Thai/English localization with a shared UI workspace',
	happenedAt: '2026-05-09',
	publishedAt: '2026-08-25',
	updatedAt: '2026-09-05',
	chapter: 'scale',
	category: 'nextjs',
	description:
		'Three days into a Bun monorepo I shipped next-intl Thai/English routing and moved the shadcn set into a shared workspace package. What that actually costs.',
	tldr: 'On 2026-05-09, three days into the [[project:rs-trophy]] monorepo rebuild, I shipped two changes together: `next-intl` Thai/English routing with Thai as the default locale, and the extraction of the shadcn component set into a shared `@rs-trophy/ui` workspace package. They shipped together because a bilingual app forces you to decide where strings live, and a copy-pasted component library has no good answer. The rule that came out of it: shared components take strings as props and never call a translation hook themselves.',
	skills: ['next-js', 'react', 'typescript', 'bun-js', 'shadcn-ui', 'tailwind-css'],
	relatedProjectIds: ['rs-trophy'],
	relatedExperienceIds: ['ruamsuk-cto', 'jasmine-tech'],
	relatedEntityIds: ['ruamsuk-plating'],
	body: [
		{
			kind: 'p',
			text: 'On 2026-05-06 I bootstrapped a Bun workspace monorepo for [[company:ruamsuk-plating]] — the trophy and medal company my family has run for twenty years — with a storefront, an admin console, an ElysiaJS API, and empty slots for shared UI and type packages. On 2026-05-09, three days later, I filled one of those slots and made the whole thing bilingual in the same pass.'
		},
		{
			kind: 'p',
			text: 'Worth stating plainly, because the dates give it away: my day job at that point was still [[career:jasmine-tech]]. The CTO title at RS Trophy did not start until 2026-08-01. This was a rebuild I was doing for the company before I formally owned its technology, which is a specific kind of pressure — nothing was allowed to be a research project.'
		},
		{ kind: 'h2', text: 'Thai is the default locale, not the translation' },
		{
			kind: 'p',
			text: 'RS Trophy sells custom trophies, medals and award plaques nationwide across Thailand. Almost every customer reads Thai. So the routing config makes `th` the default and `en` the second locale — the opposite of the reflex where English is the source language and everything else is a translation layer bolted on later.'
		},
		{
			kind: 'p',
			text: 'That ordering is not cosmetic. It decides which language [the message catalogue](https://unicode-org.github.io/icu/userguide/format_parse/messages/) is authored in, which one gets reviewed by someone who actually speaks it, and which one is allowed to be slightly awkward. If English is the source, Thai copy ends up as a machine-shaped echo of English sentence structure, and it reads like it.'
		},
		{
			kind: 'code',
			lang: 'ts',
			caption: 'illustrative — the routing shape and the one call that keeps pages static',
			code: "export const routing = defineRouting({\n\tlocales: ['th', 'en'],\n\tdefaultLocale: 'th'\n})\n\n// Every [locale] page must do this, or it silently opts into dynamic rendering.\nexport function generateStaticParams() {\n\treturn routing.locales.map(locale => ({ locale }))\n}\n\nexport default async function Page({ params }) {\n\tconst { locale } = await params\n\tsetRequestLocale(locale)\n\t// ...\n}"
		},
		{
			kind: 'p',
			text: 'The `setRequestLocale` call is the part that bites. `next-intl` reads the locale from request context, and reading request context is exactly what makes an App Router segment dynamic. Miss the call on one page and that page quietly drops out of static rendering — no error, no warning, just a route that is now server-rendered on every hit. On a catalogue site whose entire SEO argument rests on fast static pages, that is a real regression that produces no failure signal.'
		},
		{ kind: 'h2', text: 'What Thai actually breaks' },
		{
			kind: 'p',
			text: 'Localization tutorials stop at swapping strings. Thai does not stop there, because the script itself violates layout assumptions that Latin typography quietly baked in.'
		},
		{
			kind: 'list',
			items: [
				'**No spaces between words.** Browsers break lines at spaces. A Thai paragraph has none, so a naive layout either refuses to wrap or wraps mid-word. Setting `lang` correctly on the document is what lets the browser use dictionary-based line breaking at all.',
				'**Vowels and tone marks stack above and below the baseline.** A line-height tuned for Latin clips them or crowds them. Thai needs more leading than the same font size in English — which means line-height cannot be a single global number.',
				'**No plural forms.** Thai has one grammatical number, so ICU plural rules collapse to `other`. Any string you built by concatenating a count with an English plural suffix has no Thai equivalent and has to be rewritten as a whole message.',
				'**Fallback fonts are visible.** A Latin-only typeface silently hands Thai glyphs to a system fallback, and the two scripts stop looking like the same brand.'
			]
		},
		{
			kind: 'callout',
			tone: 'warn',
			title: 'The concatenation trap',
			text: 'Every string assembled from fragments in code — a noun here, a suffix there — is a string that cannot be translated, only re-implemented. Bilingual work turns string concatenation from a style preference into a bug class. I found mine by translating them.'
		},
		{ kind: 'h2', text: 'Why the shared UI package shipped the same day' },
		{
			kind: 'p',
			text: 'shadcn/ui is not a dependency. It is a generator that copies component source into your app, which is its best property and its worst one in a monorepo: with a storefront and an admin console, you get two divergent copies of the same button on day one. Extracting them into `@rs-trophy/ui` was less about reuse than about having exactly one place where a decision lands.'
		},
		{
			kind: 'code',
			lang: 'json',
			caption: 'illustrative — shipping TypeScript source, no build step for the package',
			code: '{\n\t"name": "@rs-trophy/ui",\n\t"exports": { "./*": "./src/*.tsx" }\n}\n\n// next.config.ts in each consuming app\nconst config = {\n\ttranspilePackages: [\'@rs-trophy/ui\']\n}'
		},
		{
			kind: 'p',
			text: 'Two things go wrong here and neither announces itself. First, Tailwind only generates the classes it can find, so the package source has to be inside the content the app scans — otherwise the components render unstyled in one app and fine in the other, depending on which classes happened to exist elsewhere. Second, the shadcn CLI keeps writing into the app it was run in, so the alias config has to be repointed or the next component you add lands in the wrong place and starts the divergence over.'
		},
		{ kind: 'h2', text: 'The rule: shared components do not know their language' },
		{
			kind: 'p',
			text: 'The tempting move is to let a shared component call the translation hook itself. It reads cleanly and it is a trap — the component now depends on `next-intl`, on a specific message namespace existing, and on every consumer wiring the same provider. A UI package that cannot render in a test or a story without a translation context is not a UI package.'
		},
		{
			kind: 'code',
			lang: 'tsx',
			caption: 'illustrative — the boundary that keeps the package portable',
			code: "// packages/ui — no i18n import anywhere in here\nexport function EmptyState({ title, action }: { title: string; action: string }) {\n\treturn <div><h3>{title}</h3><button>{action}</button></div>\n}\n\n// apps/web — the app owns the strings\nconst t = await getTranslations('catalog')\nreturn <EmptyState title={t('empty.title')} action={t('empty.cta')} />"
		},
		{
			kind: 'p',
			text: 'Now the argument against my own case. Extracting a shared package on day four of a codebase is premature by any normal standard. I had two consumers, no third one planned, and no idea yet what the admin console would need that the storefront would not. The cost is real: every component change is now a cross-package edit, and I have already had to un-share two components that turned out to be storefront-specific pretending to be generic.'
		},
		{
			kind: 'p',
			text: 'I would still do it in this order, for one reason that is specific rather than general. The bilingual pass touches every component that renders text. If the components had still been duplicated across two apps, I would have paid for that pass twice, and the second copy would have drifted. Doing i18n first and extraction later would have been the expensive ordering.'
		},
		{
			kind: 'stat',
			value: '3 days',
			label: 'from the first monorepo commit (2026-05-06) to bilingual routing plus a shared UI package (2026-05-09)',
			source: "the RS Trophy timeline in this site's own project data"
		}
	],
	lessons: [
		'Pick the default locale by who actually reads the site, not by what the framework examples assume. Making Thai the source language changed how the copy reads more than any amount of translation review would have.',
		'Localization is a layout problem before it is a strings problem. Line-height, line-breaking and font coverage all had to change, and none of them were in the ticket I wrote for myself.',
		'I would still extract the shared package early, but I was too generous about what counted as shared. Twice I have had to pull a component back out into the app it really belonged to — the cheaper default is to duplicate until the second consumer genuinely disagrees with the first.',
		'A silent opt-out of static rendering is worse than a crash. If I rebuilt this, I would add a build-time assertion that every localized route is still statically generated, instead of trusting myself to remember one function call per page.'
	],
	faqs: [
		{
			q: 'Should Thai or English be the default locale in a Thai e-commerce site?',
			a: 'Make Thai the default if Thai speakers are the customers. Beyond routing, the default locale is the language your message catalogue is authored and reviewed in — everything else becomes a translation of it. Authoring in English and translating to Thai produces Thai copy with English sentence structure, which native readers notice immediately.'
		},
		{
			q: 'Why do my next-intl pages stop being statically rendered?',
			a: 'Because reading the locale from request context makes an App Router segment dynamic. In next-intl you avoid it by calling `setRequestLocale` at the top of each localized page or layout, alongside a `generateStaticParams` that enumerates the locales. The failure is silent — pages keep working, they just render per request — so it is worth asserting on at build time.'
		},
		{
			q: 'What breaks when you add Thai to an interface designed in English?',
			a: 'Line breaking, vertical rhythm and fonts. Thai has no spaces between words, so wrapping depends on the browser knowing the text is Thai; tone marks and vowels stack above and below the baseline, so Latin-tuned line-height crowds or clips them; and a Latin-only typeface hands Thai to a fallback font that does not match your brand. Thai also has no plural forms, so any count-plus-suffix string has to be rewritten as a complete message.'
		},
		{
			q: 'How do you share shadcn/ui components across a monorepo?',
			a: 'Move the generated component source into a workspace package, export the source directly, and add the package to `transpilePackages` in each consuming app so no separate build step is needed. Two things need attention: your Tailwind content configuration must scan the package source or classes get dropped, and the shadcn CLI aliases must be repointed at the package so newly added components do not land back in an app.'
		},
		{
			q: 'Should a shared UI package call translation hooks?',
			a: 'No. A component that calls a translation hook depends on the i18n library, on a specific message namespace, and on every consumer providing the same context — and it can no longer be rendered in a test or a story on its own. Pass display strings in as props and let each app resolve them. The package stays portable and the ownership of copy stays in one place.'
		}
	],
	sources: [
		{
			title: 'next-intl — Getting started',
			url: 'https://next-intl.dev/docs/getting-started'
		},
		{
			title: 'ICU User Guide — Formatting messages',
			url: 'https://unicode-org.github.io/icu/userguide/format_parse/messages/'
		}
	]
}
