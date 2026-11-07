import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

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
