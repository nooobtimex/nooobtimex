import { assets } from './assets'

export const currentFocus = [
	{
		title: 'RS TROPHY',
		role: 'The family business · CTO',
		description:
			'Building and running the software behind our trophy business, from the storefront to the tools we use every day.',
		href: '/projects/rs-trophy',
		image: assets.logos.rsTrophy
	},
	{
		title: 'Thaibotic',
		role: 'Robotics · Co-founder',
		description:
			'Making a humanoid robot usable at real events, with control software and a Thai/English voice assistant.',
		href: '/projects/unitree-g1',
		image: assets.logos.thaibotic
	},
	{
		title: 'A Roblox game',
		role: 'Personal project · In progress',
		description: 'A game I’m building because I enjoy it. More to share when there’s something ready to show.'
	}
] as const

export const workStories: Record<string, { context: string; responsibility: string; outcome: string; status: string }> =
	{
		'rs-trophy': {
			context: 'Taking our family business from separate websites and manual workflows to a shared platform.',
			responsibility: 'I own the architecture, storefront, internal systems, and infrastructure.',
			outcome: 'A production storefront and connected business tools, built and maintained end to end.',
			status: 'Current work · CTO'
		},
		'unitree-g1': {
			context: 'A humanoid robot needs software people can operate at an event.',
			responsibility: 'I build the development workspace, show-control app, and bilingual voice assistant.',
			outcome: 'Simulation, offline controls, and voice interaction in one workspace. Development is ongoing.',
			status: 'Current work · In development'
		},
		'looklook-pet': {
			context: 'Connecting pet owners, business partners, and sellers across one platform.',
			responsibility: 'At JTS, I worked across the storefront, partner console, payments, and marketplace.',
			outcome: 'Delivered across web, mobile, and backend systems during my July 2025–July 2026 role.',
			status: 'Previous work · JTS'
		}
	}

export const heroModes = [
	{ id: 'systems', label: 'Systems', description: 'Apps, APIs, data — connected into one working system.' },
	{ id: 'robotics', label: 'Robotics', description: 'Unitree G1 — a 3D form study of the robot I work with.' },
	{ id: 'play', label: 'Play', description: 'Building on Roblox. Playing across PC, controller, phone, and tablet.' }
] as const
