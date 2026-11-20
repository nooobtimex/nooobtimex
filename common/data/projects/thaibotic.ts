import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

export const thaibotic: ProjectDef = {
	id: 'thaibotic',
	accent: '#2EC4B6', // Thaibotic's own teal ("zing"), sampled from its brand tokens
	// The customer-facing site: what a client reads and books through, so the web stack leads.
	highlightSkills: ['next-js', 'tailwind-css', 'seo', 'json-ld', 'railway'],
	title: 'Thaibotic — Robot Events Website',
	description:
		"The bilingual Thai/English website of Thaibotic, a venture that brings a Unitree G1 humanoid robot to events, exhibitions, universities and shoots. A client finds what the robot can do on a robots page with the full Unitree G1 EDU spec sheet, sees it on real jobs on the work pages — the clips and photos from the day, each job with its own page and share card — reads articles on planning an event with a robot and how the G1 models differ, and sends a date and venue through a contact form for a quotation. The robot's own footage plays on the home page, with every face blurred. Safety, privacy, terms and cookie pages are in both languages, and analytics load only after cookie consent.",
	resumeSummary:
		'Bilingual Thai/English website for a humanoid-robot events venture — a Unitree G1 spec page, real client jobs with clips and share cards, articles and a quote-request form. Next.js 16 on Railway.',
	images: { cover: assets.projects.thaibotic.cover, photos: [] },
	skills: ['next-js', 'react', 'tailwind-css', 'bun-js', 'seo', 'google-tag-manager', 'docker', 'railway'],
	// The public site (Railway's address until a domain is held); the repo is private.
	links: { live: 'https://synaploop.up.railway.app' },
	startDate: '2026-10-01',
	linkedExperienceIds: ['thaibotic-founder'],
	timeline: [
		{
			date: '2026-10-01',
			title: 'Launch — bilingual Thai/English site',
			description: 'Launched the site in Thai and English, each page on its own language path.',
			icon: 'mdi:translate'
		},
		{
			date: '2026-10-03',
			title: 'SEO — per-language metadata and share images',
			description: 'Gave every page metadata, share images and structured data in both languages.',
			icon: 'mdi:magnify',
			addedSkills: ['json-ld']
		},
		{
			date: '2026-10-05',
			title: 'Contact — quote requests by email',
			description:
				'Sent quote requests from the contact form by email, with clear sent and failed states and spam checks.',
			icon: 'mdi:email-fast-outline',
			addedSkills: ['resend']
		},
		{
			date: '2026-10-05',
			title: 'Robots — the Unitree G1 EDU spec sheet',
			description: 'Published the full Unitree G1 EDU spec sheet on the robots page.',
			icon: 'mdi:robot-outline'
		},
		{
			date: '2026-10-30',
			title: 'Redesign — a robot-only site with a phone menu',
			description: 'Redesigned the site around the robot, with a bottom-sheet menu on phones.',
			icon: 'mdi:palette-swatch-outline'
		},
		{
			date: '2026-11-05',
			title: 'Footage — the G1 on video',
			description: "Put the robot's own footage on the home page, with a pause button and every face blurred.",
			icon: 'mdi:video-outline'
		},
		{
			date: '2026-11-05',
			title: 'Rebuild — work, robots and articles',
			description: 'Rebuilt the site around three sections: real client jobs, the robots, and articles.',
			icon: 'mdi:newspaper-variant-outline'
		},
		{
			date: '2026-11-18',
			title: 'Work — a page and share card for every job',
			description: 'Gave every client job its own page with the event details and a share card.',
			icon: 'mdi:card-text-outline'
		},
		{
			date: '2026-11-20',
			title: 'Brand — Thaibotic (ไทยโบติก)',
			description: 'Renamed the venture and the site to Thaibotic, with a new mark in Thai and English.',
			icon: 'mdi:rename-outline'
		}
	]
}
