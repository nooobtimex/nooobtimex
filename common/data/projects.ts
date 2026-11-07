import type { Milestone, Project } from '../interfaces'
import { sortByDateDesc } from '../utils'
import { assets } from './assets'
import { type SkillId, skillById } from './skills'

/** Authoring shape for a milestone: skill deltas by id (resolved to Skill[] below). */
type MilestoneDef = Omit<Milestone, 'addedSkills' | 'removedSkills'> & {
	addedSkills?: SkillId[]
	removedSkills?: SkillId[]
}

/**
 * Authoring shape: list the STARTING stack by id (typed + autocompleted). The active/retired
 * split and the full roster are derived from the timeline's add/remove events (see resolver below).
 */
type ProjectDef = Omit<Project, 'skills' | 'activeSkills' | 'retiredSkills' | 'timeline'> & {
	skills: SkillId[]
	/**
	 * Signature tech, most representative FIRST — the technologies a reader should see to
	 * understand what this project actually is. Ranked by array position.
	 *
	 * Display order is otherwise the order skills happen to be authored in, which nobody
	 * chose: `rs-trophy` led with three retired-era marketing tools instead of Bun, and
	 * `looklook-pet` led with Flutter instead of the NestJS its description opens on.
	 *
	 * Must name only skills that are ACTIVE for the project — the resolver throws otherwise.
	 */
	highlightSkills?: SkillId[]
	timeline?: MilestoneDef[]
}

/** Tooling used on every project — always active, never retired, so it lives here not per-project. */
const commonTooling: SkillId[] = ['typescript', 'git-github', 'prettier', 'eslint']

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

export const looklookPet: ProjectDef = {
	id: 'looklook-pet',
	accent: '#FF7D5A', // sampled from looklook.pet — coral logo mark
	// NestJS leads: scope (1) and the resumeSummary both open on "15+ NestJS services".
	// Railway/Docker/R2 stay together — the description closes on that trio as one clause.
	highlightSkills: [
		'nest-js',
		'medusa',
		'mercur',
		'omise',
		'mongodb',
		'next-js',
		'better-auth',
		'redis',
		'bullmq',
		'cloudflare-r2',
		'railway',
		'docker'
	],
	title: 'LOOKLOOK PET Platform',
	description:
		'Architect and lead full-stack developer of the LOOKLOOK PET platform — a multi-surface pet-parent community and B2B2C multi-vendor marketplace. Owned the ecosystem end-to-end across three core scopes: (1) Core Storefront & Microservices: Scaled 15+ NestJS services — first over a NATS message bus, later simplified to direct HTTP service calls — backed by MongoDB, Redis, and BullMQ, and fronted by a Next.js storefront. Designed a custom native payment UI with client-side Omise tokenization, inline PromptPay QR polling, card-lock promotional gating, and migrated headless WordPress to MongoDB with TipTap HTML rendering. (2) B2B Partner Portal: Built and owned ~55% of the console codebase, developing claim-an-unlisted-place flows, team switcher management with dynamic roles, analytics panels with CSV orders export, and custom Lottie route loaders. (3) Mercur Multi-Vendor Marketplace: Served as sole maintainer of the Medusa.js 2 marketplace and seller panels, upgrading to Sprint-46, building a workflow-based refund system, and launching bilingual TH/EN deal templates. (4) Customer Mobile App: Delivered the customer-facing mobile app in Flutter against the same service layer. Deployed on Railway with Docker and Cloudflare R2.',
	resumeSummary:
		'Multi-surface pet-parent marketplace & B2B2C platform — 15+ NestJS microservices, a custom Omise / PromptPay checkout, a partner console, a Flutter customer app, and a Medusa v2 multi-vendor marketplace. Next.js / MongoDB on Railway.',
	images: { cover: assets.projects.looklookPet.cover, photos: [...assets.projects.looklookPet.gallery] },
	// Starting stack (2025-07-16). Later tech is introduced via timeline events; retired tech is
	// flagged there too. Common tooling (TypeScript/Git/Prettier/ESLint) is added by the resolver.
	skills: [
		'next-js',
		'react',
		'flutter',
		'tailwind-css',
		'radix-ui',
		'tanstack-query',
		'nest-js',
		'node-js',
		'nats',
		'mongodb',
		'redis',
		'bullmq',
		'omise',
		'seo',
		'google-tag-manager',
		'clerk',
		'wordpress',
		'tencent-cloud',
		'circleci'
	],
	links: { live: 'https://looklook.pet' },
	startDate: '2025-07-16',
	linkedExperienceIds: ['jasmine-tech'],
	timeline: [
		{
			date: '2025-10-30',
			title: 'Transport — NATS Message Bus → HTTP Service Calls',
			description:
				'Replaced the NATS/JetStream message bus with direct HTTP service calls for the internal BFF-to-service transport, simplifying the request path.',
			icon: 'mdi:transit-connection-variant',
			removedSkills: ['nats']
		},
		{
			date: '2025-11-07',
			title: 'Hosting — Tencent Cloud VM → Railway + Docker',
			description:
				'Retired the self-managed Tencent Cloud VMs and their CircleCI + SSH pipelines for Railway across the fleet, deploying every service from a Dockerfile as config-as-code.',
			icon: 'simple-icons:railway',
			addedSkills: ['railway', 'docker'],
			removedSkills: ['tencent-cloud', 'circleci']
		},
		{
			date: '2025-12-08',
			title: 'Marketplace — Medusa v2 Multi-Vendor Standup',
			description:
				'Stood up the Medusa v2 multi-vendor marketplace (Mercur) on Railway with Nixpacks, MinIO object storage, and a custom payment provider.',
			icon: 'mdi:storefront-outline',
			addedSkills: ['medusa', 'mercur', 'minio', 'postgresql', 'algolia', 'resend']
		},
		{
			date: '2026-02-09',
			title: 'Payments — Omise Webhooks, Refunds, Native Checkout',
			description:
				'Hardened the Omise payment system — webhook signature security, an async event queue, refunds, and native card / PromptPay / mobile-banking checkout.',
			icon: 'mdi:credit-card-outline'
		},
		{
			date: '2026-03-09',
			title: 'Auth — Clerk → Better Auth (Partner Portal + BFF)',
			description:
				'Migrated the B2B partner portal and its NestJS BFF from Clerk to Better Auth end-to-end — re-architecting session handling behind a proxy and adapting the Mongoose layer to Better Auth string IDs.',
			icon: 'mdi:shield-key-outline',
			addedSkills: ['better-auth'],
			removedSkills: ['clerk']
		},
		{
			date: '2026-05-25',
			title: 'Content — Headless WordPress → MongoDB',
			description:
				'Cut the storefront and every BFF off headless WordPress (Faust + Apollo) onto a native MongoDB content model — the WordPress chapter, closed.',
			icon: 'simple-icons:mongodb',
			removedSkills: ['wordpress']
		},
		{
			date: '2026-06-02',
			title: 'Media Storage — Tencent COS → Cloudflare R2',
			description:
				'Swapped the Tencent COS SDK for the AWS S3 SDK against Cloudflare R2 behind a StorageService abstraction — a runtime provider flip with zero downstream code changes.',
			icon: 'simple-icons:cloudflare',
			addedSkills: ['cloudflare-r2', 'aws-s3']
		},
		{
			date: '2026-06-18',
			title: 'Marketplace — Medusa Sprint 46 + Bilingual TH/EN Templates',
			description:
				'Upgraded the marketplace to Medusa Sprint 46 and shipped a bilingual TH/EN deal-template system (title, description, T&C, per-language apply).',
			icon: 'mdi:translate'
		},
		{
			date: '2026-06-26',
			title: 'Video Pipeline — Range Streaming + Faster Transcode',
			description:
				'Added HTTP Range video streaming, browser-universal MP4 playback, and a faster ffmpeg transcode baked into the runtime image.',
			icon: 'mdi:play-box-outline'
		},
		{
			date: '2026-07-07',
			title: 'Architecture — 15 Polyrepos → Turborepo Monorepo',
			description:
				'Consolidated ~15 standalone repos into one Turborepo — every app plus a shared @looklookpet/common workspace package, with per-service Railway config and a single cached build graph.',
			icon: 'simple-icons:turborepo'
		}
	]
}

export const rsTrophy: ProjectDef = {
	id: 'rs-trophy',
	accent: '#FCEE0A',
	// Bun leads: "Built as a Bun monorepo" is the organising idea, repeated three times.
	highlightSkills: ['bun-js', 'elysia-js', 'next-js', 'mongodb', 'cloudflare-r2', 'railway', 'redis', 'docker'],
	title: 'RS TROPHY',
	description:
		'A unified e-commerce and management platform for custom trophies, plaques, and medals — consolidating fragmented sibling brands into one high-performance system. Built as a Bun monorepo: a localized, SEO-optimized Next.js storefront, a real-time ElysiaJS API, and an admin console that share types through a common workspace package. Runs on MongoDB with Redis caching and Cloudflare R2 object storage, containerized with Docker and deployed on Railway — and ships an AI copilot for natural-language shopping assistance. The platform evolved from an original WordPress + WooCommerce storefront into this unified Bun monorepo.',
	resumeSummary:
		'Unified e-commerce + admin platform for a custom-awards manufacturer, consolidating fragmented brands into one Bun monorepo — SEO storefront, ElysiaJS API, and an AI shopping copilot. MongoDB / Redis on Railway.',
	images: { cover: assets.projects.rsTrophy.cover, photos: [...assets.projects.rsTrophy.gallery] },
	// Starting stack (2023) — the original WordPress + WooCommerce storefront. The 2026 Bun monorepo
	// rebuild is introduced via timeline events, which also retire the legacy WordPress stack.
	skills: ['wordpress', 'woocommerce', 'seo', 'google-analytics', 'google-ads'],
	links: { live: 'https://rs-trophy.com' },
	startDate: '2023-01-01',
	linkedExperienceIds: ['ruamsuk-software-engineer-part-time', 'ruamsuk-cto'],
	timeline: [
		{
			date: '2023-01-01',
			title: 'Discovery & Setup — WordPress + WooCommerce Foundation',
			description:
				'Stood up the original storefront on WordPress and WooCommerce — hosting, theme, and commerce plugin stack.',
			icon: 'simple-icons:woocommerce'
		},
		{
			date: '2023-02-01',
			title: 'Design — Storefront Theme & Catalog UX',
			description: 'Designed the storefront theme and catalog browsing experience.',
			icon: 'mdi:palette-outline'
		},
		{
			date: '2023-03-01',
			title: 'Development — Catalog, Cart & Marketing Integrations',
			description: 'Built the product catalog, cart and checkout flows, and marketing integrations.',
			icon: 'mdi:hammer-screwdriver'
		},
		{
			date: '2023-04-01',
			title: 'Launch — SEO, Analytics & Go-Live',
			description:
				'Went live with on-page SEO, analytics, and ad tracking — the storefront that ran until the modern rebuild.',
			icon: 'mdi:rocket-launch-outline'
		},
		{
			date: '2026-05-06',
			title: 'Foundation — Bun Monorepo, Railway from Day One',
			description:
				'Bootstrapped a Bun workspace monorepo — storefront, admin, ElysiaJS API, and shared UI + type packages — Railway-targeted with standalone output from the very first commit.',
			icon: 'simple-icons:bun',
			addedSkills: [
				'bun-js',
				'elysia-js',
				'next-js',
				'react',
				'mongodb',
				'redis',
				'bullmq',
				'better-auth',
				'zod',
				'react-hook-form',
				'recharts',
				'embla-carousel',
				'resend',
				'docker',
				'railway',
				'tailwind-css',
				'shadcn-ui',
				'radix-ui',
				'minio',
				'aeo',
				'geo',
				'json-ld',
				'google-tag-manager'
			]
		},
		{
			date: '2026-05-07',
			title: 'AI — OpenRouter Streaming Agent + MCP Tool Suite',
			description:
				'Built a custom high-performance OpenRouter streaming AI agent with a multi-tool MCP server, powering natural-language shopping assistance across the storefront and admin console.',
			icon: 'mdi:robot-outline'
		},
		{
			date: '2026-05-09',
			title: 'i18n — next-intl TH/EN + Shared UI Workspace',
			description:
				'Rolled out next-intl Thai/English localization and extracted the shadcn component set into a shared @rs-trophy/ui workspace package.',
			icon: 'mdi:translate'
		},
		{
			date: '2026-05-12',
			title: 'Design — Navy + Gold Token System',
			description:
				'Established a luxury navy-and-gold design-token system with the Anuphan typeface, replacing hardcoded values with a single themed source in the shared UI kit.',
			icon: 'mdi:palette-outline'
		},
		{
			date: '2026-05-13',
			title: 'Consolidation — Legacy WordPress Sibling Sites → One Platform',
			description:
				'Scraped and imported two legacy WordPress sibling sites into one unified platform, with legacy category-page redirects preserved.',
			icon: 'simple-icons:wordpress',
			removedSkills: ['wordpress', 'woocommerce']
		},
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
			date: '2026-06-04',
			title: 'Storage — MinIO → Cloudflare R2',
			description:
				'Migrated object storage from MinIO to Cloudflare R2 behind a provider-agnostic S3 layer, adding a streaming proxy and a separate private bucket for PII.',
			icon: 'simple-icons:cloudflare',
			addedSkills: ['cloudflare-r2'],
			removedSkills: ['minio']
		},
		{
			date: '2026-06-04',
			title: 'Cleanup — Self-Hosted Analytics Removed',
			description:
				'Removed the self-hosted view tracker and its analytics dashboards, leaving Google Analytics and Tag Manager as the only tracking.',
			icon: 'mdi:broom'
		},
		{
			date: '2026-06-07',
			title: 'Type Safety — End-to-End Eden Treaty Data Layer',
			description:
				'Migrated the entire web and admin data layer to type-safe Eden Treaty against the ElysiaJS API, plus production hardening — fail-fast secrets, graceful shutdown, health checks, and rate limiting.',
			icon: 'simple-icons:typescript'
		},
		{
			date: '2026-06-08',
			title: 'Design — Radix UI → Base UI, One Navy + Gold Theme',
			description:
				'Swapped Radix UI for Base UI and made the navy-and-gold theme the single source in the shared UI package.',
			icon: 'mdi:palette-swatch-outline',
			addedSkills: ['base-ui'],
			removedSkills: ['radix-ui']
		},
		{
			date: '2026-06-09',
			title: 'AI — Admin Assistant + Multimodal Core',
			description:
				'Shipped an admin AI assistant that answers with data charts, on a multimodal core behind a refactored AI service.',
			icon: 'mdi:robot-happy-outline'
		},
		{
			date: '2026-06-09',
			title: 'Security — Hardening Passes + Cookieless Consent',
			description:
				'Closed critical, high and medium findings across several hardening rounds, then added cookieless consent mode.',
			icon: 'mdi:shield-check-outline'
		},
		{
			date: '2026-06-10',
			title: 'Launch — Live in Production on Railway + Cloudflare',
			description:
				'Shipped the platform to production on Railway with Cloudflare, folding the canonical-domain redirector into the monorepo.',
			icon: 'simple-icons:railway'
		},
		{
			date: '2026-06-10',
			title: 'Redirects — Legacy Category URLs + 410 for Junk',
			description:
				'Redirected legacy WordPress category URLs to the new category pages and answered scanner junk paths with 410 Gone.',
			icon: 'mdi:link-variant'
		},
		{
			date: '2026-06-13',
			title: 'CI — Main Gated by Automated Checks',
			description:
				'Put the production branch behind the full check gate, with an automated review after CI on each pull request.',
			icon: 'mdi:check-decagram-outline'
		},
		{
			date: '2026-06-14',
			title: 'Sports — Football Data Section',
			description: 'Built a football data section with fixtures, a players hub, cup brackets and per-90 stats.',
			icon: 'mdi:soccer'
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
			title: 'Performance — Responsive Image Variants',
			description:
				'Served pre-generated responsive image variants and statically rendered the locale routes, trimming first-load JavaScript.',
			icon: 'mdi:speedometer'
		},
		{
			date: '2026-06-25',
			title: 'Design — Photo Hero + One Typeface',
			description:
				'Replaced the hero with a full-bleed photo on desktop and a stacked photo on mobile, and consolidated the UI onto Anuphan.',
			icon: 'mdi:image-area'
		},
		{
			date: '2026-06-29',
			title: 'Catalog — One Filterable Product Catalog',
			description: 'Put the products page and every category page on one filterable, paginated catalog.',
			icon: 'mdi:view-grid-outline'
		},
		{
			date: '2026-06-29',
			title: 'Admin — Richer Dashboards + One Calendar',
			description: 'Added richer admin dashboards and merged the separate admin calendars into one.',
			icon: 'mdi:view-dashboard-outline'
		},
		{
			date: '2026-06-30',
			title: 'Trust — Google Reviews on the Home Page',
			description:
				'Showed archived Google reviews and a best five-star pick on the home page, backed by a truthful AggregateRating in the LocalBusiness JSON-LD.',
			icon: 'mdi:star-circle-outline'
		},
		{
			date: '2026-07-02',
			title: 'Search — Semantic Vector Search',
			description:
				'Added semantic vector search over product and article embeddings (BullMQ embed queues), wired into both the storefront AI chat and the admin assistant.',
			icon: 'mdi:database-search-outline'
		},
		{
			date: '2026-07-02',
			title: 'Content — Company Facts from One Source',
			description:
				'Moved company facts and the brand name into one shared source that the storefront, the API and the chat all read.',
			icon: 'mdi:database-check-outline'
		},
		{
			date: '2026-07-02',
			title: 'Data — Seed Scripts → Backup Restore',
			description: 'Removed the database seed subsystem; local development now restores a MongoDB backup instead.',
			icon: 'mdi:database-refresh-outline'
		},
		{
			date: '2026-07-04',
			title: 'Data — Mongoose Layer Removed',
			description:
				'Dropped the Mongoose schema layer and its dependency, leaving one file as the only source of MongoDB indexes.',
			icon: 'simple-icons:mongodb'
		},
		{
			date: '2026-07-04',
			title: 'Performance — Storefront Speed Audit',
			description:
				'Ran a storefront speed audit that added skeleton loaders and a mobile hero preload to cut Largest Contentful Paint.',
			icon: 'mdi:speedometer-medium'
		},
		{
			date: '2026-07-04',
			title: 'Ops — Memory Logger + Restart Watchdog',
			description:
				'Added an RSS and heap logger, plus an opt-in watchdog that restarts the storefront when memory runs away.',
			icon: 'mdi:memory'
		},
		{
			date: '2026-07-08',
			title: 'Mobile — Expo Sandbox App',
			description: 'Added an Expo sandbox app beside the web apps, with EAS build config and a pinned native SDK.',
			icon: 'simple-icons:expo',
			addedSkills: ['expo', 'react-native']
		},
		{
			date: '2026-07-21',
			title: 'Mobile — Expo Sandbox Retired',
			description: 'Removed the Expo sandbox app along with its CI job, Docker copies and lint config.',
			icon: 'mdi:cellphone-remove',
			removedSkills: ['expo', 'react-native']
		},
		{
			date: '2026-07-28',
			title: 'Catalog — One Option Axis per Product',
			description:
				'Replaced the cartesian variant editor with one declared option axis per product, then removed the old variant model.',
			icon: 'mdi:tune-variant'
		},
		{
			date: '2026-07-31',
			title: 'Ops — Health Checks Gate Deploys',
			description:
				'Added liveness checks and readiness-gated deploys for every service, and made graceful shutdown actually run.',
			icon: 'mdi:heart-pulse'
		},
		{
			date: '2026-07-31',
			title: 'Runtime — Node 26 Toolchain',
			description: 'Moved the build toolchain to Node 26 and fixed the web and admin build stages to match.',
			icon: 'simple-icons:nodedotjs',
			addedSkills: ['node-js']
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
			icon: 'mdi:view-dashboard'
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
			date: '2026-08-09',
			title: 'Quality — Playwright E2E + Accessibility in CI',
			description:
				'Added Playwright end-to-end, axe accessibility and visual-regression suites, run in GitHub Actions.',
			icon: 'mdi:test-tube'
		},
		{
			date: '2026-08-18',
			title: 'Catalog — Priced Products First + Page Size',
			description: 'Sorted the catalog with priced products first and let visitors choose the page size.',
			icon: 'mdi:sort'
		},
		{
			date: '2026-08-19',
			title: 'AI Photos — One House Card Design',
			description:
				"Generated one house card design for every priced product, restaging each photo while keeping the product's own angle.",
			icon: 'mdi:cards-outline'
		},
		{
			date: '2026-08-22',
			title: 'Social — Clean Plates in Place',
			description:
				'Cleaned product photo plates in place, so social posts reuse the product image without the text from the original photo.',
			icon: 'mdi:eraser'
		},
		{
			date: '2026-08-24',
			title: 'SEO — Wider Crawl Surface',
			description: 'Extended the crawl surface so search engines and AI crawlers read the storefront consistently.',
			icon: 'mdi:search-web'
		},
		{
			date: '2026-08-31',
			title: 'Auth — Better Auth 1.7',
			description: 'Migrated authentication to Better Auth 1.7, then fixed the OAuth consent flow on top of it.',
			icon: 'mdi:shield-account-outline'
		},
		{
			date: '2026-09-01',
			title: 'AI — Product Photos in the Storefront Chat',
			description:
				'Let the storefront chat show product photos, with guardrails for when it should hand off to a person.',
			icon: 'mdi:chat-processing-outline'
		},
		{
			date: '2026-09-03',
			title: 'Tracking — Tag Manager Event Mapping',
			description: 'Mapped storefront events onto the Google Tag Manager container.',
			icon: 'simple-icons:googletagmanager'
		},
		{
			date: '2026-09-04',
			title: 'Social — Publishing Restored',
			description: 'Brought social publishing back after it was pulled on 31 August.',
			icon: 'mdi:calendar-clock'
		},
		{
			date: '2026-09-07',
			title: 'Infra — Redirect Service Folded into the Web Apps',
			description: 'Retired the standalone redirect service and moved its routing into the web apps themselves.',
			icon: 'mdi:call-merge'
		},
		{
			date: '2026-09-09',
			title: 'Search — Photo Search Returns Ten Matches',
			description: 'Photo search now returns a row of ten matches, and the chat shows the photo the visitor sent.',
			icon: 'mdi:image-search-outline'
		},
		{
			date: '2026-09-09',
			title: 'AI — MCP Server Retired',
			description: 'Removed the MCP server and its four dependencies.',
			icon: 'mdi:power-plug-off-outline'
		},
		{
			date: '2026-09-09',
			title: 'Process — Backlog Lives in the Repo',
			description: 'Moved the backlog into the repo as one markdown file per task, validated by a script.',
			icon: 'mdi:clipboard-text-outline'
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
			date: '2026-09-30',
			title: 'AI — Storefront Chat Kill Switch',
			description: 'Added an admin switch that turns the storefront AI chat off instantly.',
			icon: 'mdi:power'
		},
		{
			date: '2026-10-17',
			title: 'Sports — Football Section Retired',
			description: 'Retired the football data section; its old address now lands on a trophy page.',
			icon: 'mdi:soccer-field'
		},
		{
			date: '2026-10-19',
			title: 'Infra — Railway Service Config as Code',
			description: 'Moved every Railway service setting into infrastructure as code.',
			icon: 'simple-icons:railway'
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
			date: '2026-11-03',
			title: 'Delivery — Staging Retired',
			description: 'Removed the staging environment, leaving develop → main as the delivery path.',
			icon: 'mdi:source-branch'
		}
	]
}

export const onlinePokerGame: ProjectDef = {
	id: 'online-poker-game',
	accent: '#FF003C',
	// SSE leads: "featuring Server-Sent Events" is the description's distinguishing clause.
	highlightSkills: ['sse', 'next-js', 'mongodb', 'redis', 'bullmq'],
	title: 'Online Poker Game',
	description:
		'A real-time multiplayer online poker game featuring Server-Sent Events for live updates. Built with Next.js, and since its 2026 scale-out runs on MongoDB with Redis and a BullMQ job queue.',
	images: { cover: assets.projects.onlinePokerGame.cover, photos: [...assets.projects.onlinePokerGame.gallery] },
	// Starting stack — realtime (SSE) and the scale-out stack (Docker/BullMQ/Redis) arrive via events.
	skills: ['next-js', 'react', 'prisma', 'render', 'tailwind-css', 'postgresql'],
	links: {},
	startDate: '2025-03-01',
	linkedExperienceIds: ['freelance'],
	timeline: [
		{
			date: '2025-06-09',
			title: "Kickoff — TypeScript Texas Hold'em on Next.js",
			description:
				"Started a real-time multiplayer Texas Hold'em project on Next.js with a component-driven UI and strict TypeScript.",
			icon: 'mdi:cards-playing-outline'
		},
		{
			date: '2025-06-10',
			title: 'Data — Prisma Schema + First Table Screen',
			description: 'Set up the Prisma data layer and the first poker table interface.',
			icon: 'simple-icons:prisma'
		},
		{
			date: '2025-06-11',
			title: 'Engine — Test-Driven Hand Evaluator',
			description: 'Built the poker hand-evaluation engine test-first, with dedicated unit suites for ranking logic.',
			icon: 'mdi:cards'
		},
		{
			date: '2025-06-11',
			title: 'Realtime — Rooms over Server-Sent Events',
			description: 'Streamed live room state to every player over Server-Sent Events.',
			icon: 'mdi:broadcast',
			addedSkills: ['sse']
		},
		{
			date: '2025-06-12',
			title: 'Core — Showdown & Deck Logic',
			description: 'Implemented showdown resolution and deck management with full unit-test coverage.',
			icon: 'mdi:test-tube'
		},
		{
			date: '2025-06-14',
			title: 'UI — Lobby Page + Game-Room Table',
			description: 'Built the lobby page and the game-room table with card, community-card and player-seat components.',
			icon: 'mdi:view-grid-outline'
		},
		{
			date: '2025-06-15',
			title: 'Engine — Waiting Room, Stages + Pre-Round Betting',
			description: 'Added the waiting-room stage and a game engine with pre-round betting.',
			icon: 'mdi:poker-chip'
		},
		{
			date: '2025-07-05',
			title: 'Refactor — Modular Pot / Position / Betting Managers',
			description: 'Refactored the game engine into dedicated pot, position, and betting modules.',
			icon: 'mdi:cog-outline'
		},
		{
			date: '2025-07-11',
			title: 'Local Play — Single-Device Table',
			description: 'Shipped a single-device table with game setup, player actions and win-by-fold.',
			icon: 'mdi:cellphone'
		},
		{
			date: '2025-07-30',
			title: 'Backend — Server-Side Game State + Seat-Order Turns',
			description:
				'Moved the game logic onto the server: turns follow seat order, and rounds auto-advance when every active player is all-in.',
			icon: 'mdi:server-network-outline'
		},
		{
			date: '2025-08-05',
			title: 'Auth — Session-Based Authentication',
			description: 'Added session-based authentication for players and rooms.',
			icon: 'mdi:shield-key-outline'
		},
		{
			date: '2025-08-09',
			title: 'Multiplayer — Server-Synced Hole Cards + Room Routing',
			description:
				"Synced each player's hole cards with the server state and moved room routing and joining onto the multiplayer API.",
			icon: 'mdi:cards-outline'
		},
		{
			date: '2025-08-29',
			title: 'Odds — Monte Carlo Win-Probability',
			description: 'Built a Monte Carlo simulation for live hand-odds and win-probability estimates.',
			icon: 'mdi:chart-bell-curve-cumulative'
		},
		{
			date: '2025-09-07',
			title: 'Multiplayer — Lobby & Configurable Rooms',
			description: 'Delivered the multiplayer lobby with a create-room flow and host-configurable seat limits.',
			icon: 'mdi:account-group-outline'
		},
		{
			date: '2025-09-12',
			title: 'Odds — Prediction Panel in the Game Room',
			description: 'Added a prediction panel to the game room that shows the hand odds for the table.',
			icon: 'mdi:chart-donut'
		},
		{
			date: '2025-10-06',
			title: 'Multiplayer — Full-Room Start + Room Redirects',
			description:
				'A game now starts only once the room is full, and players are sent back to the room they are already in.',
			icon: 'mdi:account-multiple-check-outline'
		},
		{
			date: '2025-10-27',
			title: 'Tournament — Winner Mode + Spectator Roles',
			description: 'Introduced tournament mode with viewer and player-elimination roles.',
			icon: 'mdi:trophy-outline'
		},
		{
			date: '2025-10-30',
			title: 'Showdown — Card-Reveal Phase',
			description: 'Added a card-reveal phase that shows the hands before the showdown resolves.',
			icon: 'mdi:eye-outline'
		},
		{
			date: '2025-11-02',
			title: 'Viewers — Eliminated Players Watch On',
			description: 'Hid cards and action controls for eliminated players, who now stay at the table as viewers.',
			icon: 'mdi:eye-off-outline'
		},
		{
			date: '2025-11-15',
			title: 'Showdown — Real Cards + Hand Rankings',
			description: 'Showed the real showdown cards and hand rankings, and fixed hand-state sync between rounds.',
			icon: 'mdi:trophy-variant-outline'
		},
		{
			date: '2025-11-22',
			title: 'Odds — Hand-Strength Breakdown',
			description:
				'Added win, tie and lose breakdowns, expandable hand-type rows, and the best five-card hand to the prediction view.',
			icon: 'mdi:chart-box-outline'
		},
		{
			date: '2026-02-03',
			title: 'Scale-Out — Docker, Job Queue & Redis Realtime',
			description:
				'Re-architected for scale — a containerized webapp and worker on MongoDB with a BullMQ job queue, persisted game logs, and Redis-backed realtime with retries.',
			icon: 'simple-icons:redis',
			addedSkills: ['docker', 'bullmq', 'redis', 'mongodb'],
			removedSkills: ['prisma', 'postgresql']
		}
	]
}

export const floodProject: ProjectDef = {
	id: 'flood-project',
	accent: '#00F0FF',
	// Leaflet + Recharts lead: the map and the threshold charts ARE the product.
	highlightSkills: ['leaflet', 'recharts', 'prisma', 'nextauth', 'next-js', 'zod'],
	title: 'Flood Project',
	description:
		'A flood and water-level monitoring dashboard for tracking station gauges in real time. Field stations plot on an interactive, marker-clustered Leaflet map; each streams its current water level with historical area/line charts (Recharts) read against a flood threshold, and operators can export readings to CSV. Ships a full account system with role-based user management and an admin dashboard. Built with Next.js 15 (App Router, Turbopack), React 19, and TypeScript on a Prisma data layer, with Tailwind + shadcn/ui, react-hook-form + Zod forms, and NextAuth (bcrypt) auth. Delivered as a focused freelance build.',
	resumeSummary:
		'Real-time flood / water-level monitoring dashboard — interactive station map, historical charts, CSV export, and role-based accounts. A freelance build on Next.js, Prisma, Leaflet, and Recharts.',
	images: { cover: assets.projects.floodProject.cover, photos: [] },
	// Starting stack — auth, mapping, DB, and charts arrive via the timeline events below.
	skills: ['next-js', 'react', 'typescript', 'tailwind-css', 'shadcn-ui'],
	links: {},
	startDate: '2025-02-06',
	endDate: '2025-02-19',
	linkedExperienceIds: ['freelance'],
	timeline: [
		{
			date: '2025-02-06',
			title: 'Kickoff — Next.js scaffold & shell',
			description: 'Set up the project on Next.js with Tailwind, a global theme, and the app navigation shell.',
			icon: 'mdi:rocket-launch-outline'
		},
		{
			date: '2025-02-07',
			title: 'Auth — Accounts & role-based access',
			description:
				'Added a NextAuth account system with bcrypt-hashed credentials and react-hook-form + Zod validated sign-in.',
			icon: 'mdi:account-key-outline',
			addedSkills: ['nextauth', 'react-hook-form', 'zod']
		},
		{
			date: '2025-02-08',
			title: 'Stations — Leaflet map & data schema',
			description:
				'Built the interactive station map with marker clustering, modelled the readings in Prisma, and surfaced live water levels.',
			icon: 'mdi:map-marker-radius-outline',
			addedSkills: ['leaflet', 'prisma']
		},
		{
			date: '2025-02-10',
			title: 'Charts & export — area charts + CSV',
			description:
				'Reworked the readings API and swapped line charts for area charts (Recharts), added CSV export, and shipped the operator dashboard with toasts.',
			icon: 'mdi:chart-areaspline',
			addedSkills: ['recharts']
		},
		{
			date: '2025-02-13',
			title: 'Operators — user management & UX polish',
			description: 'Added role-based user management for operators and a round of UX/UI refinement.',
			icon: 'mdi:account-group-outline'
		},
		{
			date: '2025-02-17',
			title: 'History — water-level history page',
			description: 'Added a water-history page where each gauge reading can be viewed over time.',
			icon: 'mdi:history'
		},
		{
			date: '2025-02-19',
			title: 'Schema — river-gauge API, admin form & types',
			description: 'Finalized the river-gauge schema with its API routes, admin form and shared types.',
			icon: 'mdi:database-check-outline'
		}
	]
}

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

export const rsMedal: ProjectDef = {
	id: 'rs-medal',
	accent: '#8AD8FF',
	// Thin by nature — no DB, no auth. Next.js remake + structured data was the honest story.
	highlightSkills: ['next-js', 'json-ld', 'seo', 'vercel', 'react'],
	title: 'RS Medal',
	description:
		'A medal showcase and catalog web app — first built on WordPress, later remade as a localized Next.js application with structured data and a reusable product data model. Retired in May 2026, when its catalog moved into RS TROPHY.',
	images: { cover: assets.projects.rsMedal.cover, photos: [...assets.projects.rsMedal.gallery] },
	// Starting stack (2022 WordPress). The Next.js remake — and WordPress's retirement — are events.
	skills: ['wordpress', 'seo', 'google-ads'],
	// No link: rs-medal.com now 308s to rs-trophy.com/medal, a different product. Without
	// it the derived status reads "Archived", which is what the sunset milestone records.
	links: {},
	startDate: '2022-08-01',
	endDate: '2026-05-13',
	linkedExperienceIds: ['ruamsuk-software-engineer-part-time', 'ruamsuk-software-engineer-full-time'],
	timeline: [
		{
			date: '2022-08-01',
			title: 'Discovery & Setup — WordPress Foundation',
			description: 'Scoped the catalog and stood up the WordPress foundation — hosting, theme base, and plugin stack.',
			icon: 'simple-icons:wordpress'
		},
		{
			date: '2022-09-01',
			title: 'Design — Brand-Aligned Catalog Theme',
			description: 'Designed a brand-aligned theme and information architecture for the medal catalog.',
			icon: 'mdi:palette-outline'
		},
		{
			date: '2022-10-01',
			title: 'Development — Catalog & CMS Content',
			description: 'Built out the product catalog, content pages, and CMS workflows.',
			icon: 'mdi:hammer-screwdriver'
		},
		{
			date: '2022-11-01',
			title: 'Launch — SEO, Analytics & Go-Live',
			description: 'Went live with on-page SEO, analytics, and ad tracking wired in.',
			icon: 'mdi:rocket-launch-outline'
		},
		{
			date: '2025-05-30',
			title: 'Next.js Remake — Localized Storefront Foundation',
			description:
				'Began the ground-up Next.js remake — a localized, statically-optimized showcase replacing the WordPress build.',
			icon: 'simple-icons:nextdotjs',
			addedSkills: ['next-js', 'react', 'tailwind-css', 'shadcn-ui', 'vercel', 'google-tag-manager'],
			removedSkills: ['wordpress']
		},
		{
			date: '2025-06-06',
			title: 'Content & SEO — Blog System + JSON-LD',
			description: 'Added a blog system with structured data (JSON-LD), sitemap, and SEO fixes.',
			icon: 'mdi:post-outline',
			addedSkills: ['json-ld']
		},
		{
			date: '2025-06-23',
			title: 'Catalog — Product Landing Pages + Reusable Data',
			description: 'Shipped product landing pages with a reusable product data model and customer-logo carousel.',
			icon: 'mdi:view-grid-outline'
		},
		{
			date: '2026-02-25',
			title: 'Redesign — UI Overhaul + WebP Optimization',
			description: 'Refreshed the UI design and moved imagery to WebP for faster loads.',
			icon: 'mdi:palette-swatch-outline'
		},
		{
			date: '2026-05-13',
			title: 'Sunset — Catalog Folded into RS TROPHY',
			description:
				'Products and photos imported into rs-trophy.com; rs-medal.com now permanently redirects to its medal category.',
			icon: 'mdi:call-merge'
		}
	]
}

export const rsAward: ProjectDef = {
	id: 'rs-award',
	accent: '#FFB020',
	// The Next.js remake was its last identity; SEO/AEO structured data is the differentiator.
	highlightSkills: ['next-js', 'mongodb', 'aeo', 'json-ld', 'seo', 'vercel'],
	title: 'RS Award',
	description:
		'A plaque and award showcase web app — first built on WordPress, later remade as a localized Next.js application with SEO/AEO structured data and client-side search. Retired in May 2026, when its catalog moved into RS TROPHY.',
	images: { cover: assets.projects.rsAward.cover, photos: [...assets.projects.rsAward.gallery] },
	// Starting stack (2022 WordPress). The Next.js remake, the Prisma/Postgres → MongoDB migration,
	// and WordPress's retirement are all recorded as timeline events below.
	skills: ['wordpress', 'seo', 'google-ads'],
	// No link: rs-award.com now 308s to rs-trophy.com/plaque, a different product. Without
	// it the derived status reads "Archived", which is what the sunset milestone records.
	links: {},
	startDate: '2022-03-01',
	endDate: '2026-05-13',
	linkedExperienceIds: ['ruamsuk-software-engineer-part-time', 'ruamsuk-software-engineer-full-time'],
	timeline: [
		{
			date: '2022-03-01',
			title: 'Discovery & Setup — WordPress Foundation',
			description: 'Scoped the plaque and award catalog and stood up the WordPress foundation.',
			icon: 'simple-icons:wordpress'
		},
		{
			date: '2022-04-01',
			title: 'Design — Brand-Aligned Showcase Theme',
			description: 'Designed a brand-aligned showcase theme and site structure.',
			icon: 'mdi:palette-outline'
		},
		{
			date: '2022-05-01',
			title: 'Development — Catalog & CMS Content',
			description: 'Built the award catalog, content pages, and CMS workflows.',
			icon: 'mdi:hammer-screwdriver'
		},
		{
			date: '2022-06-01',
			title: 'Launch — SEO, Analytics & Go-Live',
			description: 'Went live with on-page SEO, analytics, and ad tracking.',
			icon: 'mdi:rocket-launch-outline'
		},
		{
			date: '2025-12-04',
			title: 'Next.js Remake — Foundation + SEO',
			description:
				'Kicked off the Next.js remake with SEO metadata, structured data, robots, and sitemap from day one.',
			icon: 'simple-icons:nextdotjs',
			addedSkills: [
				'next-js',
				'react',
				'tailwind-css',
				'shadcn-ui',
				'vercel',
				'prisma',
				'postgresql',
				'google-tag-manager'
			],
			removedSkills: ['wordpress']
		},
		{
			date: '2026-01-28',
			title: 'Data — Prisma/Postgres → MongoDB',
			description: 'Migrated the data layer from Prisma/Postgres to MongoDB mid-build.',
			icon: 'simple-icons:mongodb',
			addedSkills: ['mongodb'],
			removedSkills: ['prisma', 'postgresql']
		},
		{
			date: '2026-01-30',
			title: 'Design — New Design System + Thai Localization',
			description: 'Adopted a new design system with motion primitives and localized the UI to Thai.',
			icon: 'mdi:palette-swatch-outline'
		},
		{
			date: '2026-02-10',
			title: 'SEO/AEO — Product Pages + Client-Side Search',
			description: 'Shipped product pages with SEO/AEO structured data, client-side search, and a Dockerized deploy.',
			icon: 'mdi:magnify',
			addedSkills: ['aeo', 'json-ld', 'docker']
		},
		{
			date: '2026-05-13',
			title: 'Sunset — Catalog Folded into RS TROPHY',
			description:
				'Products and photos imported into rs-trophy.com; rs-award.com now permanently redirects to its plaque category.',
			icon: 'mdi:call-merge'
		}
	]
}

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

export const monomaxEplPortal: ProjectDef = {
	id: 'monomax-epl-portal',
	accent: '#EE5E25', // sampled from monomax.me — orange-red logo
	// better-auth leads: "two isolated better-auth realms" is the sharpest architectural claim.
	highlightSkills: ['better-auth', 'mongodb', 'next-js', 'leaflet', 'docker', 'zod', 'aws-s3'],
	title: 'MONOMax EPL Licensing Portal',
	description:
		'A full-stack SaaS platform that issues and verifies English Premier League commercial-broadcast licenses for Thai venues — restaurants, hotels, and pubs. Business owners sign in with email OTP, register their company and each physical venue with its screen count, and the system provisions the required MONOMax Sports Premium accounts while guaranteeing — enforced at the database level — that every account is bound to a single active venue. Admins review submissions in a dedicated console with its own auth realm and issue a verifiable digital certificate, complete with an in-house-generated QR code, for each approved venue. Built with Next.js 16 (App Router) and React 19 in strict TypeScript: two isolated better-auth realms for users and admins, MongoDB/Mongoose, zod schemas validated identically on client and server with react-hook-form, an interactive Leaflet venue-map picker, presigned document uploads to S3-compatible object storage, transactional email, and Tailwind v4 with shadcn/ui. Containerized with Docker and shipped through a GitHub Actions → GHCR → cloud-VM (Caddy) CI/CD pipeline, with PDPA-conscious data residency. Delivered as a focused 3-day sprint.',
	resumeSummary:
		'Full-stack SaaS issuing & verifying English Premier League broadcast licenses for Thai venues — dual isolated auth realms, a geospatial venue model, and in-house QR e-certificates. Next.js 16 / MongoDB, Dockerized CI/CD. Built in a 3-day sprint.',
	images: {
		cover: assets.projects.monomaxEplPortal.cover,
		photos: [...assets.projects.monomaxEplPortal.gallery]
	},
	// Starting stack — the client's Firebase SPA + a NextAuth scaffold, both retired via events below.
	skills: [
		'next-js',
		'react',
		'mongodb',
		'zod',
		'react-hook-form',
		'tailwind-css',
		'shadcn-ui',
		'leaflet',
		'aws-s3',
		'mailgun',
		'recharts',
		'vitest',
		'docker',
		'firebase',
		'nextauth'
	],
	links: {},
	startDate: '2026-06-15',
	clientOrganizationId: 'monomax',
	viaOrganizationId: 'jas-tv',
	linkedExperienceIds: ['jasmine-tech'],
	timeline: [
		{
			date: '2026-06-15',
			title: 'Replatform — Firebase SPA → Next.js 16 Full-Stack',
			description:
				'Re-architected a client-built Firebase single-page prototype into a Next.js 16 App Router full-stack application in strict TypeScript.',
			icon: 'simple-icons:nextdotjs',
			removedSkills: ['firebase']
		},
		{
			date: '2026-06-15',
			title: 'CI/CD — GitHub Actions → GHCR → Dockerized Cloud VM',
			description:
				'Wired a config-as-code pipeline — GitHub Actions builds and pushes a Docker image to GHCR, then deploys to a cloud VM behind Caddy auto-HTTPS.',
			icon: 'simple-icons:githubactions'
		},
		{
			date: '2026-06-16',
			title: 'Auth — Two Isolated Realms, Email-OTP + 2FA',
			description:
				'Built two isolated authentication realms (customer and admin) with email-OTP sign-in and 2FA, moving off the initial NextAuth scaffold to better-auth.',
			icon: 'mdi:shield-key-outline',
			addedSkills: ['better-auth'],
			removedSkills: ['nextauth']
		},
		{
			date: '2026-06-16',
			title: 'Certificate Engine — Per-Venue Approval + Branded E-Cert Email',
			description:
				'Built the licensing-certificate engine — per-venue admin approval that issues a verifiable digital certificate, delivered by branded transactional email.',
			icon: 'mdi:certificate-outline'
		},
		{
			date: '2026-06-16',
			title: 'In-House QR Verification',
			description:
				'Replaced an external QR web service with in-house QR generation for tamper-checkable certificate verification.',
			icon: 'mdi:qrcode'
		},
		{
			date: '2026-06-16',
			title: 'Geospatial Data Model — GeoJSON Places + 2dsphere',
			description:
				'Modeled venues as GeoJSON points with a 2dsphere index and a database-enforced constraint binding each provisioned account to a single active venue.',
			icon: 'mdi:map-marker-radius-outline'
		},
		{
			date: '2026-06-17',
			title: 'Admin Command Center — Company-First Console + Excel Export',
			description:
				'Built a company-first admin command center with dashboards, paginated data tables, and styled Excel export.',
			icon: 'mdi:view-dashboard-outline'
		},
		{
			date: '2026-06-17',
			title: 'Data Migration — Historical Import Pipeline',
			description:
				'Built a historical data-migration pipeline — an offline transform step feeding a gated, previewed web import with change diffs.',
			icon: 'mdi:database-import-outline'
		},
		{
			date: '2026-07-03',
			title: 'Integration — Partner Account-Verification API',
			description:
				"Integrated the partner's commercial account-verification API with admin-side sync and reconciliation.",
			icon: 'mdi:api'
		},
		{
			date: '2026-07-04',
			title: 'Admin Export Wizard — Filters + Column Picker',
			description: 'Shipped an admin export wizard with custom filters and a column picker for tailored data exports.',
			icon: 'mdi:file-export-outline'
		}
	]
}

export const qrFood: ProjectDef = {
	id: 'qr-food',
	accent: '#39FF14',
	// Nuxt/Vue lead: the only project in the portfolio not built on React, so maximally identifying.
	highlightSkills: ['nuxt-js', 'vue', 'supabase', 'prisma', 'postgresql', 'vercel'],
	title: 'QR Food Platform',
	// The description opens with where it was built, so its first sentence alone says nothing about what it is.
	summary:
		'A Thammasat senior thesis: QR-code table ordering and multi-branch restaurant management, built to replace expensive POS hardware.',
	description:
		'A senior thesis project from Thammasat University. Developed a full-stack QR-code ordering and multi-branch restaurant management web application designed to streamline in-restaurant operations and eliminate expensive POS hardware. Key components include: (1) Customer Table Ordering: A Nuxt 3 web application enabling customers to scan table-specific QR codes, browse live menus, customize dishes with add-ons, add items to a real-time cart, and place orders directly from their mobile devices. Features integrated support for calling staff and live bill tracking. (2) Staff & Kitchen Portal: Features custom views for restaurant staff to take orders directly at the table, manage order queues, track preparation statuses, and process instant table closures with bill printing. (3) Multi-Branch Admin Console: An analytical dashboard for owners to manage multiple restaurant branches, configure custom staff roles (owner/staff), toggle menu item availability dynamically per branch, customize food sections and add-on options, and view real-time sales statistics. Built with Nuxt 3, Vue 3, Tailwind CSS, Prisma, and PostgreSQL (Supabase), containerized with Docker and deployed on Vercel.',
	resumeSummary:
		'Full-stack QR-code ordering and multi-branch restaurant management web application. Customers scan QR codes to order and call staff; staff manage table statuses and orders; owners manage branches and view analytics. Nuxt 3 / Vue 3 / Prisma / Supabase / PostgreSQL / Tailwind CSS on Vercel.',
	images: {
		cover: assets.projects.qrFood.cover,
		photos: [...assets.projects.qrFood.gallery]
	},
	skills: ['vue', 'nuxt-js', 'tailwind-css', 'prisma', 'supabase', 'postgresql', 'docker', 'vercel'],
	// No link: github.com/NooobtimeX/QR-Food is private (404s for visitors), and private
	// repos get no link. This also makes the derived status read "Archived", which is
	// correct for a thesis that was delivered and ended in Dec 2024.
	links: {},
	startDate: '2023-08-01',
	endDate: '2024-12-24',
	// A senior thesis — delivered under the degree, which is also why the freelance
	// role (Jan 2024–) cannot be its home: the project predates it by five months.
	linkedExperienceIds: ['thammasat-bs-cs'],
	timeline: [
		{
			date: '2023-08-01',
			title: 'Project Inception & Core Scoping',
			description:
				'Defined objectives to replace expensive restaurant POS hardware with QR-code ordering. Designed database schema in Prisma with PostgreSQL (Supabase).',
			icon: 'mdi:rocket-launch-outline'
		},
		{
			date: '2024-03-15',
			title: 'Phase 1: QR Ordering & Table Management',
			description:
				'Stood up the core Nuxt 3 application with table QR scanning, real-time menu rendering, staff authentication, order management, and a sales dashboard.',
			icon: 'mdi:qrcode-scan',
			addedSkills: ['nuxt-js', 'vue', 'tailwind-css', 'prisma', 'supabase', 'postgresql']
		},
		{
			date: '2024-08-10',
			title: 'Phase 2: Multi-Branch & Real-time Call Staff',
			description:
				'Introduced multi-branch architecture allowing dynamic menu toggles per location. Added real-time notification alerts for customer table calls and staff ordering.',
			icon: 'mdi:storefront-outline'
		},
		{
			date: '2024-12-24',
			title: 'Final Defense & Thesis Submission',
			description:
				'Successfully completed the final defense of the thesis project at Thammasat University, presenting a 38-endpoint system running on Vercel.',
			icon: 'mdi:school-outline',
			addedSkills: ['vercel']
		}
	]
}

const defs: ProjectDef[] = [
	wangpa,
	monomaxEplPortal,
	rsTrophy,
	looklookPet,
	onlinePokerGame,
	floodProject,
	prettierConfig,
	rsAward,
	rsMedal,
	portfolio,
	qrFood
]

/**
 * Event-source each project's skills: fold the timeline (oldest→newest) over the starting stack +
 * common tooling to derive the currently-active set; the full roster is the union of everything ever
 * used (start + tooling + every add/remove); retired = roster − active. Milestone id deltas are
 * resolved to Skill objects for the timeline UI.
 */
const resolveProject = (d: ProjectDef): Project => {
	const events = [...(d.timeline ?? [])].sort((a, b) => a.date.localeCompare(b.date))
	// Union roster in first-appearance order: starting stack, then timeline deltas, then tooling.
	const roster: SkillId[] = []
	const seen = new Set<SkillId>()
	const see = (id: SkillId) => {
		if (!seen.has(id)) {
			seen.add(id)
			roster.push(id)
		}
	}
	d.skills.forEach(see)
	for (const m of events) {
		m.addedSkills?.forEach(see)
		m.removedSkills?.forEach(see)
	}
	commonTooling.forEach(see)
	// Active = starting stack + tooling, folded through the timeline's adds/removes.
	const active = new Set<SkillId>([...d.skills, ...commonTooling])
	for (const m of events) {
		m.addedSkills?.forEach(id => active.add(id))
		m.removedSkills?.forEach(id => active.delete(id))
	}
	const toSkill = (id: SkillId) => skillById[id]

	// Fail loudly on a highlight that isn't actually active. `SkillId` already catches
	// typos; what it can't catch is naming a RETIRED skill (e.g. 'nats' on looklook-pet),
	// which is a perfectly valid id that would silently rank nothing.
	const highlights = d.highlightSkills ?? []
	for (const id of highlights) {
		if (!active.has(id)) {
			throw new Error(
				`[projects] "${d.id}" highlights "${id}", which is not in its active stack. `
					+ `Highlight only active skills — retired ones cannot lead the loadout.`
			)
		}
	}

	/**
	 * Display order, three tiers: highlighted signature tech first (in the order authored),
	 * then the rest of the real stack, then `commonTooling` last. Ties keep roster order, so
	 * the sort is stable and predictable.
	 *
	 * A highlight outranks the tooling demotion — that is what lets `portfolio` lead with
	 * Tailwind, where a custom v4 design system genuinely IS the product, while Tailwind
	 * stays demoted everywhere else.
	 */
	const rank = (id: SkillId): number => {
		const highlighted = highlights.indexOf(id)
		if (highlighted !== -1) return highlighted
		return commonTooling.includes(id) ? 2_000_000 : 1_000_000
	}
	const forDisplay = (ids: SkillId[]) =>
		ids
			.map((id, i) => ({ id, i }))
			.sort((a, b) => rank(a.id) - rank(b.id) || a.i - b.i)
			.map(e => e.id)

	return {
		...d,
		skills: roster.map(toSkill),
		// Sorted for display; `skills` above stays in first-appearance (historical) order.
		activeSkills: forDisplay(roster.filter(id => active.has(id))).map(toSkill),
		retiredSkills: roster.filter(id => !active.has(id)).map(toSkill),
		timeline: d.timeline?.map(m => ({
			...m,
			addedSkills: m.addedSkills?.map(toSkill),
			removedSkills: m.removedSkills?.map(toSkill)
		}))
	}
}

// Resolve each project, then sort newest first.
export const projectsData: Project[] = defs.map(resolveProject).sort(sortByDateDesc)

/** Hand-picked projects for the home page (in this order). Edit to curate. */
const featuredProjectIds = ['wangpa', 'monomax-epl-portal', 'rs-trophy', 'looklook-pet']
export const featuredProjects: Project[] = featuredProjectIds
	.map(id => projectsData.find(p => p.id === id))
	.filter((p): p is Project => Boolean(p))
