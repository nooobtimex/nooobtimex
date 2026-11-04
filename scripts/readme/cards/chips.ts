/** Status chip row under the hero: location / availability / languages. */
import { C, monoText, monoWidth, notchPoints, px, styleBlock, svgDoc } from '../theme'

const H = 44
const PAD = 16
const GAP = 12
const SIZE = 15

interface Chip {
	label: string
	value: string
	color: string
	dot?: boolean
}

export function renderChips(): string {
	const chips: Chip[] = [
		{ label: 'LOC //', value: 'NONTHABURI', color: C.cyan },
		{ label: 'STATUS //', value: 'AVAILABLE', color: C.green, dot: true },
		{ label: 'LANG //', value: 'TH / EN', color: C.magenta }
	]

	let x = 0
	const parts: string[] = []
	for (const chip of chips) {
		const labelW = monoWidth(chip.label, SIZE)
		const valueW = monoWidth(chip.value, SIZE)
		const dotW = chip.dot ? 14 : 0
		const w = px(PAD + labelW + 8 + dotW + valueW + PAD)

		parts.push(`<g transform="translate(${px(x)} 0)">`)
		parts.push(`<polygon points="${notchPoints(w, H, 9)}" fill="${C.bg}" stroke="${C.border}" stroke-width="1.5" />`)
		const textY = H / 2 + SIZE * 0.36
		parts.push(monoText(chip.label, PAD, textY, { size: SIZE, opacity: 0.5 }))
		let vx = PAD + labelW + 8
		if (chip.dot) {
			parts.push(`<circle cx="${px(vx + 4)}" cy="${H / 2}" r="4" fill="${chip.color}" class="blink" />`)
			vx += dotW
		}
		parts.push(monoText(chip.value, vx, textY, { size: SIZE, fill: chip.color, weight: 700 }))
		parts.push('</g>')

		x += w + GAP
	}

	const W = px(x - GAP)
	return svgDoc({
		w: W,
		h: H,
		label: 'Nonthaburi — Available — TH/EN',
		body: `	${styleBlock(['blink'])}\n\t${parts.join('\n\t')}`
	})
}
