import { createG1Model } from './models/g1'
import { createPlayModel } from './models/play'
import { createSystemsModel } from './models/systems'
import { createTrophyModel } from './models/trophy'
import type { ModelFactory } from './types'

export interface Project3DMeta {
	title: string
	badge: string
	factory: ModelFactory
	description?: string
}

const REGISTRY: Record<string, Project3DMeta> = {
	'unitree-g1': {
		title: 'Unitree G1 Humanoid Study',
		badge: 'G1 Robot 3D',
		factory: createG1Model,
		description: 'Procedural study of the Unitree G1 humanoid robot silhouette and articulation joints.'
	},
	'thaibotic': {
		title: 'Thaibotic Robotics Platform',
		badge: 'Robotics 3D',
		factory: createG1Model,
		description: 'Bipedal robotics platform and ROS 2 control systems.'
	},
	'rs-trophy': {
		title: 'RS Trophy & Plated Awards',
		badge: 'Trophy 3D',
		factory: createTrophyModel,
		description: 'Electroplated gold & nickel award cup with marble base and cast medal.'
	},
	'rs-medal': {
		title: 'RS Medal & Casting',
		badge: 'Medal 3D',
		factory: createTrophyModel,
		description: 'Custom medal casting and electroplating award study.'
	},
	'rs-award': {
		title: 'RS Award & Crystal Pedestals',
		badge: 'Award 3D',
		factory: createTrophyModel,
		description: 'Custom manufactured corporate awards and plated trophies.'
	},
	'rs-eservice': {
		title: 'RS E-Service Architecture',
		badge: 'Systems 3D',
		factory: createSystemsModel,
		description: 'Fullstack customer portal, database, queuing, and order workflow architecture.'
	},
	'monomax-epl-portal': {
		title: 'Monomax Live Sports Portal',
		badge: 'Systems 3D',
		factory: createSystemsModel,
		description: 'High-concurrency streaming backend, caching layers, and real-time dashboard.'
	},
	'rs-trophy-admin': {
		title: 'RS Trophy ERP & Warehouse',
		badge: 'Systems 3D',
		factory: createSystemsModel,
		description: 'Distributed inventory, quote engine, and production workflow system.'
	},
	'online-poker-game': {
		title: 'Online Poker Multiplatform',
		badge: 'Play 3D',
		factory: createPlayModel,
		description: 'Real-time multiplayer game client running across PC, tablet, and mobile.'
	}
}

export function hasProject3D(projectId: string): boolean {
	return Boolean(REGISTRY[projectId])
}

export function getProject3DMeta(projectId: string): Project3DMeta | null {
	return REGISTRY[projectId] ?? null
}
