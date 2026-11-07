import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

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
