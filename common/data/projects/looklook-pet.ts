import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

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
