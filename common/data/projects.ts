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
		'A unified e-commerce and management platform for custom trophies, plaques, and medals — consolidating fragmented sibling brands into one high-performance system. Built as a Bun monorepo: a localized, SEO-optimized Next.js storefront, a real-time ElysiaJS API, and an admin console that share Mongoose schemas and types through a common workspace package. Runs on MongoDB with Redis caching and Cloudflare R2 object storage, containerized with Docker and deployed on Railway — and ships an AI copilot for natural-language shopping assistance. The platform evolved from an original WordPress + WooCommerce storefront into this unified Bun monorepo.',
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
				'docker',
				'railway',
				'tailwind-css',
				'shadcn-ui',
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
			date: '2026-06-04',
			title: 'Storage — MinIO → Cloudflare R2',
			description:
				'Migrated object storage from MinIO to Cloudflare R2 behind a provider-agnostic S3 layer, adding a streaming proxy and a separate private bucket for PII.',
			icon: 'simple-icons:cloudflare',
			addedSkills: ['cloudflare-r2'],
			removedSkills: ['minio']
		},
		{
			date: '2026-06-07',
			title: 'Type Safety — End-to-End Eden Treaty Data Layer',
			description:
				'Migrated the entire web and admin data layer to type-safe Eden Treaty against the ElysiaJS API, plus production hardening — fail-fast secrets, graceful shutdown, health checks, and rate limiting.',
			icon: 'simple-icons:typescript'
		},
		{
			date: '2026-06-10',
			title: 'Launch — Live in Production on Railway + Cloudflare',
			description:
				'Shipped the platform to production on Railway with Cloudflare, folding the canonical-domain redirector into the monorepo.',
			icon: 'simple-icons:railway'
		},
		{
			date: '2026-06-22',
			title: 'Social — Autopilot Multi-Channel Publishing Suite',
			description:
				'Built an autopilot social-media suite — OAuth channels for Facebook, Instagram, YouTube and TikTok, AI content generation with brand voice, a drag-to-schedule calendar, and engagement-metrics dashboards.',
			icon: 'mdi:bullhorn-outline'
		},
		{
			date: '2026-07-02',
			title: 'Search — Semantic Vector Search',
			description:
				'Added semantic vector search over product and article embeddings (BullMQ embed queues), wired into both the storefront AI chat and the admin assistant.',
			icon: 'mdi:database-search-outline'
		}
	]
}

export const onlinePokerGame: ProjectDef = {
	id: 'online-poker-game',
	accent: '#FF003C',
	// SSE leads: "featuring Server-Sent Events" is the description's distinguishing clause.
	highlightSkills: ['sse', 'next-js', 'postgresql', 'redis', 'prisma', 'bullmq'],
	title: 'Online Poker Game',
	description:
		'A real-time multiplayer online poker game featuring Server-Sent Events for live updates. Built with Next.js and PostgreSQL for a seamless, interactive card gaming experience.',
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
			date: '2025-07-05',
			title: 'Refactor — Modular Pot / Position / Betting Managers',
			description: 'Refactored the game engine into dedicated pot, position, and betting modules.',
			icon: 'mdi:cog-outline'
		},
		{
			date: '2025-08-05',
			title: 'Auth — Session-Based Authentication',
			description: 'Added session-based authentication for players and rooms.',
			icon: 'mdi:shield-key-outline'
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
			date: '2025-10-27',
			title: 'Tournament — Winner Mode + Spectator Roles',
			description:
				'Introduced tournament mode with viewer and player-elimination roles and a pre-showdown card-reveal phase.',
			icon: 'mdi:trophy-outline'
		},
		{
			date: '2026-02-03',
			title: 'Scale-Out — Docker, Job Queue & Redis Realtime',
			description:
				'Re-architected for scale — containerized deploy with a BullMQ job queue, persisted game logs, and Redis-backed realtime with retries.',
			icon: 'simple-icons:redis',
			addedSkills: ['docker', 'bullmq', 'redis']
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
			date: '2025-02-19',
			title: 'History — water-level history & schema finalize',
			description: 'Added the historical water-level view and finalized the data schema.',
			icon: 'mdi:history'
		}
	]
}

export const prettierConfig: ProjectDef = {
	id: 'prettier-config',
	accent: '#55B3B4', // Prettier's own teal, from the prettier-config.dev icon
	// CodeMirror leads: the editor is the app's main surface.
	highlightSkills: ['codemirror', 'next-js', 'base-ui', 'vercel', 'react'],
	title: 'Prettier Config',
	description:
		'The fastest way to build, share, and try a Prettier configuration — visually, in the browser. Runs the official prettier/standalone fully client-side for instant live formatting, with a CodeMirror 6 editor spanning JS/TS, CSS, HTML, JSON, Markdown, Vue, and more, plus shareable URL-encoded configs and i18n. Built on Next.js, React, TypeScript, and Tailwind CSS v4 with shadcn/ui on Base UI.',
	images: { cover: assets.projects.prettierConfig.cover, photos: [...assets.projects.prettierConfig.gallery] },
	// Starting stack — the UI libraries, editor, and analytics are introduced via timeline events.
	skills: ['next-js', 'react', 'tailwind-css', 'vercel'],
	links: { live: 'https://prettier-config.dev' },
	startDate: '2025-07-09',
	linkedExperienceIds: ['freelance'],
	timeline: [
		{
			date: '2025-05-09',
			title: 'Foundation — Next.js Config Playground',
			description: 'Laid the Next.js foundation for a browser-based Prettier configuration builder.',
			icon: 'simple-icons:prettier'
		},
		{
			date: '2025-08-24',
			title: 'i18n — Internationalization Introduced',
			description: 'Introduced internationalization with locale-aware routing.',
			icon: 'mdi:translate'
		},
		{
			date: '2025-09-06',
			title: 'Launch — prettier-config.dev',
			description: 'Settled on the prettier-config.dev domain with centralized metadata and lint tooling.',
			icon: 'mdi:web',
			addedSkills: ['google-tag-manager']
		},
		{
			date: '2026-01-09',
			title: 'Rebuild — Metadata-Driven Config Generator',
			description: 'Rebuilt the UI around an option-metadata-driven config generator.',
			icon: 'mdi:cog-outline',
			addedSkills: ['shadcn-ui', 'base-ui']
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
			date: '2026-05-29',
			title: 'Editor — Multi-Parser CodeMirror + Shareable URLs',
			description:
				'Shipped a multi-parser CodeMirror editor with URL-encoded shareable configs and existing-config import.',
			icon: 'simple-icons:codemirror',
			addedSkills: ['codemirror']
		},
		{
			date: '2026-05-30',
			title: 'Extensibility — Presets + Third-Party Plugins',
			description: 'Added one-click preset configs and a third-party plugin system.',
			icon: 'mdi:puzzle-outline'
		}
	]
}

export const rsMedal: ProjectDef = {
	id: 'rs-medal',
	accent: '#8AD8FF',
	// Thin by nature — no DB, no auth. Next.js remake + structured data is the honest story.
	highlightSkills: ['next-js', 'json-ld', 'seo', 'vercel', 'react'],
	title: 'RS Medal',
	description:
		'A medal showcase and catalog web app — first built on WordPress, later remade as a localized Next.js application with structured data and a reusable product data model.',
	images: { cover: assets.projects.rsMedal.cover, photos: [...assets.projects.rsMedal.gallery] },
	// Starting stack (2022 WordPress). The Next.js remake — and WordPress's retirement — are events.
	skills: ['wordpress', 'seo', 'google-ads'],
	links: { live: 'https://www.rs-medal.com' },
	startDate: '2022-08-01',
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
		}
	]
}

export const rsAward: ProjectDef = {
	id: 'rs-award',
	accent: '#FFB020',
	// The Next.js remake is the current identity; SEO/AEO structured data is the differentiator.
	highlightSkills: ['next-js', 'mongodb', 'aeo', 'json-ld', 'seo', 'vercel'],
	title: 'RS Award',
	description:
		'A plaque and award showcase web app — first built on WordPress, later remade as a localized Next.js application with SEO/AEO structured data and client-side search.',
	images: { cover: assets.projects.rsAward.cover, photos: [...assets.projects.rsAward.gallery] },
	// Starting stack (2022 WordPress). The Next.js remake, the Prisma/Postgres → MongoDB migration,
	// and WordPress's retirement are all recorded as timeline events below.
	skills: ['wordpress', 'seo', 'google-ads'],
	links: { live: 'https://www.rs-award.com' },
	startDate: '2022-03-01',
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
		}
	]
}

export const portfolio: ProjectDef = {
	id: 'portfolio',
	accent: '#FCEE0A',
	// Tailwind at #2 is deliberate: "a fully custom Tailwind v4 design system" is the product
	// here, so the highlight overrides the usual demotion of Tailwind as generic scaffolding.
	highlightSkills: ['next-js', 'tailwind-css', 'base-ui', 'shadcn-ui', 'bun-js', 'embla-carousel', 'railway'],
	title: '🚀 Portfolio – Wongsaphat Puangsorn',
	description:
		'This site — a Cyberpunk 2077–inspired portfolio built on Next.js (App Router, Turbopack) with a fully custom Tailwind v4 design system and shadcn/ui on Base UI. Features a ⌘K command palette, a gig-board project journal, a vertical career-trace timeline, and a print-ready CV with a slide-presentation mode. Deployed on Railway.',
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
			addedSkills: ['react', 'shadcn-ui', 'bun-js', 'railway']
		},
		{
			date: '2026-03-25',
			title: 'Content — CV, Global Search & Presentation Mode',
			description: 'Shipped a print-ready CV page, site-wide command-palette search, and a slide-presentation mode.',
			icon: 'mdi:file-document-outline',
			addedSkills: ['aeo', 'geo', 'json-ld', 'google-tag-manager']
		},
		{
			date: '2026-04-09',
			title: 'Revamp — Home UI + Component-Library Migration',
			description: 'Revamped the home page and migrated the UI onto a headless component library.',
			icon: 'mdi:home-outline',
			addedSkills: ['base-ui']
		},
		{
			date: '2026-06-08',
			title: 'Redesign — Cyberpunk Design System',
			description:
				'Rebuilt the entire site on a custom Cyberpunk 2077–inspired design system — neon signal colors, notched HUD panels, glitch and scanline accents.',
			icon: 'mdi:palette-outline',
			addedSkills: ['embla-carousel']
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
			date: '2026-06-12',
			title: 'Tooling — Self-Owned SVG README Generator',
			description:
				'Replaced third-party badge services with a self-owned SVG asset generator, refreshed on a scheduled CI cron.',
			icon: 'mdi:cog-outline'
		},
		{
			date: '2026-07-12',
			title: 'Feature — Per-Project Milestone Timelines',
			description: 'Shipped a reusable milestone-timeline component so every project can tell its build story.',
			icon: 'mdi:timeline-check-outline'
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
const featuredProjectIds = ['monomax-epl-portal', 'rs-trophy', 'looklook-pet']
export const featuredProjects: Project[] = featuredProjectIds
	.map(id => projectsData.find(p => p.id === id))
	.filter((p): p is Project => Boolean(p))
