import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

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
