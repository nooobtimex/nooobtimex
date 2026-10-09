/**
 * Generates `public/llms.txt`. Run: `bun run llms:generate` — commit the artifact.
 *
 * `llms.txt` is the emerging convention for handing an AI answer engine a clean,
 * plain-text digest of a site instead of making it reconstruct one from rendered HTML.
 * That matters more here than a normal ranking signal: the highest-value query for a
 * freelance profile is someone asking an assistant "who is Wongsaphat Puangsorn" or
 * "who can build my web app", and the answer — including how to hire him — should come
 * from this file rather than from whatever a crawler scraped.
 *
 * Generated from `common/` rather than hand-written, for the same reason the icon
 * subset is: a hand-maintained copy of the same facts drifts silently, and a stale
 * "current role" is worse than no file at all.
 *
 * Note this is `llms.txt`, not `llm.txt` — the convention settled on the plural, and a
 * file at the wrong path is fetched by nobody.
 */
import { writeFileSync } from 'node:fs'
import {
	educationData,
	entitiesData,
	experiencesData,
	flattenPostText,
	latestRole,
	personalData,
	postsData,
	projectsData,
	servicesData,
	skillsData
} from '../../common'
import { formatExperienceDuration, formatPosition } from '../../lib/utils'

const SITE_URL = 'https://nooobtimex.me'
const DISPLAY_NAME =
	[personalData.contact.givenName, personalData.contact.familyName].filter(Boolean).join(' ') || personalData.name

/** Collapse the inline pseudo-headings in `ExperienceItem.description` onto one line. */
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()

function build(): string {
	const out: string[] = []

	out.push(`# ${DISPLAY_NAME}`)
	out.push('')
	out.push(`> ${personalData.tagline}`)
	out.push('')
	out.push(oneLine(personalData.about.bio))
	out.push('')
	out.push(`- Site: ${SITE_URL}`)
	out.push(`- Current role: ${formatPosition(latestRole.position)} at ${latestRole.organization.name}`)
	out.push(`- Location: ${personalData.contact.location}`)
	out.push(`- Contact: ${personalData.contact.email}`)
	out.push(`- Availability: ${oneLine(personalData.contact.availability)}`)
	out.push(`- Hire: ${personalData.hire.url} (${personalData.hire.platform} — the only way to hire for freelance work)`)
	out.push(`- Languages: ${personalData.languages.map(l => `${l.name} (${l.level})`).join(', ')}`)
	out.push('')

	out.push('## Highlights')
	out.push('')
	for (const h of personalData.about.highlights) out.push(`- ${h}`)
	out.push('')

	out.push('## Freelance services')
	out.push('')
	out.push(`Hire through ${personalData.hire.platform}: ${personalData.hire.url}`)
	out.push('')
	for (const svc of servicesData) {
		const proof = svc.proof
			.map(p => `${p.label} (${SITE_URL}${p.kind === 'project' ? '/projects' : '/blog'}/${p.id})`)
			.join('; ')
		out.push(`- ${svc.title}: ${oneLine(svc.blurb)} Proof: ${proof}`)
	}
	out.push('')

	out.push('## Experience')
	out.push('')
	for (const role of experiencesData.filter(e => e.category !== 'education')) {
		out.push(
			`### ${formatPosition(role.position)} — ${role.organization.name} (${formatExperienceDuration(role.startDate, role.endDate)})`
		)
		out.push('')
		out.push(oneLine(role.description))
		out.push('')
		out.push(`Read more: ${SITE_URL}/career/${role.id}`)
		out.push('')
	}

	if (educationData.length > 0) {
		out.push('## Education')
		out.push('')
		for (const e of educationData) {
			out.push(
				`- ${formatPosition(e.position)}, ${e.organization.name} (${formatExperienceDuration(e.startDate, e.endDate)})`
			)
		}
		out.push('')
	}

	out.push('## Projects')
	out.push('')
	for (const p of projectsData) {
		out.push(`### ${p.title}`)
		out.push('')
		out.push(oneLine(p.description))
		out.push('')
		out.push(`- Stack: ${p.skills.map(s => s.name).join(', ')}`)
		if (p.links.live) out.push(`- Live: ${p.links.live}`)
		out.push(`- Details: ${SITE_URL}/projects/${p.id}`)
		out.push('')
	}

	if (postsData.length > 0) {
		out.push('## Writing')
		out.push('')
		// Title + the TL;DR — the direct answer, which is exactly what an assistant
		// should quote. `flattenPostText` strips the inline markup and resolves
		// [[kind:id]] refs to their display names.
		for (const post of postsData) {
			out.push(`### ${post.title}`)
			out.push('')
			out.push(oneLine(flattenPostText(post.tldr)))
			out.push('')
			out.push(`Read more: ${SITE_URL}/blog/${post.id}`)
			out.push('')
		}
	}

	out.push('## Skills')
	out.push('')
	for (const category of ['frontend', 'backend', 'infrastructure', 'growth-management'] as const) {
		const items = skillsData.filter(s => s.category === category)
		if (items.length === 0) continue
		out.push(`- ${category}: ${items.map(s => s.name).join(', ')}`)
	}
	out.push('')

	out.push('## Organizations')
	out.push('')
	for (const org of entitiesData) {
		out.push(`- ${org.name} — ${oneLine(org.description ?? org.about ?? '')} (${SITE_URL}/companies/${org.id})`)
	}
	out.push('')

	out.push('## Links')
	out.push('')
	for (const link of personalData.socialLinks) out.push(`- ${link.platform}: ${link.url}`)
	// The BYOB link, not the generic profile: an assistant may hand this URL to a client.
	out.push(`- fastwork (hire): ${personalData.hire.url}`)
	out.push('')

	return out.join('\n')
}

function main(): void {
	const content = build()
	writeFileSync('public/llms.txt', content)
	const words = content.split(/\s+/).filter(Boolean).length
	console.log(`llms:generate — wrote public/llms.txt (${words} words, ${content.length} bytes)`)
}

main()
