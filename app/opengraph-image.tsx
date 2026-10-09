import { ImageResponse } from 'next/og'
import { OG } from '@/lib/og-palette'
import { formatPosition } from '@/lib/utils'
import { latestRole, personalData } from '@/common'

// Dynamic 1200×630 social card — replaces the square logo preview. Serves both
// Open Graph and Twitter (Next falls back to this when no twitter-image exists).
export const alt = `${personalData.name} — ${formatPosition(latestRole.position)}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Shared with the 1:1 cards in components/og/ so the surfaces cannot drift apart.
const { yellow: YELLOW, cyan: CYAN } = OG

const websiteLabel = personalData.socialLinks.find(s => s.platform === 'website')?.username ?? 'nooobtimex.me'

export default function OpengraphImage() {
	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '72px 80px',
				backgroundColor: '#0a0a0a',
				backgroundImage:
					'linear-gradient(rgba(0,240,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.08) 1px, transparent 1px)',
				backgroundSize: '48px 48px',
				color: '#ffffff',
				fontFamily: 'sans-serif'
			}}>
			<div style={{ display: 'flex', color: CYAN, fontSize: 26, letterSpacing: 8, fontWeight: 600 }}>
				// PROFILE_v2.077 · AVAILABLE FOR HIRE
			</div>

			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div
					style={{
						display: 'flex',
						fontSize: 92,
						fontWeight: 800,
						lineHeight: 1,
						letterSpacing: -2,
						textTransform: 'uppercase'
					}}>
					{personalData.name}
				</div>
				<div style={{ display: 'flex', alignItems: 'center', marginTop: 28 }}>
					<div style={{ display: 'flex', width: 10, height: 54, backgroundColor: YELLOW, marginRight: 20 }} />
					<div
						style={{
							display: 'flex',
							color: YELLOW,
							fontSize: 44,
							fontWeight: 700,
							letterSpacing: 4,
							textTransform: 'uppercase'
						}}>
						{formatPosition(latestRole.position)}
					</div>
				</div>
			</div>

			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
				<div style={{ display: 'flex', color: '#a3a3a3', fontSize: 28, letterSpacing: 2 }}>{websiteLabel}</div>
				<div
					style={{
						display: 'flex',
						color: YELLOW,
						backgroundColor: 'rgba(252,238,10,0.12)',
						border: `1px solid ${YELLOW}`,
						padding: '8px 18px',
						fontSize: 22,
						letterSpacing: 3,
						textTransform: 'uppercase'
					}}>
					ID // NooobtimeX
				</div>
			</div>
		</div>,
		{ ...size }
	)
}
