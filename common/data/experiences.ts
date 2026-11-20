import type { ExperienceItem } from '../interfaces'
import { sortByDateDesc } from '../utils'
import { freelance, jasmineTechnologySolution, ruamsukPlating, thaibotic, thammasatUniversity } from './entities'

// --- Roles ---

export const freelanceExperience: ExperienceItem = {
	id: 'freelance',
	organization: freelance,
	position: 'developer',
	description:
		'Remote freelance software engineering — building web and mobile apps end-to-end, from scoping and design through full-stack delivery and deployment. Recent freelance builds include ว่างป่ะ (Wangpa, a LINE-first group scheduling app, in development), a flood / water-level monitoring dashboard (interactive station map, historical charts, CSV export, and role-based accounts), a real-time multiplayer game, and a QR-code restaurant ordering & multi-branch management platform. Open to select freelance web-app projects alongside my full-time role.',
	type: 'freelance',
	category: 'work',
	startDate: '2024-01-01'
}

export const jasmineTechnologySolutionExperience: ExperienceItem = {
	id: 'jasmine-tech',
	organization: jasmineTechnologySolution,
	position: 'developer',
	description:
		'Full-Stack Platform Ownership: Led full-stack development of the LOOKLOOK PET platform across storefront, B2B partner console, and Medusa-based Mercur marketplace. Microservices & Checkout: Managed 15+ NestJS microservices communicating over NATS, and built a custom native payment UI featuring client-side Omise card tokenization, inline PromptPay QR polling, and card-lock promotions. Team & Claim Workflows: Owned the B2B portal (~55% commits) delivering organization switchers, dynamic roles, and claim-an-unlisted-place verification logic. Infrastructure: Maintained Dockerized services on Railway via GitHub CI/CD, and migrated storage to Cloudflare R2.',
	type: 'full-time',
	category: 'work',
	startDate: '2025-07-16',
	endDate: '2026-07-31'
}

export const ruamsukPlatingDevelopereerPartTime: ExperienceItem = {
	id: 'ruamsuk-software-engineer-part-time',
	organization: ruamsukPlating,
	position: 'developer',
	description:
		"The first four years at RS TROPHY, worked part-time alongside the Computer Science degree at Thammasat. Full Stack & SEO: built and iterated the company's web applications while integrating targeted SEO and online-marketing work. Digital Transformation: modernized legacy manual workflows into web-based systems, raising day-to-day operational efficiency.",
	type: 'part-time',
	category: 'work',
	startDate: '2021-08-01',
	endDate: '2025-05-31'
}

export const ruamsukPlatingDeveloperFullTime: ExperienceItem = {
	id: 'ruamsuk-software-engineer-full-time',
	organization: ruamsukPlating,
	position: 'developer',
	description:
		"Converted to full-time in the degree's final month, ahead of moving to Jasmine Technology Solution that July. Continued the same full-stack and SEO ownership at full capacity, concentrated on the company's web applications and the ongoing move off legacy manual workflows.",
	type: 'full-time',
	category: 'work',
	startDate: '2025-06-01',
	endDate: '2025-07-15'
}

export const ruamsukPlatingCto: ExperienceItem = {
	id: 'ruamsuk-cto',
	organization: ruamsukPlating,
	position: 'chief-technology-officer',
	description:
		'Total Technology Ownership: As CTO, own every technology decision and system in the company end-to-end — from setting the technical strategy to single-handedly delivering each software project from architecture to deployment. Full-Stack & Infrastructure: Build and run all web applications, services, cloud infrastructure, CI/CD, and reliability. IT, Hardware & Systems: Handle all non-software technology as well — IT support, hardware, networking, device and equipment setup, and technology procurement and vendor management across the office and factory floor. Product & Design Leadership: Act as sole PM, PO, and UI/UX designer, authoring all product documentation and roadmaps. AI, Automation & Data: Build AI automation workflows, supply chain solutions, and internal tooling that streamline operations across the business. Cross-Functional Impact: Partner directly with finance and operations to digitize and optimize every process — the single point of ownership for everything technical the company runs on.',
	type: 'full-time',
	category: 'work',
	startDate: '2026-08-01'
}

export const thaiboticFounder: ExperienceItem = {
	id: 'thaibotic-founder',
	organization: thaibotic,
	position: 'founder',
	description:
		'Co-founded Thaibotic, a software and robotics venture that brings a Unitree G1 humanoid robot to events, exhibitions and universities, alongside the CTO role. Run the robot at every job and build all of its software: a cross-platform G1 dev workspace with simulation and a two-key safety gate for the real robot, the Hub — an offline Thai-language screen that runs the robot at a show from a phone or iPad — a Thai/English voice assistant on the robot, and the bilingual website clients book through.',
	type: 'part-time',
	category: 'work',
	startDate: '2026-09-30'
}

// --- Education ---

export const thammasatComputerScience: ExperienceItem = {
	id: 'thammasat-bs-cs',
	organization: thammasatUniversity,
	position: 'student',
	credential: 'B.S. Computer Science',
	description:
		'Bachelor of Science in Computer Science — the engineering foundation across algorithms, data structures, databases, operating systems, and software engineering that underpins the full-stack work. Developed and successfully defended QR Food, a full-stack QR-code ordering and multi-branch restaurant management web application, as the senior thesis project.',
	type: 'full-time',
	category: 'education',
	startDate: '2021-08-01',
	endDate: '2025-06-30'
}

// --- Aggregation ---

const all: ExperienceItem[] = [
	freelanceExperience,
	jasmineTechnologySolutionExperience,
	ruamsukPlatingDevelopereerPartTime,
	ruamsukPlatingDeveloperFullTime,
	ruamsukPlatingCto,
	thaiboticFounder,
	thammasatComputerScience
]

export const experiencesData: ExperienceItem[] = [...all].sort(sortByDateDesc)

/**
 * Work roles, the CTO role first — the main job — then the rest newest first. Every "latest role"
 * reader (hero, home role list and its Now badge, OG image, `/cv`, JSON-LD) takes the head of this list, so
 * Thaibotic, which started later, sits second instead of taking the headline.
 */
export const workExperienceData: ExperienceItem[] = [
	ruamsukPlatingCto,
	...all.filter(a => a.category === 'work' && a !== ruamsukPlatingCto).sort(sortByDateDesc)
]
export const educationData: ExperienceItem[] = all.filter(a => a.category === 'education').sort(sortByDateDesc)

/** The headline role — the head of `workExperienceData`, the CTO role. */
export const latestRole: ExperienceItem = workExperienceData[0]
