import type { ProjectDef } from '../../interfaces'
import { assets } from '../assets'

export const onlinePokerGame: ProjectDef = {
	id: 'online-poker-game',
	accent: '#FF003C',
	// SSE leads: "featuring Server-Sent Events" is the description's distinguishing clause.
	highlightSkills: ['sse', 'next-js', 'mongodb', 'redis', 'bullmq'],
	title: 'Online Poker Game',
	description:
		'A real-time multiplayer online poker game featuring Server-Sent Events for live updates. Built with Next.js, and since its 2026 scale-out runs on MongoDB with Redis and a BullMQ job queue.',
	images: { cover: assets.projects.onlinePokerGame.cover, photos: [...assets.projects.onlinePokerGame.gallery] },
	// Starting stack — realtime (SSE) and the scale-out stack (Docker/BullMQ/Redis) arrive via events.
	skills: ['next-js', 'react', 'prisma', 'render', 'tailwind-css', 'postgresql'],
	links: {},
	startDate: '2025-03-01',
	linkedExperienceIds: ['freelance'],
	timeline: [
		{
			date: '2025-06-09',
			title: "Kickoff — TypeScript Texas Hold'em on Next.js",
			description:
				"Started a real-time multiplayer Texas Hold'em project on Next.js with a component-driven UI and strict TypeScript.",
			icon: 'mdi:cards-playing-outline'
		},
		{
			date: '2025-06-10',
			title: 'Data — Prisma Schema + First Table Screen',
			description: 'Set up the Prisma data layer and the first poker table interface.',
			icon: 'simple-icons:prisma'
		},
		{
			date: '2025-06-11',
			title: 'Engine — Test-Driven Hand Evaluator',
			description: 'Built the poker hand-evaluation engine test-first, with dedicated unit suites for ranking logic.',
			icon: 'mdi:cards'
		},
		{
			date: '2025-06-11',
			title: 'Realtime — Rooms over Server-Sent Events',
			description: 'Streamed live room state to every player over Server-Sent Events.',
			icon: 'mdi:broadcast',
			addedSkills: ['sse']
		},
		{
			date: '2025-06-12',
			title: 'Core — Showdown & Deck Logic',
			description: 'Implemented showdown resolution and deck management with full unit-test coverage.',
			icon: 'mdi:test-tube'
		},
		{
			date: '2025-06-14',
			title: 'UI — Lobby Page + Game-Room Table',
			description: 'Built the lobby page and the game-room table with card, community-card and player-seat components.',
			icon: 'mdi:view-grid-outline'
		},
		{
			date: '2025-06-15',
			title: 'Engine — Waiting Room, Stages + Pre-Round Betting',
			description: 'Added the waiting-room stage and a game engine with pre-round betting.',
			icon: 'mdi:poker-chip'
		},
		{
			date: '2025-07-05',
			title: 'Refactor — Modular Pot / Position / Betting Managers',
			description: 'Refactored the game engine into dedicated pot, position, and betting modules.',
			icon: 'mdi:cog-outline'
		},
		{
			date: '2025-07-11',
			title: 'Local Play — Single-Device Table',
			description: 'Shipped a single-device table with game setup, player actions and win-by-fold.',
			icon: 'mdi:cellphone'
		},
		{
			date: '2025-07-30',
			title: 'Backend — Server-Side Game State + Seat-Order Turns',
			description:
				'Moved the game logic onto the server: turns follow seat order, and rounds auto-advance when every active player is all-in.',
			icon: 'mdi:server-network-outline'
		},
		{
			date: '2025-08-05',
			title: 'Auth — Session-Based Authentication',
			description: 'Added session-based authentication for players and rooms.',
			icon: 'mdi:shield-key-outline'
		},
		{
			date: '2025-08-09',
			title: 'Multiplayer — Server-Synced Hole Cards + Room Routing',
			description:
				"Synced each player's hole cards with the server state and moved room routing and joining onto the multiplayer API.",
			icon: 'mdi:cards-outline'
		},
		{
			date: '2025-08-29',
			title: 'Odds — Monte Carlo Win-Probability',
			description: 'Built a Monte Carlo simulation for live hand-odds and win-probability estimates.',
			icon: 'mdi:chart-bell-curve-cumulative'
		},
		{
			date: '2025-09-07',
			title: 'Multiplayer — Lobby & Configurable Rooms',
			description: 'Delivered the multiplayer lobby with a create-room flow and host-configurable seat limits.',
			icon: 'mdi:account-group-outline'
		},
		{
			date: '2025-09-12',
			title: 'Odds — Prediction Panel in the Game Room',
			description: 'Added a prediction panel to the game room that shows the hand odds for the table.',
			icon: 'mdi:chart-donut'
		},
		{
			date: '2025-10-06',
			title: 'Multiplayer — Full-Room Start + Room Redirects',
			description:
				'A game now starts only once the room is full, and players are sent back to the room they are already in.',
			icon: 'mdi:account-multiple-check-outline'
		},
		{
			date: '2025-10-27',
			title: 'Tournament — Winner Mode + Spectator Roles',
			description: 'Introduced tournament mode with viewer and player-elimination roles.',
			icon: 'mdi:trophy-outline'
		},
		{
			date: '2025-10-30',
			title: 'Showdown — Card-Reveal Phase',
			description: 'Added a card-reveal phase that shows the hands before the showdown resolves.',
			icon: 'mdi:eye-outline'
		},
		{
			date: '2025-11-02',
			title: 'Viewers — Eliminated Players Watch On',
			description: 'Hid cards and action controls for eliminated players, who now stay at the table as viewers.',
			icon: 'mdi:eye-off-outline'
		},
		{
			date: '2025-11-15',
			title: 'Showdown — Real Cards + Hand Rankings',
			description: 'Showed the real showdown cards and hand rankings, and fixed hand-state sync between rounds.',
			icon: 'mdi:trophy-variant-outline'
		},
		{
			date: '2025-11-22',
			title: 'Odds — Hand-Strength Breakdown',
			description:
				'Added win, tie and lose breakdowns, expandable hand-type rows, and the best five-card hand to the prediction view.',
			icon: 'mdi:chart-box-outline'
		},
		{
			date: '2026-02-03',
			title: 'Scale-Out — Docker, Job Queue & Redis Realtime',
			description:
				'Re-architected for scale — a containerized webapp and worker on MongoDB with a BullMQ job queue, persisted game logs, and Redis-backed realtime with retries.',
			icon: 'simple-icons:redis',
			addedSkills: ['docker', 'bullmq', 'redis', 'mongodb'],
			removedSkills: ['prisma', 'postgresql']
		}
	]
}
