import { OG } from '@/lib/og-palette'
import { personalData } from '@/common'

/** Profile card served at the existing /card/hire URL for compatibility. */
export default function HireSquareCard() {
	return (
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
			<div style={{ display: 'flex', fontSize: 32, color: OG.cyan }}>NooobtimeX.</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
				<div style={{ display: 'flex', fontSize: 112, fontWeight: 700, letterSpacing: -5 }}>Kwan.</div>
				<div style={{ display: 'flex', fontSize: 60, color: OG.cyan }}>Software, robots, and things that work.</div>
				<div style={{ display: 'flex', fontSize: 30, color: OG.muted }}>CTO at RS TROPHY · Co-founder of Thaibotic</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 16,
					borderTop: '3px solid #17191c',
					paddingTop: 32,
					fontSize: 30
				}}>
				<span>{personalData.name}</span>
				<span style={{ color: OG.cyan }}>{personalData.contact.email}</span>
				<span style={{ color: OG.muted }}>nooobtimex.me</span>
			</div>
		</div>
	)
}
