import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

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
