/**
 * 1080×1080 "available for hire" intro card. See `card-primitives.tsx` for the
 * Satori constraints that apply to this whole folder.
 *
 * Copy comes from `common/data/personal.ts` so the card tracks the site, with ONE
 * deliberate exception: the card never says "CTO". It is a freelance-availability
 * asset, and leading with an executive title misrepresents what is on offer — so
 * both the role headline and the blurb below use the hands-on framing instead.
 * `personalData.contact.availability` (which does mention the CTO role) is still
 * what /contact and the CV render; only this card overrides it.
 */
import React from 'react'
import {
	CARD_SIZE,
	CardFooter,
	CornerBrackets,
	Kicker,
	StackGrid,
	type StackIcon,
	gridBackground
} from '@/components/og/card-primitives'
import { iconDataUri } from '@/lib/og-assets'
import { OG } from '@/lib/og-palette'
import { hireLinkLabel } from '@/lib/utils'
import { featuredSkills, personalData } from '@/common'

const PAD = 72
/** Two rows of ten; `featuredSkills` is 19 today, so nothing overflows. */
const STACK_SLOTS = 19

/**
 * Card-only availability blurb. Mirrors `personalData.contact.availability` minus
 * its "as CTO at RS Trophy" clause — see the file header for why.
 */
const AVAILABILITY =
	'Open for remote freelance web app projects — full-stack, shipped end to end, hired through Fastwork.'

/** Where a card viewer goes to hire — the BYOB link as text, since a PNG cannot carry a link and a typed generic profile URL would not credit the client. */
const HIRE_AT = hireLinkLabel(personalData.hire.url)

const HireSquareCard: React.FC = () => {
	// Leads with the engineering role, NOT the CTO title.
	const position = personalData.heroRole

	const icons = featuredSkills.slice(0, STACK_SLOTS).flatMap<StackIcon>(skill => {
		const embedded = iconDataUri(skill.icon, { size: 48, color: OG.fg })
		return embedded ? [{ ...embedded, whiteBg: skill.whiteBg }] : []
	})
	const overflow = featuredSkills.length - icons.length

	return (
		<div
			style={{
				...gridBackground(OG.yellow),
				position: 'relative',
				width: CARD_SIZE,
				height: CARD_SIZE,
				display: 'flex',
				flexDirection: 'column',
				padding: PAD,
				color: OG.fg,
				fontFamily: 'sans-serif'
			}}>
			{/* Header. Deliberately typographic — the site avatar is a wide-framed photo
			    that reads as noise at thumbnail size, so it is not used here. */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
				<Kicker color={OG.yellow}>{'// AVAILABLE FOR HIRE'}</Kicker>
				<div
					style={{
						display: 'flex',
						color: OG.cyan,
						fontSize: 24,
						letterSpacing: 3,
						border: `1px solid ${OG.cyan}`,
						padding: '6px 16px'
					}}>
					ID // NooobtimeX
				</div>
			</div>

			{/* Identity. Explicit margins rather than `space-between` on the root: with
			    only four blocks in a 1080px column, space-between opened ~150px voids. */}
			<div style={{ display: 'flex', flexDirection: 'column', marginTop: 96 }}>
				<div
					style={{
						display: 'flex',
						fontSize: 70,
						fontWeight: 800,
						lineHeight: 1.05,
						letterSpacing: -2,
						textTransform: 'uppercase'
					}}>
					{personalData.name}
				</div>

				<div style={{ display: 'flex', alignItems: 'center', marginTop: 26 }}>
					<div style={{ display: 'flex', width: 10, height: 48, backgroundColor: OG.yellow, marginRight: 18 }} />
					<div
						style={{
							display: 'flex',
							flexDirection: 'column'
						}}>
						<div
							style={{
								display: 'flex',
								color: OG.yellow,
								fontSize: 38,
								fontWeight: 700,
								letterSpacing: 3,
								textTransform: 'uppercase'
							}}>
							{position}
						</div>
						<div style={{ display: 'flex', color: OG.muted, fontSize: 25, letterSpacing: 2, marginTop: 4 }}>
							Freelance · Full-stack · Remote
						</div>
					</div>
				</div>

				<div style={{ display: 'flex', color: OG.fg, fontSize: 31, lineHeight: 1.45, marginTop: 34, opacity: 0.85 }}>
					{AVAILABILITY}
				</div>
			</div>

			{/* Stack */}
			<div style={{ display: 'flex', flexDirection: 'column', marginTop: 150 }}>
				<div style={{ display: 'flex', marginBottom: 14 }}>
					<Kicker size={22}>{'STACK //'}</Kicker>
				</div>
				<StackGrid icons={icons} overflow={overflow} />
			</div>

			<CardFooter
				right={<div style={{ display: 'flex', color: OG.cyan, fontSize: 24, letterSpacing: 2 }}>{HIRE_AT}</div>}
			/>

			<CornerBrackets color={OG.yellow} />
		</div>
	)
}

export default HireSquareCard
