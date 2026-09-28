import type { SkillCategory } from '../enums'
import type { Skill } from '../interfaces'

// --- Category metadata (label + icon only) ---

export const categoryMetadata: Record<SkillCategory, { label: string; icon: string; description: string }> = {
	'frontend': {
		label: 'Frontend',
		icon: 'material-symbols:laptop-chromebook',
		description:
			'Interfaces built on the React and Next.js App Router, typed end to end and styled with Tailwind on top of headless primitives. Covers the whole surface a product needs: forms and validation, data fetching and caching, charts, maps, editors and carousels — plus the tooling that keeps a codebase consistent as it grows.'
	},
	'backend': {
		label: 'Backend',
		icon: 'material-symbols:database',
		description:
			'Services and data, from a single Next.js route handler up to 15+ NestJS microservices talking over NATS. Relational and document stores with typed access layers, background queues, caching, real-time transport, schema validation, and the authentication and payment integrations that production systems actually run on.'
	},
	'infrastructure': {
		label: 'Infrastructure',
		icon: 'material-symbols:cloud',
		description:
			'Getting it deployed and keeping it up. Containerized services on managed platforms with CI/CD from GitHub, object storage and CDN, transactional email, payments and search — chosen for what a small team can run reliably rather than for what scales on paper.'
	},
	'growth-management': {
		label: 'Growth & Management',
		icon: 'material-symbols:trending-up',
		description:
			'The half of the work that decides whether anything gets found or used: search and answer-engine optimization, structured data, analytics and tag management, paid acquisition, and the commerce platforms behind the storefronts. Paired with product ownership — roadmaps, specs and design — where the role calls for it.'
	}
}

/** Identity helper that preserves the literal `id` so SkillId can be derived. */
const skill = <const T extends Skill>(s: T): T => s

// --- Frontend ---
const nextjs = skill({
	id: 'next-js',
	description:
		'The React framework this site and most of the product work is built on. App Router, server components and file-based routing, with static prerendering and streaming handled by the framework rather than by hand.',
	name: 'Next.js',
	icon: 'logos:nextjs-icon',
	category: 'frontend'
})
const react = skill({
	id: 'react',
	description:
		'The component model underneath nearly everything on this list. Declarative UI built from composable functions, with hooks for state and effects.',
	name: 'React',
	icon: 'logos:react',
	category: 'frontend'
})
const typescript = skill({
	id: 'typescript',
	description:
		'JavaScript with a static type system. Used strictly here — the build is the type-check gate, so a type error fails the deploy rather than reaching production.',
	name: 'TypeScript',
	icon: 'logos:typescript-icon',
	category: 'frontend'
})
const tailwindcss = skill({
	id: 'tailwind-css',
	description:
		'Utility-first CSS. Styles live next to the markup they apply to, which keeps the design system in the components instead of in a stylesheet that drifts from them.',
	name: 'Tailwind CSS',
	icon: 'logos:tailwindcss-icon',
	category: 'frontend'
})
const shadcnui = skill({
	id: 'shadcn-ui',
	description:
		'Accessible component recipes copied into the codebase rather than installed as a dependency — so each one can be restyled to fit a theme instead of fought with.',
	name: 'Shadcn/ui',
	icon: 'simple-icons:shadcnui',
	category: 'frontend'
})
const radixui = skill({
	id: 'radix-ui',
	description:
		'Unstyled, accessible primitives for the hard parts of UI: dialogs, popovers, menus. Handles focus trapping and keyboard behaviour, leaves appearance entirely open.',
	name: 'Radix UI',
	icon: 'simple-icons:radixui',
	category: 'frontend'
})
const baseui = skill({
	id: 'base-ui',
	description:
		'The successor library from the Radix and MUI teams. Same headless, accessibility-first idea, newer API — what the components in this site are built on.',
	name: 'Base UI',
	icon: 'mdi:cube-outline',
	category: 'frontend'
})
const emblaCarousel = skill({
	id: 'embla-carousel',
	description:
		'A small, dependency-free carousel engine. Physics-based dragging with no imposed styling, which is why it survives a heavily themed design system.',
	name: 'Embla Carousel',
	icon: 'carbon:carousel-horizontal',
	category: 'frontend'
})
const tanstackQuery = skill({
	id: 'tanstack-query',
	description:
		'Async state management for server data: caching, background refetching, and request deduplication, so components ask for data instead of orchestrating fetches.',
	name: 'TanStack Query',
	icon: 'logos:react-query-icon',
	category: 'frontend'
})
// Simple Icons has no Recharts logo, so this uses a generic chart glyph. The old
// 'simple-icons:recharts' resolved to nothing and rendered blank everywhere.
const recharts = skill({
	id: 'recharts',
	description:
		'Composable charting built on React and D3. Charts are assembled from components, which keeps them themeable rather than configured through one large options object.',
	name: 'Recharts',
	icon: 'mdi:chart-line',
	category: 'frontend'
})
const flutter = skill({
	id: 'flutter',
	description:
		"Google's cross-platform UI toolkit. One Dart codebase compiled to native mobile builds, with its own rendering engine rather than platform widgets.",
	name: 'Flutter',
	icon: 'logos:flutter',
	category: 'frontend'
})
const reactNative = skill({
	id: 'react-native',
	description:
		"React's component model rendering to real native views on iOS and Android instead of the DOM. The same components and hooks, with platform widgets underneath.",
	name: 'React Native',
	icon: 'skill-icons:react-dark',
	category: 'frontend'
})
const expo = skill({
	id: 'expo',
	description:
		'The framework and toolchain around React Native: file-based routing, a curated SDK of native modules, and cloud builds for iOS and Android from one TypeScript codebase.',
	name: 'Expo',
	icon: 'logos:expo-icon',
	category: 'frontend',
	whiteBg: true
})
const prettier = skill({
	id: 'prettier',
	description:
		'The opinionated formatter that ends formatting arguments. Runs across this repo on every lint, and is the subject of prettier-config.dev.',
	name: 'Prettier',
	icon: 'logos:prettier',
	category: 'frontend'
})
const codemirror = skill({
	id: 'codemirror',
	description:
		'An extensible code editor for the browser. Syntax highlighting, editing state and extensions — the editing surface behind the live Prettier playground.',
	name: 'CodeMirror',
	icon: 'simple-icons:codemirror',
	category: 'frontend'
})
const reactHookForm = skill({
	id: 'react-hook-form',
	description:
		'Form state built on uncontrolled inputs, so typing does not re-render the whole form. Pairs with a schema validator for typed, validated submissions.',
	name: 'React Hook Form',
	icon: 'simple-icons:reacthookform',
	category: 'frontend'
})
const leaflet = skill({
	id: 'leaflet',
	description:
		'The lightweight mapping library for interactive maps and tile layers — the station map in the flood monitoring dashboard.',
	name: 'Leaflet',
	icon: 'simple-icons:leaflet',
	category: 'frontend'
})
const vitest = skill({
	id: 'vitest',
	description:
		'A Vite-native test runner. Fast, ESM-first, and API-compatible enough with Jest that assertions and mocks carry over.',
	name: 'Vitest',
	icon: 'logos:vitest',
	category: 'frontend'
})
const eslint = skill({
	id: 'eslint',
	description:
		'Static analysis that catches the bugs types cannot: unused code, unsafe patterns, and the framework rules that only matter at runtime.',
	name: 'ESLint',
	icon: 'logos:eslint',
	category: 'frontend'
})
const vue = skill({
	id: 'vue',
	description:
		'A progressive frontend framework with a reactivity system and single-file components — an alternative component model to React, used where a project already lived there.',
	name: 'Vue.js',
	icon: 'logos:vue',
	category: 'frontend'
})
const nuxtjs = skill({
	id: 'nuxt-js',
	description:
		'The full-stack framework for Vue: routing, server rendering and data fetching, filling the role Next.js fills for React.',
	name: 'Nuxt.js',
	icon: 'logos:nuxt-icon',
	category: 'frontend'
})

// --- Backend ---
const nodejs = skill({
	id: 'node-js',
	description:
		'The JavaScript runtime that lets the same language run on the server. The base most of the backend work here sits on.',
	name: 'Node.js',
	icon: 'logos:nodejs-icon',
	category: 'backend'
})
const nestjs = skill({
	id: 'nest-js',
	description:
		'An opinionated Node framework with dependency injection and a module system. The structure behind the 15+ microservices on the LOOKLOOK PET platform.',
	name: 'Nest.js',
	icon: 'logos:nestjs',
	category: 'backend'
})
const nats = skill({
	id: 'nats',
	description:
		'A lightweight messaging system for service-to-service communication — publish/subscribe and request/reply, the transport those microservices talk over.',
	name: 'NATS',
	icon: 'logos:nats-icon',
	category: 'backend'
})
// The real Elysia fox mark. `logos` has no Elysia entry, so this comes from `skill-icons`,
// whose '-dark' variant is the light-fox-on-dark treatment the official branding uses —
// the '-light' variant inverts it to a cream tile. Was a generic `flash-on` bolt.
const elysia = skill({
	id: 'elysia-js',
	description:
		'A Bun-first HTTP framework built for speed, with end-to-end type inference from route definition through to the client.',
	name: 'Elysia.js',
	icon: 'skill-icons:elysia-dark',
	category: 'backend'
})
const sse = skill({
	id: 'sse',
	description:
		'Server-Sent Events — a one-way stream from server to browser over plain HTTP. Simpler than WebSockets when only the server needs to push.',
	name: 'SSE',
	icon: 'material-symbols:stream',
	category: 'backend'
})
const websocket = skill({
	id: 'websocket',
	description:
		'A persistent, two-way connection between client and server over a single socket. Where SSE only lets the server push, both sides can send at any time.',
	name: 'WebSocket',
	icon: 'logos:websocket',
	category: 'backend',
	whiteBg: true
})
const bun = skill({
	id: 'bun-js',
	description:
		'A fast JavaScript runtime, bundler and package manager in one binary. Installs and builds this repo, though Node serves it in production.',
	name: 'Bun.js',
	icon: 'logos:bun',
	category: 'backend'
})
const postgresql = skill({
	id: 'postgresql',
	description:
		'The relational database of choice: transactional, strict about correctness, and capable well past the point most projects need.',
	name: 'PostgreSQL',
	icon: 'logos:postgresql',
	category: 'backend'
})
const mongodb = skill({
	id: 'mongodb',
	description:
		'A document database that stores JSON-like records, useful where the shape of the data is genuinely variable rather than merely unplanned.',
	name: 'MongoDB',
	icon: 'logos:mongodb-icon',
	category: 'backend'
})
const prisma = skill({
	id: 'prisma',
	description:
		'A typed ORM and migration tool. The schema generates the client, so the database shape and the TypeScript types cannot drift apart.',
	name: 'Prisma',
	icon: 'logos:prisma',
	category: 'backend',
	whiteBg: true
})
const redis = skill({
	id: 'redis',
	description:
		'An in-memory data store used for caching, sessions and rate limiting — and as the substrate a job queue runs on.',
	name: 'Redis',
	icon: 'logos:redis',
	category: 'backend'
})
const bullmq = skill({
	id: 'bullmq',
	description:
		'A Redis-backed job queue for background work: retries, scheduling and concurrency for anything that should not block a request.',
	name: 'BullMQ',
	icon: 'mdi:format-list-numbered',
	category: 'backend'
})
const medusa = skill({
	id: 'medusa',
	description:
		'An open-source, headless commerce engine. Modular Node building blocks for carts, orders and fulfilment instead of a monolithic storefront platform.',
	name: 'Medusa',
	icon: 'simple-icons:medusa',
	category: 'backend'
})
const zod = skill({
	id: 'zod',
	description:
		'Schema validation where the schema is the source of truth for the type. Validates untrusted input at the boundary and infers the TypeScript type from it.',
	name: 'Zod',
	icon: 'simple-icons:zod',
	category: 'backend'
})
const betterAuth = skill({
	id: 'better-auth',
	description:
		'A framework-agnostic authentication library for TypeScript — sessions, providers and account linking owned in your own database.',
	name: 'Better Auth',
	icon: 'material-symbols:shield-lock',
	category: 'backend'
})
const clerk = skill({
	id: 'clerk',
	description:
		'A managed authentication and user-management service, with prebuilt UI for sign-in, organizations and multi-factor.',
	name: 'Clerk',
	icon: 'simple-icons:clerk',
	category: 'backend'
})
const nextauth = skill({
	id: 'nextauth',
	description:
		'Authentication for Next.js, supporting OAuth providers, email links and credentials against your own database.',
	name: 'NextAuth',
	icon: 'simple-icons:auth0',
	category: 'backend'
})
const firebase = skill({
	id: 'firebase',
	description:
		"Google's app platform: hosted auth, realtime and document databases, storage and messaging behind one SDK.",
	name: 'Firebase',
	icon: 'logos:firebase',
	category: 'backend'
})
const supabase = skill({
	id: 'supabase',
	description:
		'An open-source Firebase alternative built on Postgres — auth, storage, realtime and generated APIs over a database you can still query directly.',
	name: 'Supabase',
	icon: 'logos:supabase-icon',
	category: 'backend'
})
const mercur = skill({
	id: 'mercur',
	description:
		'An open-source B2B and multi-vendor marketplace framework built on Medusa — the base of the LOOKLOOK PET marketplace.',
	name: 'Mercur',
	icon: 'material-symbols:storefront',
	category: 'backend'
})

// --- Infrastructure ---
const vercel = skill({
	id: 'vercel',
	description:
		'The hosting platform built by the Next.js team. Preview deployments per branch and edge delivery, closest to zero-config for a Next app.',
	name: 'Vercel',
	icon: 'logos:vercel-icon',
	category: 'infrastructure',
	whiteBg: true
})
const railway = skill({
	id: 'railway',
	description:
		'Container hosting with config-as-code and managed databases. What nooobtimex.me deploys to, built by Bun and served by Node.',
	name: 'Railway',
	icon: 'simple-icons:railway',
	category: 'infrastructure'
})
const docker = skill({
	id: 'docker',
	description:
		'Containerization — an application and its dependencies pinned into one image, so the thing that runs in production is the thing that was built.',
	name: 'Docker',
	icon: 'logos:docker-icon',
	category: 'infrastructure'
})
const render = skill({
	id: 'render',
	description:
		'A managed platform for web services, static sites and cron jobs, with builds straight from a Git repository.',
	name: 'Render',
	icon: 'simple-icons:render',
	category: 'infrastructure'
})
const tencentCloud = skill({
	id: 'tencent-cloud',
	description:
		"Tencent's cloud platform — compute, object storage and CDN, and the provider of choice for workloads that must perform inside mainland China.",
	name: 'Tencent Cloud',
	icon: 'simple-icons:tencentqq',
	category: 'infrastructure'
})
const circleci = skill({
	id: 'circleci',
	description:
		'A hosted CI/CD service that builds, tests and deploys on every push, with pipelines defined in the repository alongside the code.',
	name: 'CircleCI',
	icon: 'simple-icons:circleci',
	category: 'infrastructure'
})
const github = skill({
	id: 'git-github',
	description:
		'Version control and the collaboration layer on top of it: branches, pull requests, code review, and the Actions that run CI.',
	name: 'Git/GitHub',
	icon: 'logos:github-icon',
	category: 'infrastructure',
	whiteBg: true
})
const minio = skill({
	id: 'minio',
	description: 'Self-hosted, S3-compatible object storage. Same API as S3 on infrastructure you control.',
	name: 'MinIO',
	icon: 'simple-icons:minio',
	category: 'infrastructure'
})
const resend = skill({
	id: 'resend',
	description:
		'Transactional email built for developers, with templates authored as React components and delivery you can actually debug.',
	name: 'Resend',
	icon: 'simple-icons:resend',
	category: 'infrastructure'
})
const cloudflareR2 = skill({
	id: 'cloudflare-r2',
	description:
		'S3-compatible object storage with no egress fees — which is what makes it viable for serving media directly rather than only storing it.',
	name: 'Cloudflare R2',
	icon: 'simple-icons:cloudflare',
	category: 'infrastructure'
})
const awsS3 = skill({
	id: 'aws-s3',
	description:
		'The object storage service the rest of the industry is compatible with. Durable blob storage addressed over HTTP.',
	name: 'AWS S3',
	icon: 'logos:aws-s3',
	category: 'infrastructure'
})
const mailgun = skill({
	id: 'mailgun',
	description:
		'An email delivery API for transactional and bulk sending, with routing, validation and deliverability tooling.',
	name: 'Mailgun',
	icon: 'simple-icons:mailgun',
	category: 'infrastructure'
})
const omise = skill({
	id: 'omise',
	description:
		'A Southeast Asian payment gateway. Card tokenization and PromptPay QR — the rails behind the native checkout on LOOKLOOK PET.',
	name: 'Omise',
	icon: 'material-symbols:payments',
	category: 'infrastructure'
})
const algolia = skill({
	id: 'algolia',
	description:
		'Hosted search built for speed: typo tolerance, faceting and ranking that returns results as fast as someone can type.',
	name: 'Algolia',
	icon: 'logos:algolia',
	category: 'infrastructure'
})

// --- Growth & Management ---
const seo = skill({
	id: 'seo',
	description:
		'Search engine optimization — the technical side included. Crawlability, canonicals, structured data and internal linking, not keyword density.',
	name: 'SEO',
	icon: 'material-symbols:search',
	category: 'growth-management'
})
const aeo = skill({
	id: 'aeo',
	description:
		'Answer Engine Optimization: structuring a site so AI assistants can quote it accurately, which is increasingly where an answer is read rather than a link clicked.',
	name: 'AEO',
	icon: 'material-symbols:auto-awesome',
	category: 'growth-management'
})
const geo = skill({
	id: 'geo',
	description:
		'Generative Engine Optimization — shaping content so it survives being summarized by a model, with the claims and attribution intact.',
	name: 'GEO',
	icon: 'material-symbols:public',
	category: 'growth-management'
})
const jsonld = skill({
	id: 'json-ld',
	description:
		'The structured-data format search and answer engines actually parse. Declares what a page means — a person, a project, an organization — rather than how it looks.',
	name: 'JSON-LD',
	icon: 'material-symbols:data-object',
	category: 'growth-management'
})
const googleAnalytics = skill({
	id: 'google-analytics',
	description:
		'Behavioural analytics: where traffic comes from, what people do once they arrive, and which of that turns into anything.',
	name: 'Google Analytics',
	icon: 'logos:google-analytics',
	category: 'growth-management'
})
const googleAds = skill({
	id: 'google-ads',
	description:
		'Paid search and display advertising — keyword and audience targeting, bidding, and measuring whether the spend returned anything.',
	name: 'Google Ads',
	icon: 'logos:google-ads',
	category: 'growth-management'
})
const gtm = skill({
	id: 'google-tag-manager',
	description:
		'A tag container that lets analytics and marketing scripts be deployed and versioned without shipping a code change for each one.',
	name: 'Google Tag Manager',
	icon: 'logos:google-tag-manager',
	category: 'growth-management'
})
const wordpress = skill({
	id: 'wordpress',
	description:
		'The CMS a large share of the web still runs on. Relevant here as the platform the RS Trophy storefronts started on before being rebuilt.',
	name: 'WordPress',
	icon: 'simple-icons:wordpress',
	category: 'growth-management'
})
const woocommerce = skill({
	id: 'woocommerce',
	description:
		'The commerce layer for WordPress — products, carts, checkout and payments bolted onto a WordPress site.',
	name: 'WooCommerce',
	icon: 'simple-icons:woocommerce',
	category: 'growth-management'
})

// Display order (grouped by category). The literal tuple is what derives SkillId.
const allSkills = [
	// frontend
	nextjs,
	react,
	typescript,
	tailwindcss,
	shadcnui,
	radixui,
	baseui,
	emblaCarousel,
	tanstackQuery,
	recharts,
	flutter,
	reactNative,
	expo,
	prettier,
	codemirror,
	reactHookForm,
	leaflet,
	vitest,
	eslint,
	vue,
	nuxtjs,
	// backend
	nodejs,
	nestjs,
	nats,
	elysia,
	sse,
	websocket,
	bun,
	postgresql,
	mongodb,
	prisma,
	redis,
	bullmq,
	medusa,
	zod,
	betterAuth,
	clerk,
	nextauth,
	firebase,
	supabase,
	mercur,
	// infrastructure
	vercel,
	railway,
	docker,
	render,
	tencentCloud,
	circleci,
	github,
	minio,
	resend,
	cloudflareR2,
	awsS3,
	mailgun,
	omise,
	algolia,
	// growth & management
	seo,
	aeo,
	geo,
	jsonld,
	googleAnalytics,
	googleAds,
	gtm,
	wordpress,
	woocommerce
]

/** Every valid skill id — gives autocomplete + typo errors where projects list their skills. */
export type SkillId = (typeof allSkills)[number]['id']

export const skillsData: Skill[] = allSkills

/** Lookup a skill by id (used to resolve a project's skill ids). */
export const skillById = Object.fromEntries(skillsData.map(s => [s.id, s])) as Record<SkillId, Skill>

/** Hand-picked core stack (19), surfaced on the home page + CV. Edit this list to curate. */
export const featuredSkills: Skill[] = [
	// frontend
	typescript,
	nextjs,
	react,
	tailwindcss,
	shadcnui,
	radixui,
	// backend
	nodejs,
	nestjs,
	elysia,
	bun,
	nats,
	mongodb,
	postgresql,
	redis,
	// infrastructure
	docker,
	vercel,
	railway,
	github,
	cloudflareR2
]
