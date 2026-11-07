import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

export const portfolio: ProjectDef = {
	id: 'portfolio',
	accent: '#FCEE0A',
	// Tailwind at #2 is deliberate: "a fully custom Tailwind v4 design system" is the product
	// here, so the highlight overrides the usual demotion of Tailwind as generic scaffolding.
	highlightSkills: ['next-js', 'tailwind-css', 'base-ui', 'shadcn-ui', 'bun-js', 'embla-carousel', 'railway'],
	title: '🚀 NooobtimeX — Profile Site',
	description:
		'This site — a Cyberpunk 2077–inspired profile that turns visitors into freelance clients, built on Next.js (App Router, Turbopack) with a fully custom Tailwind v4 design system and shadcn/ui on Base UI. Features a ⌘K command palette, a gig-board project journal, a vertical career-trace timeline, and a print-ready CV with a slide-presentation mode. Deployed on Railway.',
	images: { cover: assets.projects.portfolio.cover, photos: [] },
	// Starting stack — a static profile that grew into a full web app via the timeline events below.
	skills: ['next-js', 'tailwind-css', 'seo'],
	links: { live: 'https://github.com/NooobtimeX/NooobtimeX' },
	startDate: '2021-01-01',
	linkedExperienceIds: ['freelance'],
	timeline: [
		{
			date: '2025-08-25',
			title: 'Inception — Repo + Personal Profile Scaffold',
			description: 'Bootstrapped the repository as a personal GitHub profile with the first structured content.',
			icon: 'mdi:rocket-launch-outline'
		},
		{
			date: '2025-12-23',
			title: 'GitHub Profile — Automated README System',
			description:
				'Built an automated profile README with scheduled workflows for activity stats and a contribution snake.',
			icon: 'simple-icons:github'
		},
		{
			date: '2026-02-03',
			title: 'Pivot — Static Profile → Full Web App',
			description: 'Pivoted from a static profile into a statically-generated Next.js web app with a performance pass.',
			icon: 'simple-icons:nextdotjs',
			addedSkills: ['react', 'shadcn-ui', 'bun-js', 'embla-carousel', 'json-ld', 'google-tag-manager']
		},
		{
			date: '2026-03-25',
			title: 'Content — CV, Global Search & Presentation Mode',
			description: 'Shipped a print-ready CV page, site-wide command-palette search, and a slide-presentation mode.',
			icon: 'mdi:file-document-outline',
			addedSkills: ['aeo', 'geo']
		},
		{
			date: '2026-04-09',
			title: 'Revamp — Home UI + Component-Library Migration',
			description: 'Revamped the home page and migrated the UI onto a headless component library.',
			icon: 'mdi:home-outline'
		},
		{
			date: '2026-05-05',
			title: 'Deploy — First Dockerfile + Railway Config',
			description: 'Added a Dockerfile and Railway config as code — the first container build for the site.',
			icon: 'simple-icons:docker',
			addedSkills: ['docker', 'railway']
		},
		{
			date: '2026-06-08',
			title: 'Deploy — Moved to Vercel',
			description: 'Moved the site to Vercel and removed the Docker and Railway config.',
			icon: 'simple-icons:vercel',
			addedSkills: ['vercel'],
			removedSkills: ['docker', 'railway']
		},
		{
			date: '2026-06-08',
			title: 'Redesign — Cyberpunk Design System',
			description:
				'Rebuilt the entire site on a custom Cyberpunk 2077–inspired design system — neon signal colors, notched HUD panels, glitch and scanline accents.',
			icon: 'mdi:palette-outline',
			addedSkills: ['base-ui']
		},
		{
			date: '2026-06-08',
			title: 'Skills — Force-Directed Skill Graph + Game-UI Pages',
			description:
				'Modeled skills as a connected node graph wired by real tech dependencies, with game-style detail pages for skills, projects, and roles.',
			icon: 'mdi:graph-outline'
		},
		{
			date: '2026-06-08',
			title: 'GitHub Stats — Token-Free Coding Stats (ISR)',
			description:
				'Added a dedicated GitHub stats page with contribution insights, fetched token-free and cached with incremental static regeneration.',
			icon: 'mdi:chart-box-outline'
		},
		{
			date: '2026-06-08',
			title: 'Docs — Agent Guide + Content Skill',
			description: 'Added an agent guide and a portfolio-content skill so AI tools follow the same Bun workflow.',
			icon: 'mdi:book-open-variant-outline'
		},
		{
			date: '2026-06-12',
			title: 'Tooling — Self-Owned SVG README Generator',
			description:
				'Replaced third-party badge services with a self-owned SVG asset generator, refreshed on a scheduled CI cron.',
			icon: 'mdi:cog-outline'
		},
		{
			date: '2026-06-17',
			title: 'Projects — MONOMax EPL Licensing Portal',
			description: 'Added the MONOMax EPL licensing portal as a featured project.',
			icon: 'mdi:briefcase-outline'
		},
		{
			date: '2026-07-03',
			title: 'Projects — LOOKLOOK as One Platform Entry',
			description: 'Merged the separate LOOKLOOK projects into a single platform entry.',
			icon: 'mdi:storefront-outline'
		},
		{
			date: '2026-07-12',
			title: 'Feature — Per-Project Milestone Timelines',
			description: 'Shipped a reusable milestone-timeline component so every project can tell its build story.',
			icon: 'mdi:timeline-check-outline'
		},
		{
			date: '2026-07-16',
			title: 'CV — Rebuilt Around Three Flagship Projects',
			description:
				'Rebuilt the CV around three flagship projects and gave each project its own slide in presentation mode.',
			icon: 'mdi:file-account-outline'
		},
		{
			date: '2026-07-16',
			title: 'SEO — Robots, PWA Manifest + Dynamic OG Image',
			description: 'Added robots rules, a PWA manifest and a dynamically generated Open Graph image.',
			icon: 'mdi:image-outline'
		},
		{
			date: '2026-07-16',
			title: 'SEO — Person JSON-LD on Every Page',
			description: 'Expanded the Person JSON-LD and added structured data to every page.',
			icon: 'mdi:code-json'
		},
		{
			date: '2026-07-18',
			title: 'Projects — Stacks Derived from the Timeline',
			description:
				"Made each project's stack a fold over its timeline events, so retired tech is marked instead of silently dropped.",
			icon: 'mdi:source-branch'
		},
		{
			date: '2026-07-20',
			title: 'Contact — Contact Page + Mobile Tab Bar',
			description: 'Added a contact page and a bottom tab bar for phone widths.',
			icon: 'mdi:card-account-mail-outline'
		},
		{
			date: '2026-07-21',
			title: 'Identity — CTO at RS TROPHY, Remote Freelance',
			description:
				'Updated the hero and identity to the CTO role and merged the freelance roles into one remote-first entry.',
			icon: 'mdi:account-tie-outline'
		},
		{
			date: '2026-07-21',
			title: 'Covers — Generated Cyberpunk Banners',
			description: 'Generated a Cyberpunk cover banner for every project in the portfolio.',
			icon: 'mdi:image-frame'
		},
		{
			date: '2026-07-21',
			title: 'Contact — Digital Business Card (vCard)',
			description: 'Added a downloadable vCard digital business card to the contact page.',
			icon: 'mdi:card-account-details-outline'
		},
		{
			date: '2026-07-28',
			title: 'Share — Per-Project Share Cards',
			description: 'Added a 1:1 share card for every project, with download buttons.',
			icon: 'mdi:share-variant-outline'
		},
		{
			date: '2026-07-30',
			title: 'Deploy — Railway Only, Bun Builds + Node Serves',
			description: 'Made Railway the only deploy target, built from a Dockerfile where Bun builds and Node serves.',
			icon: 'simple-icons:railway',
			addedSkills: ['docker', 'railway'],
			removedSkills: ['vercel']
		},
		{
			date: '2026-07-31',
			title: 'Runtime — Node 26 Serves the Standalone Build',
			description: 'Pinned the runtime image to Node 26 to serve the standalone Next.js build.',
			icon: 'simple-icons:nodedotjs',
			addedSkills: ['node-js']
		},
		{
			date: '2026-07-31',
			title: 'Performance — Container RSS 402 → 126 MB',
			description:
				'Cut container memory from 402 to 126 MB and public assets from 4.0 to 1.4 MB by keeping full icon collections out of the server.',
			icon: 'mdi:speedometer'
		},
		{
			date: '2026-08-24',
			title: 'Accessibility — Reduced Motion + No-JS Fallback',
			description: 'Added reduced-motion handling, a no-JavaScript fallback and an entity graph for the site.',
			icon: 'mdi:human'
		},
		{
			date: '2026-08-24',
			title: 'SEO/AEO — Structured Data Overhaul',
			description: 'Reworked the SEO and AEO structured data across the whole site in one overhaul.',
			icon: 'mdi:magnify-scan'
		},
		{
			date: '2026-08-25',
			title: 'Journal — AEO-First Blog',
			description: 'Launched the Journal, an AEO-first blog wired into the site graph, with a first batch of posts.',
			icon: 'mdi:notebook-outline'
		},
		{
			date: '2026-09-05',
			title: 'Journal — Citation Gate + Checker',
			description:
				'Added a citation gate and checker so every Journal post links its sources, then retrofitted the archive.',
			icon: 'mdi:format-quote-close'
		},
		{
			date: '2026-09-14',
			title: 'Legal — Privacy Policy Page',
			description: 'Added a privacy policy page to the site.',
			icon: 'mdi:shield-check-outline'
		},
		{
			date: '2026-09-14',
			title: 'Performance — Data Layer Out of the Browser',
			description: 'Kept the server-only data layer out of the client bundle.',
			icon: 'mdi:package-variant-closed'
		},
		{
			date: '2026-09-14',
			title: 'SEO — Thin Skill Pages Noindexed',
			description:
				'Set noindex on skill pages without original coverage and surfaced the Journal in the site navigation.',
			icon: 'mdi:eye-off-outline'
		},
		{
			date: '2026-10-06',
			title: 'Tooling — Packages Upgraded + TypeScript 7 Gate',
			description: 'Upgraded every package to latest and moved the type gate to TypeScript 7.',
			icon: 'simple-icons:typescript'
		},
		{
			date: '2026-10-09',
			title: 'Profile — Freelance Hire Profile + Service Cards',
			description: 'Turned the portfolio into a freelance hire profile with a service card for each offering.',
			icon: 'mdi:account-search-outline'
		},
		{
			date: '2026-10-09',
			title: 'Accessibility — Readable Chrome + Contrast',
			description: 'Raised text-size and contrast floors and kept the decorative overlays from hurting readability.',
			icon: 'mdi:contrast-circle'
		},
		{
			date: '2026-10-09',
			title: 'Nav — Slimmer Primary Navigation',
			description:
				'Folded the companies section into Career, slimmed the primary navigation and switched to plain-English labels.',
			icon: 'mdi:menu'
		},
		{
			date: '2026-10-09',
			title: 'GitHub Stats — Every Period Prerendered',
			description: 'Prerendered every GitHub stats period and redrew the charts for readability.',
			icon: 'mdi:chart-bar'
		},
		{
			date: '2026-10-09',
			title: 'CI — README Assets Refreshed Weekly',
			description: 'Limited the README asset refresh to a weekly schedule and manual dispatch, never on push.',
			icon: 'simple-icons:githubactions'
		},
		{
			date: '2026-10-20',
			title: 'Docs — Repo-Kit Standard + AGENTS.md',
			description: 'Adopted the repo-kit standard, with AGENTS.md as the one guide every AI tool reads.',
			icon: 'mdi:book-cog-outline'
		},
		{
			date: '2026-10-23',
			title: 'Projects — Wangpa In Development',
			description: 'Added the Wangpa LINE scheduling app as a featured in-development project.',
			icon: 'mdi:calendar-account-outline'
		},
		{
			date: '2026-10-28',
			title: 'Hire — Every Hire Button Opens an Email',
			description: 'Made every hire control on the site open an email with the subject already filled in.',
			icon: 'mdi:email-outline'
		},
		{
			date: '2026-10-31',
			title: 'Tooling — Bun 1.4.4 Pinned, bun fmt + bun check',
			description: "Pinned Bun 1.4.4 across the repo and moved formatting and type checks onto Bun's own tools.",
			icon: 'simple-icons:bun'
		},
		{
			date: '2026-11-04',
			title: 'Brand — RS TROPHY Named the Same Everywhere',
			description: 'Wrote the employer as RS TROPHY everywhere, with links between this site and the company.',
			icon: 'mdi:link-variant'
		}
	]
}
