/** CTA buttons — one renderer, solid (yellow) and outline (cyan) variants. */
import { C, monoText, monoWidth, notchPoints, px, svgDoc } from '../theme'

const H = 52
const SIZE = 18
const PAD = 26

export interface ButtonSpec {
	file: string
	label: string
	variant: 'solid' | 'outline'
}

export const BUTTONS: ButtonSpec[] = [
	{ file: 'btn-hire.svg', label: 'HIRE_ME', variant: 'solid' },
	{ file: 'btn-profile.svg', label: 'VIEW_PROFILE', variant: 'outline' },
	{ file: 'btn-cv.svg', label: 'VIEW_CV', variant: 'outline' },
	{ file: 'btn-career.svg', label: 'FULL_CAREER_TRACE', variant: 'outline' },
	{ file: 'btn-gigs.svg', label: 'ALL_GIGS', variant: 'outline' },
	{ file: 'btn-arsenal.svg', label: 'FULL_ARSENAL', variant: 'outline' },
	{ file: 'btn-github.svg', label: 'DEEP_STATS', variant: 'outline' }
]

export function renderButton(spec: ButtonSpec): string {
	const glyphW = 12
	const textW = monoWidth(spec.label, SIZE, 1)
	const W = px(PAD + glyphW + 10 + textW + PAD)

	const solid = spec.variant === 'solid'
	const main = solid ? C.bg : C.cyan
	const shape =
		solid ?
			`<polygon points="${notchPoints(W, H, 11)}" fill="${C.yellow}" />`
		:	`<polygon points="${notchPoints(W, H, 11)}" fill="${C.bg}" stroke="${C.cyan}" stroke-width="2" />`

	const gy = H / 2
	const glyph =
		solid ?
			`<polygon points="${PAD},${gy - 7} ${PAD + glyphW},${gy} ${PAD},${gy + 7}" fill="${main}" />`
		:	`<polygon points="${PAD},${gy - 7} ${PAD + glyphW},${gy} ${PAD},${gy + 7}" fill="none" stroke="${main}" stroke-width="2" />`

	const body = `	${shape}
	${glyph}
	${monoText(spec.label, PAD + glyphW + 10, H / 2 + SIZE * 0.36, { size: SIZE, ls: 1, fill: main, weight: 700 })}`

	return svgDoc({ w: W, h: H, label: spec.label.replace(/_/g, ' '), body })
}
