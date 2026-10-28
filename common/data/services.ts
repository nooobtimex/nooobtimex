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
		proofProjectIds: ['wangpa', 'qr-food', 'online-poker-game']
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
	},
	{
		id: 'line-chatbot',
		title: 'AI chatbot on LINE',
		blurb:
			'A LINE OA chatbot that answers your customers from your own shop or clinic data, with the automations behind it — summaries, sheet updates and a hand-off to your team — written as code you own.',
		icon: 'mdi:robot-outline',
		proofProjectIds: ['rs-trophy'],
		proofPostIds: ['ai-verification-gate-failed-open'],
		// No LINE demo has shipped yet.
		hidden: true
	},
	{
		id: 'ai-coaching',
		title: 'AI coaching (1:1)',
		blurb:
			'One-to-one sessions for business owners: you leave with AI doing a real, repeated task in your own business, taught from systems running in production at a factory.',
		icon: 'mdi:account-voice',
		proofProjectIds: ['rs-trophy'],
		proofPostIds: ['automation-is-mostly-failure-handling']
	}
]

const fail = (id: string, msg: string): never => {
	throw new Error(`[services] "${id}": ${msg}`)
}

const resolveService = (def: ServiceDef): Service => {
	const { id, title, blurb, icon, proofProjectIds, proofPostIds = [] } = def
	const projects = proofProjectIds.map((pid): ServiceProof => {
		const project = projectsData.find(p => p.id === pid)
		return project ?
				{ kind: 'project', id: pid, label: project.title }
			:	fail(id, `proofProjectIds "${pid}" is not a project id`)
	})
	const posts = proofPostIds.map((pid): ServiceProof => {
		const post = postById(pid)
		return post ? { kind: 'post', id: pid, label: post.title } : fail(id, `proofPostIds "${pid}" is not a post id`)
	})
	const proof = [...projects, ...posts]
	if (proof.length === 0) fail(id, 'needs at least one proof link — an offering nobody can check is just a claim')
	return { id, title, blurb, icon, proof }
}

// Every def resolves, hidden ones too — so flipping `hidden` off is never what breaks the build.
const resolved = defs.map(def => ({ def, service: resolveService(def) }))

/** The cards the site renders — `hidden` ones are left out here, in one place. */
export const servicesData: Service[] = resolved.filter(r => !r.def.hidden).map(r => r.service)

/** Every card's icon, hidden ones included, so un-hiding a card needs no `icons:generate`. */
export const serviceIcons: string[] = defs.map(d => d.icon)
