import { ImageResponse } from 'next/og'
import { OG } from '@/lib/og-palette'
import { personalData } from '@/common'

export const alt = 'Kwan / NooobtimeX — Software, robots, and things that work.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
	return new ImageResponse(
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '100%',
				height: '100%',
				padding: 72,
				background: OG.bg,
				border: '12px solid #17191c',
				color: OG.fg,
				fontFamily: 'sans-serif'
			}}>
			<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 25, color: OG.cyan }}>
				<span>NooobtimeX.</span>
				<span>Software · Robotics · Games</span>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ display: 'flex', fontSize: 82, fontWeight: 700, letterSpacing: -4 }}>Kwan.</div>
				<div style={{ display: 'flex', fontSize: 72, fontWeight: 700, letterSpacing: -3, color: OG.cyan }}>
					Always building.
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					borderTop: '3px solid #17191c',
					paddingTop: 24,
					fontSize: 24,
					color: OG.muted
				}}>
				<span>CTO at {personalData.employer.name} · Co-founder of Thaibotic</span>
				<span>nooobtimex.me</span>
			</div>
		</div>,
		size
	)
}
