import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

/**
 * Public copy covers the shared workspace only — requests, approvals, documents, tasks and the
 * catalog editors. Other parts of the app are private to the company and never appear here:
 * check a new milestone against the Journal's risk rules (`write-post` skill) before adding it.
 */
export const rsEservice: ProjectDef = {
	id: 'rs-eservice',
	accent: '#ECD399', // the light gold of the shared RS TROPHY UI kit (packages/ui tokens.css)
	// The app's own story is the shared stack done as a PWA: Next.js on the monorepo's Elysia API
	// and the shared Base UI kit. No SkillId exists for PWA / Web Push.
	highlightSkills: ['next-js', 'elysia-js', 'base-ui', 'shadcn-ui', 'bun-js', 'railway'],
	title: 'RS ESERVICE',
	description:
		"RS TROPHY's login-only staff workspace, installable as a PWA with email one-time sign-in and native Web Push. Staff raise requests and move them through approval, sign documents electronically, and print them with a QR code that opens each document's live page; a task list and a dashboard hub sit on the home screen, and since November 2026 the article, product and playlist editors live here too. Laid out for every width — a tablet rail, desktop side panels and phone bottom sheets — on the shared RS TROPHY UI kit, as a Next.js app in the Bun monorepo that calls the shared ElysiaJS API. It began as a LINE LIFF app and became a standalone PWA within its first week.",
	resumeSummary:
		'Staff workspace PWA for RS TROPHY — requests and approvals, e-signed printable documents with QR links, tasks and a dashboard hub. Next.js on the shared ElysiaJS API, with email sign-in and Web Push.',
	// Cover only: screens of an internal tool would show company data.
	images: { cover: assets.projects.rsEservice.cover, photos: [] },
	// Starting stack (2026-10-06) — a LINE LIFF shell on the shared kit; LIFF left four days later.
	skills: [
		'next-js',
		'react',
		'tailwind-css',
		'shadcn-ui',
		'base-ui',
		'elysia-js',
		'bun-js',
		'docker',
		'railway',
		'line-liff'
	],
	// No link: staff sign in on a private host. `stage` keeps the derived status from reading "Archived".
	links: {},
	stage: 'internal',
	startDate: '2026-10-06',
	linkedExperienceIds: ['ruamsuk-cto'],
	timeline: [
		{
			date: '2026-10-06',
			title: 'Workspace — Staff App Scaffold',
			description:
				'Registered the staff app as its own Next.js app in the monorepo, with a LINE LIFF onboarding shell, its own Dockerfile and Railway boot checks.',
			icon: 'simple-icons:line'
		},
		{
			date: '2026-10-06',
			title: 'Requests — Request + Approval Screens',
			description: 'Built the request editor, list, detail and approval screens, with file attachments.',
			icon: 'mdi:file-document-check-outline'
		},
		{
			date: '2026-10-10',
			title: 'PWA — Standalone App with Web Push',
			description:
				'Replaced the LINE shell with a standalone PWA: email one-time sign-in, native Web Push and a first-login wizard.',
			icon: 'mdi:cellphone-link',
			removedSkills: ['line-liff']
		},
		{
			date: '2026-10-12',
			title: 'Forms — RS ESERVICE Name + One Shared Select',
			description: 'Named the app RS ESERVICE and moved every dropdown onto one shared Select.',
			icon: 'mdi:form-select'
		},
		{
			date: '2026-10-14',
			title: 'Access — Rights Instead of Roles',
			description: 'Replaced the single role field with a set of rights per person and reset the API contract to v1.',
			icon: 'mdi:shield-account-outline'
		},
		{
			date: '2026-10-15',
			title: 'E-Signature — Signed, Printable Documents',
			description:
				'Added an e-signature step, stamped signatures onto printed documents, and put a QR on each printout that opens its live page.',
			icon: 'mdi:draw-pen'
		},
		{
			date: '2026-10-16',
			title: 'Every Width — Tablet Rail, Phone Sheets + Notices',
			description:
				'Laid the app out for tablet rails, desktop side panels and phone bottom sheets, and let each person choose how notices reach them.',
			icon: 'mdi:responsive'
		},
		{
			date: '2026-10-17',
			title: 'Redesign — Shell, Home + Dashboard',
			description:
				'Redesigned the shell with a plus sheet, a new Home, Tasks and dashboard, and calm motion on taps and lists.',
			icon: 'mdi:view-dashboard-edit-outline'
		},
		{
			date: '2026-10-19',
			title: 'Shared Kit — One UI Kit for Both Staff Apps',
			description:
				"Lifted the workspace's components into the shared UI package and gave both staff apps one date and number formatter and a notification bell.",
			icon: 'mdi:puzzle-outline'
		},
		{
			date: '2026-11-03',
			title: 'Signatures — Lines Follow the Approval Chain',
			description:
				'Signature lines on printed documents now follow the approval chain and fit on one sheet, and access rights are managed inside the app.',
			icon: 'mdi:signature'
		},
		{
			date: '2026-11-07',
			title: 'Catalog — Article, Product + Playlist Editors Move In',
			description:
				'Article, product and playlist editing moved here from the admin console, whose old addresses now redirect to this app.',
			icon: 'mdi:swap-horizontal'
		},
		{
			date: '2026-11-07',
			title: 'Hub — Dashboard Cards',
			description: 'Added a dashboard hub of summary cards, each opening its full dashboard.',
			icon: 'mdi:view-grid-plus-outline'
		}
	]
}
