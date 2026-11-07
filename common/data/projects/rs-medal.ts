import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

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
