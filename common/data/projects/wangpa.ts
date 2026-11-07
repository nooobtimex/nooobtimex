import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

export const wangpa: ProjectDef = {
	id: 'wangpa',
	accent: '#5CCF95', // the "free" green of the app's own heatmap (Sticker Club style)
	// LIFF leads: the whole product is one Next.js app that opens inside the LINE chat, backed by an
	// Elysia/Bun API whose types the web app imports directly.
	highlightSkills: ['line-liff', 'next-js', 'elysia-js', 'bun-js', 'mongodb', 'redis'],
	title: 'ว่างป่ะ · Wangpa',
	description:
		'A LINE-first group scheduling app for Thailand that shows a friend group or family when everyone is free, without anyone sharing what fills their week. It opens inside the LINE chat as a LIFF web app: one tap signs in with LINE, each person paints a private weekly schedule, and the group sees only busy or free in a shared heatmap with the best times suggested, then proposes, votes on and confirms a plan, and shares invites and plan cards back into the chat. Built as a Bun monorepo: a Next.js 16 web app that runs in LINE and in any browser, an Elysia API on MongoDB and Redis whose types the web and admin apps import through Eden, and an admin app, under strict TypeScript, maximised ESLint, real-store tests and Playwright at phone width. In development for a public launch in November 2026, running on Railway.',
	resumeSummary:
		'LINE-first group scheduling for Thailand — a LIFF web app inside LINE with busy-only privacy, a shared free-time heatmap and plan voting. A Bun monorepo with Next.js 16 and an Elysia API on MongoDB and Redis, in development.',
	// Cover only: no product screens yet.
	images: { cover: assets.projects.wangpa.cover, photos: [] },
	skills: [
		'line-liff',
		'next-js',
		'react',
		'tailwind-css',
		'bun-js',
		'elysia-js',
		'mongodb',
		'redis',
		'docker',
		'railway'
	],
	// No link: the repo is private and the app has no public URL yet. `stage` keeps the
	// derived status from reading "Archived" while it is being built.
	links: {},
	stage: 'in-development',
	startDate: '2026-10-23',
	// Personal builds live under the freelance role, as portfolio and prettier-config do.
	linkedExperienceIds: ['freelance'],
	timeline: [
		{
			date: '2026-10-23',
			title: 'Foundation — strict monorepo and gate',
			description:
				'Set up the Bun monorepo with an Elysia API typed end to end into two Next.js apps through Eden, strict TypeScript, maximised ESLint, real MongoDB and Redis in tests, and Playwright at phone width with a LIFF mock.',
			icon: 'mdi:rocket-launch-outline'
		},
		{
			date: '2026-10-23',
			title: 'LINE — Thailand channels and LIFF apps',
			description:
				'Created LINE Login channels for staging and production with their LIFF apps and share-to-chat, linked to the Official Account that will carry plan confirmations and reminders.',
			icon: 'simple-icons:line'
		},
		{
			date: '2026-10-23',
			title: 'Deploy — Railway staging as code',
			description:
				'Described the staging services in Railway infrastructure as code, with Docker builds that cache installs, CI as the deploy gate, and staging on its own domain.',
			icon: 'simple-icons:railway'
		},
		{
			date: '2026-10-23',
			title: 'Engine — weekly schedules and suggested times',
			description:
				"Built the scheduling engine — time zones and intervals, each person's weekly schedule, and the group heatmap with suggested times and who is free.",
			icon: 'mdi:calendar-clock'
		},
		{
			date: '2026-10-23',
			title: 'API — versioned core with LINE sign-in',
			description:
				'Stood up the versioned API with LINE sign-in and the profile, busy-time, group, invite and availability routes, sharing its schemas with the apps.',
			icon: 'mdi:api'
		},
		{
			date: '2026-10-24',
			title: 'Plans — answers, venues and live updates',
			description:
				'Added plans with answers, venues and suggestions, with live updates streamed to open screens over Server-Sent Events.',
			icon: 'mdi:broadcast',
			addedSkills: ['sse']
		},
		{
			date: '2026-10-24',
			title: 'LINE — webhook, pushes and notification settings',
			description:
				'Added the LINE webhook and push jobs, with a guard on each kind of push and per-person notification settings.',
			icon: 'mdi:bell-ring-outline'
		},
		{
			date: '2026-10-24',
			title: 'Recurring — regular hangouts and Thai holidays',
			description:
				'Added recurring hangouts and the Thai public-holiday calendar, plus the activity timeline and yearly recap behind the API.',
			icon: 'mdi:calendar-sync-outline'
		},
		{
			date: '2026-10-24',
			title: 'Flyers — upload and scan into a plan',
			description: 'Added flyer uploads and AI scans that read an event flyer into the details of a plan.',
			icon: 'mdi:image-search-outline'
		},
		{
			date: '2026-10-24',
			title: 'Design — Sticker Club kit on Base UI',
			description:
				'Built the Sticker Club design tokens and a shared UI kit on Base UI, shown in a component gallery in both apps.',
			icon: 'mdi:palette-swatch-outline',
			addedSkills: ['base-ui']
		},
		{
			date: '2026-10-26',
			title: 'Web — LIFF shell, four tabs and onboarding',
			description:
				'Built the LIFF web shell with a LINE session, a four-tab app frame and three ways in for new people.',
			icon: 'mdi:tab',
			addedSkills: ['tanstack-query']
		},
		{
			date: '2026-10-26',
			title: 'Groups — who is free and best times',
			description: 'Built the group screen with who is free, a heat grid, suggested best times and group settings.',
			icon: 'mdi:account-group-outline'
		},
		{
			date: '2026-10-26',
			title: 'Plans — create, answer and confirm',
			description:
				'Built the plan flow from the group screen — create a plan, answer it, confirm it, and follow it on a live plan page.',
			icon: 'mdi:calendar-check-outline'
		},
		{
			date: '2026-10-26',
			title: 'Home — my week and upcoming plans',
			description: 'Added a my-week view with dated busy times and home cards for upcoming plans.',
			icon: 'mdi:home-clock-outline'
		},
		{
			date: '2026-10-26',
			title: 'Account — rename, message switches and deletion',
			description:
				'Let people rename themselves, switch kinds of LINE message off, and delete their account from the Me tab.',
			icon: 'mdi:account-cog-outline'
		},
		{
			date: '2026-10-26',
			title: 'Public — landing, legal pages and SEO',
			description:
				'Shipped the landing page and bilingual privacy, terms, help and delete-account pages, with canonical links, hreflang, a sitemap, and Tag Manager loaded only after cookie consent.',
			icon: 'mdi:earth',
			addedSkills: ['google-tag-manager']
		},
		{
			date: '2026-10-26',
			title: 'Admin — operator console',
			description:
				'Built a separate admin app with sign-in, an overview, reports, people and group tools, and the holiday calendar.',
			icon: 'mdi:shield-account-outline'
		},
		{
			date: '2026-10-26',
			title: 'LINE — chat cards and rich menu',
			description:
				'Styled the LINE message cards, let people answer a plan from the chat, and published the rich menu from the admin app.',
			icon: 'mdi:card-text-outline'
		},
		{
			date: '2026-10-26',
			title: 'Insights — activity feed and yearly recap',
			description:
				'Added the activity feed and yearly recap screens, with a recap card that can be shared into a chat.',
			icon: 'mdi:chart-timeline-variant'
		},
		{
			date: '2026-10-27',
			title: 'Events — seasonal festival engine',
			description:
				'Added a festival engine that features one seasonal event at a time on the home screen and its own page, switched on from the admin app.',
			icon: 'mdi:party-popper'
		},
		{
			date: '2026-10-27',
			title: 'Events — Loy Krathong builder and shared river',
			description:
				'Added a krathong builder rendered to an image, a shared river with a share card, and unlock stamps that earn keepsakes.',
			icon: 'mdi:water-outline'
		},
		{
			date: '2026-10-28',
			title: 'Safety — in-app reports',
			description: 'Let people report a plan, a group or a person from inside the app.',
			icon: 'mdi:flag-outline'
		},
		{
			date: '2026-10-28',
			title: 'Security — audit fixes, headers and rate limits',
			description:
				'Closed the findings of a security audit, added security headers and a stricter redirect check, and rate-limited each person.',
			icon: 'mdi:shield-lock-outline'
		},
		{
			date: '2026-10-30',
			title: 'LINE — group chats and typed commands',
			description: 'Made the app work inside LINE group chats, with typed chat commands, group cards and answer links.',
			icon: 'mdi:chat-outline'
		},
		{
			date: '2026-10-31',
			title: 'Tooling — Bun 1.4.4 pinned',
			description:
				"Pinned Bun 1.4.4 everywhere and moved formatting and type checks onto Bun's own bun fmt and bun check.",
			icon: 'simple-icons:bun'
		},
		{
			date: '2026-11-04',
			title: 'Groups — one plain membership model',
			description: 'Simplified groups to one plain membership model across the data, the API and the copy.',
			icon: 'mdi:account-multiple-check-outline'
		},
		{
			date: '2026-11-04',
			title: 'Groups — one join screen and a linked LINE chat',
			description:
				'Gave each group one join screen and a one-tap start, let an owner keep people who count toward free times without a vote, and tied a group to its LINE chat.',
			icon: 'mdi:account-group'
		},
		{
			date: '2026-11-04',
			title: 'CI — MongoDB integration jobs on Ubuntu 24.04',
			description:
				'Moved the MongoDB integration jobs to Ubuntu 24.04 with a database start that works on the runner kernel.',
			icon: 'simple-icons:githubactions'
		},
		{
			date: '2026-11-05',
			title: 'QA — first staging run with a real LINE account',
			description:
				'Ran the suites on staging with a real LINE account, fixed what they found, and made staging wait for CI again.',
			icon: 'mdi:check-decagram-outline'
		}
	]
}
