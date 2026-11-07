import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

export const rsTrophyAdmin: ProjectDef = {
	id: 'rs-trophy-admin',
	accent: '#C5A059', // the brand gold of the shared RS TROPHY UI kit (packages/ui tokens.css)
	// The social publishing suite and the data assistant are what the console is for; Better Auth
	// and Recharts are what sets it apart from the public storefront on the same API.
	highlightSkills: ['next-js', 'elysia-js', 'better-auth', 'recharts', 'base-ui', 'bun-js'],
	title: 'RS TROPHY Admin',
	description:
		"The login-only staff console of RS TROPHY, where the team runs marketing and the shop's day-to-day: a social publishing suite that drafts, approves and schedules posts to Facebook, Instagram, YouTube and TikTok with AI-written captions and generated posters; an AI assistant that answers with charts from the shop's own data; a LINE inbox; one calendar; and a seven-panel command-center home. Installable as a PWA with phone-width layouts. A Next.js app in the RS TROPHY Bun monorepo that reaches the shared ElysiaJS API through a same-origin proxy, with Better Auth sessions and rights-based access. Catalog editing moved to RS ESERVICE in November 2026.",
	resumeSummary:
		'Login-only staff console for RS TROPHY — a multi-channel social publishing suite with AI captions and approvals, an AI data assistant, a LINE inbox and a command-center home. Next.js on the shared ElysiaJS API.',
	// Cover only: screens of an internal tool would show company data.
	images: { cover: assets.projects.rsTrophyAdmin.cover, photos: [] },
	// Starting stack (2026-05-06) — the admin app as it shipped in the monorepo's first commit.
	skills: [
		'next-js',
		'react',
		'tailwind-css',
		'shadcn-ui',
		'elysia-js',
		'better-auth',
		'react-hook-form',
		'recharts',
		'embla-carousel',
		'bun-js',
		'docker',
		'railway'
	],
	// No link: staff sign in on a private host. `stage` keeps the derived status from reading "Archived".
	links: {},
	stage: 'internal',
	startDate: '2026-05-06',
	linkedExperienceIds: ['ruamsuk-cto'],
	timeline: [
		{
			date: '2026-05-19',
			title: 'Content — Article Planning Calendar',
			description: 'Turned the article calendar into a five-view planner with drag-to-reschedule and category colours.',
			icon: 'mdi:calendar-edit'
		},
		{
			date: '2026-05-30',
			title: 'Editor — Shared Tiptap Module',
			description:
				'Moved the article editor onto one Tiptap module in the shared UI package, used by both the admin and the storefront.',
			icon: 'mdi:file-document-edit-outline'
		},
		{
			date: '2026-06-08',
			title: 'Design — Shared Base UI Kit',
			description:
				'Moved onto the shared Base UI kit and the single navy-and-gold theme every app in the monorepo uses.',
			icon: 'mdi:palette-swatch-outline',
			addedSkills: ['base-ui']
		},
		{
			date: '2026-06-09',
			title: 'AI — Admin Assistant + Multimodal Core',
			description:
				'Shipped an admin AI assistant that answers with data charts, on a multimodal core behind a refactored AI service.',
			icon: 'mdi:robot-happy-outline'
		},
		{
			date: '2026-06-22',
			title: 'Social — Autopilot Multi-Channel Publishing Suite',
			description:
				'Built an autopilot social-media suite — OAuth channels for Facebook, Instagram, YouTube and TikTok, AI content generation with brand voice, a drag-to-schedule calendar, and engagement-metrics dashboards.',
			icon: 'mdi:bullhorn-outline'
		},
		{
			date: '2026-06-22',
			title: 'Photos — Product Photo Re-Staging',
			description: 'Added a tool that re-stages product photos by compositing them onto the display podium.',
			icon: 'mdi:image-edit-outline'
		},
		{
			date: '2026-06-24',
			title: 'Uploads — One Crop-Capable Image Input',
			description: 'Put every admin image upload behind one component that crops to 1:1.',
			icon: 'mdi:crop'
		},
		{
			date: '2026-06-29',
			title: 'Admin — Richer Dashboards + One Calendar',
			description: 'Added richer admin dashboards and merged the separate admin calendars into one.',
			icon: 'mdi:view-dashboard-outline'
		},
		{
			date: '2026-08-05',
			title: 'Admin — Installable PWA + Phone Layouts',
			description:
				'Made the admin dashboard an installable PWA and gave its lists, dialogs and calendars phone-width layouts.',
			icon: 'mdi:cellphone-link'
		},
		{
			date: '2026-08-05',
			title: 'Social — Reliable Publishing + Approval Gate',
			description:
				'Repaired the publish pipeline and made review a two-way gate, so an unapproved post can never go live.',
			icon: 'mdi:send-check-outline'
		},
		{
			date: '2026-08-07',
			title: 'Admin — Command Center Home',
			description: 'Rebuilt the admin home as a seven-panel command center fed by one date-windowed calendar endpoint.',
			icon: 'mdi:view-dashboard',
			removedSkills: ['embla-carousel']
		},
		{
			date: '2026-08-08',
			title: 'Social — TikTok Posting Compliance',
			description: "Added TikTok's content-posting compliance step and per-post publishing options to the composer.",
			icon: 'simple-icons:tiktok'
		},
		{
			date: '2026-08-08',
			title: 'Social — Photo Presets + Caption Templates',
			description: 'Added photo presets, caption templates and auto-post time slots to the composer.',
			icon: 'mdi:text-box-multiple-outline'
		},
		{
			date: '2026-08-15',
			title: 'Safety — Delete Guards + Channel Health',
			description:
				'Added safety checks before anything is deleted and made channel health reflect the real state of each connected account.',
			icon: 'mdi:shield-check-outline'
		},
		{
			date: '2026-08-22',
			title: 'Social — Clean Plates in Place',
			description:
				'Cleaned product photo plates in place, so social posts reuse the product image without the text from the original photo.',
			icon: 'mdi:eraser'
		},
		{
			date: '2026-09-04',
			title: 'Social — Publishing Restored',
			description: 'Brought social publishing back after it was pulled on 31 August.',
			icon: 'mdi:calendar-clock'
		},
		{
			date: '2026-09-04',
			title: 'i18n — Social Publishing in Thai + English',
			description: 'The social publishing screens now speak Thai as well as English.',
			icon: 'mdi:translate'
		},
		{
			date: '2026-09-11',
			title: 'Editors — One Section-Based Detail Editor',
			description: 'Unified every admin detail editor behind the same section navigation.',
			icon: 'mdi:page-layout-sidebar-left'
		},
		{
			date: '2026-09-14',
			title: 'Social — Composer + Approve-and-Post',
			description: 'Added a generation composer and an approve-and-post flow for social drafts.',
			icon: 'mdi:check-circle-outline'
		},
		{
			date: '2026-09-15',
			title: 'Social — Video Posts',
			description: 'Added MP4 video posts to the social composer.',
			icon: 'mdi:video-outline'
		},
		{
			date: '2026-09-22',
			title: 'Social — House Poster Generator',
			description: 'Generated house-style social posters from product photos, with a contact band on every poster.',
			icon: 'mdi:image-frame'
		},
		{
			date: '2026-10-06',
			title: 'Session — Same-Origin API + Host-Only Cookie',
			description:
				'The admin now calls its own origin, which proxies to the API, and its session cookie stays on the admin host.',
			icon: 'mdi:cookie-lock-outline'
		},
		{
			date: '2026-10-16',
			title: 'Handoff — Pending Work Opens in RS ESERVICE',
			description: 'The pending tile on the admin home opens its full list in the RS ESERVICE staff app.',
			icon: 'mdi:open-in-new'
		},
		{
			date: '2026-10-19',
			title: 'Messages — Refusals Explained in Thai',
			description: 'Every refusal in the admin carries a code and a Thai message instead of raw server English.',
			icon: 'mdi:message-alert-outline'
		},
		{
			date: '2026-10-19',
			title: 'Access — Rights Instead of Roles',
			description: 'Moved admin access to a set of rights per person, with tighter checks on who can grant them.',
			icon: 'mdi:account-key-outline'
		},
		{
			date: '2026-10-21',
			title: 'AI — Usage Dashboard',
			description: 'Added an admin dashboard showing how each AI feature is used.',
			icon: 'mdi:chart-line'
		},
		{
			date: '2026-10-21',
			title: 'Social — Posts by Product + Caption Options',
			description: 'Added product-led posts, caption options and sports-news posts to the social composer.',
			icon: 'mdi:newspaper-variant-outline'
		},
		{
			date: '2026-10-23',
			title: 'Social — Trending-Product Posts',
			description: 'Added trending-product posts that end on a LINE call to action.',
			icon: 'mdi:trending-up'
		},
		{
			date: '2026-11-07',
			title: 'Catalog — Editing Moves to RS ESERVICE',
			description:
				'Retired the admin catalog sections; article, product and playlist editing now lives in RS ESERVICE, and the old addresses redirect there.',
			icon: 'mdi:arrow-right-bold-outline'
		}
	]
}
