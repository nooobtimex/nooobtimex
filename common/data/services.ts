import type { FastworkListing, Service, ServiceDef, ServiceProof } from '../interfaces'
import { postById } from './posts'
import { projectsData } from './projects'

/**
 * The services published on fastwork.co/user/nooobtimex, keyed by the id a card names them
 * by. Titles are Fastwork's own, verbatim — the card quotes one so a client landing on the
 * profile knows which service to open. Every card still links to `personalData.hire.url`:
 * BYOB credit survives only on the profile page that link lands on, never on a listing page.
 */
export const fastworkListings = {
	'web-apps': {
		title: 'รับทำเว็บแอปและระบบจัดการหลังบ้าน Next.js + TypeScript พร้อม Deploy ใช้งานจริง',
		listingUrl: 'https://fastwork.co/user/nooobtimex/web-development-78755460'
	},
	'dashboards': {
		title: 'รับทำระบบหลังบ้าน + Dashboard จาก Excel/Google Sheets ที่ใช้อยู่ — ทั้งทีมใช้ได้ผ่านเว็บ',
		listingUrl: 'https://fastwork.co/user/nooobtimex/web-development-26256074'
	},
	'wordpress-catalog': {
		title: 'เปลี่ยนเว็บ WordPress/WooCommerce เป็นเว็บแคตตาล็อกสินค้าเขียนเอง เร็วกว่าเดิม ลิงก์เดิมไม่เสีย',
		listingUrl: 'https://fastwork.co/user/nooobtimex/web-development-54361469'
	},
	'deploy': {
		title: 'รับ Deploy เว็บขึ้น Server — Docker, VPS, โดเมน, SSL พร้อมลดค่าเซิร์ฟเวอร์',
		listingUrl: 'https://fastwork.co/user/nooobtimex/it-solution-and-support-32476486'
	},
	'speed-fix': {
		title: 'รับแก้บั๊ก กู้เว็บพัง และจูนเว็บช้าให้เร็วขึ้น วัดผลด้วย PageSpeed ก่อน–หลัง',
		listingUrl: 'https://fastwork.co/user/nooobtimex/web-development-17046756'
	},
	// Under review on Fastwork — the drafted title, and no public listing yet.
	'line-chatbot': {
		title: 'รับทำแชทบอท AI บน LINE + ระบบอัตโนมัติด้วยโค้ดจริง — ตอบแชท สรุปเอกสาร ดึงข้อมูลลงชีต'
	},
	'ai-coaching': {
		title: 'ที่ปรึกษา AI สำหรับเจ้าของธุรกิจ สอน 1:1 ให้ AI ทำงานซ้ำแทนคุณ จากระบบที่ใช้จริงในโรงงาน',
		listingUrl: 'https://fastwork.co/user/nooobtimex/ai-consultant-56404298'
	}
} as const satisfies Record<string, FastworkListing>

export type FastworkId = keyof typeof fastworkListings

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
		proofProjectIds: ['whenwe', 'qr-food', 'online-poker-game'],
		fastwork: { main: 'web-apps' }
	},
	{
		id: 'dashboards',
		title: 'Dashboards & internal tools',
		blurb:
			'Admin consoles, data dashboards and role-based back-offices — maps, charts, CSV export and the permissions that keep each person on the right screen.',
		icon: 'mdi:view-dashboard-outline',
		proofProjectIds: ['flood-project', 'monomax-epl-portal'],
		fastwork: { main: 'dashboards' }
	},
	{
		id: 'sites',
		title: 'Company & landing sites',
		blurb:
			'Fast company and landing sites that render without JavaScript, index cleanly in search, and stay easy for your team to update.',
		icon: 'mdi:web',
		proofProjectIds: ['rs-trophy', 'portfolio'],
		// No Fastwork service of its own — the profile is the destination; the WordPress rebuild is the nearest one.
		fastwork: { also: 'wordpress-catalog' }
	},
	{
		id: 'infra',
		title: 'Deploy, infra & speed-ups',
		blurb:
			'Docker and Railway deploys, build gates that stop a broken release, and fixes for apps that are slow or eat memory in production.',
		icon: 'mdi:speedometer',
		proofProjectIds: [],
		proofPostIds: ['container-rss-402-to-126', 'bun-builds-node-serves'],
		fastwork: { main: 'deploy', also: 'speed-fix' }
	},
	{
		id: 'line-chatbot',
		title: 'AI chatbot on LINE',
		blurb:
			'A LINE OA chatbot that answers your customers from your own shop or clinic data, with the automations behind it — summaries, sheet updates and a hand-off to your team — written as code you own.',
		icon: 'mdi:robot-outline',
		proofProjectIds: ['rs-trophy'],
		proofPostIds: ['ai-verification-gate-failed-open'],
		fastwork: { main: 'line-chatbot' },
		// Fastwork is still reviewing the service, and no LINE demo has shipped yet.
		hidden: true
	},
	{
		id: 'ai-coaching',
		title: 'AI coaching (1:1)',
		blurb:
			'One-to-one sessions for business owners: you leave with AI doing a real, repeated task in your own business, taught from systems running in production at a factory.',
		icon: 'mdi:account-voice',
		proofProjectIds: ['rs-trophy'],
		proofPostIds: ['automation-is-mostly-failure-handling'],
		fastwork: { main: 'ai-coaching' }
	}
]

const fail = (id: string, msg: string): never => {
	throw new Error(`[services] "${id}": ${msg}`)
}

/**
 * A card's Fastwork ids → the listings it quotes. A hidden card never renders, so the case
 * that matters is a visible card naming a service Fastwork has not published (no
 * `listingUrl`): the card would send a client looking for something they cannot find.
 */
const resolveFastwork = (def: ServiceDef): Service['fastwork'] => {
	const pick = (id?: FastworkId): FastworkListing | undefined => {
		if (!id) return undefined
		const listing: FastworkListing = fastworkListings[id]
		// TODO(human): decide what a visible card (`!def.hidden`) naming an unpublished listing
		// (`!listing.listingUrl`) does — `fail(def.id, …)` the build, or drop the hint (return undefined).
		return listing
	}
	return { main: pick(def.fastwork.main), also: pick(def.fastwork.also) }
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
	return { id, title, blurb, icon, proof, fastwork: resolveFastwork(def) }
}

// Every def resolves, hidden ones too — so flipping `hidden` off is never what breaks the build.
const resolved = defs.map(def => ({ def, service: resolveService(def) }))

/** The cards the site renders — `hidden` ones are left out here, in one place. */
export const servicesData: Service[] = resolved.filter(r => !r.def.hidden).map(r => r.service)

/** Every card's icon, hidden ones included, so un-hiding a card needs no `icons:generate`. */
export const serviceIcons: string[] = defs.map(d => d.icon)
