import type { Service, ServiceDef, ServiceProof } from '../interfaces'
import { postById } from './posts'
import { projectsData } from './projects'

/**
 * The freelance offerings on the home page's "What I build" section — ordered by how
 * often a client asks for them. Each one names the work that proves it: a card that says
 * "dashboards" next to a link to the flood-monitoring dashboard is a claim a client can
 * check, which is the whole point of putting proof on a sales section.
 */
const defs: ServiceDef[] = [
	{
		id: 'web-apps',
		title: 'Web apps & MVPs',
		blurb:
			'A full-stack web app taken from idea to production — scoping, UI, API, database, auth and deploy, built by one engineer who owns all of it.',
		icon: 'mdi:application-brackets-outline',
		proofProjectIds: ['whenwe', 'qr-food', 'online-poker-game']
	},
	{
		id: 'dashboards',
		title: 'Dashboards & internal tools',
		blurb:
			'Admin consoles, data dashboards and role-based back-offices — maps, charts, CSV export and the permissions that keep each person on the right screen.',
		icon: 'mdi:view-dashboard-outline',
		proofProjectIds: ['flood-project', 'monomax-epl-portal']
	},
	{
		id: 'sites',
		title: 'Company & landing sites',
		blurb:
			'Fast company and landing sites that render without JavaScript, index cleanly in search, and stay easy for your team to update.',
		icon: 'mdi:web',
		proofProjectIds: ['rs-trophy', 'portfolio']
	},
	{
		id: 'infra',
		title: 'Deploy, infra & speed-ups',
		blurb:
			'Docker and Railway deploys, build gates that stop a broken release, and fixes for apps that are slow or eat memory in production.',
		icon: 'mdi:speedometer',
		proofProjectIds: [],
		proofPostIds: ['container-rss-402-to-126', 'bun-builds-node-serves']
	}
]

const fail = (id: string, msg: string): never => {
	throw new Error(`[services] "${id}": ${msg}`)
}

const resolveService = ({ proofProjectIds, proofPostIds = [], ...rest }: ServiceDef): Service => {
	const projects = proofProjectIds.map((id): ServiceProof => {
		const project = projectsData.find(p => p.id === id)
		return project ?
				{ kind: 'project', id, label: project.title }
			:	fail(rest.id, `proofProjectIds "${id}" is not a project id`)
	})
	const posts = proofPostIds.map((id): ServiceProof => {
		const post = postById(id)
		return post ? { kind: 'post', id, label: post.title } : fail(rest.id, `proofPostIds "${id}" is not a post id`)
	})
	const proof = [...projects, ...posts]
	if (proof.length === 0) fail(rest.id, 'needs at least one proof link — an offering nobody can check is just a claim')
	return { ...rest, proof }
}

export const servicesData: Service[] = defs.map(resolveService)
