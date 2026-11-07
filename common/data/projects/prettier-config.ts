import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

export const prettierConfig: ProjectDef = {
	id: 'prettier-config',
	accent: '#55B3B4', // Prettier's own teal, from the prettier-config.dev icon
	// CodeMirror leads: the editor is the app's main surface.
	highlightSkills: ['codemirror', 'next-js', 'base-ui', 'railway', 'react'],
	title: 'Prettier Config',
	description:
		'The fastest way to build, share, and try a Prettier configuration — visually, in the browser. Runs the official prettier/standalone fully client-side for instant live formatting, with a CodeMirror 6 editor spanning JS/TS, CSS, HTML, JSON, Markdown, Vue, and more, plus shareable URL-encoded configs and i18n. Built on Next.js, React, TypeScript, and Tailwind CSS v4 with shadcn/ui on Base UI.',
	images: { cover: assets.projects.prettierConfig.cover, photos: [...assets.projects.prettierConfig.gallery] },
	// Starting stack — the UI libraries, editor, and analytics are introduced via timeline events.
	skills: ['next-js', 'react', 'tailwind-css', 'vercel'],
	links: { live: 'https://prettier-config.dev' },
	startDate: '2025-05-09',
	linkedExperienceIds: ['freelance'],
	timeline: [
		{
			date: '2025-05-09',
			title: 'Foundation — Next.js Config Playground',
			description: 'Laid the Next.js foundation for a browser-based Prettier configuration builder.',
			icon: 'simple-icons:prettier',
			addedSkills: ['shadcn-ui', 'radix-ui', 'google-tag-manager']
		},
		{
			date: '2025-07-13',
			title: 'Demo — Live Formatting Demo + Config Modals',
			description: 'Added a live code-formatting demo and reworked the config modals; the demo was retired in August.',
			icon: 'mdi:code-braces'
		},
		{
			date: '2025-08-24',
			title: 'i18n — Internationalization Introduced',
			description: 'Introduced internationalization with locale-aware routing.',
			icon: 'mdi:translate'
		},
		{
			date: '2025-08-28',
			title: 'Home — Config Builder Home Page',
			description: 'Built the home page around an add-a-config flow.',
			icon: 'mdi:home-outline'
		},
		{
			date: '2025-09-06',
			title: 'Launch — prettier-config.dev',
			description: 'Moved the site and the repo to the prettier-config.dev name and domain.',
			icon: 'mdi:web'
		},
		{
			date: '2025-10-28',
			title: 'Tooling — Prettier + ESLint, Central Metadata',
			description: 'Wired Prettier into ESLint and moved external links and metadata into shared constants.',
			icon: 'simple-icons:eslint'
		},
		{
			date: '2025-11-18',
			title: 'SEO — Locale-Aware Sitemap + robots.txt',
			description: 'Generated a locale-aware sitemap and added a robots.txt route.',
			icon: 'mdi:sitemap',
			addedSkills: ['seo']
		},
		{
			date: '2026-01-06',
			title: 'Tooling — Bun as the Package Manager',
			description: 'Moved the project onto Bun and its lockfile.',
			icon: 'simple-icons:bun',
			addedSkills: ['bun-js']
		},
		{
			date: '2026-01-09',
			title: 'Rebuild — Metadata-Driven Config Generator',
			description: 'Rebuilt the UI around an option-metadata-driven config generator.',
			icon: 'mdi:cog-outline'
		},
		{
			date: '2026-05-05',
			title: 'UI — Radix UI → Base UI',
			description: 'Moved the component library from Radix UI to Base UI under the same shadcn/ui components.',
			icon: 'mdi:puzzle-edit-outline',
			addedSkills: ['base-ui'],
			removedSkills: ['radix-ui']
		},
		{
			date: '2026-05-05',
			title: 'Hosting — Docker + Railway Trial',
			description: 'Tried a Dockerfile and Railway config for hosting; the trial was reverted in June.',
			icon: 'simple-icons:docker',
			addedSkills: ['docker', 'railway']
		},
		{
			date: '2026-05-05',
			title: 'Preview — Live Preview with Three Tabs',
			description: 'Added a live preview panel with Config, Preview and Your Code tabs.',
			icon: 'mdi:eye-outline'
		},
		{
			date: '2026-05-05',
			title: 'Content — FAQ + About Pages, llms.txt',
			description: 'Added FAQ and About pages built for search and answer engines, plus an llms.txt file.',
			icon: 'mdi:frequently-asked-questions'
		},
		{
			date: '2026-05-05',
			title: 'i18n — 15 Locales + hreflang Sitemap',
			description: 'Scaled to fifteen locales with a dynamic multi-language sitemap and hreflang SEO.',
			icon: 'mdi:earth'
		},
		{
			date: '2026-05-27',
			title: 'Engine — Version Picker + Schema Options + Diff',
			description:
				'Auto-generated options from the Prettier schema for any selected version, with a GitHub-style diff preview.',
			icon: 'mdi:file-compare'
		},
		{
			date: '2026-05-27',
			title: 'State — Choices Saved Locally',
			description: 'Saved the chosen Prettier version and option selections in the browser between visits.',
			icon: 'mdi:content-save-outline'
		},
		{
			date: '2026-05-28',
			title: 'Tokens — Token-Count Badge',
			description: 'Added a token-count badge to the diff header, with a model picker.',
			icon: 'mdi:counter'
		},
		{
			date: '2026-05-29',
			title: 'Editor — Multi-Parser CodeMirror + Shareable URLs',
			description:
				'Shipped a multi-parser CodeMirror editor with URL-encoded shareable configs and existing-config import.',
			icon: 'simple-icons:codemirror',
			addedSkills: ['codemirror']
		},
		{
			date: '2026-05-29',
			title: 'i18n — Five More Locales + x-default',
			description: 'Added Polish, Turkish, Ukrainian, Persian and Bengali, and fixed hreflang with an x-default.',
			icon: 'mdi:web-plus'
		},
		{
			date: '2026-05-30',
			title: 'Extensibility — Presets + Third-Party Plugins',
			description: 'Added one-click preset configs and a third-party plugin system.',
			icon: 'mdi:puzzle-outline'
		},
		{
			date: '2026-06-08',
			title: 'Hosting — Back on Vercel',
			description: 'Removed the Railway and Docker config and went back to deploying on Vercel.',
			icon: 'simple-icons:vercel',
			removedSkills: ['docker', 'railway']
		},
		{
			date: '2026-06-08',
			title: 'Docs — Agent Guide + Playground Skill',
			description: 'Added an agent guide and a playground skill so AI tools follow the same workflow.',
			icon: 'mdi:book-open-variant-outline'
		},
		{
			date: '2026-07-30',
			title: 'Deploy — Railway, Bun Builds + Node Serves',
			description: 'Moved hosting to Railway with a Dockerfile where Bun builds and Node serves.',
			icon: 'simple-icons:railway',
			addedSkills: ['docker', 'railway'],
			removedSkills: ['vercel']
		},
		{
			date: '2026-07-31',
			title: 'Runtime — Node 26 Toolchain',
			description: 'Moved the whole toolchain to Node 26.',
			icon: 'simple-icons:nodedotjs',
			addedSkills: ['node-js']
		},
		{
			date: '2026-07-31',
			title: 'Performance — Server Memory Cut ~45%',
			description: 'Cut server memory by about 45% and trimmed the client bundle for a fully prerendered site.',
			icon: 'mdi:speedometer'
		},
		{
			date: '2026-08-24',
			title: 'Security — Headers, Per-Locale Font + a Real 404',
			description: 'Added security headers, a per-locale font and a real 404 page.',
			icon: 'mdi:shield-lock-outline'
		},
		{
			date: '2026-08-24',
			title: 'SEO — A Page for Every Option',
			description:
				'Added a server-rendered page for each Prettier option, an options hub and generated before/after examples.',
			icon: 'mdi:format-list-bulleted'
		},
		{
			date: '2026-08-24',
			title: 'SEO — Per-Locale Canonicals',
			description: 'Gave every locale its own canonical, title and heading, and restored sitemap discovery.',
			icon: 'mdi:link-variant'
		},
		{
			date: '2026-09-04',
			title: 'Content — 26 Option Articles',
			description: 'Wrote English articles for 26 Prettier options on a new content layer.',
			icon: 'mdi:file-document-multiple-outline'
		},
		{
			date: '2026-09-04',
			title: 'i18n — Thai Translation Begun',
			description: 'Began translating the site into Thai, starting with the semi and singleQuote options.',
			icon: 'mdi:translate-variant'
		},
		{
			date: '2026-10-06',
			title: 'Tooling — TypeScript 7 + ESLint 10',
			description: 'Upgraded every package and moved to TypeScript 7 and ESLint 10.',
			icon: 'simple-icons:typescript'
		},
		{
			date: '2026-10-19',
			title: 'Deploy — Railway Config as Code',
			description: 'Moved the Railway service config into infrastructure as code.',
			icon: 'mdi:file-cog-outline'
		},
		{
			date: '2026-10-20',
			title: 'Docs — Repo-Kit Standard + AGENTS.md',
			description: 'Adopted the repo-kit standard, with AGENTS.md as the one guide every AI tool reads.',
			icon: 'mdi:book-cog-outline'
		},
		{
			date: '2026-10-31',
			title: 'Tooling — Bun 1.4.4 Pinned',
			description: "Pinned Bun 1.4.4 and moved formatting and type checks onto Bun's own tools.",
			icon: 'simple-icons:bun'
		}
	]
}
