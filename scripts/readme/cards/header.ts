/** Hero banner — generated port of the original hand-built header.svg. */
import { formatPosition } from '@/lib/utils'
import { latestRole, personalData } from '@/common'
import {
	C,
	clipDef,
	displayText,
	gridDef,
	hudBrackets,
	monoText,
	panelBorder,
	panelSurface,
	scanlineDef,
	scanlineOverlay,
	styleBlock,
	svgDoc
} from '../theme'

const W = 1000
const H = 300
const NOTCH = 23

export function renderHeader(): string {
	const handle = 'NOOOBTIMEX'
	const subtitle = `${personalData.name.toUpperCase()} // ${formatPosition(latestRole.position).toUpperCase()}`
	const tagline = 'TYPESCRIPT ECOSYSTEMS · HIGH-PERFORMANCE SYSTEM DESIGN'

	const dataBars = [
		{ x: 846, y: 120, h: 44, fill: C.yellow },
		{ x: 862, y: 104, h: 60, fill: C.cyan },
		{ x: 878, y: 132, h: 32, fill: C.magenta },
		{ x: 894, y: 92, h: 72, fill: C.yellow },
		{ x: 910, y: 116, h: 48, fill: C.cyan },
		{ x: 926, y: 140, h: 24, fill: C.purple }
	]
		.map(b => `<rect x="${b.x}" y="${b.y}" width="10" height="${b.h}" fill="${b.fill}" />`)
		.join('\n\t\t')

	const body = `	${styleBlock(['blink', 'scan', 'glitch', 'bars'])}

	<defs>
		${clipDef('panel-clip', W, H, NOTCH)}
		${gridDef()}
		${scanlineDef()}
	</defs>

	${panelSurface(W, H, NOTCH)}

	<g clip-path="url(#panel-clip)">
		<rect x="0" y="0" width="${W}" height="${H}" fill="url(#grid)" />

		${monoText('// PROFILE_V2.077', 60, 62, { size: 16, ls: 6, fill: C.cyan })}

		<g>
			<circle cx="744" cy="36" r="4" fill="${C.green}" class="blink" />
			${monoText('SYS.STATUS // ONLINE', 940, 40, { size: 12, ls: 2, fill: C.green, anchor: 'end', cls: 'blink' })}
			${monoText('NET // GITHUB.COM/NOOOBTIMEX', 940, 60, { size: 12, ls: 2, opacity: 0.45, anchor: 'end' })}
		</g>

		<g>
			${displayText(handle, 56, 158, { size: 104, ls: 3, fill: C.magenta, cls: 'glitch-m' })}
			${displayText(handle, 56, 158, { size: 104, ls: 3, fill: C.cyan, cls: 'glitch-c' })}
			${displayText(handle, 56, 158, { size: 104, ls: 3, fill: C.yellow, cls: 'glitch-base' })}
		</g>

		<line x1="60" y1="184" x2="940" y2="184" stroke="${C.border}" stroke-width="2" />
		<line x1="60" y1="184" x2="220" y2="184" stroke="${C.yellow}" stroke-width="2" />

		<rect x="60" y="206" width="6" height="30" fill="${C.yellow}" />
		${monoText(subtitle, 80, 228, { size: 19, ls: 4 })}
		${monoText(tagline, 80, 258, { size: 13, ls: 2, opacity: 0.5 })}

		<g class="bars">
			${dataBars}
		</g>

		<rect x="784" y="254" width="150" height="26" fill="${C.yellow}" />
		${monoText('ID // NOOOBTIMEX', 859, 271, { size: 12, ls: 2, anchor: 'middle', fill: C.bg })}

		${scanlineOverlay(W, H, true)}
	</g>

	${panelBorder(W, H, NOTCH)}
	${hudBrackets(W, H, 30, 20)}`

	return svgDoc({ w: W, h: H, label: `${handle} — ${personalData.name}, ${personalData.title}`, body })
}
