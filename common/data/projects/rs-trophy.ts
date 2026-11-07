import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

export const rsTrophy: ProjectDef = {
	id: 'rs-trophy',
	accent: '#FCEE0A',
	// Bun leads: "Built as a Bun monorepo" is the organising idea, repeated three times.
	highlightSkills: ['bun-js', 'elysia-js', 'next-js', 'mongodb', 'cloudflare-r2', 'railway', 'redis', 'docker'],
	title: 'RS TROPHY',
	description:
		'The public storefront for custom trophies, plaques, and medals, and the shared platform behind it — consolidating fragmented sibling brands into one high-performance system. Built as a Bun monorepo: a localized, SEO-optimized Next.js storefront and a real-time ElysiaJS API that every app in the monorepo calls, sharing types through a common workspace package. Runs on MongoDB with Redis caching and Cloudflare R2 object storage, containerized with Docker and deployed on Railway — and ships an AI copilot for natural-language shopping assistance. The staff-facing RS TROPHY Admin console and the RS ESERVICE workspace run on the same API and are listed as projects of their own. The platform evolved from an original WordPress + WooCommerce storefront into this unified Bun monorepo.',
	resumeSummary:
		'Public e-commerce storefront and shared platform for a custom-awards manufacturer, consolidating fragmented brands into one Bun monorepo — SEO storefront, ElysiaJS API, and an AI shopping copilot. MongoDB / Redis on Railway.',
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
			date: '2026-11-03',
			title: 'Delivery — Staging Retired',
			description: 'Removed the staging environment, leaving develop → main as the delivery path.',
			icon: 'mdi:source-branch'
		}
	]
}
