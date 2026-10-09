/** Featured gig cards — full-width stacked rows, one per project, individually linkable. */
import { projectsData } from '@/common'
import { icon } from '../icons'
import {
	C,
	clipDef,
	displayText,
	hudBrackets,
	monoText,
	monoWidth,
	notchPoints,
	panelBorder,
	px,
	scanlineDef,
	scanlineOverlay,
	styleBlock,
	svgDoc,
	truncateMono
} from '../theme'

const W = 1000
const H = 120
const PAD = 36

export interface GigSpec {
	id: string
	file: string
	title: string
	blurb: string
	domain: string
	href: string
}

export const GIGS: GigSpec[] = [
	{
		id: 'monomax-epl-portal',
		file: 'gig-monomax-epl-portal.svg',
		title: 'MONOMAX EPL',
		blurb: 'EPL BROADCAST-LICENSE SAAS · PER-VENUE QR CERTIFICATES',
		domain: 'nooobtimex.me',
		href: 'https://nooobtimex.me/projects/monomax-epl-portal'
	},
	{
		id: 'rs-trophy',
		file: 'gig-rs-trophy.svg',
		title: 'RS TROPHY',
		blurb: 'E-COMMERCE + AI SHOPPING COPILOT FOR CUSTOM TROPHIES & MEDALS',
		domain: 'rs-trophy.com',
		href: 'https://rs-trophy.com'
	},
	{
		id: 'looklook-pet',
		file: 'gig-looklook-pet.svg',
		title: 'LOOKLOOK PET',
		blurb: 'PET-PARENT COMMUNITY MARKETPLACE · 15+ MICROSERVICES',
		domain: 'looklook.pet',
		href: 'https://looklook.pet'
	},
	{
		id: 'prettier-config',
		file: 'gig-prettier-config.svg',
		title: 'PRETTIER CONFIG',
		blurb: 'VISUAL PRETTIER PLAYGROUND · FULLY CLIENT-SIDE · SHAREABLE CONFIGS',
		domain: 'prettier-config.dev',
		href: 'https://prettier-config.dev'
	},
	{
		id: 'portfolio',
		file: 'gig-portfolio.svg',
		title: 'PROFILE_V2.077',
		blurb: 'THIS REPO · CYBERPUNK-2077-THEMED NEXT.JS PROFILE',
		domain: 'nooobtimex.me',
		href: 'https://nooobtimex.me'
	}
]

export function renderGig(spec: GigSpec, index: number): string {
	const project = projectsData.find(p => p.id === spec.id)
	const skillIcons = (project?.skills ?? []).slice(0, 5)

	const parts: string[] = []

	// dim oversized index number, right side backdrop
	parts.push(
		displayText(String(index + 1).padStart(2, '0'), W - 24, 104, {
			size: 96,
			fill: C.fg,
			opacity: 0.07,
			anchor: 'end'
		})
	)

	parts.push(displayText(spec.title, PAD, 52, { size: 32, ls: 2, fill: C.yellow }))
	parts.push(monoText(truncateMono(spec.blurb, 640, 17), PAD, 87, { size: 17, fill: C.fg, opacity: 0.55 }))

	// live status + domain, top right
	const domainW = monoWidth(spec.domain, 16)
	parts.push(`<circle cx="${px(W - PAD - domainW - 70)}" cy="41" r="4" fill="${C.green}" class="pulse" />`)
	parts.push(monoText('LIVE', W - PAD - domainW - 58, 46, { size: 14, fill: C.green }))
	parts.push(monoText(spec.domain, W - PAD, 46, { size: 16, fill: C.cyan, anchor: 'end', weight: 700 }))

	// skill icons, bottom right
	const ICON = 24
	const widths = skillIcons.map(s => icon(s.icon, ICON, { whiteBg: s.whiteBg, fallbackLabel: s.name }))
	let ix = W - PAD - widths.reduce((sum, em) => sum + em.width + 14, -14)
	for (const em of widths) {
		parts.push(em.at(ix, 64))
		ix += em.width + 14
	}

	const body = `	${styleBlock(['pulse'])}
	<defs>
		${clipDef('panel-clip', W, H, 14)}
		${scanlineDef()}
	</defs>
	<polygon points="${notchPoints(W, H, 14)}" fill="${C.bg}" />
	<g clip-path="url(#panel-clip)">
		<rect x="0" y="0" width="6" height="${H}" fill="${C.yellow}" opacity="0.85" />
		${parts.join('\n\t\t')}
		${scanlineOverlay(W, H)}
	</g>
	${panelBorder(W, H, 14)}
	${hudBrackets(W, H, 12, 12)}`

	return svgDoc({ w: W, h: H, label: `${spec.title.replace(/_/g, ' ')} — ${spec.blurb} — ${spec.domain}`, body })
}
